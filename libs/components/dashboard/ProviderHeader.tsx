import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { GET_PROVIDER_ORGANIZATION, GET_QUOTES_BY_ORGANIZATION, GET_SERVICE_REQUESTS, GET_MY_PROFILE } from '../../../apollo/user/query';
import { getHeaders } from '../../../apollo/utils';
import { isLoggedIn, getJwtToken, decodeJWT } from '../../auth';
import { NotificationBell } from './NotificationBell';

interface ProviderHeaderProps {
  title?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export const ProviderHeader: React.FC<ProviderHeaderProps> = ({ title }) => {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const userName = currentUser?.userNick || 'Provider';

  // Initialize userVar from JWT token on mount if not already set
  useEffect(() => {
    if (!currentUser?._id && isLoggedIn()) {
      const token = getJwtToken();
      if (token) {
        try {
          const claims = decodeJWT(token);
          if (claims?._id || claims?.userId) {
            userVar({
              _id: claims._id || claims.userId,
              userNick: claims.userNick || '',
              userEmail: claims.userEmail || '',
              userImage: claims.userImage || '',
              userRole: claims.userRole || '',
              ...claims,
            });
          }
        } catch (e) {
          // Ignore
        }
      }
    }
  }, []);

  // Get userId from currentUser or token
  const getUserId = (): string | null => {
    if (currentUser?._id && currentUser._id.length === 24) return currentUser._id;
    const token = getJwtToken();
    if (token) {
      try {
        const claims = decodeJWT(token);
        return claims?._id || claims?.userId || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const validUserId = getUserId();

  // Fetch user profile to get latest image on page load and after updates
  const { data: profileData, refetch: refetchProfile } = useQuery(GET_MY_PROFILE, {
    skip: !isLoggedIn() || !validUserId,
    variables: { userId: validUserId || '' },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    onCompleted: (data) => {
      if (data?.getUser?.userImage) {
        const current = userVar();
        // Update userVar with latest image
        userVar({
          ...current,
          userImage: data.getUser.userImage,
        });
      }
    },
  });

  // Note: Profile refetch is handled by refetchQueries in the mutation
  // This component will automatically update when the cache is invalidated

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

  // Use profile image if available, otherwise use currentUser image or token claims
  const rawUserImage = profileData?.getUser?.userImage || currentUser?.userImage || (() => {
    const token = getJwtToken();
    if (token) {
      try {
        const claims = decodeJWT(token);
        return claims?.userImage || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  })();
  
  const userImage = rawUserImage ? getImageUrl(rawUserImage) : null;

  // Fetch provider organization data
  const { data: orgData } = useQuery(GET_PROVIDER_ORGANIZATION, {
    skip: !isLoggedIn(),
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
  });

  const providerOrgId: string | undefined = orgData?.getProviderOrganization?._id;

  // Fetch quotes by organization
  const { data: quotesData } = useQuery(GET_QUOTES_BY_ORGANIZATION, {
    skip: !isLoggedIn() || !providerOrgId,
    fetchPolicy: 'cache-first',
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    variables: { orgId: providerOrgId || '' },
  });

  // Fetch available service requests
  const { data: requestsData } = useQuery(GET_SERVICE_REQUESTS, {
    skip: !isLoggedIn(),
    fetchPolicy: 'cache-first',
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    variables: {
      input: {
        page: 1,
        limit: 5,
        sort: 'createdAt',
        sortOrder: 'desc',
        search: {
          reqStatus: 'OPEN',
        },
      },
    },
  });

  const organization = orgData?.getProviderOrganization;
  const displayTitle = title || (organization
    ? `${organization.organizationName || userName}`
    : `Welcome, ${userName}`);

  const availableRequests = requestsData?.getServiceRequests?.list || [];
  const myQuotes = quotesData?.getQuotesByOrganization || [];
  const pendingQuotes = myQuotes.filter((q: any) => q.quoteStatus === 'PENDING');
  const acceptedQuotes = myQuotes.filter((q: any) => q.quoteStatus === 'ACCEPTED');
  const activeOrders = acceptedQuotes;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'PR';
  };

  return (
    <header className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/dashboardNavbar.webp"
          alt="Dashboard"
          fill
          className="object-cover"
          priority
        />
      </div>
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-white/80 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/80"></div>
      
      <div className="relative z-10">
        {/* Top Bar */}
        <div className="h-20 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <div className="min-w-0">
              <h1 className="text-lg font-black text-slate-900 dark:text-white truncate">
                {displayTitle}
              </h1>
              {organization && !title && (
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  {organization.organizationIndustry || 'Provider Organization'}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell userId={currentUser?._id} userRole={currentUser?.userRole} />
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
            <button
              onClick={() => router.push('/provider/settings')}
              className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl transition-all"
            >
              {userImage ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-indigo-500/20 shadow-lg hover:ring-indigo-500/40 transition-all">
                  <img 
                    src={userImage} 
                    alt={userName} 
                    className="w-full h-full object-cover"
                    style={{ display: 'block' }}
                    onError={(e) => {
                      // Fallback to initials if image fails
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement?.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg" style="display: flex">${getInitials(userName)}</div>`;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg hover:from-indigo-600 hover:to-indigo-700 transition-all" style={{ display: 'flex' }}>
                  {getInitials(userName)}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Greeting and Stats Section */}
        {!title && (
          <div className="px-6 lg:px-8 pb-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="pt-6 mb-6">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                {getGreeting()}, {userName.split(' ')[0]} 👋
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
                It's time to grow your business. Welcome to the B2B Service Marketplace.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Available Requests Stat */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-300 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Available Requests</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white mb-3">{availableRequests.length}</p>
                    <button
                      onClick={() => router.push('/provider/jobs')}
                      className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group"
                    >
                      Browse Jobs
                      <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </button>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-xl">description</span>
                  </div>
                </div>
              </div>

              {/* My Quotes Stat */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-300 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">My Quotes</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white mb-3">{myQuotes.length}</p>
                    <div className="flex items-center gap-3 text-xs font-semibold">
                      <span className="text-emerald-600 dark:text-emerald-400">{acceptedQuotes.length} Accepted</span>
                      <span className="text-amber-600 dark:text-amber-400">{pendingQuotes.length} Pending</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-xl">request_quote</span>
                  </div>
                </div>
              </div>

              {/* Active Orders Stat */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-300 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Active Orders</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white mb-3">{activeOrders.length}</p>
                    <button
                      onClick={() => router.push('/provider/projects')}
                      className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 group"
                    >
                      View Projects
                      <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </button>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">work</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
