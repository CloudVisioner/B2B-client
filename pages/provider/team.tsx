import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn } from '../../libs/auth';
import { getHeaders } from '../../apollo/utils';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';
import { GET_PROVIDER_ORGANIZATION } from '../../apollo/user/query';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'IT' | 'Business' | 'Marketing' | 'Design';
  email: string;
  rating: number;
  projectsCount: number;
  avatar: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Senior Full-Stack Developer',
    department: 'IT',
    email: 'sarah.chen@company.com',
    rating: 4.9,
    projectsCount: 28,
    avatar: '/team/ec5751f8092aab122dd8886abd69002b (1).webp',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'Business Strategy Consultant',
    department: 'Business',
    email: 'michael.rodriguez@company.com',
    rating: 4.8,
    projectsCount: 22,
    avatar: '/team/JPMorgan Chase CEO Jamie Dimon Sells  150M in Shares.webp',
  },
  {
    id: '3',
    name: 'Emma Thompson',
    role: 'Digital Marketing Specialist',
    department: 'Marketing',
    email: 'emma.thompson@company.com',
    rating: 4.9,
    projectsCount: 19,
    avatar: '/team/ff4517da88b78f3a70edee38c20b917d.jpg',
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Lead UI/UX Designer',
    department: 'Design',
    email: 'david.kim@company.com',
    rating: 5.0,
    projectsCount: 31,
    avatar: '/team/c24d0d7542ee6be66bf4270123c15df4.webp',
  },
];

const DEPARTMENT_COLORS = {
  IT: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'code' },
  Business: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'business_center' },
  Marketing: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'campaign' },
  Design: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', icon: 'palette' },
};

export default function ProviderTeamPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);

  const { data: orgData, loading: orgLoading } = useQuery(GET_PROVIDER_ORGANIZATION, {
    skip: !isLoggedIn(),
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    fetchPolicy: 'cache-and-network',
  });

  const organization = orgData?.getProviderOrganization;

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

  // Helper function to convert relative image paths to full URLs
  const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:4001/graphql';
    const baseUrl = apiUrl.replace('/graphql', '');
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${baseUrl}/${cleanPath}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const orgImageUrl = organization?.organizationImage ? getImageUrl(organization.organizationImage) : null;

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

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden antialiased">
      <ProviderSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ProviderHeader title="Team Members" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Organization Info Section - Only show when organization exists */}
            {organization && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-6">
                  {orgImageUrl ? (
                    <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-slate-100 shadow-lg flex-shrink-0">
                  <img 
                        src={orgImageUrl} 
                        alt={organization?.organizationName || 'Organization'} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                            parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold">${getInitials(organization?.organizationName || 'Organization')}</div>`;
                      }
                    }}
                  />
                </div>
              ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-2 ring-slate-100 flex-shrink-0">
                  {getInitials(organization?.organizationName || 'Organization')}
                </div>
              )}
              <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {organization?.organizationName || 'Organization'} Team
                    </h1>
                    <div className="flex items-center gap-6 text-sm text-slate-600">
                      <span className="font-semibold">{TEAM_MEMBERS.length} Team Members</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-semibold">{TEAM_MEMBERS.reduce((sum, m) => sum + m.projectsCount, 0)} Total Projects</span>
                      {organization?.organizationIndustry && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="font-semibold">{organization.organizationIndustry}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Members Grid - Premium Square Cards */}
            {!organization ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/20 mx-auto mb-6 flex items-center justify-center">
                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-4xl">business</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Create Your Organization</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    You need to create your provider organization profile before you can view and manage team members.
                  </p>
                  <button
                    onClick={() => router.push('/provider/organizations')}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 mx-auto"
                  >
                    <span className="material-symbols-outlined">add_business</span>
                    Create Organization
                  </button>
            </div>
          </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TEAM_MEMBERS.map((member) => {
                  const dept = DEPARTMENT_COLORS[member.department];
                  // Lower the first card's image (Sarah Chen - id: '1')
                  const imagePosition = member.id === '1' ? 'center 30%' : 'center 20%';
                  return (
              <div
                key={member.id}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                    >
                      {/* Member Photo */}
                      <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          style={{ objectPosition: imagePosition }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-4xl font-bold">${getInitials(member.name)}</div>`;
                            }
                          }}
                        />
                      {/* Department Badge */}
                      <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg ${dept.bg} ${dept.border} border backdrop-blur-sm`}>
                        <div className="flex items-center gap-1.5">
                          <span className={`material-symbols-outlined text-sm ${dept.text}`}>{dept.icon}</span>
                          <span className={`text-xs font-bold ${dept.text}`}>{member.department}</span>
                        </div>
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                      <p className="text-sm text-slate-600 mb-4">{member.role}</p>

                      {/* Stats */}
                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</span>
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-slate-900">{member.rating}</span>
                            <span className="material-symbols-outlined text-amber-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Projects</span>
                          <span className="text-lg font-bold text-slate-900">{member.projectsCount}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <span className="material-symbols-outlined text-slate-400 text-base">email</span>
                          <span className="text-xs text-slate-600 truncate flex-1">{member.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

            {/* Footer */}
            <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-slate-200">
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
            <button 
              onClick={() => router.push('/provider/help-support')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
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
