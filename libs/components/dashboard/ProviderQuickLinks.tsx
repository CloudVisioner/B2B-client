import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface QuickLink {
  icon: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

const ALL_QUICK_LINKS: QuickLink[] = [
  { icon: 'add_task', label: 'New Project', href: '/provider/projects/new' },
  { icon: 'send', label: 'Send Quote', href: '/provider/quotes/new' },
  { icon: 'support_agent', label: 'Support', href: '/provider/support' },
  { icon: 'cloud_upload', label: 'Documents', href: '/provider/documents' },
  { icon: 'analytics', label: 'Analytics', href: '/provider/analytics' },
  { icon: 'settings', label: 'Settings', href: '/provider/settings' },
];

const ITEMS_PER_PAGE = 4;

export const ProviderQuickLinks: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(ALL_QUICK_LINKS.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedLinks = ALL_QUICK_LINKS.slice(startIndex, endIndex);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Quick Links</h2>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {currentPage}/{totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {displayedLinks.map((link) => (
          <button
            key={link.label}
            onClick={() => link.href && router.push(link.href)}
            className="flex flex-col items-center gap-2 p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
          >
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
              {link.icon}
            </span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{link.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
