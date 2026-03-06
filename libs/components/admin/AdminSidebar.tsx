import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { logOut } from '../../auth';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', href: '/admin' },
  { icon: 'people', label: 'Users', href: '/admin/users' },
  { icon: 'corporate_fare', label: 'Organizations', href: '/admin/organizations' },
  { icon: 'description', label: 'Service Requests', href: '/admin/service-requests' },
  { icon: 'request_quote', label: 'Quotes', href: '/admin/quotes' },
  { icon: 'assignment', label: 'Orders', href: '/admin/orders' },
  { icon: 'article', label: 'Articles', href: '/admin/articles' },
  { icon: 'settings', label: 'Settings', href: '/admin/settings' },
];

export const AdminSidebar: React.FC = () => {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const userName = currentUser?.userNick || 'Admin';

  const handleLogout = async () => {
    await logOut();
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 flex flex-col h-full">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700 flex-shrink-0">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">admin_panel_settings</span>
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-indigo-400">Admin</span>
            <span className="text-slate-200">Panel</span>
          </span>
        </Link>
      </div>

      {/* User Info */}
      <div className="px-6 py-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md ring-2 ring-slate-700">
            <span className="material-symbols-outlined text-white text-xl">admin_panel_settings</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">{userName}</span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Administrator</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white font-medium'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-red-900/20 hover:text-red-400 transition-all rounded-lg text-sm font-medium"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
