import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn } from '../libs/auth';
import { Sidebar } from '../libs/components/dashboard/Sidebar';

/* ─── Types ─── */
interface OrderItem {
  id: string;
  title: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  provider: {
    name: string;
    rating: number;
    image?: string;
    icon?: string; // fallback material icon
  };
  totalValue: string;
  timeline: string;
  progress: number; // 0–100
  actionLabel: string;
  actionStyle: 'primary' | 'outline';
}

/* ─── Mock Data ─── */
const MOCK_ORDERS: OrderItem[] = [
  {
    id: 'ORD-1024',
    title: 'Enterprise CRM Integration & Custom Dashboard',
    status: 'ACTIVE',
    provider: { name: 'TechFlow Systems', rating: 4.9 },
    totalValue: '$18,500.00',
    timeline: 'Oct 12, 2023 – Jan 15, 2024',
    progress: 75,
    actionLabel: 'Approve Milestone',
    actionStyle: 'primary',
  },
  {
    id: 'ORD-0988',
    title: 'Quarterly Financial Compliance Audit',
    status: 'COMPLETED',
    provider: { name: 'Global Partners LLP', rating: 5.0, icon: 'business_center' },
    totalValue: '$4,200.00',
    timeline: 'Sep 01, 2023 – Oct 30, 2023',
    progress: 100,
    actionLabel: 'Download Invoice',
    actionStyle: 'outline',
  },
  {
    id: 'ORD-1031',
    title: 'Annual Brand Refresher & Assets',
    status: 'ACTIVE',
    provider: { name: 'Creative Studio X', rating: 4.8 },
    totalValue: '$2,500.00',
    timeline: 'Nov 15, 2023 – Dec 22, 2023',
    progress: 20,
    actionLabel: 'Approve Milestone',
    actionStyle: 'primary',
  },
];

/* ─── Progress bar helper ─── */
function SegmentedProgress({ progress, status }: { progress: number; status: OrderItem['status'] }) {
  const totalSegments = 10;
  const filledSegments = Math.round((progress / 100) * totalSegments);
  const color = status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-indigo-600';
  const percentColor = status === 'COMPLETED' ? 'text-emerald-600' : 'text-indigo-600';

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
        <span className={`text-[11px] font-bold ${percentColor}`}>{progress}%</span>
      </div>
      <div className="segmented-progress">
        {Array.from({ length: totalSegments }).map((_, i) => (
          <div
            key={i}
            className={`progress-segment ${
              i < filledSegments
                ? color
                : i < filledSegments + 1 && status === 'ACTIVE'
                ? 'bg-indigo-200'
                : 'bg-slate-100'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Status badge ─── */
function StatusBadge({ status }: { status: OrderItem['status'] }) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */
export default function OrdersPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) router.push('/login');
  }, [router]);

  /* SSR skeleton */
  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full border-r border-slate-200 bg-white" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-32 bg-white border-b" />
          <main className="flex-1 overflow-y-auto" />
        </div>
      </div>
    );
  }
  if (!isLoggedIn()) return null;

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── Single scrollable area ── */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          {/* Header section */}
          <div className="bg-white border-b border-slate-200 pt-8 px-10">
            <div className="max-w-6xl mx-auto">
              {/* Title row */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Orders &amp; Contracts</h1>
                  <p className="text-sm text-slate-500 font-medium mt-1">Manage and track your active service agreements</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="material-symbols-outlined text-indigo-600 text-lg">business</span>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Acme Corp</span>
                </div>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Orders', value: '42', color: '' },
                  { label: 'Active', value: '08', color: 'text-amber-600' },
                  { label: 'Completed', value: '32', color: 'text-emerald-600' },
                  { label: 'Cancelled', value: '02', color: '' },
                ].map((card) => (
                  <div key={card.label} className="p-4 bg-white border border-slate-100 rounded-lg">
                    <span className={`text-xs font-bold uppercase tracking-[0.1em] mb-1 block ${card.color || 'text-slate-400'}`}>
                      {card.label}
                    </span>
                    <span className="text-3xl font-bold text-slate-900">{card.value}</span>
                  </div>
                ))}
              </div>

              {/* Filter */}
              <div className="flex items-center justify-between pb-6">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="status-filter">
                    Filter by Status:
                  </label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-sm font-semibold text-slate-700 border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 py-1.5 pl-3 pr-10"
                  >
                    <option value="all">All Orders</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Order cards */}
          <div className="p-10">
            <div className="max-w-6xl mx-auto space-y-4">
            {/* Order cards */}
            {MOCK_ORDERS.map((order) => (
              <div key={order.id} className="bg-white border border-slate-200 rounded-lg shadow-sm">
                {/* Card header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 font-mono">{order.id}</span>
                    <h3 className="text-sm font-bold text-slate-900">{order.title}</h3>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Card body */}
                <div className="p-6">
                  <div className="grid grid-cols-12 gap-6 items-center">
                    {/* Provider */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        {order.provider.icon ? (
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                            <span className="material-symbols-outlined text-slate-400 text-sm">{order.provider.icon}</span>
                          </div>
                        ) : (
                          <img
                            alt={order.provider.name}
                            className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(order.provider.name)}&background=E8E5FF&color=4F46E5&size=32`}
                          />
                        )}
                        <div>
                          <div className="text-sm font-bold text-slate-900">{order.provider.name}</div>
                          <div className="flex items-center gap-1 text-amber-500">
                            <span className="material-symbols-outlined text-[14px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-[11px] font-bold">{order.provider.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Total Value */}
                    <div className="col-span-2">
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Value</span>
                      <span className="text-sm font-bold text-slate-900">{order.totalValue}</span>
                    </div>

                    {/* Timeline */}
                    <div className="col-span-3">
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Timeline</span>
                      <span className="text-xs font-semibold text-slate-700">{order.timeline}</span>
                    </div>

                    {/* Progress */}
                    <div className="col-span-4">
                      <SegmentedProgress progress={order.progress} status={order.status} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-50">
                    <button className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded transition-colors">
                      View Order
                    </button>
                    <button
                      className={`px-4 py-1.5 text-xs font-bold rounded shadow-sm transition-all ${
                        order.actionStyle === 'primary'
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'border border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      {order.actionLabel}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination — centered */}
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-[var(--primary)] transition-colors">
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--primary)] bg-indigo-50 text-[var(--primary)] text-sm font-bold">
                  1
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-transparent text-slate-600 hover:bg-white hover:border-slate-200 text-sm font-medium">
                  2
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-transparent text-slate-600 hover:bg-white hover:border-slate-200 text-sm font-medium">
                  3
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-transparent text-slate-600 hover:bg-white hover:border-slate-200 text-sm font-medium">
                  4
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-[var(--primary)] transition-colors">
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
              <p className="text-sm text-slate-400 font-medium">
                Showing 3 of 42 total orders
              </p>
            </div>

            {/* Management Footer */}
            <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-[var(--border)]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-4">Management</p>
              <button
                onClick={() => router.push('/marketplace')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">groups</span>
                Browse Talent
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-lg">settings_suggest</span>
                Manage Organizations
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-lg">help</span>
                Help &amp; Support
              </button>
            </div>
            <div className="pb-8">
              <p className="text-xs text-slate-400 font-medium">© 2024 SME Connect. Enterprise Buyer Protocol v2.4.1</p>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
