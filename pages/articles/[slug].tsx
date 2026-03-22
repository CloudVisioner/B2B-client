import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import Footer from '../../libs/components/Footer';
import { GET_ARTICLE_BY_SLUG } from '../../apollo/admin/query';
import { getImageUrl } from '../../libs/utils';

// Legacy mock data fallback (will be removed once backend is ready)
const getArticleBySlug = (slug: string) => {
  const articles: Record<string, any> = {
    'how-to-choose-right-service-provider': {
      _id: '1',
      title: 'How to Choose the Right Service Provider',
      slug: 'how-to-choose-right-service-provider',
      shortDescription: 'A comprehensive guide to finding and selecting the perfect service provider for your business needs.',
      body: `
        <h2>Introduction</h2>
        <p>Choosing the right service provider is crucial for your business success. This guide will help you make informed decisions.</p>
        
        <h2>Key Factors to Consider</h2>
        <ul>
          <li><strong>Experience:</strong> Look for providers with proven track records in your industry</li>
          <li><strong>Portfolio:</strong> Review their previous work and case studies</li>
          <li><strong>Communication:</strong> Ensure they respond promptly and clearly</li>
          <li><strong>Pricing:</strong> Compare quotes but don't sacrifice quality for price</li>
        </ul>
        
        <h2>Questions to Ask</h2>
        <p>Before making a decision, ask potential providers:</p>
        <ol>
          <li>How long have you been in business?</li>
          <li>Can you provide references from similar projects?</li>
          <li>What is your process for handling revisions?</li>
          <li>How do you handle project timelines and deadlines?</li>
        </ol>
        
        <h2>Conclusion</h2>
        <p>Take your time to research and compare different providers. The right choice will save you time and money in the long run.</p>
      `,
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
      tags: ['Business', 'Tips', 'Guide'],
      publishedAt: '2024-02-15T10:30:00Z',
      author: 'Admin Team',
    },
    'maximizing-business-potential': {
      _id: '3',
      title: 'Maximizing Your Business Potential',
      slug: 'maximizing-business-potential',
      shortDescription: 'Discover strategies to unlock your business potential and achieve sustainable growth.',
      body: `
        <h2>Understanding Business Potential</h2>
        <p>Every business has untapped potential waiting to be discovered. This article explores key strategies.</p>
        
        <h2>Growth Strategies</h2>
        <p>Here are proven strategies to maximize your business potential:</p>
        
        <h3>1. Market Expansion</h3>
        <p>Explore new markets and customer segments to grow your revenue base.</p>
        
        <h3>2. Innovation</h3>
        <p>Continuously innovate your products and services to stay ahead of competitors.</p>
        
        <h3>3. Strategic Partnerships</h3>
        <p>Form partnerships that complement your business and open new opportunities.</p>
        
        <blockquote>
          <p>"The only way to do great work is to love what you do." - Steve Jobs</p>
        </blockquote>
        
        <h2>Conclusion</h2>
        <p>By implementing these strategies, you can unlock your business's full potential and achieve sustainable growth.</p>
      `,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
      tags: ['Business', 'Growth', 'Strategy'],
      publishedAt: '2024-02-10T09:15:00Z',
      author: 'Admin Team',
    },
  };
  return articles[slug] || null;
};

export default function ArticlePage() {
  const router = useRouter();
  const { slug } = router.query;

  const { data: articleData, loading: articleLoading, error: articleError } = useQuery(GET_ARTICLE_BY_SLUG, {
    skip: !slug || typeof slug !== 'string',
    variables: {
      slug: slug as string,
    },
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  if (!slug || typeof slug !== 'string') {
    return (
      <div className="app-container">
        <main className="main-content bg-[#f6f6f8] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h1>
            <Link href="/articles" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              ← Back to Articles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (articleLoading) {
    return (
      <div className="app-container">
        <main className="main-content bg-[#f6f6f8] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-xl text-slate-600">Loading article...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const article = articleData?.getArticleBySlug;
  
  // Fallback to mock data if query fails (for development)
  const finalArticle = article || getArticleBySlug(slug);

  if (articleError && !finalArticle) {
    return (
      <div className="app-container">
        <main className="main-content bg-[#f6f6f8] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h1>
            <p className="text-slate-600 mb-4">{articleError?.message || 'The article you are looking for does not exist.'}</p>
            <Link href="/articles" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              ← Back to Articles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!finalArticle) {
    return (
      <div className="app-container">
        <main className="main-content bg-[#f6f6f8] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h1>
            <Link href="/articles" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              ← Back to Articles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return renderArticle(finalArticle);
}

function renderArticle(article: any) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="app-container">
      <main className="main-content bg-white dark:bg-slate-900 min-h-screen">
        <article className="max-w-4xl mx-auto px-6 py-12">
          {/* Back Button */}
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Articles
          </Link>

          {/* Header */}
          <header className="mb-8">
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
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
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span>{formatDate(article.publishedAt)}</span>
              {article.author && (
                <>
                  <span>•</span>
                  <span>{article.author}</span>
                </>
              )}
            </div>
          </header>

          {/* Cover Image */}
          <div className="mb-8 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 min-h-[400px] max-h-[500px]">
            {article.articleCoverImage || article.thumbnail ? (
              <img
                src={getImageUrl(article.articleCoverImage || article.thumbnail)}
                alt={article.title}
                className="w-full h-full object-cover"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const parent = target.parentElement;
                  if (parent) {
                    target.style.display = 'none';
                    if (!parent.querySelector('.fallback-icon')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full min-h-[400px] flex items-center justify-center fallback-icon bg-slate-300 dark:bg-slate-600';
                      fallback.innerHTML = '<span class="material-symbols-outlined text-8xl text-slate-400">image</span>';
                      parent.appendChild(fallback);
                    }
                  }
                }}
              />
            ) : (
              <div className="w-full min-h-[400px] flex items-center justify-center bg-slate-300 dark:bg-slate-600">
                <span className="material-symbols-outlined text-8xl text-slate-400">image</span>
              </div>
            )}
          </div>

          {/* Article Content */}
          <div
            className="prose prose-slate dark:prose-invert max-w-none
              [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-slate-900 [&_h1]:dark:text-white
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-slate-900 [&_h2]:dark:text-white
              [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-slate-900 [&_h3]:dark:text-white
              [&_p]:text-slate-700 [&_p]:dark:text-slate-300 [&_p]:mb-4 [&_p]:leading-relaxed
              [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:text-slate-700 [&_ul]:dark:text-slate-300
              [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:text-slate-700 [&_ol]:dark:text-slate-300
              [&_li]:mb-2 [&_li]:text-slate-700 [&_li]:dark:text-slate-300
              [&_strong]:font-bold [&_strong]:text-slate-900 [&_strong]:dark:text-white
              [&_em]:italic
              [&_code]:bg-slate-100 [&_code]:dark:bg-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
              [&_a]:text-indigo-600 [&_a]:dark:text-indigo-400 [&_a]:underline [&_a]:hover:text-indigo-700 [&_a]:dark:hover:text-indigo-300
              [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:dark:border-slate-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-slate-600 [&_blockquote]:dark:text-slate-400
              [&_img]:rounded-lg [&_img]:my-6 [&_img]:shadow-md
              [&_pre]:bg-slate-100 [&_pre]:dark:bg-slate-800 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
              [&_code_block]:text-sm [&_code_block]:font-mono"
            dangerouslySetInnerHTML={{ __html: article.body || '' }}
          />

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              View All Articles
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
