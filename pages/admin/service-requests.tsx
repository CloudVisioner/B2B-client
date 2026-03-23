import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, normalizeRole, isAdminPortalRole } from '../../libs/auth';
import { AdminSidebar } from '../../libs/components/admin/AdminSidebar';
import { AdminHeader } from '../../libs/components/admin/AdminHeader';
import { GET_ALL_SERVICE_REQUESTS } from '../../apollo/admin/query';
import { CLOSE_SERVICE_REQUEST, FLAG_SERVICE_REQUEST, DELETE_SERVICE_REQUEST } from '../../apollo/admin/mutation';

export default function AdminServiceRequestsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [flaggedFilter, setFlaggedFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedRequestForFlag, setSelectedRequestForFlag] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [flagReason, setFlagReason] = useState('');

  const { data: requestsData, loading: requestsLoading, error: requestsError, refetch: refetchRequests } = useQuery(GET_ALL_SERVICE_REQUESTS, {
    skip: !mounted || !isLoggedIn(),
    variables: {
      input: {
        page,
        limit,
        search: {
          ...(statusFilter !== 'all' && { reqStatus: statusFilter }),
          ...(flaggedFilter === 'flagged' && { isFlagged: true }),
          ...(searchTerm && { reqTitle: searchTerm }),
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

  const [closeRequest] = useMutation(CLOSE_SERVICE_REQUEST);
  const [flagRequest] = useMutation(FLAG_SERVICE_REQUEST);
  const [deleteRequest] = useMutation(DELETE_SERVICE_REQUEST);

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

  const requests = requestsData?.getAllServiceRequests?.list || [];
  const totalRequests = requestsData?.getAllServiceRequests?.metaCounter?.[0]?.total || 0;

  const handleCloseRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to close this service request?')) return;
    try {
      await closeRequest({ variables: { requestId } });
      await refetchRequests();
      alert('Service request closed successfully');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to close service request'}`);
    }
  };

  const handleFlagRequest = async () => {
    if (!selectedRequestForFlag) return;
    if (!flagReason.trim()) {
      alert('Please provide a reason for flagging');
      return;
    }
    if (!confirm('Are you sure you want to flag this service request?')) return;
    try {
      await flagRequest({ variables: { input: { requestId: selectedRequestForFlag._id, reason: flagReason } } });
      await refetchRequests();
      alert('Service request flagged successfully');
      setFlagReason('');
      setSelectedRequestForFlag(null);
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to flag service request'}`);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this service request? This action cannot be undone.')) return;
    try {
      await deleteRequest({ variables: { requestId } });
      await refetchRequests();
      alert('Service request deleted successfully');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to delete service request'}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
        <AdminHeader title="Service Requests" subtitle="Manage and monitor all service requests" />

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
                        placeholder="Search requests..."
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
                      <option value="OPEN">Open</option>
                      <option value="ACTIVE">Active</option>
                      <option value="CLOSED">Closed</option>
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
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Title</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Buyer Org</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Quotes</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Created</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {requestsLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                          Loading service requests...
                        </td>
                      </tr>
                    ) : requestsError ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                          Error loading service requests: {requestsError.message}
                        </td>
                      </tr>
                    ) : requests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                          No service requests found
                        </td>
                      </tr>
                    ) : (
                      requests.map((req: any) => (
                      <tr key={req._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4"><span className="text-sm font-mono text-slate-600">{req._id.slice(-8)}</span></td>
                        <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-900">{req.reqTitle}</span></td>
                        <td className="px-6 py-4"><span className="text-sm text-slate-600">{req.reqBuyerOrgData?.organizationName}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              req.reqStatus === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                              req.reqStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>{req.reqStatus}</span>
                            {req.isFlagged && (
                              <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">flag</span>
                                FLAGGED
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm text-slate-600">{req.reqTotalQuotes || 0}</span></td>
                        <td className="px-6 py-4"><span className="text-sm text-slate-500">{formatDate(req.createdAt)}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => setSelectedRequest(req)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                              <span className="material-symbols-outlined text-lg">visibility</span>
                            </button>
                            {req.reqStatus !== 'CLOSED' && (
                              <button onClick={() => handleCloseRequest(req._id)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Close Request">
                                <span className="material-symbols-outlined text-lg">lock</span>
                              </button>
                            )}
                            <button onClick={() => setSelectedRequestForFlag(req)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Flag Request">
                              <span className="material-symbols-outlined text-lg">flag</span>
                            </button>
                            <button onClick={() => handleDeleteRequest(req._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete Request">
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

            {selectedRequest && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Request Details</h3>
                    <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                      <span className="material-symbols-outlined text-slate-600">close</span>
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div><label className="block text-sm font-semibold text-slate-600 mb-1">Title</label><p className="text-sm text-slate-900">{selectedRequest.reqTitle}</p></div>
                    <div><label className="block text-sm font-semibold text-slate-600 mb-1">Buyer Organization</label><p className="text-sm text-slate-900">{selectedRequest.reqBuyerOrgData?.organizationName}</p></div>
                    <div><label className="block text-sm font-semibold text-slate-600 mb-1">Status</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedRequest.reqStatus === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                        selectedRequest.reqStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>{selectedRequest.reqStatus}</span>
                    </div>
                    <div><label className="block text-sm font-semibold text-slate-600 mb-1">Quotes Received</label><p className="text-sm text-slate-900">{selectedRequest.reqTotalQuotes || 0}</p></div>
                  </div>
                  <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
                    <button onClick={() => setSelectedRequest(null)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold">Close</button>
                    {selectedRequest && selectedRequest.reqStatus !== 'CLOSED' && (
                      <button onClick={() => handleCloseRequest(selectedRequest._id)} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold">Close Request</button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Flag Request Modal */}
            {selectedRequestForFlag && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Flag Service Request</h3>
                    <button onClick={() => { setSelectedRequestForFlag(null); setFlagReason(''); }} className="p-2 hover:bg-slate-100 rounded-lg">
                      <span className="material-symbols-outlined text-slate-600">close</span>
                    </button>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-slate-600 mb-2">Request: <span className="font-semibold">{selectedRequestForFlag.reqTitle}</span></p>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Flag Reason (required)</label>
                    <textarea
                      value={flagReason}
                      onChange={(e) => setFlagReason(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter reason for flagging..."
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setSelectedRequestForFlag(null); setFlagReason(''); }} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold">Cancel</button>
                    <button onClick={handleFlagRequest} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold">Flag Request</button>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalRequests > limit && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalRequests)} of {totalRequests} requests
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
                    disabled={page * limit >= totalRequests}
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
