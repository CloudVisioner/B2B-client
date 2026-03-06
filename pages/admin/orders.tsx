import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, normalizeRole } from '../../libs/auth';
import { AdminSidebar } from '../../libs/components/admin/AdminSidebar';
import { AdminHeader } from '../../libs/components/admin/AdminHeader';

const MOCK_ORDERS = [
  {
    _id: '1',
    buyerOrg: 'Acme Corp',
    providerOrg: 'DevStudio Pro',
    amount: 5000,
    status: 'ACTIVE',
    createdAt: '2024-02-15T10:30:00Z',
  },
  {
    _id: '2',
    buyerOrg: 'TechStart Inc',
    providerOrg: 'DesignPro',
    amount: 3500,
    status: 'COMPLETED',
    createdAt: '2024-02-10T14:20:00Z',
  },
  {
    _id: '3',
    buyerOrg: 'Innovate Ltd',
    providerOrg: 'TechSolutions',
    amount: 8000,
    status: 'DISPUTE',
    createdAt: '2024-02-05T09:15:00Z',
  },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    const matchesSearch = order.buyerOrg.toLowerCase().includes(searchTerm.toLowerCase()) || order.providerOrg.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <AdminHeader title="Orders Management" subtitle="Monitor and manage all orders" />

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
                      placeholder="Search orders..."
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
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="DISPUTE">Dispute</option>
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
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Buyer</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Provider</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Created</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4"><span className="text-sm font-mono text-slate-600">{order._id.slice(-8)}</span></td>
                        <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-900">{order.buyerOrg}</span></td>
                        <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-900">{order.providerOrg}</span></td>
                        <td className="px-6 py-4"><span className="text-sm font-bold text-slate-900">${order.amount.toLocaleString()}</span></td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                            order.status === 'DISPUTE' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>{order.status}</span>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm text-slate-500">{formatDate(order.createdAt)}</span></td>
                        <td className="px-6 py-4">
                          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
