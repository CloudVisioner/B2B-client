import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import Navbar from '../../libs/components/Navbar';
import Footer from '../../libs/components/Footer';
import { GET_ALL_ARTICLES } from '../../apollo/admin/query';
import { getImageUrl } from '../../libs/utils';

export default function ArticlesPage() {
  const { data: articlesData, loading: articlesLoading, error: articlesError } = useQuery(GET_ALL_ARTICLES, {
    variables: {
      input: {
        page: 1,
        limit: 50,
        search: {
          status: 'PUBLISHED',
        },
      },
    },
    fetchPolicy: 'network-only',
  });

  const articles = articlesData?.getAllArticles?.list || [];
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="app-container">
      <Navbar currentPage="articles" />

      <main className="main-content bg-[#f6f6f8] dark:bg-slate-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* ── Section Title ── */}
          <div className="mb-16 text-center">
            <h1 className="text-sm font-bold tracking-[0.2em] text-indigo-600 dark:text-indigo-400 uppercase mb-4">
              Resources & Articles
            </h1>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Expert Insights & Best Practices
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Discover valuable tips, guides, and strategies to help your business succeed
            </p>
          </div>

          {/* ── Articles Grid ── */}
          {articlesLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Loading articles...</p>
            </div>
          ) : articlesError ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl text-red-500">error</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Error Loading Articles</h3>
              <p className="text-slate-600 dark:text-slate-400">{articlesError.message}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl text-slate-400">article</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Articles Yet</h3>
              <p className="text-slate-600 dark:text-slate-400">Check back soon for new articles and resources.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {articles.map((article: any) => (
                <Link
                  key={article._id}
                  href={`/articles/${article.slug}`}
                  className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-700">
                    {article.thumbnail ? (
                      <img
                        src={getImageUrl(article.thumbnail)}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const parent = target.parentElement;
                          if (parent) {
                            target.style.display = 'none';
                            if (!parent.querySelector('.fallback-icon')) {
                              const fallback = document.createElement('div');
                              fallback.className = 'w-full h-full flex items-center justify-center fallback-icon bg-slate-300 dark:bg-slate-600';
                              fallback.innerHTML = '<span class="material-symbols-outlined text-6xl text-slate-400">image</span>';
                              parent.appendChild(fallback);
                            }
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-300 dark:bg-slate-600">
                        <span className="material-symbols-outlined text-6xl text-slate-400">image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.tags.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 text-sm font-semibold text-purple-700 bg-purple-100 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {article.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                      {article.shortDescription}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{article.publishedAt ? formatDate(article.publishedAt) : 'Not published'}</span>
                      <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                        Read More
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
