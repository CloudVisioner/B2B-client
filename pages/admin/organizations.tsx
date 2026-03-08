import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, normalizeRole } from '../../libs/auth';
import { AdminSidebar } from '../../libs/components/admin/AdminSidebar';
import { AdminHeader } from '../../libs/components/admin/AdminHeader';
import { GET_ALL_ORGANIZATIONS } from '../../apollo/admin/query';
import { APPROVE_ORGANIZATION, REJECT_ORGANIZATION, SUSPEND_ORGANIZATION, UPDATE_ORGANIZATION } from '../../apollo/admin/mutation';

export default function AdminOrganizationsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [flaggedFilter, setFlaggedFilter] = useState<string>('all');
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [rejectReason, setRejectReason] = useState('');

  const { data: orgsData, loading: orgsLoading, error: orgsError, refetch: refetchOrgs } = useQuery(GET_ALL_ORGANIZATIONS, {
    skip: !mounted || !isLoggedIn(),
    variables: {
      input: {
        page,
        limit,
        search: {
          ...(typeFilter !== 'all' && { organizationType: typeFilter }),
          ...(statusFilter !== 'all' && { organizationStatus: statusFilter }),
          ...(flaggedFilter === 'flagged' && { isFlagged: true }),
          ...(searchTerm && { organizationName: searchTerm }),
        },
      },
    },
    fetchPolicy: 'network-only',
  });

  const [approveOrg] = useMutation(APPROVE_ORGANIZATION);
  const [rejectOrg] = useMutation(REJECT_ORGANIZATION);
  const [suspendOrg] = useMutation(SUSPEND_ORGANIZATION);
  const [updateOrg] = useMutation(UPDATE_ORGANIZATION);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push('/admin/login');
      return;
    }
    const role = normalizeRole(currentUser?.userRole);
    if (role && role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
  }, [router, currentUser]);

  const organizations = orgsData?.getAllOrganizations?.list || [];
  const totalOrgs = orgsData?.getAllOrganizations?.metaCounter?.[0]?.total || 0;

  const handleApproveOrg = async (orgId: string) => {
    if (!confirm('Are you sure you want to approve this organization?')) return;
    try {
      await approveOrg({ variables: { organizationId: orgId } });
      await refetchOrgs();
      alert('Organization approved successfully');
      setSelectedOrg(null);
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to approve organization'}`);
    }
  };

  const handleRejectOrg = async (orgId: string) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    if (!confirm('Are you sure you want to reject this organization?')) return;
    try {
      await rejectOrg({ variables: { input: { organizationId: orgId, reason: rejectReason } } });
      await refetchOrgs();
      alert('Organization rejected successfully');
      setSelectedOrg(null);
      setRejectReason('');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to reject organization'}`);
    }
  };

  const handleSuspendOrg = async (orgId: string) => {
    if (!confirm('Are you sure you want to suspend this organization?')) return;
    try {
      await suspendOrg({ variables: { organizationId: orgId } });
      await refetchOrgs();
      alert('Organization suspended successfully');
      setSelectedOrg(null);
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to suspend organization'}`);
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
  if (role && role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden antialiased">
      {/* Sidebar - Navigation */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* ── Header ── */}
        <AdminHeader title="Organizations Management" subtitle="Review and manage buyer and provider organizations" />

        {/* ── Scrollable Body ── */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-8 py-10">
            {/* Filters */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Search</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search organizations..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="BUYER">Buyer</option>
                    <option value="PROVIDER">Provider</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING_REVIEW">Pending Review</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setTypeFilter('all');
                      setStatusFilter('all');
                      setFlaggedFilter('all');
                    }}
                    className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Organizations Table */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Organization</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Country</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Activity</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {orgsLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                          Loading organizations...
                        </td>
                      </tr>
                    ) : orgsError ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-red-500">
                          Error loading organizations: {orgsError.message}
                        </td>
                      </tr>
                    ) : organizations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                          No organizations found
                        </td>
                      </tr>
                    ) : (
                      organizations.map((org: any) => (
                      <tr key={org._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{org.organizationName}</p>
                            <p className="text-xs text-slate-500">{org.organizationIndustry}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            org.organizationType === 'BUYER' ? 'bg-blue-100 text-blue-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {org.organizationType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-600">{org.organizationCountry}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              org.organizationStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                              org.organizationStatus === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-700' :
                              org.organizationStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {org.organizationStatus.replace('_', ' ')}
                            </span>
                            {org.isFlagged && (
                              <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">flag</span>
                                FLAGGED
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-600">
                            {org.organizationType === 'BUYER' ? (
                              <span>{org.requestCount || 0} requests</span>
                            ) : (
                              <span>{org.quoteCount || 0} quotes, {org.orderCount || 0} orders</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-500">{formatDate(org.createdAt)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedOrg(org)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                            </button>
                            {org.organizationStatus === 'PENDING_REVIEW' && (
                              <>
                                <button
                                  onClick={() => handleApproveOrg(org._id)}
                                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <span className="material-symbols-outlined text-lg">check_circle</span>
                                </button>
                                <button
                                  onClick={() => setSelectedOrg(org)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <span className="material-symbols-outlined text-lg">cancel</span>
                                </button>
                              </>
                            )}
                            {org.organizationStatus === 'APPROVED' && (
                              <button
                                onClick={() => handleSuspendOrg(org._id)}
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Suspend"
                              >
                                <span className="material-symbols-outlined text-lg">block</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Organization Detail Modal */}
            {selectedOrg && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Organization Details</h3>
                    <button
                      onClick={() => setSelectedOrg(null)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-slate-600">close</span>
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Organization Name</label>
                        <p className="text-sm text-slate-900">{selectedOrg.organizationName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Type</label>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedOrg.organizationType === 'BUYER' ? 'bg-blue-100 text-blue-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {selectedOrg.organizationType}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Country</label>
                        <p className="text-sm text-slate-900">{selectedOrg.organizationCountry}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Status</label>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedOrg.organizationStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                          selectedOrg.organizationStatus === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {selectedOrg.organizationStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Industry</label>
                        <p className="text-sm text-slate-900">{selectedOrg.organizationIndustry}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Members</label>
                        <p className="text-sm text-slate-900">{selectedOrg.memberCount}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Activity</h4>
                      {selectedOrg.organizationType === 'BUYER' ? (
                        <p className="text-sm text-slate-600">{selectedOrg.requestCount || 0} service requests</p>
                      ) : (
                        <div className="text-sm text-slate-600 space-y-1">
                          <p>{selectedOrg.quoteCount || 0} quotes submitted</p>
                          <p>{selectedOrg.orderCount || 0} orders completed</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
                    <button
                      onClick={() => setSelectedOrg(null)}
                      className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
                    >
                      Close
                    </button>
                    {selectedOrg.organizationStatus === 'PENDING_REVIEW' && (
                      <>
                        <div className="w-full mb-4">
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Rejection Reason (required)</label>
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter reason for rejection..."
                          />
                        </div>
                        <button
                          onClick={() => handleRejectOrg(selectedOrg._id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproveOrg(selectedOrg._id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          Approve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalOrgs > limit && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalOrgs)} of {totalOrgs} organizations
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
                    disabled={page * limit >= totalOrgs}
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
