import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, normalizeRole } from '../../libs/auth';
import { AdminSidebar } from '../../libs/components/admin/AdminSidebar';
import { AdminHeader } from '../../libs/components/admin/AdminHeader';
import { ArticleEditor } from '../../libs/components/admin/ArticleEditor';
import { GET_ALL_ARTICLES } from '../../apollo/admin/query';
import { CREATE_ARTICLE, UPDATE_ARTICLE, PUBLISH_ARTICLE, UNPUBLISH_ARTICLE, DELETE_ARTICLE } from '../../apollo/admin/mutation';
import { getImageUrl } from '../../libs/utils';

export default function AdminArticlesPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [articleContent, setArticleContent] = useState<string>('');
  const [articleTitle, setArticleTitle] = useState<string>('');
  const [articleSlug, setArticleSlug] = useState<string>('');
  const [articleDescription, setArticleDescription] = useState<string>('');
  const [articleThumbnail, setArticleThumbnail] = useState<string>('');
  const [articleStatus, setArticleStatus] = useState<string>('DRAFT');
  const [articleTags, setArticleTags] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data: articlesData, loading: articlesLoading, error: articlesError, refetch: refetchArticles } = useQuery(GET_ALL_ARTICLES, {
    skip: !mounted || !isLoggedIn(),
    variables: {
      input: {
        page,
        limit,
        search: {
          ...(statusFilter !== 'all' && { status: statusFilter }),
          ...(searchTerm && { title: searchTerm }),
        },
      },
    },
    fetchPolicy: 'network-only',
  });

  const [createArticle] = useMutation(CREATE_ARTICLE);
  const [updateArticle] = useMutation(UPDATE_ARTICLE);
  const [publishArticle] = useMutation(PUBLISH_ARTICLE);
  const [unpublishArticle] = useMutation(UNPUBLISH_ARTICLE);
  const [deleteArticle] = useMutation(DELETE_ARTICLE);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push('/admin/login');
      return;
    }
    const role = normalizeRole(currentUser?.userRole);
    if (role && role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
  }, [router, currentUser]);

  // Initialize tags when editing
  useEffect(() => {
    if (editingArticle) {
      const tags = editingArticle.tags || [];
      setTagsList(tags);
      setArticleTags(tags.join(', '));
    } else if (isCreating && !editingArticle) {
      setTagsList([]);
      setArticleTags('');
      setTagInput('');
    }
  }, [editingArticle, isCreating]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tagsList.includes(trimmedTag)) {
      const newTags = [...tagsList, trimmedTag];
      setTagsList(newTags);
      setArticleTags(newTags.join(', '));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tagsList.filter(tag => tag !== tagToRemove);
    setTagsList(newTags);
    setArticleTags(newTags.join(', '));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const articles = articlesData?.getAllArticles?.list || [];
  const totalArticles = articlesData?.getAllArticles?.metaCounter?.[0]?.total || 0;

  const handleSaveArticle = async (isDraft: boolean) => {
    if (!articleTitle.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!articleContent.trim()) {
      alert('Please enter article content');
      return;
    }

    try {
      const now = new Date();
      const isoDate = now.toISOString();
      
      const articleData = {
        title: articleTitle,
        slug: articleSlug || articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        shortDescription: articleDescription,
        body: articleContent,
        thumbnail: articleThumbnail || undefined,
        tags: tagsList,
        status: isDraft ? 'DRAFT' : 'PUBLISHED',
        ...(isDraft ? {} : { publishedAt: isoDate }),
      };

      if (editingArticle) {
        await updateArticle({
          variables: {
            input: {
              articleId: editingArticle._id,
              ...articleData,
            },
          },
        });
        alert('Article updated successfully');
      } else {
        await createArticle({
          variables: {
            input: articleData,
          },
        });
        alert(`Article ${isDraft ? 'saved as draft' : 'published'} successfully`);
      }

      // Reset form
      setIsCreating(false);
      setEditingArticle(null);
      setArticleContent('');
      setArticleTitle('');
      setArticleSlug('');
      setArticleDescription('');
      setArticleThumbnail('');
      setArticleStatus('DRAFT');
      setArticleTags('');
      setTagsList([]);
      setTagInput('');
      await refetchArticles();
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to save article'}`);
    }
  };

  const handlePublishArticle = async (articleId: string) => {
    try {
      await publishArticle({ variables: { articleId } });
      await refetchArticles();
      alert('Article published successfully');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to publish article'}`);
    }
  };

  const handleUnpublishArticle = async (articleId: string) => {
    try {
      await unpublishArticle({ variables: { articleId } });
      await refetchArticles();
      alert('Article unpublished successfully');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to unpublish article'}`);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;
    try {
      await deleteArticle({ variables: { articleId } });
      await refetchArticles();
      alert('Article deleted successfully');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to delete article'}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full border-r border-slate-200 bg-white" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-16 bg-white border-b" />
          <main className="flex-1 overflow-y-auto" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn()) return null;

  const role = normalizeRole(currentUser?.userRole);
  if (role && role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden antialiased">
      {/* Sidebar - Navigation */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* ── Header ── */}
        <AdminHeader title="Articles Management" subtitle="Create and manage blog articles and resources" />

        {/* ── Scrollable Body ── */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-8 py-10">
            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">search</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 flex items-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                <span>New Article</span>
              </button>
            </div>

            {/* Articles Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Title</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Slug</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Created</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Updated</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {articlesLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          Loading articles...
                        </td>
                      </tr>
                    ) : articlesError ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-red-500">
                          Error loading articles: {articlesError.message}
                        </td>
                      </tr>
                    ) : articles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          No articles found
                        </td>
                      </tr>
                    ) : (
                      articles.map((article: any) => (
                      <tr key={article._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {article.thumbnail && (
                              <img
                                src={getImageUrl(article.thumbnail)}
                                alt={article.title}
                                className="w-12 h-12 object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            )}
                            <span className="text-sm font-semibold text-slate-900">{article.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm font-mono text-slate-500">{article.slug}</span></td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            article.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>{article.status}</span>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm text-slate-500">{formatDate(article.createdAt)}</span></td>
                        <td className="px-6 py-4"><span className="text-sm text-slate-500">{formatDate(article.updatedAt)}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingArticle(article);
                                setArticleTitle(article.title);
                                setArticleSlug(article.slug);
                                setArticleDescription(article.shortDescription || '');
                                setArticleContent(article.body || '');
                                setArticleThumbnail(article.thumbnail || '');
                                setArticleStatus(article.status);
                                setTagsList(article.tags || []);
                                setArticleTags((article.tags || []).join(', '));
                                setIsCreating(true);
                              }}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            {article.status === 'PUBLISHED' ? (
                              <button
                                onClick={() => handleUnpublishArticle(article._id)}
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                                title="Unpublish"
                              >
                                <span className="material-symbols-outlined text-lg">visibility_off</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handlePublishArticle(article._id)}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                                title="Publish"
                              >
                                <span className="material-symbols-outlined text-lg">publish</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteArticle(article._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Create/Edit Article Modal */}
            {(isCreating || editingArticle) && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">
                      {editingArticle ? 'Edit Article' : 'Create New Article'}
                    </h3>
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setEditingArticle(null);
                        setArticleContent('');
                        setArticleTitle('');
                        setArticleSlug('');
                        setArticleDescription('');
                        setArticleThumbnail('');
                        setArticleStatus('DRAFT');
                        setArticleTags('');
                        setTagsList([]);
                        setTagInput('');
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg"
                    >
                      <span className="material-symbols-outlined text-slate-600">close</span>
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
                      <input
                        type="text"
                        value={articleTitle || editingArticle?.title || ''}
                        onChange={(e) => setArticleTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter article title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Slug *</label>
                      <input
                        type="text"
                        value={articleSlug || editingArticle?.slug || ''}
                        onChange={(e) => setArticleSlug(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                        placeholder="article-url-slug"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description</label>
                      <textarea
                        rows={3}
                        value={articleDescription || editingArticle?.shortDescription || ''}
                        onChange={(e) => setArticleDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Brief description of the article"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Content *</label>
                      <ArticleEditor
                        content={articleContent || editingArticle?.body || ''}
                        onChange={setArticleContent}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Thumbnail URL</label>
                        <input
                          type="url"
                          value={articleThumbnail || editingArticle?.thumbnail || ''}
                          onChange={(e) => setArticleThumbnail(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                        <select
                          value={articleStatus || editingArticle?.status || 'DRAFT'}
                          onChange={(e) => setArticleStatus(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="PUBLISHED">Published</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
                      <div className="space-y-3">
                        {/* Tag Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagInputKeyDown}
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter tag and press Enter"
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        
                        {/* Tags Display */}
                        {tagsList.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            {tagsList.map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                                  title="Remove tag"
                                >
                                  <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Helper Text */}
                        <p className="text-xs text-slate-500">
                          Add tags to help categorize your article. Press Enter or click Add to add a tag.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setEditingArticle(null);
                        setArticleContent('');
                        setArticleTitle('');
                        setArticleSlug('');
                        setArticleDescription('');
                        setArticleThumbnail('');
                        setArticleStatus('DRAFT');
                        setArticleTags('');
                        setTagsList([]);
                        setTagInput('');
                      }}
                      className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveArticle(true)}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold"
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={() => handleSaveArticle(false)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                    >
                      {editingArticle ? 'Update' : 'Publish'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
