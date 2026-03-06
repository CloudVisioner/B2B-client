import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, normalizeRole } from '../../libs/auth';
import { AdminSidebar } from '../../libs/components/admin/AdminSidebar';
import { AdminHeader } from '../../libs/components/admin/AdminHeader';

const MOCK_REQUESTS = [
  {
    _id: '1',
    reqTitle: 'Website Development Needed',
    reqBuyerOrgData: { organizationName: 'Acme Corp' },
    reqStatus: 'OPEN',
    createdAt: '2024-02-15T10:30:00Z',
    reqTotalQuotes: 5,
  },
  {
    _id: '2',
    reqTitle: 'Marketing Campaign Design',
    reqBuyerOrgData: { organizationName: 'TechStart Inc' },
    reqStatus: 'ACTIVE',
    createdAt: '2024-02-14T14:20:00Z',
    reqTotalQuotes: 3,
  },
  {
    _id: '3',
    reqTitle: 'Mobile App Development',
    reqBuyerOrgData: { organizationName: 'Innovate Ltd' },
    reqStatus: 'CLOSED',
    createdAt: '2024-02-10T09:15:00Z',
    reqTotalQuotes: 8,
  },
];

export default function AdminServiceRequestsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

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

  const filteredRequests = MOCK_REQUESTS.filter((req) => {
    const matchesSearch = req.reqTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.reqStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <AdminHeader title="Service Requests" subtitle="Manage and monitor all service requests" />

        {/* ── Scrollable Body ── */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-8 py-10">
            <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
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
                <div className="flex items-end">
                  <button
                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                    className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                  >
                    Reset
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
                    {filteredRequests.map((req) => (
                      <tr key={req._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4"><span className="text-sm font-mono text-slate-600">{req._id.slice(-8)}</span></td>
                        <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-900">{req.reqTitle}</span></td>
                        <td className="px-6 py-4"><span className="text-sm text-slate-600">{req.reqBuyerOrgData?.organizationName}</span></td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            req.reqStatus === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                            req.reqStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>{req.reqStatus}</span>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm text-slate-600">{req.reqTotalQuotes || 0}</span></td>
                        <td className="px-6 py-4"><span className="text-sm text-slate-500">{formatDate(req.createdAt)}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => setSelectedRequest(req)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                              <span className="material-symbols-outlined text-lg">visibility</span>
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                              <span className="material-symbols-outlined text-lg">flag</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold">Close Request</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
