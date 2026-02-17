import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn } from '../libs/auth';
import { Sidebar } from '../libs/components/dashboard/Sidebar';

/* ─── Types ─── */
interface NotificationItem {
  id: string;
  type: 'QUOTE' | 'MESSAGE' | 'MILESTONE' | 'ORDER' | 'SYSTEM';
  label: string;
  time: string;
  description: string;
  boldWords: string[];
  actionLabel: string;
  actionStyle: 'primary' | 'outline';
  hasMenu?: boolean;
  icon: string;
  iconBg: string;
  iconColor: string;
  labelColor: string;
}

/* ─── Mock Data ─── */
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'QUOTE',
    label: 'New Quote Received',
    time: '14m ago',
    description: 'Provider Alex submitted a premium proposal for your project Mobile App UI. Pricing matches your budget.',
    boldWords: ['Provider Alex', 'Mobile App UI'],
    actionLabel: 'View Quote',
    actionStyle: 'primary',
    hasMenu: true,
    icon: 'request_quote',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    labelColor: 'text-indigo-600',
  },
  {
    id: 'n2',
    type: 'MESSAGE',
    label: 'New Message',
    time: '42m ago',
    description: 'Legal Solutions LLC sent you a message regarding the Compliance Audit documentation.',
    boldWords: ['Legal Solutions LLC', 'Compliance Audit'],
    actionLabel: 'Message',
    actionStyle: 'outline',
    hasMenu: true,
    icon: 'chat',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    labelColor: 'text-indigo-600',
  },
  {
    id: 'n3',
    type: 'MILESTONE',
    label: 'Milestone Completed',
    time: '2h ago',
    description: 'Phase 1 of Website Rebrand has been completed by Design Studio.',
    boldWords: ['Website Rebrand', 'Design Studio'],
    actionLabel: 'Approve',
    actionStyle: 'outline',
    icon: 'check_circle',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
    labelColor: 'text-slate-600',
  },
  {
    id: 'n4',
    type: 'ORDER',
    label: 'Order Confirmed',
    time: '3h ago',
    description: 'Order #ORD-9902 has been accepted by the provider. Work is scheduled to start on Monday.',
    boldWords: ['#ORD-9902'],
    actionLabel: 'Track Order',
    actionStyle: 'primary',
    icon: 'shopping_cart',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    labelColor: 'text-indigo-600',
  },
  {
    id: 'n5',
    type: 'SYSTEM',
    label: 'System Update',
    time: '1d ago',
    description: "We've updated our Privacy Policy. Please review the changes in your account settings.",
    boldWords: ['Privacy Policy'],
    actionLabel: 'Review',
    actionStyle: 'outline',
    icon: 'info',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-400',
    labelColor: 'text-slate-500',
  },
];

const FILTER_TABS = ['All', 'Quotes', 'Messages', 'Milestones', 'Orders', 'System'];

/* ─── Bold-word renderer ─── */
function renderDescription(text: string, boldWords: string[]) {
  if (!boldWords.length) return text;

  const regex = new RegExp(`(${boldWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  const parts = text.split(regex);

  return parts.map((part, i) =>
    boldWords.includes(part) ? (
      <span key={i} className="font-bold text-slate-900">{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */
export default function NotificationsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) router.push('/login');
  }, [router]);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full border-r border-slate-200 bg-white" />
        <div className="flex flex-1 flex-col overflow-hidden">
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
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-5xl mx-auto px-10 py-10 space-y-8">
            {/* Title row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications</h1>
                <span className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  5
                </span>
              </div>
              <button className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm">
                Mark All as Read
              </button>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeFilter === tab
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Notification list */}
            <div className="space-y-0">
              {MOCK_NOTIFICATIONS.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-4 px-6 py-6 border-l-[3px] border-l-indigo-500 bg-white border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full ${notif.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <span className={`material-symbols-outlined ${notif.iconColor} text-xl`}>{notif.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold uppercase tracking-wider ${notif.labelColor}`}>
                        {notif.label}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-xs text-slate-400 font-medium">{notif.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {renderDescription(notif.description, notif.boldWords)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        notif.actionStyle === 'primary'
                          ? 'bg-[var(--primary)] hover:bg-indigo-700 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {notif.actionLabel}
                    </button>
                    {notif.hasMenu && (
                      <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-lg">more_horiz</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

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
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-[var(--primary)] transition-colors">
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
              <p className="text-sm text-slate-400 font-medium">
                Showing 5 of 12 notifications
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
