import React from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { GET_BUYER_ORGANIZATION } from '../../../apollo/user/query';
import { getHeaders } from '../../../apollo/utils';
import { isLoggedIn } from '../../auth';

interface ProviderHeaderProps {
  title?: string;
}

export const ProviderHeader: React.FC<ProviderHeaderProps> = ({ title }) => {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const userName = currentUser?.userNick || 'Provider';

  // Fetch organization data
  const { data: orgData } = useQuery(GET_BUYER_ORGANIZATION, {
    skip: !isLoggedIn(),
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
  });

  const organization = orgData?.getBuyerOrganization;
  const displayTitle = title || (organization
    ? `Welcome back, ${userName}! • ${organization.organizationName}`
    : `Welcome back, ${userName}!`);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'PR';
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-8 flex-1">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            {displayTitle}
          </h1>
          {organization && !title && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {organization.organizationIndustry ? `${organization.organizationIndustry}` : 'Provider Organization'}
            </p>
          )}
        </div>
        <div className="relative w-96 max-w-md hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xl">
            search
          </span>
          <input
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary transition-all"
            placeholder="Search projects, invoices, or clients..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
        <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
          {getInitials(userName)}
        </div>
      </div>
    </header>
  );
};
