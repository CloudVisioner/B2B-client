import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn } from '../../libs/auth';
import { getHeaders } from '../../apollo/utils';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';

/* ─── Format date helper ─── */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ═══════════════════════════════════════════════════════════
   Provider Dashboard - Professional Overview
   ═══════════════════════════════════════════════════════════ */
export default function ProviderDashboardPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);

  // TODO: Replace with actual provider queries when available
  // For now using mock data structure
  const [availableRequests, setAvailableRequests] = useState<any[]>([]);
  const [myQuotes, setMyQuotes] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    // Check if user is a provider
    const userRole = currentUser?.userRole;
    if (userRole && userRole !== 'PROVIDER' && userRole !== 'provider') {
      router.push('/dashboard');
    }

    // TODO: Fetch actual data from GraphQL queries
    // Mock data for now
    setAvailableRequests([
      { _id: '1', reqTitle: 'Web Design', reqBudgetRange: '$3,500', reqDeadline: '2024-03-15' },
      { _id: '2', reqTitle: 'Logo', reqBudgetRange: '$800', reqDeadline: '2024-02-28' },
    ]);
    setMyQuotes([
      { _id: '123', reqTitle: 'Web Design', status: 'PENDING' },
      { _id: '124', reqTitle: 'Logo', status: 'ACCEPTED' },
    ]);
    setActiveOrders([
      { _id: '127', reqTitle: 'Legal Review', status: 'IN_PROGRESS', progress: 50 },
    ]);
  }, [router, currentUser]);

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

  const userRole = currentUser?.userRole;
  if (userRole && userRole !== 'PROVIDER' && userRole !== 'provider') {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden antialiased">
      {/* Sidebar - Navigation */}
      <ProviderSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* ── Header (Same as other provider pages) ── */}
        <ProviderHeader title="Dashboard" />

        {/* ── Scrollable Body ── */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto px-8 py-10">
            {/* Overview Section */}
            <div className="mb-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Overview</h2>
                <p className="text-sm text-slate-500">Quick snapshot of your opportunities and work</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* CARD 1: Available Requests */}
                <div className="bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all duration-200">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-slate-600 text-xl">description</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Available Requests ({availableRequests.length})</h3>
                      </div>
                    </div>
                    {loading ? (
                      <div className="space-y-2">
                        <div className="h-12 bg-slate-100 rounded animate-pulse"></div>
                        <div className="h-12 bg-slate-100 rounded animate-pulse"></div>
                      </div>
                    ) : availableRequests.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">No available requests</p>
                    ) : (
                      <div className="space-y-2 mb-4">
                        {availableRequests.slice(0, 3).map((req: any) => (
                          <div
                            key={req._id}
                            className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            onClick={() => router.push(`/provider/jobs?id=${req._id}`)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">{req.reqTitle}</p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                                  <span>{req.reqBudgetRange || 'N/A'}</span>
                                  <span>•</span>
                                  <span>{req.reqDeadline ? formatDate(req.reqDeadline) : 'No deadline'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => router.push('/provider/jobs')}
                      className="w-full mt-4 px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      ➕ View All
                    </button>
                  </div>
                </div>

                {/* CARD 2: My Quotes */}
                <div className="bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all duration-200">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-slate-600 text-xl">request_quote</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">My Quotes ({myQuotes.length})</h3>
                      </div>
                    </div>
                    {loading ? (
                      <div className="space-y-2">
                        <div className="h-12 bg-slate-100 rounded animate-pulse"></div>
                        <div className="h-12 bg-slate-100 rounded animate-pulse"></div>
                      </div>
                    ) : myQuotes.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">No quotes submitted</p>
                    ) : (
                      <div className="space-y-2 mb-4">
                        {myQuotes.slice(0, 3).map((quote: any) => (
                          <div
                            key={quote._id}
                            className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            onClick={() => router.push(`/provider/jobs?id=${quote._id}`)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono font-bold text-slate-400">#{quote._id}</span>
                                  <span className="text-sm font-semibold text-slate-900 truncate">{quote.reqTitle}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-slate-600">→</span>
                                  <span className={`text-xs font-semibold ${
                                    quote.status === 'ACCEPTED' 
                                      ? 'text-emerald-600' 
                                      : quote.status === 'REJECTED'
                                      ? 'text-red-600'
                                      : 'text-slate-600'
                                  }`}>
                                    {quote.status === 'ACCEPTED' ? 'Accepted ✓' : quote.status === 'REJECTED' ? 'Rejected' : 'Pending'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => router.push('/provider/jobs')}
                      className="w-full mt-4 px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      👀 Manage
                    </button>
                  </div>
                </div>

                {/* CARD 3: Active Orders */}
                <div className="bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all duration-200">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-slate-600 text-xl">work</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Active Orders ({activeOrders.length})</h3>
                      </div>
                    </div>
                    {loading ? (
                      <div className="space-y-2">
                        <div className="h-16 bg-slate-100 rounded animate-pulse"></div>
                      </div>
                    ) : activeOrders.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">No active orders</p>
                    ) : (
                      <div className="space-y-3 mb-4">
                        {activeOrders.slice(0, 3).map((order: any) => (
                          <div
                            key={order._id}
                            className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            onClick={() => router.push(`/provider/projects?id=${order._id}`)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-slate-400">#{order._id}</span>
                                <span className="text-sm font-semibold text-slate-900">{order.reqTitle}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2 mb-2">
                              <span className="text-xs font-semibold text-blue-600">In Progress</span>
                            </div>
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-slate-600">📊 Progress</span>
                                <span className="text-xs font-bold text-slate-700">{order.progress || 0}%</span>
                              </div>
                              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                                  style={{ width: `${order.progress || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => router.push('/provider/projects')}
                      className="w-full mt-4 px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      👀 View All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
