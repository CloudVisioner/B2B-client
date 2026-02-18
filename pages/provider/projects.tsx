import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn } from '../../libs/auth';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';

type ProjectStatus = 'proposals' | 'active' | 'completed';

interface Project {
  id: string;
  title: string;
  client: string;
  status: ProjectStatus;
  amount: string;
  dueDate?: string;
  progress?: number;
  daysLeft?: number;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: '1234',
    title: 'ABC Corp Website',
    client: 'ABC Corp',
    status: 'proposals',
    amount: '$2,500',
    dueDate: 'Mar 15',
  },
  {
    id: '1235',
    title: 'XYZ Mobile App',
    client: 'XYZ Inc',
    status: 'active',
    amount: '$4,200',
    progress: 65,
    daysLeft: 3,
  },
  {
    id: '1236',
    title: 'E-commerce Platform',
    client: 'Retail Co',
    status: 'active',
    amount: '$8,500',
    progress: 40,
    daysLeft: 12,
  },
  {
    id: '1237',
    title: 'Brand Identity Design',
    client: 'StartupXYZ',
    status: 'completed',
    amount: '$1,800',
  },
  {
    id: '1238',
    title: 'API Integration',
    client: 'TechCorp',
    status: 'completed',
    amount: '$3,200',
  },
];

export default function ProviderProjectsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ProjectStatus>('proposals');

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

  const proposalsCount = MOCK_PROJECTS.filter((p) => p.status === 'proposals').length;
  const activeCount = MOCK_PROJECTS.filter((p) => p.status === 'active').length;
  const completedCount = MOCK_PROJECTS.filter((p) => p.status === 'completed').length;
  const totalEarned = '$23,450';

  const filteredProjects = MOCK_PROJECTS.filter((p) => p.status === activeTab);

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'proposals':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Proposal Sent
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Active
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Completed
          </span>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden antialiased">
      <ProviderSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ProviderHeader title="My Projects" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Proposals</span>
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-xl">send</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{proposalsCount}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active</span>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-xl">work</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{activeCount}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completed</span>
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">check_circle</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{completedCount}</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Total Earned</span>
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xl">payments</span>
                </div>
              </div>
              <p className="text-3xl font-bold">{totalEarned}</p>
            </div>
          </div>

          {/* Projects List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button
                onClick={() => setActiveTab('proposals')}
                className={`flex-1 px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === 'proposals'
                    ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Proposals Sent ({proposalsCount})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === 'active'
                    ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === 'completed'
                    ? 'border-blue-500 text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>

            {/* Projects */}
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredProjects.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400 text-3xl">inbox</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No projects in this category</p>
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <div key={project.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm font-bold text-slate-400 dark:text-slate-500">#{project.id}</span>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{project.title}</h3>
                          {getStatusBadge(project.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                          <span className="font-semibold text-slate-900 dark:text-slate-200">{project.amount}</span>
                          {project.dueDate && (
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base">event</span>
                              Due: {project.dueDate}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base">business</span>
                            {project.client}
                          </span>
                          {project.progress !== undefined && (
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base">trending_up</span>
                              {project.progress}% complete
                            </span>
                          )}
                          {project.daysLeft !== undefined && (
                            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                              <span className="material-symbols-outlined text-base">schedule</span>
                              {project.daysLeft} days left
                            </span>
                          )}
                        </div>
                        {project.progress !== undefined && (
                          <div className="mb-4">
                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          {project.status === 'proposals' && (
                            <>
                              <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">visibility</span>
                                View Details
                              </button>
                              <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">edit</span>
                                Edit Proposal
                              </button>
                            </>
                          )}
                          {project.status === 'active' && (
                            <>
                              <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">chat</span>
                                Chat
                              </button>
                              <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">timer</span>
                                Time Track
                              </button>
                              <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">receipt</span>
                                Invoice
                              </button>
                            </>
                          )}
                          {project.status === 'completed' && (
                            <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">visibility</span>
                              View Details
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
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
