import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn } from '../libs/auth';
import { getHeaders } from '../apollo/utils';
import { Sidebar } from '../libs/components/dashboard/Sidebar';
import { Header } from '../libs/components/dashboard/Header';
import { BuyerOrganizationForm } from '../libs/components/dashboard/BuyerOrganizationForm';
import { GET_BUYER_ORGANIZATION } from '../apollo/user/query';

export default function BuyerOrganizationsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const hasRefetchedRef = useRef(false);

  // Force refetch organization data when page mounts
  const { refetch } = useQuery(GET_BUYER_ORGANIZATION, {
    skip: !isLoggedIn() || !mounted,
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
  });

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    
    // Refetch organization data when page loads to ensure fresh data
    if (mounted && !hasRefetchedRef.current) {
      hasRefetchedRef.current = true;
      refetch().catch(console.error);
    }
  }, [router, mounted, refetch]);

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

  const userName = currentUser?.userNick || 'Buyer';

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Organizations" />
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-5xl mx-auto px-10 py-10">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organizations</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Manage your buyer organization details used across requests and billing.
              </p>
            </div>

            {/* Organization form with Edit button that goes to Settings */}
            <div className="relative">
              <BuyerOrganizationForm />
              <div className="absolute top-8 right-8">
                <button
                  onClick={() => router.push('/settings?tab=organization')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-[var(--primary)] hover:bg-indigo-50 border border-indigo-200 transition-colors bg-white shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                  Edit
                </button>
              </div>
            </div>

            <div className="pb-8 mt-10 border-t border-[var(--border)] pt-6 flex items-center gap-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-4">
                Linked to account
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-slate-50">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  person
                </span>
                {userName}
              </span>
            </div>

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

