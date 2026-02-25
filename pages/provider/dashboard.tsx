import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn } from '../../libs/auth';
import { getHeaders } from '../../apollo/utils';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';
import { GET_PROVIDER_ORGANIZATION, GET_QUOTES_BY_ORGANIZATION, GET_SERVICE_REQUESTS } from '../../apollo/user/query';

/* ─── Format date helper ─── */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/* ═══════════════════════════════════════════════════════════
   Provider Dashboard - Premium Overview
   ═══════════════════════════════════════════════════════════ */
export default function ProviderDashboardPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);

  // Fetch provider organization
  const { data: providerOrgData } = useQuery(GET_PROVIDER_ORGANIZATION, {
    skip: !isLoggedIn(),
    fetchPolicy: 'network-only',
    context: { headers: isLoggedIn() ? getHeaders() : {} },
  });
  const providerOrgId: string | undefined = providerOrgData?.getProviderOrganization?._id;

  // Fetch quotes by organization
  const { data: quotesData, loading: quotesLoading } = useQuery(GET_QUOTES_BY_ORGANIZATION, {
    skip: !isLoggedIn() || !providerOrgId || !mounted,
    fetchPolicy: 'network-only',
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    variables: { orgId: providerOrgId || '' },
  });

  // Fetch available service requests
  const { data: requestsData, loading: requestsLoading } = useQuery(GET_SERVICE_REQUESTS, {
    skip: !isLoggedIn() || !mounted,
    fetchPolicy: 'network-only',
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    variables: {
      input: {
        page: 1,
        limit: 5,
        sort: 'createdAt',
        sortOrder: 'desc',
        search: {
          reqStatus: 'OPEN',
        },
      },
    },
  });

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    const userRole = currentUser?.userRole;
    if (userRole && userRole !== 'PROVIDER' && userRole !== 'provider') {
      router.push('/dashboard');
    }
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

  const userName = currentUser?.userNick || providerOrgData?.getProviderOrganization?.organizationName || 'Provider';
  const availableRequests = requestsData?.getServiceRequests?.list || [];
  const myQuotes = quotesData?.getQuotesByOrganization || [];
  const pendingQuotes = myQuotes.filter((q: any) => q.quoteStatus === 'PENDING');
  const acceptedQuotes = myQuotes.filter((q: any) => q.quoteStatus === 'ACCEPTED');
  const activeOrders = acceptedQuotes; // Using accepted quotes as active orders for now

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
      <ProviderSidebar />
      
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <ProviderHeader title="Dashboard" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
            {/* Premium Cards Grid - Two Square Cards on Top */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Card 1: Active Orders - Square */}
              <div className="group">
                <div className="relative bg-white rounded-3xl border border-slate-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden aspect-square">
                  {/* Featured Image Section */}
                  <div className="relative h-full overflow-hidden">
                    <Image
                      src="/images/activeOrders.webp"
                      alt="Active Orders"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/30 to-transparent"></div>
                    {/* Number at top left */}
                    <div className="absolute top-6 left-6 z-10">
                      <p className="text-6xl font-black text-white leading-none">{activeOrders.length}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-2xl">work</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-white">Active Orders</h2>
                          <p className="text-sm font-semibold text-white/90">Projects in progress</p>
                        </div>
                      </div>
                      
                      {/* Content Overlay */}
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                        {quotesLoading ? (
                          <div className="h-12 bg-slate-100 rounded-xl animate-pulse"></div>
                        ) : activeOrders.length === 0 ? (
                          <p className="text-xs font-semibold text-slate-600 text-center py-2">No active orders</p>
                        ) : (
                          <div className="space-y-2">
                            {activeOrders.slice(0, 2).map((order: any) => (
                              <div
                                key={order._id}
                                onClick={() => router.push(`/provider/projects?id=${order._id}`)}
                                className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                              >
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {order.quoteServiceReqData?.reqTitle || 'Project'}
                                </p>
                                <span className="text-xs font-semibold text-emerald-600">Accepted</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: My Quotes - Square */}
              <div className="group">
                <div className="relative bg-white rounded-3xl border border-slate-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden aspect-square">
                  {/* Featured Image Section */}
                  <div className="relative h-full overflow-hidden">
                    <Image
                      src="/images/quotes.webp"
                      alt="My Quotes"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 via-emerald-900/30 to-transparent"></div>
                    {/* Number at top left */}
                    <div className="absolute top-6 left-6 z-10">
                      <p className="text-6xl font-black text-white leading-none">{myQuotes.length}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-2xl">request_quote</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-white">My Quotes</h2>
                          <p className="text-sm font-semibold text-white/90">Your submissions</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-bold border border-white/30">{acceptedQuotes.length} Accepted</span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-bold border border-white/30">{pendingQuotes.length} Pending</span>
                      </div>
                      
                      {/* Content Overlay */}
                      <div>
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                          {quotesLoading ? (
                            <div className="h-12 bg-slate-100 rounded-xl animate-pulse"></div>
                          ) : myQuotes.length === 0 ? (
                            <p className="text-xs font-semibold text-slate-600 text-center py-2">No quotes yet</p>
                          ) : (
                            <div className="space-y-2">
                              {myQuotes.slice(0, 2).map((quote: any) => (
                                <div
                                  key={quote._id}
                                  onClick={() => router.push(`/provider/my-quotes`)}
                                  className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                                >
                                  <p className="text-xs font-bold text-slate-900 truncate mb-1">
                                    {quote.quoteServiceReqData?.reqTitle || 'Quote'}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                      quote.quoteStatus === 'ACCEPTED' 
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : quote.quoteStatus === 'REJECTED'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                      {quote.quoteStatus}
                                    </span>
                                    <span className="text-xs font-bold text-slate-600">
                                      ${quote.quoteAmount?.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Available Requests - Long Horizontal */}
            <div className="group">
              <div className="relative bg-white rounded-3xl border border-slate-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Featured Image Section */}
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src="/images/request.webp"
                    alt="Available Requests"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 via-indigo-900/30 to-transparent"></div>
                  {/* Number at top left */}
                  <div className="absolute top-8 left-8 lg:left-10 z-10">
                    <p className="text-7xl font-black text-white leading-none">{availableRequests.length}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-3xl">description</span>
                        </div>
                        <div>
                          <h2 className="text-3xl font-black text-white mb-1">Available Requests</h2>
                          <p className="text-base font-semibold text-white/90">New opportunities waiting for you</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative p-8 lg:p-10 bg-white">
                  {requestsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse"></div>
                      ))}
                    </div>
                  ) : availableRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 mx-auto mb-4 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-400 text-3xl">work_off</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">No available requests</p>
                      <p className="text-xs text-slate-500">Check back later for new opportunities</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {availableRequests.slice(0, 3).map((req: any) => (
                        <div
                          key={req._id}
                          onClick={() => router.push(`/provider/jobs?id=${req._id}`)}
                          className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:bg-white hover:shadow-lg transition-all cursor-pointer group"
                        >
                          <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2">{req.reqTitle}</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                              <span className="material-symbols-outlined text-sm">attach_money</span>
                              <span>{req.reqBudgetRange || 'Contact to discuss'}</span>
                            </div>
                            {req.reqDeadline && (
                              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                <span>{formatDate(req.reqDeadline)}</span>
                              </div>
                            )}
                            {req.reqCategory && (
                              <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg">
                                {req.reqCategory}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => router.push('/provider/jobs')}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 group"
                  >
                    Browse All Jobs
                    <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
