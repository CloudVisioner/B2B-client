import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn } from '../../libs/auth';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';

interface JobPost {
  id: string;
  title: string;
  client: string;
  budget: string;
  category: string;
  location: string;
  postedAgo: string;
  applicants?: number;
  description?: string;
}

const MOCK_JOBS: JobPost[] = [
  {
    id: '987',
    title: 'ABC Corp Website',
    client: 'ABC Corp',
    budget: '$2,500',
    category: 'Web Development',
    location: 'Busan',
    postedAgo: '2 hours ago',
    description: 'React developer Busan',
  },
  {
    id: '988',
    title: 'XYZ Mobile App',
    client: 'XYZ Inc',
    budget: '$4,200',
    category: 'React Native',
    location: 'Seoul',
    postedAgo: '5 hours ago',
    applicants: 5,
  },
  {
    id: '989',
    title: 'E-commerce Platform',
    client: 'Retail Co',
    budget: '$8,500',
    category: 'Full Stack',
    location: 'Busan',
    postedAgo: '1 day ago',
    applicants: 12,
  },
];

export default function ProviderJobsPage() {
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

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden antialiased">
      <ProviderSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ProviderHeader title="New Job Posts" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Job Posts ({MOCK_JOBS.length})</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Browse and propose on new service requests from buyers
                </p>
              </div>
            </div>

            {/* Job Posts List */}
            <div className="space-y-4">
              {MOCK_JOBS.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-bold text-slate-400 dark:text-slate-500">#{job.id}</span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
                      </div>
                      {job.description && (
                        <div className="flex items-center gap-2 mb-4 text-sm text-slate-600 dark:text-slate-400">
                          <span className="material-symbols-outlined text-base">search</span>
                          <span className="italic">"{job.description}"</span>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-200">
                          <span className="material-symbols-outlined text-base">payments</span>
                          {job.budget}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">category</span>
                          {job.category}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">location_on</span>
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">schedule</span>
                          Posted {job.postedAgo}
                        </span>
                        {job.applicants !== undefined && (
                          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                            <span className="material-symbols-outlined text-base">people</span>
                            {job.applicants} applicants
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">visibility</span>
                          View
                        </button>
                        <button className="px-4 py-2 bg-[var(--primary)] hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">send</span>
                          Propose
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {MOCK_JOBS.length === 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-3xl">work_off</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">No new job posts available</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Check back later for new opportunities</p>
              </div>
            )}

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
