import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn } from '../libs/auth';
import { Sidebar } from '../libs/components/dashboard/Sidebar';

/* ═══════════════════════════════════════════════════════════
   Tab definitions
   ═══════════════════════════════════════════════════════════ */
const TABS = [
  { id: 'organization', label: 'Organization', icon: 'business' },
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'billing', label: 'Billing', icon: 'credit_card' },
] as const;

type TabId = (typeof TABS)[number]['id'];

/* ═══════════════════════════════════════════════════════════
   Organization Tab
   ═══════════════════════════════════════════════════════════ */
function OrganizationTab() {
  return (
    <div className="space-y-8">
      {/* Logo & Name */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Company Profile</h3>
            <p className="text-sm text-slate-500 mt-0.5">Manage your organization&apos;s public identity</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            Verified
          </span>
        </div>

        <div className="flex items-start gap-8">
          {/* Logo upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
              AC
            </div>
            <button className="text-xs font-bold text-[var(--primary)] hover:underline">Change Logo</button>
          </div>

          {/* Fields */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Organization Name</label>
              <input
                type="text"
                defaultValue="Acme Corp"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Industry</label>
              <select className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50">
                <option>Technology & Software</option>
                <option>Finance & Banking</option>
                <option>Healthcare</option>
                <option>E-Commerce</option>
                <option>Manufacturing</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
              <input
                type="text"
                defaultValue="San Francisco, CA"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Website</label>
              <input
                type="url"
                defaultValue="https://acmecorp.com"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
              <textarea
                rows={3}
                defaultValue="Leading enterprise technology solutions company specializing in cloud infrastructure and digital transformation."
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Business Verification */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Business Verification</h3>
        <p className="text-sm text-slate-500 mb-6">Your verification status and documents</p>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Business License', status: 'Verified', icon: 'description', color: 'emerald' },
            { label: 'Tax Registration', status: 'Verified', icon: 'receipt_long', color: 'emerald' },
            { label: 'Bank Account', status: 'Pending', icon: 'account_balance', color: 'amber' },
          ].map((doc) => (
            <div key={doc.label} className="p-4 border border-slate-100 rounded-lg flex items-center gap-4 hover:border-slate-200 transition-colors">
              <div className={`w-10 h-10 rounded-lg ${doc.color === 'emerald' ? 'bg-emerald-50' : 'bg-amber-50'} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${doc.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'} text-xl`}>
                  {doc.icon}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">{doc.label}</p>
                <p className={`text-xs font-semibold ${doc.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {doc.status}
                </p>
              </div>
              <span className="material-symbols-outlined text-slate-300 text-lg">chevron_right</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Team Members</h3>
            <p className="text-sm text-slate-500 mt-0.5">Manage who has access to your organization</p>
          </div>
          <button className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-sm">
            <span className="material-symbols-outlined text-lg">person_add</span>
            Invite Member
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Azamat', email: 'azamat@acmecorp.com', role: 'Owner', avatar: '' },
            { name: 'Sarah Jenkins', email: 'sarah@acmecorp.com', role: 'Admin', avatar: '' },
          ].map((member) => (
            <div key={member.email} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-700">{member.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                  member.role === 'Owner' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}>
                  {member.role}
                </span>
                <button className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined text-lg">more_horiz</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm">
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Profile Tab
   ═══════════════════════════════════════════════════════════ */
function ProfileTab() {
  return (
    <div className="space-y-8">
      {/* Avatar & Personal Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Personal Information</h3>
        <p className="text-sm text-slate-500 mb-8">Update your personal details and profile photo</p>

        <div className="flex items-start gap-8">
          {/* Photo */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200 overflow-hidden">
                A
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-slate-500 text-sm">photo_camera</span>
              </button>
            </div>
            <button className="text-xs font-bold text-red-500 hover:underline">Remove</button>
          </div>

          {/* Fields */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                defaultValue="Azamat"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
              <input
                type="text"
                defaultValue="azamat"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                defaultValue="azamat@acmecorp.com"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
              <input
                type="tel"
                defaultValue="+1 (555) 000-0000"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Security</h3>
            <p className="text-sm text-slate-500 mt-0.5">Manage your password and two-factor authentication</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            Secure
          </span>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50"
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-600">security</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500">Add an extra layer of security to your account</p>
            </div>
          </div>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            Enable 2FA
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm">
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Notifications Tab
   ═══════════════════════════════════════════════════════════ */
function ToggleSwitch({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? 'bg-[var(--primary)]' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function NotificationsTab() {
  const categories = [
    {
      title: 'Quote Notifications',
      description: 'When providers submit or update quotes on your requests',
      icon: 'request_quote',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      email: true, sms: false, push: true,
    },
    {
      title: 'Order Updates',
      description: 'Milestone completions, delivery updates, and status changes',
      icon: 'local_shipping',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      email: true, sms: true, push: true,
    },
    {
      title: 'Messages',
      description: 'New messages from providers and team members',
      icon: 'chat',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      email: true, sms: false, push: true,
    },
    {
      title: 'Billing & Payments',
      description: 'Invoice reminders, payment confirmations, and receipts',
      icon: 'payments',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      email: true, sms: true, push: false,
    },
    {
      title: 'System Announcements',
      description: 'Platform updates, maintenance notices, and policy changes',
      icon: 'campaign',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-500',
      email: true, sms: false, push: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Channel toggles */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Notification Channels</h3>
        <p className="text-sm text-slate-500 mb-8">Choose how you want to be notified for each category</p>

        {/* Header */}
        <div className="grid grid-cols-12 gap-4 mb-4 px-4">
          <div className="col-span-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</span>
          </div>
          <div className="col-span-2 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</span>
          </div>
          <div className="col-span-2 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SMS</span>
          </div>
          <div className="col-span-2 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Push</span>
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.title} className="grid grid-cols-12 gap-4 items-center p-4 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
              <div className="col-span-6 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${cat.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <span className={`material-symbols-outlined ${cat.iconColor}`}>{cat.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{cat.title}</p>
                  <p className="text-xs text-slate-500">{cat.description}</p>
                </div>
              </div>
              <div className="col-span-2 flex justify-center">
                <ToggleSwitch defaultOn={cat.email} />
              </div>
              <div className="col-span-2 flex justify-center">
                <ToggleSwitch defaultOn={cat.sms} />
              </div>
              <div className="col-span-2 flex justify-center">
                <ToggleSwitch defaultOn={cat.push} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digest Settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Email Digest</h3>
        <p className="text-sm text-slate-500 mb-6">Get a summary of your activity delivered to your inbox</p>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Real-time', desc: 'Get notified immediately', icon: 'bolt', active: false },
            { label: 'Daily Digest', desc: 'Once per day at 9:00 AM', icon: 'today', active: true },
            { label: 'Weekly Digest', desc: 'Every Monday morning', icon: 'date_range', active: false },
          ].map((option) => (
            <button
              key={option.label}
              className={`p-5 border rounded-xl text-left transition-all ${
                option.active
                  ? 'border-[var(--primary)] bg-indigo-50/50 ring-1 ring-indigo-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg ${option.active ? 'bg-indigo-100' : 'bg-slate-100'} flex items-center justify-center mb-3`}>
                <span className={`material-symbols-outlined ${option.active ? 'text-indigo-600' : 'text-slate-400'}`}>{option.icon}</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{option.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{option.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm">
          Save Preferences
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Billing Tab
   ═══════════════════════════════════════════════════════════ */
function BillingTab() {
  return (
    <div className="space-y-8">
      {/* Usage Overview */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Monthly Spend', value: '$24,500', sub: 'Oct 2023', icon: 'trending_up', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
          { label: 'Active Contracts', value: '8', sub: '$42,300 total value', icon: 'handshake', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
          { label: 'Pending Invoices', value: '3', sub: '$6,200 due', icon: 'receipt_long', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <div className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${stat.iconColor} text-xl`}>{stat.icon}</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 font-medium mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Payment Methods</h3>
            <p className="text-sm text-slate-500 mt-0.5">Manage your payment cards and bank accounts</p>
          </div>
          <button className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-sm">
            <span className="material-symbols-outlined text-lg">add</span>
            Add Method
          </button>
        </div>

        <div className="space-y-3">
          {[
            { type: 'Visa', last4: '4242', exp: '12/25', isDefault: true },
            { type: 'Mastercard', last4: '8888', exp: '03/26', isDefault: false },
          ].map((card) => (
            <div key={card.last4} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 rounded bg-gradient-to-r from-slate-800 to-slate-600 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">{card.type.toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {card.type} ending in {card.last4}
                  </p>
                  <p className="text-xs text-slate-500">Expires {card.exp}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {card.isDefault && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                    Default
                  </span>
                )}
                <button className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined text-lg">more_horiz</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Invoice History</h3>
            <p className="text-sm text-slate-500 mt-0.5">Download and review past invoices</p>
          </div>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
            <span className="material-symbols-outlined text-lg">download</span>
            Export All
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-100">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { id: 'INV-2048', date: 'Oct 15, 2023', amount: '$18,500.00', status: 'Paid' },
                { id: 'INV-2031', date: 'Sep 30, 2023', amount: '$4,200.00', status: 'Paid' },
                { id: 'INV-2019', date: 'Sep 15, 2023', amount: '$2,800.00', status: 'Pending' },
              ].map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-bold text-slate-900">{inv.id}</td>
                  <td className="px-5 py-4 text-sm text-slate-600 font-medium">{inv.date}</td>
                  <td className="px-5 py-4 text-sm font-bold text-slate-900">{inv.amount}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-[var(--primary)] font-semibold text-sm hover:underline flex items-center gap-1 ml-auto">
                      <span className="material-symbols-outlined text-base">download</span>
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Settings Page
   ═══════════════════════════════════════════════════════════ */
export default function SettingsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('organization');

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

  const renderTab = () => {
    switch (activeTab) {
      case 'organization': return <OrganizationTab />;
      case 'profile': return <ProfileTab />;
      case 'notifications': return <NotificationsTab />;
      case 'billing': return <BillingTab />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-5xl mx-auto px-10 py-10">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Manage your account, organization, and preferences</p>
            </div>

            {/* Tab bar */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1.5 mb-8">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-[var(--primary)] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-lg"
                    style={activeTab === tab.id ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {renderTab()}

            {/* Management Footer */}
            <div className="flex flex-wrap items-center gap-4 pt-10 mt-10 border-t border-[var(--border)]">
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
            <div className="pb-8 mt-4">
              <p className="text-xs text-slate-400 font-medium">© 2024 SME Connect. Enterprise Buyer Protocol v2.4.1</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
