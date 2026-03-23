import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, normalizeRole, isAdminPortalRole } from '../../libs/auth';
import { AdminSidebar } from '../../libs/components/admin/AdminSidebar';
import { AdminHeader } from '../../libs/components/admin/AdminHeader';
import { GET_ALL_ORDERS } from '../../apollo/admin/query';
import { CHANGE_ORDER_STATUS, ADD_ORDER_ADMIN_NOTES } from '../../apollo/admin/mutation';

export default function AdminOrdersPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [amountMin, setAmountMin] = useState<string>('');
  const [amountMax, setAmountMax] = useState<string>('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');

  const { data: ordersData, loading: ordersLoading, error: ordersError, refetch: refetchOrders } = useQuery(GET_ALL_ORDERS, {
    skip: !mounted || !isLoggedIn(),
    variables: {
      input: {
        page,
        limit,
        search: {
          ...(statusFilter !== 'all' && { orderStatus: statusFilter }),
          ...(amountMin && { amountMin: parseFloat(amountMin) }),
          ...(amountMax && { amountMax: parseFloat(amountMax) }),
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

  const [changeOrderStatus] = useMutation(CHANGE_ORDER_STATUS);
  const [addOrderNotes] = useMutation(ADD_ORDER_ADMIN_NOTES);

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

  const orders = ordersData?.getAllOrders?.list || [];
  const totalOrders = ordersData?.getAllOrders?.metaCounter?.[0]?.total || 0;

  const handleChangeStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    try {
      await changeOrderStatus({ variables: { input: { orderId: selectedOrder._id, orderStatus: newStatus, adminNotes: adminNotes || undefined } } });
      await refetchOrders();
      alert('Order status updated successfully');
      setSelectedOrder(null);
      setNewStatus('');
      setAdminNotes('');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to update order status'}`);
    }
  };

  const handleAddNotes = async () => {
    if (!selectedOrder || !adminNotes.trim()) {
      alert('Please enter admin notes');
      return;
    }
    try {
      await addOrderNotes({ variables: { input: { orderId: selectedOrder._id, adminNotes } } });
      await refetchOrders();
      alert('Admin notes added successfully');
      setAdminNotes('');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to add admin notes'}`);
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
    <div className="flex h-screen w-full bg-dashboard-canvas overflow-hidden antialiased">
      {/* Sidebar - Navigation */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* ── Header ── */}
        <AdminHeader title="Orders Management" subtitle="Monitor and manage all orders" />

        {/* ── Scrollable Body ── */}
        <main className="flex-1 overflow-y-auto bg-dashboard-canvas">
          <div className="max-w-7xl mx-auto px-8 py-10">
            <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
              <div className="space-y-4">
                {/* First Row: Search and Status */}
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

                {/* Second Row: Custom Date Range (shown when custom is selected) */}
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

                {/* Third Row: Amount Range */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Min Amount ($)</label>
                    <input
                      type="number"
                      value={amountMin}
                      onChange={(e) => setAmountMin(e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Max Amount ($)</label>
                    <input
                      type="number"
                      value={amountMax}
                      onChange={(e) => setAmountMax(e.target.value)}
                      placeholder="No limit"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setDateRangeFilter('all');
                        setStartDate('');
                        setEndDate('');
                        setAmountMin('');
                        setAmountMax('');
                      }}
                      className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
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
                    {ordersLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                          Loading orders...
                        </td>
                      </tr>
                    ) : ordersError ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-red-500">
                          Error loading orders: {ordersError.message}
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      orders.map((order: any) => (
                      <tr key={order._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4"><span className="text-sm font-mono text-slate-600">{order._id.slice(-8)}</span></td>
                        <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-900">{order.orderBuyerOrgData?.organizationName || 'N/A'}</span></td>
                        <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-900">{order.orderProviderOrgData?.organizationName || 'N/A'}</span></td>
                        <td className="px-6 py-4"><span className="text-sm font-bold text-slate-900">${(order.orderAmount || 0).toLocaleString()}</span></td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.orderStatus === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                            order.orderStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                            order.orderStatus === 'DISPUTE' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>{order.orderStatus}</span>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm text-slate-500">{formatDate(order.createdAt)}</span></td>
                        <td className="px-6 py-4">
                          <button onClick={() => { setSelectedOrder(order); setNewStatus(order.orderStatus); setAdminNotes(order.adminNotes || ''); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Edit Order">
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Order Details</h3>
                    <button onClick={() => { setSelectedOrder(null); setNewStatus(''); setAdminNotes(''); }} className="p-2 hover:bg-slate-100 rounded-lg">
                      <span className="material-symbols-outlined text-slate-600">close</span>
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Order ID</label>
                        <p className="text-sm text-slate-900 font-mono">{selectedOrder._id.slice(-8)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Amount</label>
                        <p className="text-sm text-slate-900 font-bold">${(selectedOrder.orderAmount || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Buyer</label>
                        <p className="text-sm text-slate-900">{selectedOrder.orderBuyerOrgData?.organizationName || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Provider</label>
                        <p className="text-sm text-slate-900">{selectedOrder.orderProviderOrgData?.organizationName || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Change Status</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="NEW">New</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="DISPUTE">Dispute</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Admin Notes</label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Add internal admin notes..."
                      />
                    </div>
                  </div>
                  <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
                    <button onClick={() => { setSelectedOrder(null); setNewStatus(''); setAdminNotes(''); }} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold">Close</button>
                    <button onClick={handleAddNotes} className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold">Add Notes</button>
                    <button onClick={handleChangeStatus} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold">Update Status</button>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalOrders > limit && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalOrders)} of {totalOrders} orders
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
                    disabled={page * limit >= totalOrders}
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
