import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn } from '../libs/auth';
import { Sidebar } from '../libs/components/dashboard/Sidebar';
import { Header } from '../libs/components/dashboard/Header';

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
    email?: string;
    phone?: string;
    companyLogo?: string; // High quality company logo
  };
  totalValue: string;
  timeline: string;
  progress: number; // 0–100
  actionLabel: string;
  actionStyle: 'primary' | 'outline';
  description?: string;
  deliverables?: string[];
  milestones?: Array<{ title: string; status: 'completed' | 'pending' | 'in-progress'; dueDate: string }>;
  startDate?: string;
  endDate?: string;
  category?: string;
}

/* ─── Mock Data ─── */
const ALL_MOCK_ORDERS: OrderItem[] = [
  {
    id: 'ORD-1024',
    title: 'Enterprise CRM Integration & Custom Dashboard',
    status: 'ACTIVE',
    provider: { name: 'TechFlow Systems', rating: 4.9, email: 'contact@techflow.com', phone: '+1 (555) 123-4567', companyLogo: '/logos/google.svg' },
    totalValue: '$18,500.00',
    timeline: 'Oct 12, 2023 – Jan 15, 2024',
    progress: 75,
    actionLabel: 'Approve Milestone',
    actionStyle: 'primary',
    description: 'Complete integration of Salesforce CRM with custom dashboard for real-time analytics and reporting.',
    deliverables: ['CRM Integration', 'Custom Dashboard', 'API Documentation', 'User Training'],
    milestones: [
      { title: 'Project Kickoff', status: 'completed', dueDate: 'Oct 15, 2023' },
      { title: 'API Integration', status: 'completed', dueDate: 'Nov 10, 2023' },
      { title: 'Dashboard Development', status: 'in-progress', dueDate: 'Dec 20, 2023' },
      { title: 'Testing & Deployment', status: 'pending', dueDate: 'Jan 10, 2024' },
    ],
    startDate: 'Oct 12, 2023',
    endDate: 'Jan 15, 2024',
    category: 'IT & Software',
  },
  {
    id: 'ORD-0988',
    title: 'Quarterly Financial Compliance Audit',
    status: 'COMPLETED',
    provider: { name: 'Global Partners LLP', rating: 5.0, icon: 'business_center', email: 'audit@globalpartners.com', phone: '+1 (555) 234-5678', companyLogo: '/logos/google.svg' },
    totalValue: '$4,200.00',
    timeline: 'Sep 01, 2023 – Oct 30, 2023',
    progress: 100,
    actionLabel: 'Download Invoice',
    actionStyle: 'outline',
    description: 'Comprehensive financial audit for Q3 2023 including compliance review and risk assessment.',
    deliverables: ['Audit Report', 'Compliance Certificate', 'Risk Assessment', 'Recommendations'],
    milestones: [
      { title: 'Initial Review', status: 'completed', dueDate: 'Sep 15, 2023' },
      { title: 'Field Work', status: 'completed', dueDate: 'Oct 10, 2023' },
      { title: 'Report Preparation', status: 'completed', dueDate: 'Oct 25, 2023' },
      { title: 'Final Delivery', status: 'completed', dueDate: 'Oct 30, 2023' },
    ],
    startDate: 'Sep 01, 2023',
    endDate: 'Oct 30, 2023',
    category: 'Business Services',
  },
  {
    id: 'ORD-1031',
    title: 'Annual Brand Refresher & Assets',
    status: 'ACTIVE',
    provider: { name: 'Creative Studio X', rating: 4.8, email: 'hello@creativestudio.com', phone: '+1 (555) 345-6789', companyLogo: '/logos/apple.svg' },
    totalValue: '$2,500.00',
    timeline: 'Nov 15, 2023 – Dec 22, 2023',
    progress: 20,
    actionLabel: 'Approve Milestone',
    actionStyle: 'primary',
    description: 'Complete brand refresh including logo redesign, color palette update, and marketing asset creation.',
    deliverables: ['New Logo Design', 'Brand Guidelines', 'Marketing Assets', 'Social Media Templates'],
    milestones: [
      { title: 'Brand Discovery', status: 'completed', dueDate: 'Nov 20, 2023' },
      { title: 'Logo Concepts', status: 'in-progress', dueDate: 'Dec 5, 2023' },
      { title: 'Asset Creation', status: 'pending', dueDate: 'Dec 15, 2023' },
      { title: 'Final Delivery', status: 'pending', dueDate: 'Dec 22, 2023' },
    ],
    startDate: 'Nov 15, 2023',
    endDate: 'Dec 22, 2023',
    category: 'Design & Creative',
  },
  {
    id: 'ORD-1045',
    title: 'Digital Marketing Campaign - Q4 Launch',
    status: 'ACTIVE',
    provider: { name: 'Marketing Pro Agency', rating: 4.7, email: 'info@marketingpro.com', phone: '+1 (555) 456-7890', companyLogo: '/logos/vercel.png' },
    totalValue: '$12,000.00',
    timeline: 'Nov 01, 2023 – Feb 29, 2024',
    progress: 45,
    actionLabel: 'Approve Milestone',
    actionStyle: 'primary',
    description: 'Comprehensive digital marketing campaign including SEO, PPC, social media, and content marketing.',
    deliverables: ['SEO Strategy', 'PPC Campaigns', 'Social Media Content', 'Analytics Report'],
    milestones: [
      { title: 'Strategy Development', status: 'completed', dueDate: 'Nov 10, 2023' },
      { title: 'Campaign Launch', status: 'completed', dueDate: 'Nov 20, 2023' },
      { title: 'Performance Optimization', status: 'in-progress', dueDate: 'Jan 15, 2024' },
      { title: 'Final Report', status: 'pending', dueDate: 'Feb 25, 2024' },
    ],
    startDate: 'Nov 01, 2023',
    endDate: 'Feb 29, 2024',
    category: 'Marketing & Sales',
  },
  {
    id: 'ORD-1052',
    title: 'Mobile App Development - iOS & Android',
    status: 'ACTIVE',
    provider: { name: 'AppDev Solutions', rating: 4.9, email: 'dev@appdev.com', phone: '+1 (555) 567-8901', companyLogo: '/logos/anthropic.webp' },
    totalValue: '$35,000.00',
    timeline: 'Oct 01, 2023 – Mar 31, 2024',
    progress: 60,
    actionLabel: 'Approve Milestone',
    actionStyle: 'primary',
    description: 'Native mobile app development for both iOS and Android platforms with backend API integration.',
    deliverables: ['iOS App', 'Android App', 'Backend API', 'Admin Dashboard'],
    milestones: [
      { title: 'Design & Wireframes', status: 'completed', dueDate: 'Oct 20, 2023' },
      { title: 'Backend Development', status: 'completed', dueDate: 'Nov 30, 2023' },
      { title: 'App Development', status: 'in-progress', dueDate: 'Feb 15, 2024' },
      { title: 'Testing & Launch', status: 'pending', dueDate: 'Mar 25, 2024' },
    ],
    startDate: 'Oct 01, 2023',
    endDate: 'Mar 31, 2024',
    category: 'IT & Software',
  },
  {
    id: 'ORD-0995',
    title: 'Website Redesign & E-commerce Setup',
    status: 'COMPLETED',
    provider: { name: 'WebCraft Design', rating: 4.6, email: 'contact@webcraft.com', phone: '+1 (555) 678-9012', companyLogo: '/logos/Logo.webp' },
    totalValue: '$8,500.00',
    timeline: 'Aug 15, 2023 – Oct 10, 2023',
    progress: 100,
    actionLabel: 'Download Invoice',
    actionStyle: 'outline',
    description: 'Complete website redesign with modern UI/UX and e-commerce functionality integration.',
    deliverables: ['New Website Design', 'E-commerce Platform', 'Payment Integration', 'SEO Optimization'],
    milestones: [
      { title: 'Design Phase', status: 'completed', dueDate: 'Sep 1, 2023' },
      { title: 'Development', status: 'completed', dueDate: 'Sep 25, 2023' },
      { title: 'Testing', status: 'completed', dueDate: 'Oct 5, 2023' },
      { title: 'Launch', status: 'completed', dueDate: 'Oct 10, 2023' },
    ],
    startDate: 'Aug 15, 2023',
    endDate: 'Oct 10, 2023',
    category: 'Design & Creative',
  },
  {
    id: 'ORD-1067',
    title: 'HR Policy Documentation & Handbook',
    status: 'CANCELLED',
    provider: { name: 'HR Consultants Inc', rating: 4.5, email: 'hr@hrconsultants.com', phone: '+1 (555) 789-0123', companyLogo: '/logos/Walmart_Logo_1.png' },
    totalValue: '$3,500.00',
    timeline: 'Dec 01, 2023 – Jan 15, 2024',
    progress: 0,
    actionLabel: 'View Details',
    actionStyle: 'outline',
    description: 'Development of comprehensive HR policy documentation and employee handbook.',
    deliverables: ['HR Policy Document', 'Employee Handbook', 'Compliance Guide'],
    milestones: [],
    startDate: 'Dec 01, 2023',
    endDate: 'Jan 15, 2024',
    category: 'Business Services',
  },
  {
    id: 'ORD-1078',
    title: 'Data Analytics Platform Setup',
    status: 'ACTIVE',
    provider: { name: 'DataInsight Analytics', rating: 4.8, email: 'info@datainsight.com', phone: '+1 (555) 890-1234', companyLogo: '/logos/vercel.png' },
    totalValue: '$22,000.00',
    timeline: 'Nov 20, 2023 – Apr 15, 2024',
    progress: 30,
    actionLabel: 'Approve Milestone',
    actionStyle: 'primary',
    description: 'Setup and configuration of enterprise data analytics platform with custom dashboards.',
    deliverables: ['Analytics Platform', 'Custom Dashboards', 'Data Integration', 'Training'],
    milestones: [
      { title: 'Platform Setup', status: 'completed', dueDate: 'Dec 5, 2023' },
      { title: 'Data Integration', status: 'in-progress', dueDate: 'Jan 20, 2024' },
      { title: 'Dashboard Development', status: 'pending', dueDate: 'Mar 10, 2024' },
      { title: 'Training & Handover', status: 'pending', dueDate: 'Apr 10, 2024' },
    ],
    startDate: 'Nov 20, 2023',
    endDate: 'Apr 15, 2024',
    category: 'IT & Software',
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const ordersPerPage = 5;

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) router.push('/login');
  }, [router]);

  // Filter orders by status
  const filteredOrders = statusFilter === 'all' 
    ? ALL_MOCK_ORDERS 
    : ALL_MOCK_ORDERS.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Update page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const handleViewOrder = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        <Header title="My Orders & Contracts" subtitle="Manage and track your active service agreements" />
        {/* ── Single scrollable area ── */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          {/* Header section */}
          <div className="bg-white border-b border-slate-200 pt-8 px-10">
            <div className="max-w-6xl mx-auto">
              {/* Summary cards */}

              {/* Summary cards */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Orders', value: ALL_MOCK_ORDERS.length.toString(), color: '' },
                  { label: 'Active', value: ALL_MOCK_ORDERS.filter(o => o.status === 'ACTIVE').length.toString().padStart(2, '0'), color: 'text-amber-600' },
                  { label: 'Completed', value: ALL_MOCK_ORDERS.filter(o => o.status === 'COMPLETED').length.toString().padStart(2, '0'), color: 'text-emerald-600' },
                  { label: 'Cancelled', value: ALL_MOCK_ORDERS.filter(o => o.status === 'CANCELLED').length.toString().padStart(2, '0'), color: '' },
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
            {paginatedOrders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">inbox</span>
                <p className="text-lg font-semibold text-slate-600">No orders found</p>
                <p className="text-sm text-slate-400 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              paginatedOrders.map((order) => (
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
                        {order.provider.companyLogo ? (
                          <div className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 flex items-center justify-center overflow-hidden">
                            <img
                              alt={order.provider.name}
                              className="max-w-full max-h-full w-auto h-auto object-contain"
                              src={order.provider.companyLogo}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const parent = target.parentElement;
                                if (parent && order.provider.icon) {
                                  parent.innerHTML = `<div class="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700"><span class="material-symbols-outlined text-slate-400 dark:text-slate-300 text-lg">${order.provider.icon}</span></div>`;
                                } else if (parent) {
                                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(order.provider.name)}&background=E8E5FF&color=4F46E5&size=48`;
                                }
                              }}
                            />
                          </div>
                        ) : order.provider.icon ? (
                          <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                            <span className="material-symbols-outlined text-slate-400 dark:text-slate-300 text-lg">{order.provider.icon}</span>
                          </div>
                        ) : (
                          <img
                            alt={order.provider.name}
                            className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-700 object-cover"
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(order.provider.name)}&background=E8E5FF&color=4F46E5&size=48`}
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
                    <button 
                      onClick={() => handleViewOrder(order)}
                      className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded transition-colors"
                    >
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
            ))
            )}

            {/* Pagination — centered */}
            {totalPages > 1 && (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-[var(--primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'border-[var(--primary)] bg-indigo-50 text-[var(--primary)] font-bold'
                          : 'border-transparent text-slate-600 hover:bg-white hover:border-slate-200'
                      }`}
                    >
                      {page}
                </button>
                  ))}
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-[var(--primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
              <p className="text-sm text-slate-400 font-medium">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} total orders
              </p>
            </div>
            )}

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
              <button
                onClick={() => router.push('/organizations')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">settings_suggest</span>
                Manage Organizations
              </button>
              <button
                onClick={() => router.push('/help-support')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
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

      {/* View Order Modal */}
      {isOrderModalOpen && selectedOrder && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setIsOrderModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-300">
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-slate-400 font-mono">{selectedOrder.id}</span>
                      <StatusBadge status={selectedOrder.status} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedOrder.title}</h2>
                    {selectedOrder.category && (
                      <p className="text-sm text-slate-500 font-medium">{selectedOrder.category}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsOrderModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-slate-400">close</span>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="space-y-8">
                  {/* Provider Info */}
                  <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Provider Information</h3>
                    <div className="flex items-start gap-4">
                      {selectedOrder.provider.icon ? (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center border-2 border-indigo-200">
                          <span className="material-symbols-outlined text-indigo-600 text-2xl">{selectedOrder.provider.icon}</span>
                        </div>
                      ) : (
                        <img
                          alt={selectedOrder.provider.name}
                          className="w-16 h-16 rounded-xl border-2 border-slate-200 object-cover"
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedOrder.provider.name)}&background=E8E5FF&color=4F46E5&size=64`}
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-900 mb-1">{selectedOrder.provider.name}</h4>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1 text-amber-500">
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-sm font-bold">{selectedOrder.provider.rating}</span>
                          </div>
                          <span className="text-slate-300">•</span>
                          <span className="text-sm text-slate-500">Provider</span>
                        </div>
                        {selectedOrder.provider.email && (
                          <p className="text-sm text-slate-600 mb-1">
                            <span className="material-symbols-outlined text-base align-middle mr-1">email</span>
                            {selectedOrder.provider.email}
                          </p>
                        )}
                        {selectedOrder.provider.phone && (
                          <p className="text-sm text-slate-600">
                            <span className="material-symbols-outlined text-base align-middle mr-1">phone</span>
                            {selectedOrder.provider.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Order Value</h3>
                      <p className="text-3xl font-black text-slate-900">{selectedOrder.totalValue}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Timeline</h3>
                      <p className="text-lg font-bold text-slate-900">{selectedOrder.timeline}</p>
                      {selectedOrder.startDate && selectedOrder.endDate && (
                        <p className="text-sm text-slate-500 mt-1">
                          {selectedOrder.startDate} → {selectedOrder.endDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Progress</h3>
                      <span className={`text-lg font-bold ${selectedOrder.status === 'COMPLETED' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                        {selectedOrder.progress}%
                      </span>
                    </div>
                    <SegmentedProgress progress={selectedOrder.progress} status={selectedOrder.status} />
                  </div>

                  {/* Description */}
                  {selectedOrder.description && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Description</h3>
                      <p className="text-slate-700 leading-relaxed">{selectedOrder.description}</p>
                    </div>
                  )}

                  {/* Deliverables */}
                  {selectedOrder.deliverables && selectedOrder.deliverables.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Deliverables</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedOrder.deliverables.map((deliverable, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            <span className="material-symbols-outlined text-indigo-600 text-sm">check_circle</span>
                            <span className="text-sm font-medium text-slate-700">{deliverable}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Milestones */}
                  {selectedOrder.milestones && selectedOrder.milestones.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Milestones</h3>
                      <div className="space-y-4">
                        {selectedOrder.milestones.map((milestone, idx) => (
                          <div key={idx} className="flex items-start gap-4">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              milestone.status === 'completed' 
                                ? 'bg-emerald-100 text-emerald-600' 
                                : milestone.status === 'in-progress'
                                ? 'bg-indigo-100 text-indigo-600'
                                : 'bg-slate-100 text-slate-400'
                            }`}>
                              <span className="material-symbols-outlined text-lg">
                                {milestone.status === 'completed' ? 'check' : milestone.status === 'in-progress' ? 'schedule' : 'radio_button_unchecked'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-slate-900">{milestone.title}</h4>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                  milestone.status === 'completed'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : milestone.status === 'in-progress'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {milestone.status.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500">Due: {milestone.dueDate}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-white transition-colors"
                >
                  Close
                </button>
                <button
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all ${
                    selectedOrder.actionStyle === 'primary'
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'border border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {selectedOrder.actionLabel}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
