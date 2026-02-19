import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { logOut } from '../../auth';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', href: '/provider/dashboard' },
  { icon: 'work', label: 'Find Jobs', href: '/provider/jobs' },
  { icon: 'corporate_fare', label: 'Organizations', href: '/provider/organizations' },
  { icon: 'settings', label: 'Settings', href: '/provider/settings' },
];

const PROJECT_ITEMS = [
  { icon: 'work', label: 'My Projects', href: '/provider/projects' },
  { icon: 'receipt_long', label: 'Billing & Invoices', href: '/provider/billing' },
  { icon: 'group', label: 'Team Members', href: '/provider/team' },
];

export const ProviderSidebar: React.FC = () => {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const userName = currentUser?.userNick || 'User';

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-[var(--primary)]">SME</span>
          <span className="text-slate-900 dark:text-white">Connect</span>
        </Link>
      </div>

      {/* Profile */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <img
            alt={userName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
            src={currentUser?.userImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff`}
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 dark:text-white">{userName}</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Provider</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-[var(--primary)] font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1", color: 'var(--primary)' } : undefined}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        {PROJECT_ITEMS.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-[var(--primary)] font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1", color: 'var(--primary)' } : undefined}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
