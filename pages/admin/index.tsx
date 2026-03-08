import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, normalizeRole } from '../../libs/auth';
import { AdminSidebar } from '../../libs/components/admin/AdminSidebar';
import { AdminHeader } from '../../libs/components/admin/AdminHeader';
import { GET_DASHBOARD_STATISTICS } from '../../apollo/admin/query';

export default function AdminDashboardPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);

  const { data: statsData, loading: statsLoading, error: statsError, refetch: refetchStats } = useQuery(GET_DASHBOARD_STATISTICS, {
    skip: !mounted || !isLoggedIn(),
    pollInterval: 30000, // Refresh every 30 seconds
    fetchPolicy: 'network-only',
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

  const stats = statsData?.getDashboardStatistics;
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
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

  if (!isLoggedIn()) {
    return null;
  }

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
        <AdminHeader title="Admin Dashboard" subtitle="Overview of platform activity and statistics" />

        {/* ── Scrollable Body ── */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-8 py-10">
            {/* KPI Cards */}
            <div className="mb-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Platform Overview</h2>
                <p className="text-sm text-slate-500">Key metrics and statistics</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Buyers Card */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-xl">people</span>
                    </div>
                    <span className="text-xs font-semibold opacity-80 uppercase tracking-wider">Buyers</span>
                  </div>
                  <p className="text-4xl font-bold mb-2">
                    {statsLoading ? '...' : (stats?.totalBuyers?.current || 0).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    {stats?.totalBuyers?.change !== undefined && (
                      <>
                        <span className={`material-symbols-outlined text-sm ${(stats.totalBuyers.change || 0) >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                          {(stats.totalBuyers.change || 0) >= 0 ? 'trending_up' : 'trending_down'}
                        </span>
                        <span className={`text-sm font-semibold ${(stats.totalBuyers.change || 0) >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                          {Math.abs(stats.totalBuyers.change || 0).toFixed(1)}%
                        </span>
                        <span className="text-xs opacity-70">vs previous period</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Providers Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-xl">business</span>
                    </div>
                    <span className="text-xs font-semibold opacity-80 uppercase tracking-wider">Providers</span>
                  </div>
                  <p className="text-4xl font-bold mb-2">
                    {statsLoading ? '...' : (stats?.totalProviders?.current || 0).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    {stats?.totalProviders?.change !== undefined && (
                      <>
                        <span className={`material-symbols-outlined text-sm ${(stats.totalProviders.change || 0) >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                          {(stats.totalProviders.change || 0) >= 0 ? 'trending_up' : 'trending_down'}
                        </span>
                        <span className={`text-sm font-semibold ${(stats.totalProviders.change || 0) >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                          {Math.abs(stats.totalProviders.change || 0).toFixed(1)}%
                        </span>
                        <span className="text-xs opacity-70">vs previous period</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Requests Card */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-xl">description</span>
                    </div>
                    <span className="text-xs font-semibold opacity-80 uppercase tracking-wider">Requests</span>
                  </div>
                  <p className="text-4xl font-bold mb-2">
                    {statsLoading ? '...' : (stats?.activeRequests?.current || 0)}
                  </p>
                  <div className="flex items-center gap-2">
                    {stats?.activeRequests?.change !== undefined && (
                      <>
                        <span className={`material-symbols-outlined text-sm ${(stats.activeRequests.change || 0) >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                          {(stats.activeRequests.change || 0) >= 0 ? 'trending_up' : 'trending_down'}
                        </span>
                        <span className={`text-sm font-semibold ${(stats.activeRequests.change || 0) >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                          {Math.abs(stats.activeRequests.change || 0).toFixed(1)}%
                        </span>
                        <span className="text-xs opacity-70">vs previous period</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quotes Card */}
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-6 text-white shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-xl">request_quote</span>
                    </div>
                    <span className="text-xs font-semibold opacity-80 uppercase tracking-wider">Quotes</span>
                  </div>
                  <p className="text-4xl font-bold mb-2">
                    {statsLoading ? '...' : (stats?.openQuotes?.current || 0)}
                  </p>
                  <div className="flex items-center gap-2">
                    {stats?.openQuotes?.change !== undefined && (
                      <>
                        <span className={`material-symbols-outlined text-sm ${(stats.openQuotes.change || 0) >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                          {(stats.openQuotes.change || 0) >= 0 ? 'trending_up' : 'trending_down'}
                        </span>
                        <span className={`text-sm font-semibold ${(stats.openQuotes.change || 0) >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                          {Math.abs(stats.openQuotes.change || 0).toFixed(1)}%
                        </span>
                        <span className="text-xs opacity-70">vs previous period</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Orders Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-xl">assignment</span>
                    </div>
                    <span className="text-xs font-semibold opacity-80 uppercase tracking-wider">Orders</span>
                  </div>
                  <p className="text-4xl font-bold mb-2">
                    {statsLoading ? '...' : (stats?.activeOrders?.current || 0)}
                  </p>
                  <div className="flex items-center gap-2">
                    {stats?.activeOrders?.change !== undefined && (
                      <>
                        <span className={`material-symbols-outlined text-sm ${(stats.activeOrders.change || 0) >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                          {(stats.activeOrders.change || 0) >= 0 ? 'trending_up' : 'trending_down'}
                        </span>
                        <span className={`text-sm font-semibold ${(stats.activeOrders.change || 0) >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                          {Math.abs(stats.activeOrders.change || 0).toFixed(1)}%
                        </span>
                        <span className="text-xs opacity-70">vs previous period</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-lg p-8 mb-10">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => router.push('/admin/articles/new')}
                  className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  New Article
                </button>
                <button
                  onClick={() => router.push('/admin/service-requests')}
                  className="px-6 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-700 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">visibility</span>
                  View Service Requests
                </button>
                <button
                  onClick={() => router.push('/admin/organizations')}
                  className="px-6 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-700 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">business</span>
                  Manage Providers
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Service Requests */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Recent Service Requests</h3>
                  <button
                    onClick={() => router.push('/admin/service-requests')}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {statsLoading ? (
                    <p className="text-sm text-slate-500 text-center py-4">Loading...</p>
                  ) : stats?.recentServiceRequests?.length > 0 ? (
                    stats.recentServiceRequests.map((req: any) => (
                      <div key={req._id} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                        <p className="text-sm font-semibold text-slate-900 mb-1">{req.reqTitle}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{req.reqStatus}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            req.reqStatus === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                            req.reqStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {req.reqStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{formatTimeAgo(req.createdAt)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No recent service requests</p>
                  )}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
                  <button
                    onClick={() => router.push('/admin/orders')}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {statsLoading ? (
                    <p className="text-sm text-slate-500 text-center py-4">Loading...</p>
                  ) : stats?.recentOrders?.length > 0 ? (
                    stats.recentOrders.map((order: any) => (
                      <div key={order._id} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-slate-900">${(order.orderAmount || 0).toLocaleString()}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            order.orderStatus === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                            order.orderStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{formatTimeAgo(order.createdAt)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No recent orders</p>
                  )}
                </div>
              </div>

              {/* Recent Articles */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Recent Articles</h3>
                  <button
                    onClick={() => router.push('/admin/articles')}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {statsLoading ? (
                    <p className="text-sm text-slate-500 text-center py-4">Loading...</p>
                  ) : stats?.recentArticles?.length > 0 ? (
                    stats.recentArticles.map((article: any) => (
                      <div key={article._id} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                        <p className="text-sm font-semibold text-slate-900 mb-1">{article.title}</p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            article.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {article.status}
                          </span>
                          <span className="text-xs text-slate-400">{formatTimeAgo(article.createdAt)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No recent articles</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
