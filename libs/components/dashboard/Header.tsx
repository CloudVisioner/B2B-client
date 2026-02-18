import React from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { GET_BUYER_ORGANIZATION } from '../../../apollo/user/query';
import { getHeaders } from '../../../apollo/utils';
import { isLoggedIn } from '../../auth';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const userName = currentUser?.userNick || 'User';

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
  const displaySubtitle = subtitle || (organization 
    ? `Active Organization: ${organization.orgName}${organization.orgIndustry ? ` • ${organization.orgIndustry}` : ''}`
    : 'Create your organization in Settings');

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title || `Welcome back, ${userName}!`}</h1>
        {displaySubtitle && (
          <p className="text-xs text-slate-500 font-medium">{displaySubtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/post-job')}
          className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Post New Job
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2" />

        <button className="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>

        <button className="flex items-center gap-2 pl-2 py-1 pr-1 hover:bg-slate-50 rounded-full transition-colors border border-slate-100">
          <img
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
            src={currentUser?.userImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff`}
          />
          <span className="material-symbols-outlined text-slate-400">expand_more</span>
        </button>
      </div>
    </header>
  );
};
