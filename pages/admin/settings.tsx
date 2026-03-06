import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, normalizeRole } from '../../libs/auth';
import { AdminSidebar } from '../../libs/components/admin/AdminSidebar';
import { AdminHeader } from '../../libs/components/admin/AdminHeader';

const MOCK_ADMINS = [
  {
    _id: '1',
    userNick: 'admin_user',
    userEmail: 'admin@example.com',
    role: 'SUPER_ADMIN',
    createdAt: '2024-01-01T10:00:00Z',
  },
];

export default function AdminSettingsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'platform' | 'admins'>('platform');
  const [platformSettings, setPlatformSettings] = useState({
    siteName: 'SMEConnect',
    supportEmail: 'support@smeconnect.com',
    quoteRulesText: '',
    termsLink: '/terms',
  });

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
        <AdminHeader title="Settings" subtitle="Platform settings and admin management" />

        {/* ── Scrollable Body ── */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-4xl mx-auto px-8 py-10">
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('platform')}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                    activeTab === 'platform'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Platform Settings
                </button>
                <button
                  onClick={() => setActiveTab('admins')}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                    activeTab === 'admins'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Admin Accounts
                </button>
              </div>

              {/* Platform Settings Tab */}
              {activeTab === 'platform' && (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Site Name</label>
                    <input
                      type="text"
                      value={platformSettings.siteName}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, siteName: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Support Email</label>
                    <input
                      type="email"
                      value={platformSettings.supportEmail}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Quote Rules Text</label>
                    <textarea
                      rows={4}
                      value={platformSettings.quoteRulesText}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, quoteRulesText: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Rules and guidelines for quote submissions..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Terms & Conditions Link</label>
                    <input
                      type="text"
                      value={platformSettings.termsLink}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, termsLink: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="/terms"
                    />
                  </div>
                  <div className="flex items-center justify-end pt-4 border-t border-slate-200">
                    <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Admin Accounts Tab */}
              {activeTab === 'admins' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Admin Accounts</h3>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">person_add</span>
                      <span>Invite Admin</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {MOCK_ADMINS.map((admin) => (
                      <div key={admin._id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{admin.userNick}</p>
                            <p className="text-xs text-slate-500">{admin.userEmail}</p>
                            <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                              {admin.role}
                            </span>
                          </div>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
