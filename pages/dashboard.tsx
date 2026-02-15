import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn } from '../libs/auth';

export default function DashboardPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [activeTab, setActiveTab] = useState<'requests' | 'orders'>('requests');

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
    }
  }, [router]);

  // Get user name from userVar or default
  const userName = currentUser?.userNick || 'User';

  return (
    <div className="antialiased h-screen flex overflow-hidden bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E7EB] flex-shrink-0 flex flex-col h-full z-30">
        <div className="h-16 flex items-center px-6 border-b border-[#E5E7EB]">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#4F46E5] flex items-center gap-2">
            <span className="text-2xl">🔗</span>
            <span className="text-slate-900">SME<span className="text-[#4F46E5]">Connect</span></span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-[#4F46E5] bg-indigo-50 font-semibold rounded-md text-sm">
            <span className="text-lg">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-[#4F46E5] transition-all rounded-md text-sm font-medium">
            <span className="text-lg">📄</span>
            <span>My Requests</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-[#4F46E5] transition-all rounded-md text-sm font-medium">
            <span className="text-lg">💰</span>
            <span>Quotes</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-[#4F46E5] transition-all rounded-md text-sm font-medium">
            <span className="text-lg">🔔</span>
            <span>Notifications</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-[#4F46E5] transition-all rounded-md text-sm font-medium">
            <span className="text-lg">👤</span>
            <span>Account</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-[#E5E7EB] bg-slate-50/50">
          <div className="flex items-center gap-2 px-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Quick Links
          </div>
          <div className="space-y-1">
            <Link href="#" className="flex items-center gap-3 px-4 py-1.5 text-xs italic text-slate-500 hover:bg-slate-50 hover:text-[#4F46E5] transition-all rounded-md">Help Center</Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-1.5 text-xs italic text-slate-500 hover:bg-slate-50 hover:text-[#4F46E5] transition-all rounded-md">API Docs</Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8 flex-shrink-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-slate-900 whitespace-nowrap">Welcome back, {userName}!</h1>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-50 rounded-md transition-colors">
                <span className="text-xs font-semibold text-slate-600">Acme Corp</span>
                <span className="text-slate-400 text-sm">▼</span>
              </button>
            </div>
          </div>
          <div className="flex-1 max-w-2xl px-12">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-[#4F46E5] focus:border-[#4F46E5] outline-none" 
                placeholder="Search users, orgs, or requests..." 
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/marketplace')}
                className="bg-[#4F46E5] hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-semibold text-xs transition-all shadow-sm"
              >
                Post New Job
              </button>
              <button 
                onClick={() => router.push('/marketplace')}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md font-semibold text-xs transition-all"
              >
                Browse Providers
              </button>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-4">
              <button className="relative p-1 text-slate-500 hover:text-[#4F46E5] transition-colors">
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <img 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-slate-200 object-cover" 
                src={currentUser?.userImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userName) + "&background=4F46E5&color=fff"}
              />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-sm">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Requests</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">7</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-sm">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Quotes</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">12</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">+3 new</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-sm">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Orders</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">3</span>
                </div>
              </div>
              <div className="bg-indigo-50/50 p-6 rounded-lg border border-indigo-100 shadow-sm">
                <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Unread Notifications</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-indigo-700">5</span>
                </div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-8">
              {/* Left Column */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* Requests/Orders Table */}
                <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm overflow-hidden">
                  <div className="flex border-b border-[#E5E7EB] px-4 bg-white">
                    <button 
                      onClick={() => setActiveTab('requests')}
                      className={`px-6 py-4 text-sm font-semibold transition-colors ${
                        activeTab === 'requests' 
                          ? 'border-b-2 border-[#4F46E5] text-[#4F46E5]' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Open Requests
                    </button>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className={`px-6 py-4 text-sm font-medium transition-colors ${
                        activeTab === 'orders' 
                          ? 'border-b-2 border-[#4F46E5] text-[#4F46E5]' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Active Orders
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 bg-slate-50 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-[#E5E7EB]">Job Title</th>
                          <th className="px-4 py-3 bg-slate-50 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-[#E5E7EB]">Budget</th>
                          <th className="px-4 py-3 bg-slate-50 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-[#E5E7EB]">Deadline</th>
                          <th className="px-4 py-3 bg-slate-50 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-[#E5E7EB]">Status</th>
                          <th className="px-4 py-3 bg-slate-50 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-[#E5E7EB]">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 text-sm text-slate-700 border-b border-slate-100">
                            <div className="font-medium text-slate-900">Enterprise Cloud Migration</div>
                            <div className="text-[10px] text-slate-400">#SR-9021 • Infrastructure</div>
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-slate-900 border-b border-slate-100">$12,000</td>
                          <td className="px-4 py-4 text-sm font-bold text-slate-600 border-b border-slate-100">Mar 15, 2024</td>
                          <td className="px-4 py-4 text-sm border-b border-slate-100">
                            <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-tight">Open</span>
                          </td>
                          <td className="px-4 py-4 text-sm text-right border-b border-slate-100">
                            <button className="text-[#4F46E5] font-semibold text-xs hover:underline">Manage</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 text-sm text-slate-700 border-b border-slate-100">
                            <div className="font-medium text-slate-900">Cybersecurity Compliance Audit</div>
                            <div className="text-[10px] text-slate-400">#SR-8842 • Security</div>
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-slate-900 border-b border-slate-100">$4,500</td>
                          <td className="px-4 py-4 text-sm font-bold text-slate-600 border-b border-slate-100">Feb 28, 2024</td>
                          <td className="px-4 py-4 text-sm border-b border-slate-100">
                            <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-tight">Pending</span>
                          </td>
                          <td className="px-4 py-4 text-sm text-right border-b border-slate-100">
                            <button className="text-[#4F46E5] font-semibold text-xs hover:underline">Manage</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 text-sm text-slate-700 border-b border-slate-100">
                            <div className="font-medium text-slate-900">Custom ERP Extension Development</div>
                            <div className="text-[10px] text-slate-400">#SR-7731 • Software</div>
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-slate-900 border-b border-slate-100">$8,200</td>
                          <td className="px-4 py-4 text-sm font-bold text-slate-600 border-b border-slate-100">Apr 02, 2024</td>
                          <td className="px-4 py-4 text-sm border-b border-slate-100">
                            <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-tight">Open</span>
                          </td>
                          <td className="px-4 py-4 text-sm text-right border-b border-slate-100">
                            <button className="text-[#4F46E5] font-semibold text-xs hover:underline">Manage</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Ongoing Work Progress */}
                <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Ongoing Work Progress</h3>
                    <button className="text-xs font-semibold text-[#4F46E5]">View Track All</button>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Network Topology Mapping</p>
                          <p className="text-xs text-slate-500">Provider: TechSystems Inc.</p>
                        </div>
                        <span className="text-xs font-bold text-slate-700">60% Complete</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#4F46E5] h-full w-[60%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Frontend UI Kit Design</p>
                          <p className="text-xs text-slate-500">Provider: Studio Minimal</p>
                        </div>
                        <span className="text-xs font-bold text-slate-700">85% Complete</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[85%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                {/* Activity Feed */}
                <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm flex flex-col h-full">
                  <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">Activity Feed</h3>
                    <span className="text-slate-400 text-lg">🕐</span>
                  </div>
                  <div className="p-6 space-y-8">
                    <div className="flex gap-4 relative">
                      <div className="absolute left-[15px] top-8 bottom-[-20px] w-px bg-slate-100"></div>
                      <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 z-10">
                        <span className="text-[#4F46E5] text-sm">💰</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-900 font-semibold mb-0.5">New Quote Received</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Infrastructure Partners submitted a quote for <span className="text-slate-800 font-medium">Cloud Migration</span>.</p>
                        <p className="text-[10px] text-slate-400 mt-1.5 font-medium">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex gap-4 relative">
                      <div className="absolute left-[15px] top-8 bottom-[-20px] w-px bg-slate-100"></div>
                      <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 z-10">
                        <span className="text-emerald-600 text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-900 font-semibold mb-0.5">Milestone Approval</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Phase 1 of <span className="text-slate-800 font-medium">Network Mapping</span> is ready for review.</p>
                        <p className="text-[10px] text-slate-400 mt-1.5 font-medium">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 z-10">
                        <span className="text-amber-600 text-sm">💬</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-900 font-semibold mb-0.5">Message</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">New message from <span className="text-slate-800 font-medium">Sarah Jenkins</span> regarding budget.</p>
                        <p className="text-[10px] text-slate-400 mt-1.5 font-medium">4 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto p-4 border-t border-slate-50 text-center">
                    <button className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-[#4F46E5] transition-colors">See all history</button>
                  </div>
                </div>

                {/* Current Burn Rate */}
                <div className="bg-[#4F46E5] rounded-lg p-6 text-white shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-4">Current Burn Rate</h4>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold">$24,500</p>
                      <p className="text-[10px] text-indigo-200 mt-1">Budget utilized this month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-300">82%</p>
                      <p className="text-[10px] text-indigo-200">Of threshold</p>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-indigo-800/50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-white h-full w-[82%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Management Section */}
            <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-[#E5E7EB]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-4">Management</p>
              <button 
                onClick={() => router.push('/marketplace')}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="text-base">👥</span>
                Browse Talent
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <span className="text-base">⚙️</span>
                Manage Organizations
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <span className="text-base">❓</span>
                Help & Support
              </button>
            </div>

            {/* Footer */}
            <div className="pb-8">
              <p className="text-[10px] text-slate-400 font-medium">© 2024 SME Connect. Enterprise Buyer Protocol v2.4.1</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
