import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn } from '../../libs/auth';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';

export default function ProviderOrganizationsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    const role = currentUser?.userRole;
    if (role && role !== 'PROVIDER' && role !== 'provider') {
      router.push('/dashboard');
    }
  }, [router, currentUser]);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800" />
          <main className="flex-1 overflow-y-auto" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn()) return null;

  const userName = currentUser?.userNick || 'Provider';

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden antialiased">
      {/* Sidebar */}
      <ProviderSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ProviderHeader title="Organizations" />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
          {/* Top card: Organization profile shared pattern */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Studio Profile</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Update how clients see your provider organization in the marketplace.
                </p>
              </div>
              <button
                onClick={() => router.push('/provider/settings')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-[var(--primary)] hover:bg-indigo-50 dark:hover:bg-slate-800 border border-indigo-200 dark:border-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
                Edit
              </button>
            </div>

            <div className="flex items-start gap-8">
              {/* Logo */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
                  {userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'PR'}
                </div>
              </div>

              {/* Fields – provider flavored */}
              <div className="flex-1 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Studio Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Web Studio"
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Primary Niche <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="B2B SaaS, Fintech, Healthcare"
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Remote • Berlin, Germany"
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Website
                  </label>
                  <input
                    type="text"
                    placeholder="https://acmestudio.com"
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Studio Description
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Describe your team, process, and ideal projects so buyers know when to choose you..."
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 resize-y"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Role-specific fields section */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Provider Settings</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Configure how you work with buyers: pricing, availability, and capabilities.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Specialties
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, AWS, DevOps"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                  Separate skills with commas. These power search & matching.
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Standard Hourly Rate
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-500">$</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="75"
                    className="w-32 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40"
                  />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">/ hour</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Weekly Availability
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={80}
                    placeholder="40"
                    className="w-20 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40"
                  />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">hours / week</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Team Size
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="3"
                  className="w-24 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">save</span>
              Save Changes
            </button>
          </div>

          {/* Footer - Matching Buyer Dashboard Style */}
          <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-[var(--border)]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-4">Management</p>
            <button
              onClick={() => router.push('/provider/jobs')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">work</span>
              Find Jobs
            </button>
            <button
              onClick={() => router.push('/provider/organizations')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">settings_suggest</span>
              Manage Organizations
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-lg">help</span>
              Help & Support
            </button>
          </div>
          <div className="pb-8">
            <p className="text-xs text-slate-400 font-medium">© 2026 SME Marketplace Provider v2.1</p>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}

