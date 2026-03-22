import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, normalizeRole, isAdminPortalRole } from '../../libs/auth';
import { AdminSidebar } from '../../libs/components/admin/AdminSidebar';
import { AdminHeader } from '../../libs/components/admin/AdminHeader';
import { GET_ALL_QUOTES } from '../../apollo/admin/query';
import { FLAG_QUOTE, HARD_DELETE_QUOTE } from '../../apollo/admin/mutation';

export default function AdminQuotesPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [flaggedFilter, setFlaggedFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [flagReason, setFlagReason] = useState('');
  const [selectedQuoteForFlag, setSelectedQuoteForFlag] = useState<string | null>(null);

  const { data: quotesData, loading: quotesLoading, error: quotesError, refetch: refetchQuotes } = useQuery(GET_ALL_QUOTES, {
    skip: !mounted || !isLoggedIn(),
    variables: {
      input: {
        page,
        limit,
        search: {
          ...(statusFilter !== 'all' && { quoteStatus: statusFilter }),
          ...(flaggedFilter === 'flagged' && { isFlagged: true }),
          ...(searchTerm && { providerOrgId: searchTerm }),
          ...(dateRangeFilter === 'custom' && startDate && { createdAtFrom: new Date(startDate).toISOString() }),
          ...(dateRangeFilter === 'custom' && endDate && { createdAtTo: new Date(endDate + 'T23:59:59').toISOString() }),
          ...(dateRangeFilter === 'today' && {
            createdAtFrom: new Date().setHours(0, 0, 0, 0).toString(),
            createdAtTo: new Date().setHours(23, 59, 59, 999).toString(),
          }),
          ...(dateRangeFilter === 'week' && {
            createdAtFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          }),
          ...(dateRangeFilter === 'month' && {
            createdAtFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          }),
        },
      },
    },
    fetchPolicy: 'network-only',
  });

  const [flagQuote] = useMutation(FLAG_QUOTE);
  const [deleteQuote] = useMutation(HARD_DELETE_QUOTE);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push('/admin/login');
      return;
    }
    const role = normalizeRole(currentUser?.userRole);
    if (role && !isAdminPortalRole(role)) {
      router.push('/dashboard');
      return;
    }
  }, [router, currentUser]);

  const quotes = quotesData?.getAllQuotes?.list || [];
  const totalQuotes = quotesData?.getAllQuotes?.metaCounter?.[0]?.total || 0;

  const handleFlagQuote = async () => {
    if (!selectedQuoteForFlag) return;
    if (!flagReason.trim()) {
      alert('Please provide a reason for flagging');
      return;
    }
    if (!confirm('Are you sure you want to flag this quote?')) return;
    try {
      await flagQuote({ variables: { input: { quoteId: selectedQuoteForFlag, reason: flagReason } } });
      await refetchQuotes();
      alert('Quote flagged successfully');
      setFlagReason('');
      setSelectedQuoteForFlag(null);
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to flag quote'}`);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm('Are you sure you want to permanently delete this quote? This action cannot be undone.')) return;
    try {
      await deleteQuote({ variables: { quoteId } });
      await refetchQuotes();
      alert('Quote deleted successfully');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to delete quote'}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

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

  const role = normalizeRole(currentUser?.userRole);
  if (role && !isAdminPortalRole(role)) {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden antialiased">
      {/* Sidebar - Navigation */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* ── Header ── */}
        <AdminHeader title="Quotes Management" subtitle="Monitor and manage all quotes" />

        {/* ── Scrollable Body ── */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-8 py-10">
            <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Search</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">search</span>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search quotes..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date Range</label>
                    <select
                      value={dateRangeFilter}
                      onChange={(e) => setDateRangeFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                </div>
                {dateRangeFilter === 'custom' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setFlaggedFilter('all');
                      setDateRangeFilter('all');
                      setStartDate('');
                      setEndDate('');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Provider Org</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Created</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {quotesLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                          Loading quotes...
                        </td>
                      </tr>
                    ) : quotesError ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                          Error loading quotes: {quotesError.message}
                        </td>
                      </tr>
                    ) : quotes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                          No quotes found
                        </td>
                      </tr>
                    ) : (
                      quotes.map((quote: any) => (
                      <tr key={quote._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4"><span className="text-sm font-mono text-slate-600">{quote._id.slice(-8)}</span></td>
                        <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-900">{quote.quoteProviderOrgData?.organizationName}</span></td>
                        <td className="px-6 py-4"><span className="text-sm font-bold text-slate-900">${(quote.quoteAmount || 0).toLocaleString()}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              quote.quoteStatus === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                              quote.quoteStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>{quote.quoteStatus}</span>
                            {quote.isFlagged && (
                              <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">flag</span>
                                FLAGGED
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm text-slate-500">{formatDate(quote.createdAt)}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => setSelectedQuoteForFlag(quote._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Flag Quote">
                              <span className="material-symbols-outlined text-lg">flag</span>
                            </button>
                            <button onClick={() => handleDeleteQuote(quote._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete Quote">
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Flag Modal */}
            {selectedQuoteForFlag && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Flag Quote</h3>
                  <textarea
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                    placeholder="Enter reason for flagging..."
                  />
                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setFlagReason(''); setSelectedQuoteForFlag(null); }} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold">Cancel</button>
                    <button onClick={handleFlagQuote} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold">Flag</button>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalQuotes > limit && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalQuotes)} of {totalQuotes} quotes
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * limit >= totalQuotes}
                    className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
