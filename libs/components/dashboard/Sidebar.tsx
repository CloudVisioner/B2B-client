import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { logOut, isLoggedIn } from '../../auth';
import { getHeaders } from '../../../apollo/utils';
import { GET_BUYER_ORGANIZATION } from '../../../apollo/user/query';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { icon: 'corporate_fare', label: 'Organizations', href: '/organizations' },
  { icon: 'description', label: 'My Service Requests', href: '/service-requests' },
  { icon: 'assignment', label: 'Orders', href: '/orders' },
  { icon: 'notifications', label: 'Notifications', href: '/notifications' },
  { icon: 'settings', label: 'Settings', href: '/settings' },
];

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const userName = currentUser?.userNick || 'User';

  // Fetch organization data to get the logo
  const { data: orgData } = useQuery(GET_BUYER_ORGANIZATION, {
    skip: !isLoggedIn(),
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
  });

  // Helper function to convert relative image paths to full URLs
  const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '';
    // If it's already a full URL (starts with http:// or https://), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If it's a relative path, prepend the base URL
    const apiUrl = process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:3010/graphql';
    const baseUrl = apiUrl.replace('/graphql', '');
    // Remove leading slash from imagePath if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${baseUrl}/${cleanPath}`;
  };

  const organization = orgData?.getBuyerOrganization;
  const organizationImage = organization?.organizationImage;
  const organizationName = organization?.organizationName || userName;
  const imageUrl = organizationImage ? getImageUrl(organizationImage) : null;

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <Link 
          href="/" 
          onClick={(e) => {
            e.preventDefault();
            router.push('/');
          }}
          className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="text-[var(--primary)]">SME</span>
          <span className="text-slate-900 dark:text-white">Connect</span>
        </Link>
      </div>

      {/* Profile / Organization Logo */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {imageUrl ? (
            <img
              alt={organizationName}
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-slate-100 shadow-md"
              src={imageUrl}
              onError={(e) => {
                // Fallback to initials if image fails to load
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`${imageUrl ? 'hidden' : 'flex'} items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-xl font-bold shadow-md ring-2 ring-slate-100`}
          >
            {organizationName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) || 'OR'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">{organizationName}</span>
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

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <Link
          href="/help-support"
          className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all rounded-lg text-sm font-medium"
        >
          <span className="material-symbols-outlined text-[22px]">help</span>
          <span>Help & Support</span>
        </Link>
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
