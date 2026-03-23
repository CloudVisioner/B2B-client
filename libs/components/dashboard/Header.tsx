import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { GET_BUYER_ORGANIZATION, GET_MY_PROFILE } from '../../../apollo/user/query';
import { getHeaders } from '../../../apollo/utils';
import { isLoggedIn, getJwtToken, decodeJWT } from '../../auth';
import { NotificationBell } from './NotificationBell';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const userName = currentUser?.userNick || 'User';

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
  const { data: profileData } = useQuery(GET_MY_PROFILE, {
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

  // Helper function to convert relative image paths to full URLs
  const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '';
    // If it's already a full URL (starts with http:// or https://), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If it's a relative path, prepend the base URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:4001/graphql';
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
    ? `Active Organization: ${organization.organizationName}${organization.organizationIndustry ? ` • ${organization.organizationIndustry}` : ''}`
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

        <NotificationBell userId={currentUser?._id} userRole={currentUser?.userRole} />

        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-slate-200/80 py-1 pl-1 pr-2 leading-none transition-colors hover:bg-slate-50"
        >
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/80">
            {userImage ? (
              <img
                alt="Profile"
                className="block h-full w-full min-h-0 object-cover object-center"
                src={userImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff`;
                }}
              />
            ) : (
              <img
                alt="Profile"
                className="block h-full w-full min-h-0 object-cover object-center"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff`}
              />
            )}
          </span>
        </button>
      </div>
    </header>
  );
};
