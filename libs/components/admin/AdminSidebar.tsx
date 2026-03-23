import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logOut } from '../../auth';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', href: '/admin' },
  { icon: 'people', label: 'Users', href: '/admin/users' },
  { icon: 'corporate_fare', label: 'Organizations', href: '/admin/organizations' },
  { icon: 'description', label: 'Service Requests', href: '/admin/service-requests' },
  { icon: 'request_quote', label: 'Quotes', href: '/admin/quotes' },
  { icon: 'assignment', label: 'Orders', href: '/admin/orders' },
  { icon: 'article', label: 'Articles', href: '/admin/articles' },
  { icon: 'support_agent', label: 'Customer Support', href: '/admin/customer-support' },
];

export const AdminSidebar: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 flex-shrink-0">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">admin_panel_settings</span>
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-indigo-600">Admin</span>
            <span className="text-slate-900">Panel</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          // `/admin` must not match every `/admin/*` route — only exact match for Dashboard
          const isActive =
            item.href === '/admin'
              ? router.pathname === '/admin'
              : router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1", color: 'var(--primary)' } : undefined}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all rounded-lg text-sm font-medium"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
