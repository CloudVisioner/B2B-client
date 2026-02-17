import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { logOut } from '../../auth';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { icon: 'description', label: 'My Service Requests', href: '/service-requests' },
  { icon: 'assignment', label: 'Orders', href: '/orders' },
  { icon: 'notifications', label: 'Notifications', href: '/notifications' },
  { icon: 'settings', label: 'Settings', href: '/settings' },
];

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const userName = currentUser?.userNick || 'User';

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 flex-shrink-0">
        <Link href="/" className="text-xl font-bold tracking-tight text-[var(--primary)]">
          SME<span className="text-slate-900">Connect</span>
        </Link>
      </div>

      {/* Profile */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img
            alt={userName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
            src={currentUser?.userImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff`}
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">{userName}</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Buyer</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-[var(--primary)] font-semibold'
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

      {/* Logout */}
      <div className="p-4 border-t border-slate-100">
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
