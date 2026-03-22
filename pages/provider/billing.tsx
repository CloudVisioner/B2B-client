import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn } from '../../libs/auth';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';

interface Invoice {
  id: string;
  client: string;
  amount: string;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  project?: string;
}

const MOCK_INVOICES: Invoice[] = [
  { id: '456', client: 'ABC Corp', amount: '$2,500', date: 'Mar 10, 2024', status: 'paid', project: 'ABC Corp Website' },
  { id: '457', client: 'XYZ Inc', amount: '$1,200', date: 'Mar 8, 2024', status: 'paid', project: 'XYZ Mobile App' },
  { id: '458', client: 'Retail Co', amount: '$3,400', date: 'Mar 5, 2024', status: 'pending', project: 'E-commerce Platform' },
  { id: '459', client: 'StartupXYZ', amount: '$1,800', date: 'Feb 28, 2024', status: 'paid', project: 'Brand Identity Design' },
  { id: '460', client: 'TechCorp', amount: '$2,100', date: 'Feb 25, 2024', status: 'overdue', project: 'API Integration' },
];

export default function ProviderBillingPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    const role = currentUser?.userRole;
    if (role && role !== 'PROVIDER' && role !== 'provider') {
      router.push('/dashboard');
    }
  }, [router, currentUser]);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-dashboard-canvas overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800" />
          <main className="flex-1 overflow-y-auto" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn()) return null;

  const lifetimeEarned = '$23,450';
  const currentBalance = '$1,230';
  const pendingAmount = '$2,100';

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <span className="material-symbols-outlined text-sm">schedule</span>
            Pending
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
            <span className="material-symbols-outlined text-sm">warning</span>
            Overdue
          </span>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-dashboard-canvas overflow-hidden antialiased">
      <ProviderSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ProviderHeader title="Billing & Invoices" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Lifetime Earned</span>
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xl">payments</span>
                </div>
              </div>
              <p className="text-3xl font-bold">{lifetimeEarned}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Current Balance</span>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-xl">account_balance_wallet</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{currentBalance}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending</span>
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-xl">schedule</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{pendingAmount}</p>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Invoices</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">View and download your invoice history</p>
                </div>
                <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">download</span>
                  Export All
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {MOCK_INVOICES.map((invoice) => (
                <div key={invoice.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-sm font-bold text-slate-400 dark:text-slate-500">#{invoice.id}</span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{invoice.client}</h3>
                        {invoice.project && (
                          <span className="text-sm text-slate-500 dark:text-slate-400">• {invoice.project}</span>
                        )}
                        {getStatusBadge(invoice.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-bold text-slate-900 dark:text-white">{invoice.amount}</span>
                        <span className="text-slate-500 dark:text-slate-400">{invoice.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">download</span>
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Payment Methods</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage how you receive payments</p>
              </div>
              <button className="px-4 py-2 bg-[var(--primary)] hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">add</span>
                Add Method
              </button>
            </div>
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-dashboard-canvas/50">
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                Stripe integration coming soon. You'll be able to receive payments directly to your bank account.
              </p>
            </div>
          </div>

          {/* Footer - Matching Buyer Dashboard Style */}
          <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-[var(--border)]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-4">Management</p>
            <button
              onClick={() => router.push('/provider/jobs')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">work</span>
              Find Jobs
            </button>
            <button
              onClick={() => router.push('/provider/organizations')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">settings_suggest</span>
              Manage Organizations
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-lg">help</span>
              Help & Support
            </button>
          </div>
          <div className="pb-8">
            <p className="text-xs text-slate-400 font-medium">© 2026 SME Marketplace Provider v2.1</p>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
