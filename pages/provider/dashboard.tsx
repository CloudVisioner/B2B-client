import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn } from '../../libs/auth';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';
import { ProviderStatsCard } from '../../libs/components/dashboard/ProviderStatsCard';
import { ProviderActivityFeed } from '../../libs/components/dashboard/ProviderActivityFeed';
import { ProviderQuickLinks } from '../../libs/components/dashboard/ProviderQuickLinks';
import { ProviderStatusCard } from '../../libs/components/dashboard/ProviderStatusCard';

export default function ProviderDashboardPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    // Check if user is a provider, if not redirect to buyer dashboard
    const userRole = currentUser?.userRole;
    if (userRole && userRole !== 'PROVIDER' && userRole !== 'provider') {
      router.push('/dashboard');
    }
  }, [router, currentUser]);

  // During SSR or before mount, render empty div to match client
  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"></div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0"></div>
          <main className="flex-1 overflow-y-auto"></main>
        </div>
      </div>
    );
  }

  // If not logged in after mount, don't render anything
  if (!isLoggedIn()) {
    return null;
  }

  // Check user role
  const userRole = currentUser?.userRole;
  if (userRole && userRole !== 'PROVIDER' && userRole !== 'provider') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden antialiased">
      {/* Sidebar - Fixed Width, No Overlap */}
      <ProviderSidebar />

      {/* Main Content Area - Fills remaining space */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header - Stays at top */}
        <ProviderHeader />

        {/* Scrollable Section */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ProviderStatsCard
                icon="assignment"
                title="Active Projects"
                value="8"
                linkText="View All"
                linkHref="/provider/projects"
              />
              <ProviderStatsCard
                icon="payments"
                iconBg="bg-green-50 dark:bg-green-900/20"
                iconColor="text-green-600 dark:text-green-400"
                title="Revenue this Month"
                value="$12,400"
                badge="+12%"
                badgeColor="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
              />
              <ProviderStatsCard
                icon="pending_actions"
                iconBg="bg-primary"
                iconColor="text-white"
                title="New Proposals"
                value="3"
                badge="URGENT"
                badgeColor="text-primary bg-primary/10"
                highlight={true}
              />
              <ProviderStatsCard
                icon="mail"
                iconBg="bg-amber-50 dark:bg-amber-900/20"
                iconColor="text-amber-600 dark:text-amber-400"
                title="Recent Messages"
                value="5"
                linkText="Inbox"
                linkHref="/provider/messages"
              />
            </div>

            {/* Bottom Section: Recent Activity & Quick Links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity Feed */}
              <ProviderActivityFeed />

              {/* Quick Actions / Shortcuts */}
              <div className="space-y-6">
                <ProviderQuickLinks />

                {/* Platform Status Card */}
                <ProviderStatusCard
                  title="SME Connect Hub"
                  message="Your provider status is currently excellent. Keep up the great response time!"
                  progress={92}
                />
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
