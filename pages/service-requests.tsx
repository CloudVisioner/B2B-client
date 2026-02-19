import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn } from '../libs/auth';
import { getHeaders } from '../apollo/utils';
import { Sidebar } from '../libs/components/dashboard/Sidebar';
import { GET_BUYER_SERVICE_REQUESTS } from '../apollo/user/query';

/* ─── Service Request Interface ─── */
interface ServiceRequest {
  _id: string;
  reqTitle: string;
  reqDescription: string;
  reqStatus: string;
  reqBudgetRange: string;
  reqDeadline: string;
  reqUrgency: string;
  reqTotalQuotes?: number;
  reqNewQuotesCount?: number;
  reqCategory?: string;
  reqSubCategory?: string;
  reqSkillsNeeded?: string[];
  createdAt: string;
  updatedAt: string;
}

/* ─── Status badge helper ─── */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    OPEN: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    DRAFT: 'bg-slate-100 text-slate-600 border-slate-200',
    CLOSED: 'bg-slate-100 text-slate-500 border-slate-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-100',
  };
  const labels: Record<string, string> = {
    OPEN: 'Open',
    PUBLISHED: 'Published',
    IN_PROGRESS: 'In Progress',
    DRAFT: 'Draft',
    CLOSED: 'Closed',
    CANCELLED: 'Cancelled',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border uppercase ${styles[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {labels[status] || status}
    </span>
  );
}

/* ─── Action button helper ─── */
function actionLabel(status: string) {
  switch (status) {
    case 'OPEN':
    case 'PUBLISHED':
      return 'View Quotes';
    case 'IN_PROGRESS':
      return 'Approve Work';
    case 'DRAFT':
      return 'Publish Request';
    default:
      return 'View Details';
  }
}
function actionIcon(status: string) {
  if (status === 'DRAFT') return 'send';
  return '';
}

/* ─── Format date helper ─── */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ─── Map category helper ─── */
function mapCategory(category?: string): string {
  if (!category) return 'Uncategorized';
  const categoryMap: Record<string, string> = {
    IT_AND_SOFTWARE: 'IT & Software',
    BUSINESS_SERVICES: 'Business Services',
    MARKETING_AND_SALES: 'Marketing & Sales',
    DESIGN_AND_CREATIVE: 'Design & Creative',
  };
  return categoryMap[category] || category.replace(/_/g, ' ');
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */
export default function ServiceRequestsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch service requests from backend
  const { data, loading, error, refetch } = useQuery(GET_BUYER_SERVICE_REQUESTS, {
    skip: !isLoggedIn(),
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    variables: {
      input: {
        status: statusFilter !== 'all' ? statusFilter.toUpperCase() : undefined,
        search: searchQuery || undefined,
        sortBy: sortBy === 'newest' ? 'createdAt' : sortBy === 'deadline' ? 'reqDeadline' : 'reqBudgetRange',
        sortOrder: 'desc',
        page: 1,
        limit: 50,
      },
    },
  });

  const serviceRequests = data?.getBuyerServiceRequests?.list || [];
  const metaCounter = data?.getBuyerServiceRequests?.metaCounter || {
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
    draft: 0,
  };

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) router.push('/login');
  }, [router]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  // Refetch when filters change (debounced for search)
  useEffect(() => {
    if (!mounted || !isLoggedIn()) return;
    
    const timeoutId = setTimeout(() => {
      refetch({
        input: {
          status: statusFilter !== 'all' ? statusFilter.toUpperCase() : undefined,
          search: searchQuery || undefined,
          sortBy: sortBy === 'newest' ? 'createdAt' : sortBy === 'deadline' ? 'reqDeadline' : 'reqBudgetRange',
          sortOrder: 'desc',
          page: 1,
          limit: 50,
        },
      }).catch(console.error);
    }, searchQuery ? 300 : 0); // Debounce search, immediate for other filters
    
    return () => clearTimeout(timeoutId);
  }, [statusFilter, sortBy, searchQuery, mounted]);

  /* SSR skeleton */
  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full border-r border-slate-200 bg-white" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-16 bg-white border-b" />
          <main className="flex-1 overflow-y-auto" />
        </div>
      </div>
    );
  }
  if (!isLoggedIn()) return null;

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden antialiased">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* ── Header ── */}
        <header className="bg-white border-b border-slate-200 flex-shrink-0">
          {/* Top row */}
          <div className="h-16 flex items-center justify-between px-8">
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Service Requests</h1>
              <p className="text-xs text-slate-500 font-medium">
                {loading ? 'Loading...' : `${metaCounter.total} Total Requests`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/post-job')}
                className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                Post New Job
              </button>

              <div className="h-8 w-px bg-slate-200 mx-2" />

              <button className="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>

              <button className="flex items-center gap-2 pl-2 py-1 pr-1 hover:bg-slate-50 rounded-full transition-colors border border-slate-100">
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                  src={currentUser?.userImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.userNick || 'U')}&background=4F46E5&color=fff`}
                />
                <span className="material-symbols-outlined text-slate-400">expand_more</span>
              </button>
            </div>
          </div>

          {/* Search & filters */}
          <div className="px-8 py-3 bg-white border-t border-slate-100 flex items-center gap-4">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-[var(--primary)] focus:border-[var(--primary)] placeholder:text-slate-400"
                placeholder="Search requests..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-[var(--primary)] focus:border-[var(--primary)] px-3 py-2.5 pr-10 min-w-[140px]"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-[var(--primary)] focus:border-[var(--primary)] px-3 py-2.5 pr-10 min-w-[140px]"
              >
                <option value="newest">Newest First</option>
                <option value="budget">Budget High-Low</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Summary row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Requests', value: metaCounter.total || 0, sub: 'Lifetime' },
                { label: 'Open', value: metaCounter.open || 0, sub: 'Active', subColor: 'text-emerald-600' },
                { label: 'In Progress', value: metaCounter.inProgress || 0, sub: 'Ongoing' },
                { label: 'Closed', value: metaCounter.closed || 0, sub: 'Completed' },
              ].map((card) => (
                <div key={card.label} className="p-5 bg-white border border-transparent rounded-xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{card.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{card.value}</span>
                    <span className={`text-sm font-semibold ${card.subColor || 'text-slate-500'}`}>{card.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Request cards */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-lg p-6 animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="h-16 bg-slate-100 rounded"></div>
                      <div className="h-16 bg-slate-100 rounded"></div>
                      <div className="h-16 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-bold">Error loading service requests</p>
                <p className="text-sm text-red-500 mt-2">{error.message}</p>
              </div>
            ) : serviceRequests.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">description</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Service Requests Yet</h3>
                <p className="text-sm text-slate-500 mb-6">Create your first service request to get started</p>
                <button
                  onClick={() => router.push('/post-job')}
                  className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2 mx-auto"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  Post New Service Request
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {serviceRequests.map((req: ServiceRequest) => {
                  const isOpen = req.reqStatus === 'OPEN' || req.reqStatus === 'PUBLISHED';
                  const isDraft = req.reqStatus === 'DRAFT';
                  const isInProgress = req.reqStatus === 'IN_PROGRESS';

                  return (
                    <div
                      key={req._id}
                      className="bg-white border border-slate-200 rounded-lg overflow-hidden card-hover transition-all duration-200"
                    >
                      {/* Card body */}
                      <div className="p-6">
                        {/* Title row */}
                        <div className="flex justify-between items-start mb-5">
                          <div>
                            <span className="text-[11px] font-mono font-bold text-slate-400 tracking-widest uppercase mb-1 block">
                              #{req._id.slice(-6).toUpperCase()}
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 leading-tight">{req.reqTitle}</h3>
                          </div>
                          <StatusBadge status={req.reqStatus} />
                        </div>

                        {/* Meta grid */}
                        <div className="grid grid-cols-3 gap-6 mb-6">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">payments</span>
                            <div>
                              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wide">Budget</p>
                              <p className="font-bold text-slate-700 text-sm">{req.reqBudgetRange || 'Not set'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">calendar_month</span>
                            <div>
                              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wide">Deadline</p>
                              <p className="font-bold text-slate-700 text-sm">{req.reqDeadline ? formatDate(req.reqDeadline) : 'Not set'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">sell</span>
                            <div>
                              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wide">Category</p>
                              <p className="font-bold text-slate-700 text-sm">{req.reqCategory ? mapCategory(req.reqCategory) : 'Uncategorized'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Status-specific section */}
                        {isOpen && (req.reqTotalQuotes != null || req.reqNewQuotesCount != null) && (
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-4">
                              {req.reqTotalQuotes != null && (
                                <p className="text-sm font-bold text-slate-700">{req.reqTotalQuotes} Quotes Received</p>
                              )}
                              {req.reqNewQuotesCount && req.reqNewQuotesCount > 0 && (
                                <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                  +{req.reqNewQuotesCount} New
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {isDraft && (
                          <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex items-center justify-center">
                            <p className="text-sm font-medium text-slate-500 italic">Review required before publishing to marketplace</p>
                          </div>
                        )}
                      </div>

                      {/* Card footer */}
                      <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedRequest(req);
                            setIsModalOpen(true);
                          }}
                          className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                        >
                          View Details
                        </button>
                        <button className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2">
                          {actionIcon(req.reqStatus) && (
                            <span className="material-symbols-outlined text-sm">{actionIcon(req.reqStatus)}</span>
                          )}
                          {actionLabel(req.reqStatus)}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination - Show only if there are requests */}
            {serviceRequests.length > 0 && (
              <div className="flex flex-col items-center gap-3 py-8">
                <p className="text-sm text-slate-400 font-medium">
                  Displaying {serviceRequests.length} of {metaCounter.total} Service Request{metaCounter.total !== 1 ? 's' : ''}
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
        </main>
      </div>

      {/* ── Service Request Details Modal ── */}
      {isModalOpen && selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400 tracking-widest uppercase">
                      #{selectedRequest._id.slice(-6).toUpperCase()}
                    </span>
                    <StatusBadge status={selectedRequest.reqStatus} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedRequest.reqTitle}</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="ml-4 p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">description</span>
                    Description
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedRequest.reqDescription || 'No description provided.'}
                    </p>
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-5 border border-indigo-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">payments</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Budget Range</p>
                        <p className="text-lg font-bold text-slate-900">{selectedRequest.reqBudgetRange || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-5 border border-emerald-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">calendar_month</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deadline</p>
                        <p className="text-lg font-bold text-slate-900">
                          {selectedRequest.reqDeadline ? formatDate(selectedRequest.reqDeadline) : 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-5 border border-amber-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">sell</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</p>
                        <p className="text-lg font-bold text-slate-900">
                          {selectedRequest.reqCategory ? mapCategory(selectedRequest.reqCategory) : 'Uncategorized'}
                        </p>
                        {selectedRequest.reqSubCategory && (
                          <p className="text-sm text-slate-600 mt-1">{selectedRequest.reqSubCategory.replace(/_/g, ' ')}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-5 border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">speed</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Urgency</p>
                        <p className="text-lg font-bold text-slate-900 capitalize">
                          {selectedRequest.reqUrgency?.toLowerCase() || 'Normal'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Required Skills */}
                {selectedRequest.reqSkillsNeeded && selectedRequest.reqSkillsNeeded.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">psychology</span>
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.reqSkillsNeeded.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-lg border border-indigo-200"
                        >
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                          </span>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quotes Info (if open) */}
                {(selectedRequest.reqStatus === 'OPEN' || selectedRequest.reqStatus === 'PUBLISHED') && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Quotes Received</p>
                        <p className="text-2xl font-bold text-emerald-700">
                          {selectedRequest.reqTotalQuotes || 0}
                        </p>
                      </div>
                      {selectedRequest.reqNewQuotesCount && selectedRequest.reqNewQuotesCount > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            +{selectedRequest.reqNewQuotesCount} New
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Created</p>
                    <p className="text-sm font-semibold text-slate-600">
                      {selectedRequest.createdAt ? formatDate(selectedRequest.createdAt) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Last Updated</p>
                    <p className="text-sm font-semibold text-slate-600">
                      {selectedRequest.updatedAt ? formatDate(selectedRequest.updatedAt) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-white rounded-lg transition-colors border border-slate-200"
              >
                Close
              </button>
              <div className="flex items-center gap-3">
                {selectedRequest.reqStatus === 'DRAFT' && (
                  <button className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-white rounded-lg transition-colors border border-slate-200">
                    Edit
                  </button>
                )}
                <button className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2">
                  {actionIcon(selectedRequest.reqStatus) && (
                    <span className="material-symbols-outlined text-sm">{actionIcon(selectedRequest.reqStatus)}</span>
                  )}
                  {actionLabel(selectedRequest.reqStatus)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
