import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn } from '../libs/auth';
import { Sidebar } from '../libs/components/dashboard/Sidebar';
import { Header } from '../libs/components/dashboard/Header';
import { SummaryCard } from '../libs/components/dashboard/SummaryCard';
import { RequestTable } from '../libs/components/dashboard/RequestTable';
import { ProgressSection } from '../libs/components/dashboard/ProgressSection';
import { ActivityFeed } from '../libs/components/dashboard/ActivityFeed';
import { BurnRateCard } from '../libs/components/dashboard/BurnRateCard';

export default function DashboardPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [activeTab, setActiveTab] = useState('Open Requests');
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push('/login');
    }
  }, [router]);

  // During SSR or before mount, render empty div to match client
  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full border-r border-slate-200 bg-white"></div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-16 bg-white border-b"></div>
          <main className="flex-1 overflow-y-auto"></main>
        </div>
      </div>
    );
  }

  // If not logged in after mount, don't render anything
  if (!isLoggedIn()) {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden antialiased">
      {/* Sidebar - Fixed Width, No Overlap */}
      <Sidebar />

      {/* Main Content Area - Fills remaining space */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header - Stays at top */}
        <Header />

        {/* Scrollable Section */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <SummaryCard title="Active Requests" value="7" />
              <SummaryCard title="Total Quotes" value="12" badge="+3 new" />
              <SummaryCard title="Active Orders" value="3" />
              <SummaryCard title="Unread Notifications" value="5" color="indigo" />
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* Left Column: Requests & Progress */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* Requests Section */}
                <div className="bg-white rounded-lg border border-[var(--border)] card-shadow overflow-hidden">
                  <div className="flex border-b border-[var(--border)] px-4 bg-white">
                    <button 
                      onClick={() => setActiveTab('Open Requests')}
                      className={`px-6 py-4 text-base font-semibold border-b-2 ${
                        activeTab === 'Open Requests' 
                          ? 'border-[var(--primary)] text-[var(--primary)]' 
                          : 'border-transparent font-medium text-slate-500 hover:text-slate-700 transition-colors'
                      }`}
                    >
                      Open Requests
                    </button>
                    <button 
                      onClick={() => setActiveTab('Active Orders')}
                      className={`px-6 py-4 text-base ${
                        activeTab === 'Active Orders'
                          ? 'font-semibold border-b-2 border-[var(--primary)] text-[var(--primary)]'
                          : 'border-b-2 border-transparent font-medium text-slate-500 hover:text-slate-700 transition-colors'
                      }`}
                    >
                      Active Orders
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <RequestTable activeTab={activeTab} />
                  </div>
                </div>

                {/* Progress Section */}
                <ProgressSection />
              </div>

              {/* Right Column: Feed & Finance */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <ActivityFeed />
                <BurnRateCard />
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-[var(--border)]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-4">Management</p>
              <button 
                onClick={() => router.push('/marketplace')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">groups</span>
                Browse Talent
              </button>
              <button
                onClick={() => router.push('/organizations')}
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
              <p className="text-xs text-slate-400 font-medium">© 2024 SME Connect. Enterprise Buyer Protocol v2.4.1</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
