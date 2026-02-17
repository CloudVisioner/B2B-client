import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn } from '../libs/auth';
import { Sidebar } from '../libs/components/dashboard/Sidebar';

/* ─── Mock Data ─── */
interface ServiceRequest {
  id: string;
  title: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'DRAFT' | 'CLOSED';
  budgetLabel: string;
  budget: string;
  dateLabel: string;
  date: string;
  category: string;
  // Open-specific
  quotesReceived?: number;
  newQuotes?: number;
  // In-Progress-specific
  provider?: { name: string; rating: number; reviews: number; image: string };
  phase?: string;
  // Draft-specific
  draftNote?: string;
}

const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: '#REQ-8291',
    title: 'Web Design & Brand Identity Refresher',
    status: 'OPEN',
    budgetLabel: 'Budget',
    budget: '$4,500 - $6,000',
    dateLabel: 'Deadline',
    date: 'Nov 12, 2023',
    category: 'Creative / UI-UX',
    quotesReceived: 12,
    newQuotes: 3,
  },
  {
    id: '#REQ-8245',
    title: 'Annual Legal Compliance Audit 2023',
    status: 'IN_PROGRESS',
    budgetLabel: 'Contract Value',
    budget: '$2,800.00',
    dateLabel: 'Next Milestone',
    date: 'Oct 30, 2023',
    category: 'Legal Services',
    provider: {
      name: 'Elite Legal Partners',
      rating: 4.9,
      reviews: 124,
      image: 'https://ui-avatars.com/api/?name=ELP&background=4F46E5&color=fff&size=40',
    },
    phase: 'Phase 3: Review',
  },
  {
    id: '#REQ-8112',
    title: 'Hybrid Cloud Migration Phase 1',
    status: 'DRAFT',
    budgetLabel: 'Est. Budget',
    budget: '$12,000+',
    dateLabel: 'Creation Date',
    date: 'Oct 15, 2023',
    category: 'IT & Infrastructure',
    draftNote: 'Review required before publishing to marketplace',
  },
];

/* ─── Status badge helper ─── */
function StatusBadge({ status }: { status: ServiceRequest['status'] }) {
  const styles: Record<string, string> = {
    OPEN: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    DRAFT: 'bg-slate-100 text-slate-600 border-slate-200',
    CLOSED: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  const labels: Record<string, string> = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    DRAFT: 'Draft',
    CLOSED: 'Closed',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border uppercase ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

/* ─── Action button helper ─── */
function actionLabel(status: ServiceRequest['status']) {
  switch (status) {
    case 'OPEN': return 'View Quotes';
    case 'IN_PROGRESS': return 'Approve Work';
    case 'DRAFT': return 'Publish Request';
    default: return 'View Details';
  }
}
function actionIcon(status: ServiceRequest['status']) {
  if (status === 'DRAFT') return 'send';
  return '';
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
                Active Organization: <span className="text-slate-700">Acme Corp</span>
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
                { label: 'Total Requests', value: '42', sub: 'Lifetime' },
                { label: 'Open', value: '12', sub: '82% Engagement', subColor: 'text-emerald-600' },
                { label: 'In Progress', value: '08', sub: 'Ongoing' },
                { label: 'Closed', value: '22', sub: 'Completed' },
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
            <div className="space-y-4">
              {MOCK_REQUESTS.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden card-hover transition-all duration-200"
                >
                  {/* Card body */}
                  <div className="p-6">
                    {/* Title row */}
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-slate-400 tracking-widest uppercase mb-1 block">
                          {req.id}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 leading-tight">{req.title}</h3>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>

                    {/* Meta grid */}
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400">payments</span>
                        <div>
                          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wide">{req.budgetLabel}</p>
                          <p className="font-bold text-slate-700 text-sm">{req.budget}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400">calendar_month</span>
                        <div>
                          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wide">{req.dateLabel}</p>
                          <p className="font-bold text-slate-700 text-sm">{req.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400">sell</span>
                        <div>
                          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wide">Category</p>
                          <p className="font-bold text-slate-700 text-sm">{req.category}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status-specific section */}
                    {req.status === 'OPEN' && req.quotesReceived != null && (
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <p className="text-sm font-bold text-slate-700">{req.quotesReceived} Quotes Received</p>
                          {req.newQuotes && (
                            <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                              +{req.newQuotes} New
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {req.status === 'IN_PROGRESS' && req.provider && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            alt={req.provider.name}
                            className="w-10 h-10 rounded-lg object-cover"
                            src={req.provider.image}
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-900">{req.provider.name}</p>
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-amber-400 text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              <span className="text-xs font-bold text-slate-500">
                                {req.provider.rating} ({req.provider.reviews} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                          <p className="text-sm font-bold text-indigo-600">{req.phase}</p>
                        </div>
                      </div>
                    )}

                    {req.status === 'DRAFT' && req.draftNote && (
                      <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex items-center justify-center">
                        <p className="text-sm font-medium text-slate-500 italic">{req.draftNote}</p>
                      </div>
                    )}
                  </div>

                  {/* Card footer */}
                  <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
                    <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
                      View Details
                    </button>
                    <button className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2">
                      {actionIcon(req.status) && (
                        <span className="material-symbols-outlined text-sm">{actionIcon(req.status)}</span>
                      )}
                      {actionLabel(req.status)}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
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
                Displaying 1–10 of 42 Service Requests
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
        </main>
      </div>
    </div>
  );
}
