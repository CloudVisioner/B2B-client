import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, normalizeRole } from '../../libs/auth';
import { AdminSidebar } from '../../libs/components/admin/AdminSidebar';
import { AdminHeader } from '../../libs/components/admin/AdminHeader';
import { GET_PLATFORM_SETTINGS, GET_ALL_ADMINS } from '../../apollo/admin/query';
import { UPDATE_PLATFORM_SETTINGS, INVITE_ADMIN, REMOVE_ADMIN } from '../../apollo/admin/mutation';

export default function AdminSettingsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'platform' | 'admins' | 'profile'>('platform');
  const [adminProfile, setAdminProfile] = useState({
    userNick: currentUser?.userNick || '',
    userEmail: currentUser?.userEmail || '',
    userPhone: currentUser?.userPhone || '',
    userDescription: currentUser?.userDescription || '',
    userImage: currentUser?.userImage || '',
  });
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'CONTENT_ADMIN'>('ADMIN');

  const { data: settingsData, loading: settingsLoading, refetch: refetchSettings } = useQuery(GET_PLATFORM_SETTINGS, {
    skip: !mounted || !isLoggedIn(),
    fetchPolicy: 'network-only',
  });

  const { data: adminsData, loading: adminsLoading, refetch: refetchAdmins } = useQuery(GET_ALL_ADMINS, {
    skip: !mounted || !isLoggedIn() || activeTab !== 'admins',
    fetchPolicy: 'network-only',
  });

  const [updateSettings] = useMutation(UPDATE_PLATFORM_SETTINGS);
  const [inviteAdmin] = useMutation(INVITE_ADMIN);
  const [removeAdmin] = useMutation(REMOVE_ADMIN);

  const platformSettings = settingsData?.getPlatformSettings || {
    siteName: '',
    supportEmail: '',
    quoteRulesText: '',
    termsLink: '',
    privacyLink: '',
  };

  const [localSettings, setLocalSettings] = useState(platformSettings);

  useEffect(() => {
    if (settingsData?.getPlatformSettings) {
      setLocalSettings(settingsData.getPlatformSettings);
    }
  }, [settingsData]);

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

  const admins = adminsData?.getAllAdmins?.list || [];

  const handleSaveSettings = async () => {
    try {
      await updateSettings({
        variables: {
          input: {
            siteName: localSettings.siteName,
            supportEmail: localSettings.supportEmail,
            quoteRulesText: localSettings.quoteRulesText,
            termsLink: localSettings.termsLink,
            privacyLink: localSettings.privacyLink,
          },
        },
      });
      await refetchSettings();
      alert('Platform settings updated successfully');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to update settings'}`);
    }
  };

  const handleInviteAdmin = async () => {
    if (!inviteEmail.trim()) {
      alert('Please enter an email address');
      return;
    }
    try {
      await inviteAdmin({
        variables: {
          input: {
            userEmail: inviteEmail,
            role: inviteRole,
          },
        },
      });
      await refetchAdmins();
      alert('Admin invitation sent successfully');
      setInviteEmail('');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to invite admin'}`);
    }
  };

  const handleRemoveAdmin = async (adminUserId: string) => {
    if (!confirm('Are you sure you want to remove this admin?')) return;
    try {
      await removeAdmin({ variables: { adminUserId } });
      await refetchAdmins();
      alert('Admin removed successfully');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to remove admin'}`);
    }
  };

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
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                    activeTab === 'profile'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  My Profile
                </button>
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

              {/* Admin Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-slate-200">
                    <div className="relative">
                      {adminProfile.userImage ? (
                        <img
                          src={adminProfile.userImage}
                          alt={adminProfile.userNick}
                          className="w-24 h-24 rounded-full object-cover border-4 border-slate-200"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-slate-200">
                          <span className="material-symbols-outlined text-4xl text-indigo-600">person</span>
                        </div>
                      )}
                      <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg">
                        <span className="material-symbols-outlined text-sm">camera_alt</span>
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{adminProfile.userNick || 'Admin User'}</h3>
                      <p className="text-sm text-slate-600">{adminProfile.userEmail}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                        {normalizeRole(currentUser?.userRole) === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Display Name</label>
                      <input
                        type="text"
                        value={adminProfile.userNick}
                        onChange={(e) => setAdminProfile({ ...adminProfile, userNick: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Your display name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={adminProfile.userEmail}
                        disabled
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={adminProfile.userPhone}
                        onChange={(e) => setAdminProfile({ ...adminProfile, userPhone: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Image URL</label>
                      <input
                        type="url"
                        value={adminProfile.userImage}
                        onChange={(e) => setAdminProfile({ ...adminProfile, userImage: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Bio / Description</label>
                    <textarea
                      rows={4}
                      value={adminProfile.userDescription}
                      onChange={(e) => setAdminProfile({ ...adminProfile, userDescription: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="flex items-center justify-end pt-4 border-t border-slate-200">
                    <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">
                      Save Profile
                    </button>
                  </div>
                </div>
              )}

              {/* Platform Settings Tab */}
              {activeTab === 'platform' && (
                <div className="p-6 space-y-6">
                  {settingsLoading ? (
                    <p className="text-center text-slate-500 py-8">Loading settings...</p>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Website Name</label>
                        <input
                          type="text"
                          value={localSettings.siteName || ''}
                          onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="SMEConnect"
                        />
                        <p className="text-xs text-slate-500 mt-1">This name will appear throughout the platform</p>
                      </div>
                      <div className="flex items-center justify-end pt-4 border-t border-slate-200">
                        <button onClick={handleSaveSettings} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">
                          Save Changes
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Admin Accounts Tab */}
              {activeTab === 'admins' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Admin Accounts</h3>
                    <div className="flex items-center gap-3">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="admin@example.com"
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as 'ADMIN' | 'CONTENT_ADMIN')}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="CONTENT_ADMIN">Content Admin</option>
                      </select>
                      <button onClick={handleInviteAdmin} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        <span>Invite</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {adminsLoading ? (
                      <p className="text-center text-slate-500 py-4">Loading admins...</p>
                    ) : admins.length === 0 ? (
                      <p className="text-center text-slate-500 py-4">No admins found</p>
                    ) : (
                      admins.map((admin: any) => (
                        <div key={admin._id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-semibold text-slate-900">{admin.userNick}</p>
                                {admin.role === 'SUPER_ADMIN' && (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded border border-amber-300">
                                    SUPER_ADMIN
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">{admin.userEmail}</p>
                              <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${
                                admin.role === 'SUPER_ADMIN' 
                                  ? 'bg-amber-100 text-amber-700 border border-amber-300' 
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {admin.role}
                              </span>
                            </div>
                            <button onClick={() => handleRemoveAdmin(admin._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
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
