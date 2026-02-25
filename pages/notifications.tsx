import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn } from '../libs/auth';
import { getHeaders } from '../apollo/utils';
import { Sidebar } from '../libs/components/dashboard/Sidebar';
import { ProviderSidebar } from '../libs/components/dashboard/ProviderSidebar';
import { Header } from '../libs/components/dashboard/Header';
import { ProviderHeader } from '../libs/components/dashboard/ProviderHeader';
import { GET_NOTIFICATIONS, GET_UNREAD_NOTIFICATION_COUNT, MARK_NOTIFICATION_AS_READ, MARK_ALL_NOTIFICATIONS_AS_READ } from '../apollo/user/notification';

interface Notification {
  _id: string;
  type: 'QUOTE_SENT' | 'QUOTE_ACCEPTED';
  message: string;
  read: boolean;
  createdAt: string;
  relatedQuoteId?: string;
  senderUserData?: {
    _id: string;
    userNick?: string;
    userEmail?: string;
  };
}

const FILTER_TABS = ['All', 'Unread', 'Archived'] as const;
type FilterTab = typeof FILTER_TABS[number];

export default function NotificationsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const isProvider = currentUser?.userRole === 'PROVIDER' || currentUser?.userRole === 'provider';

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) router.push('/login');
  }, [router]);

  // Fetch notifications
  const getSearchFilter = () => {
    if (activeFilter === 'Unread') {
      return { read: false, type: null };
    }
    return { read: null, type: null };
  };

  const { data, loading, refetch } = useQuery(GET_NOTIFICATIONS, {
    skip: !isLoggedIn() || !currentUser?._id,
    variables: {
      input: {
        page: 1,
        limit: 50,
        search: getSearchFilter(),
      },
    },
    fetchPolicy: 'network-only',
    context: { headers: isLoggedIn() ? getHeaders() : {} },
  });

  // Fetch unread count
  const { data: countData } = useQuery(GET_UNREAD_NOTIFICATION_COUNT, {
    skip: !isLoggedIn() || !currentUser?._id,
    variables: {
      input: {
        page: 1,
        limit: 1,
        search: {
          read: false,
          type: null,
        },
      },
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000,
    context: { headers: isLoggedIn() ? getHeaders() : {} },
  });

  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ, {
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    refetchQueries: [
      { query: GET_NOTIFICATIONS, variables: { input: { page: 1, limit: 50, search: getSearchFilter() } } },
      { query: GET_UNREAD_NOTIFICATION_COUNT, variables: { input: { page: 1, limit: 1, search: { read: false, type: null } } } },
    ],
  });

  const [markAllAsReadMutation] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ, {
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    refetchQueries: [
      { query: GET_NOTIFICATIONS, variables: { input: { page: 1, limit: 50, search: getSearchFilter() } } },
      { query: GET_UNREAD_NOTIFICATION_COUNT, variables: { input: { page: 1, limit: 1, search: { read: false, type: null } } } },
    ],
  });

  const allNotifications: Notification[] = data?.getMyNotifications?.list || [];
  const unreadCount = countData?.getUnreadNotificationCount || allNotifications.filter(n => !n.read).length;

  const filteredNotifications = allNotifications;

  const markAllAsRead = async () => {
    setIsMarkingAll(true);
    try {
      await markAllAsReadMutation();
      if (refetch) await refetch();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      try {
        await markAsRead({ variables: { notificationId: notification._id } });
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Navigate based on notification type
    if (notification.relatedQuoteId) {
      if (isProvider) {
        router.push(`/provider/jobs?quoteId=${notification.relatedQuoteId}`);
      } else {
        router.push(`/service-requests?quoteId=${notification.relatedQuoteId}`);
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden antialiased">
      {isProvider ? <ProviderSidebar /> : <Sidebar />}
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {isProvider ? <ProviderHeader title="Notifications" /> : <Header title="Notifications" />}
        
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-slate-500 mt-1">{unreadCount} unread</p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={isMarkingAll}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {isMarkingAll ? 'Marking...' : 'Mark all as read'}
                </button>
              )}
            </div>

            {/* Modern Filter Tabs */}
            <div className="flex items-center gap-2 mb-6">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeFilter === tab
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30 scale-105'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Ultra-Modern Notifications List */}
            {loading ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 mx-auto mb-4 flex items-center justify-center">
                  <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-2xl animate-spin">sync</span>
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center">
                <div className="w-24 h-24 mx-auto mb-5 opacity-10">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-slate-400">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-base font-semibold text-slate-700 dark:text-slate-300">You're all caught up</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1.5">No notifications to display</p>
              </div>
            ) : (
              <div className="space-y-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                {filteredNotifications.map((notification) => (
                  <button
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full px-6 py-5 text-left hover:bg-gradient-to-r hover:from-slate-50 hover:to-white dark:hover:from-slate-800/50 dark:hover:to-slate-900/50 transition-all group relative ${
                      !notification.read ? 'bg-gradient-to-r from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-slate-900' : ''
                    }`}
                  >
                    {/* Modern Active Indicator */}
                    {!notification.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-r-full"></div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Modern Status Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${
                        notification.type === 'QUOTE_ACCEPTED'
                          ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40'
                          : 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40'
                      }`}>
                        <span className={`material-symbols-outlined text-lg ${
                          notification.type === 'QUOTE_ACCEPTED'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {notification.type === 'QUOTE_ACCEPTED' ? 'check_circle' : 'request_quote'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-relaxed mb-2 ${
                          notification.read
                            ? 'text-slate-600 dark:text-slate-400'
                            : 'text-slate-900 dark:text-white font-semibold'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {formatTime(notification.createdAt)}
                          </p>
                          {notification.senderUserData?.userNick && (
                            <>
                              <span className="text-slate-300 dark:text-slate-600">•</span>
                              <p className="text-xs text-slate-400 dark:text-slate-500">
                                {notification.senderUserData.userNick}
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Modern Indicators */}
                      <div className="flex-shrink-0 flex items-center gap-2">
                        {!notification.read && (
                          <div className="w-2.5 h-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full shadow-sm"></div>
                        )}
                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-xl opacity-0 group-hover:opacity-100 transition-opacity">
                          arrow_forward
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
