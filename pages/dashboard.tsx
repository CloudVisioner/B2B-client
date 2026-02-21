import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn } from '../libs/auth';
import { getHeaders } from '../apollo/utils';
import { Sidebar } from '../libs/components/dashboard/Sidebar';
import { Header } from '../libs/components/dashboard/Header';
import { GET_BUYER_SERVICE_REQUESTS } from '../apollo/user/query';

/* ═══════════════════════════════════════════════════════════
   Buyer Dashboard - Professional Overview (Counts Only)
   ═══════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);

  // Fetch service requests
  const { data: requestsData, loading: requestsLoading } = useQuery(GET_BUYER_SERVICE_REQUESTS, {
    skip: !isLoggedIn(),
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    variables: {
      input: {
        limit: 50,
      },
    },
  });

  const allRequests = requestsData?.getBuyerServiceRequests?.list || [];
  const openRequests = allRequests.filter((r: any) => r.reqStatus === 'OPEN');
  const activeOrders = allRequests.filter((r: any) => r.reqStatus === 'ACTIVE');
  
  // Calculate counts
  const openCount = openRequests.length;
  const quotesWaiting = openRequests.reduce((sum: number, req: any) => sum + (req.reqTotalQuotes || 0), 0);
  const activeCount = activeOrders.length;
  
  // Calculate overdue (requests past deadline with OPEN status)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueCount = openRequests.filter((req: any) => {
    if (!req.reqDeadline) return false;
    const deadline = new Date(req.reqDeadline);
    deadline.setHours(0, 0, 0, 0);
    return deadline < today;
  }).length;

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push('/login');
    }
  }, [router]);

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

  if (!isLoggedIn()) return null;

  const stats = [
    {
      label: 'Open Requests',
      value: openCount,
      icon: 'description',
    },
    {
      label: 'Quotes Waiting',
      value: quotesWaiting,
      icon: 'request_quote',
    },
    {
      label: 'Active Order' + (activeCount !== 1 ? 's' : ''),
      value: activeCount,
      icon: 'work',
    },
    {
      label: 'Overdue',
      value: overdueCount,
      icon: 'schedule',
      isWarning: overdueCount > 0,
    },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden antialiased">
      {/* Sidebar - Navigation */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* ── Header (Same as other pages) ── */}
        <Header title="Dashboard" subtitle="Overview of your service requests and activity" />

        {/* ── Scrollable Body ── */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto px-8 py-10">
            {/* Overview Section */}
            <div className="mb-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Overview</h2>
                <p className="text-sm text-slate-500">Quick snapshot of your service requests</p>
              </div>
              
              {requestsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-lg p-6 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                      <div className="h-10 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-slate-600 text-xl">{stat.icon}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{stat.label}</p>
                        <p className={`text-4xl font-bold ${stat.isWarning ? 'text-red-600' : 'text-slate-900'}`}>
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-lg p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => router.push('/post-job')}
                  className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  Post New Request
                </button>
                <button
                  onClick={() => router.push('/service-requests')}
                  className="px-6 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-700 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">visibility</span>
                  Manage Requests
                </button>
                <button
                  onClick={() => router.push('/marketplace')}
                  className="px-6 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-700 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">groups</span>
                  Browse Talent
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
