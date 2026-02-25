import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn } from '../../libs/auth';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';
import { GET_PROVIDER_ORGANIZATION, GET_QUOTES_BY_ORGANIZATION } from '../../apollo/user/query';
import { getHeaders } from '../../apollo/utils';

export default function ProviderMyQuotesPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('all');

  // Fetch provider organization
  const { data: providerOrgData } = useQuery(GET_PROVIDER_ORGANIZATION, {
    skip: !isLoggedIn(),
    fetchPolicy: 'network-only',
    context: { headers: isLoggedIn() ? getHeaders() : {} },
  });
  const providerOrgId: string | undefined = providerOrgData?.getProviderOrganization?._id;

  // Fetch quotes by organization
  const { data, loading, error } = useQuery(GET_QUOTES_BY_ORGANIZATION, {
    skip: !isLoggedIn() || !providerOrgId || !mounted,
    fetchPolicy: 'network-only',
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    variables: { orgId: providerOrgId || '' },
  });

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

  const allQuotes = data?.getQuotesByOrganization || [];
  const filteredQuotes = statusFilter === 'all' 
    ? allQuotes 
    : allQuotes.filter((q: any) => q.quoteStatus === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'REJECTED':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'PENDING':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
    }
  };

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
        <ProviderHeader title="My Quotes" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Quotes</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  View and manage all quotes you've submitted to buyers
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              {(['all', 'PENDING', 'ACCEPTED', 'REJECTED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {status === 'all' ? 'All Quotes' : status}
                  {status !== 'all' && (
                    <span className="ml-2 px-1.5 py-0.5 bg-white/20 dark:bg-slate-700/50 rounded text-xs">
                      {allQuotes.filter((q: any) => q.quoteStatus === status).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Quotes List */}
            {loading ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-3xl animate-spin">sync</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your quotes...</p>
              </div>
            ) : error ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mx-auto mb-4 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-400 text-3xl">error</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Error loading quotes</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{error.message || 'Please try again later'}</p>
              </div>
            ) : filteredQuotes.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-3xl">request_quote</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {statusFilter === 'all' ? 'No quotes yet' : `No ${statusFilter.toLowerCase()} quotes`}
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  {statusFilter === 'all' 
                    ? 'Start submitting quotes on jobs to see them here' 
                    : 'Try selecting a different filter'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuotes.map((quote: any) => (
                  <div
                    key={quote._id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                            {quote.quoteServiceReqData?.reqTitle || 'Service Request'}
                          </h3>
                          <div className="flex items-center gap-3 flex-wrap mt-2">
                            {quote.quoteServiceReqData?.reqCategory && (
                              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-xs font-medium">
                                {quote.quoteServiceReqData.reqCategory}
                              </span>
                            )}
                            {quote.quoteServiceReqData?.reqSubCategory && (
                              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-xs font-medium">
                                {quote.quoteServiceReqData.reqSubCategory}
                              </span>
                            )}
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${getStatusColor(quote.quoteStatus)}`}>
                              {quote.quoteStatus}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Your Quote</p>
                          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            ${quote.quoteAmount?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                          {quote.quoteMessage}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <div>
                            <span className="font-medium">Submitted:</span>{' '}
                            {new Date(quote.createdAt).toLocaleDateString()} at{' '}
                            {new Date(quote.createdAt).toLocaleTimeString()}
                          </div>
                          {quote.quoteValidUntil && (
                            <div>
                              <span className="font-medium">Valid Until:</span>{' '}
                              {new Date(quote.quoteValidUntil).toLocaleDateString()}
                            </div>
                          )}
                          {quote.quoteServiceReqData?.reqBudgetRange && (
                            <div>
                              <span className="font-medium">Request Budget:</span>{' '}
                              {quote.quoteServiceReqData.reqBudgetRange}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => router.push(`/provider/jobs?requestId=${quote.quoteServiceReqData?._id}`)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          View Request
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
