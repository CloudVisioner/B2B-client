import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, normalizeRole, isAdminPortalRole } from '../../libs/auth';
import { AdminSidebar } from '../../libs/components/admin/AdminSidebar';
import { AdminHeader } from '../../libs/components/admin/AdminHeader';
import { GET_ALL_USERS, GET_USER_BY_ID } from '../../apollo/admin/query';
import { SUSPEND_USER, ACTIVATE_USER, RESET_USER_PASSWORD } from '../../apollo/admin/mutation';

export default function AdminUsersPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data: usersData, loading: usersLoading, error: usersError, refetch: refetchUsers } = useQuery(GET_ALL_USERS, {
    skip: !mounted || !isLoggedIn(),
    variables: {
      input: {
        page,
        limit,
        search: {
          ...(roleFilter !== 'all' && { userRole: roleFilter }),
          ...(statusFilter !== 'all' && { userStatus: statusFilter }),
          ...(searchTerm && { userNick: searchTerm, userEmail: searchTerm }),
        },
      },
    },
    fetchPolicy: 'network-only',
  });

  const [suspendUser] = useMutation(SUSPEND_USER);
  const [activateUser] = useMutation(ACTIVATE_USER);
  const [resetPassword] = useMutation(RESET_USER_PASSWORD);

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

  const users = usersData?.getAllUsers?.list || [];
  const totalUsers = usersData?.getAllUsers?.metaCounter?.[0]?.total || 0;

  const handleSuspendUser = async (userId: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    try {
      await suspendUser({ variables: { userId } });
      await refetchUsers();
      alert('User suspended successfully');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to suspend user'}`);
    }
  };

  const handleActivateUser = async (userId: string) => {
    if (!confirm('Are you sure you want to activate this user?')) return;
    try {
      await activateUser({ variables: { userId } });
      await refetchUsers();
      alert('User activated successfully');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to activate user'}`);
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!confirm('Are you sure you want to reset this user\'s password?')) return;
    try {
      await resetPassword({ variables: { userId } });
      alert('Password reset link sent successfully');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to reset password'}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
        <AdminHeader title="Users Management" subtitle="View and manage all platform users" />

        {/* ── Scrollable Body ── */}
        <main className="flex-1 overflow-y-auto bg-dashboard-canvas">
          <div className="max-w-7xl mx-auto px-8 py-10">
            {/* Filters */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
              <div className="space-y-4">
                {/* Search, Role, Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Search</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">
                        search
                      </span>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="all">All Roles</option>
                      <option value="BUYER">Buyer</option>
                      <option value="SERVICE_PROVIDER">SERVICE_PROVIDER</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>
                </div>

                {/* Reset Button */}
                <div className="pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setRoleFilter('all');
                      setStatusFilter('all');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {usersLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                          Loading users...
                        </td>
                      </tr>
                    ) : usersError ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-red-500">
                          Error loading users: {usersError.message}
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user: any) => (
                        <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-mono text-slate-600">{user._id.slice(-8)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-slate-900">{user.userNick}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-600">{user.userEmail}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.userRole === 'BUYER' ? 'bg-blue-100 text-blue-700' :
                              user.userRole === 'SERVICE_PROVIDER' || user.userRole === 'PROVIDER' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {user.userRole}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.userStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {user.userStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-500">{formatDate(user.createdAt)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <span className="material-symbols-outlined text-lg">visibility</span>
                              </button>
                              <button
                                onClick={() => user.userStatus === 'ACTIVE' ? handleSuspendUser(user._id) : handleActivateUser(user._id)}
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title={user.userStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                              >
                                <span className="material-symbols-outlined text-lg">
                                  {user.userStatus === 'ACTIVE' ? 'block' : 'check_circle'}
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">User Details</h3>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-slate-600">close</span>
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">User ID</label>
                      <p className="text-sm text-slate-900 font-mono">{selectedUser._id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Username</label>
                      <p className="text-sm text-slate-900">{selectedUser.userNick}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Email</label>
                      <p className="text-sm text-slate-900">{selectedUser.userEmail}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Role</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedUser.userRole === 'BUYER' ? 'bg-blue-100 text-blue-700' :
                        selectedUser.userRole === 'SERVICE_PROVIDER' || selectedUser.userRole === 'PROVIDER' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {selectedUser.userRole}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Status</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedUser.userStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {selectedUser.userStatus}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Created At</label>
                      <p className="text-sm text-slate-900">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                  </div>
                  <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handleResetPassword(selectedUser._id)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
