import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn } from '../../libs/auth';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  rating: number;
  projectsCount: number;
  avatar?: string;
}

const MOCK_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Kim',
    role: 'Lead React Developer',
    email: 'sarah@acme.com',
    rating: 4.9,
    projectsCount: 23,
  },
  {
    id: '2',
    name: 'Minho Park',
    role: 'Senior AWS DevOps',
    email: 'minho@acme.com',
    rating: 4.8,
    projectsCount: 18,
  },
  {
    id: '3',
    name: 'Jiwoo Lee',
    role: 'UI/UX Designer',
    email: 'jiwoo@acme.com',
    rating: 5.0,
    projectsCount: 12,
  },
];

export default function ProviderTeamPage() {
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleIcon = (role: string) => {
    if (role.toLowerCase().includes('developer') || role.toLowerCase().includes('react')) {
      return 'code';
    }
    if (role.toLowerCase().includes('devops') || role.toLowerCase().includes('aws')) {
      return 'cloud';
    }
    if (role.toLowerCase().includes('designer') || role.toLowerCase().includes('ui')) {
      return 'palette';
    }
    return 'person';
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden antialiased">
      <ProviderSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ProviderHeader title="Team Members" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team Members</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage your organization's team and their roles
              </p>
            </div>
            <button className="px-6 py-3 bg-[var(--primary)] hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">add</span>
              Add Team Member
            </button>
          </div>

          {/* Team Stats */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {getInitials('Acme Web Studio')}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Acme Web Studio Team</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{MOCK_TEAM.length} members</p>
              </div>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_TEAM.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0">
                    {getInitials(member.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{member.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-base">
                          {getRoleIcon(member.role)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate">{member.role}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-base">email</span>
                    <span className="truncate">{member.email}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{member.rating}</span>
                      <span className="material-symbols-outlined text-amber-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">({member.projectsCount} projects)</span>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                      <span className="material-symbols-outlined text-lg">more_vert</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State (if no team) */}
          {MOCK_TEAM.length === 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-400 text-3xl">group</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-2">No team members yet</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">Add your first team member to get started</p>
              <button className="px-6 py-3 bg-[var(--primary)] hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center gap-2 mx-auto">
                <span className="material-symbols-outlined text-lg">add</span>
                Add Team Member
              </button>
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
