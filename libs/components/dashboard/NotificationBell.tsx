import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { GET_NOTIFICATIONS, GET_UNREAD_NOTIFICATION_COUNT, MARK_NOTIFICATION_AS_READ, MARK_ALL_NOTIFICATIONS_AS_READ } from '../../../apollo/user/notification';
import { getHeaders } from '../../../apollo/utils';
import { isLoggedIn, getJwtToken, decodeJWT } from '../../auth';

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

interface NotificationBellProps {
  userId?: string;
  userRole?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ userId, userRole }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Get userId from props or JWT token
  const getUserId = (): string | null => {
    if (userId && userId.trim() && userId.length === 24) return userId;
    const token = getJwtToken();
    if (token) {
      try {
        const claims = decodeJWT(token);
        const id = claims?._id || claims?.userId;
        if (id && id.trim() && id.length === 24) return id;
      } catch (e) {
        // Ignore
      }
    }
    return null;
  };

  const validUserId = getUserId();

  // Fetch unread count for badge
  const { data: countData } = useQuery(GET_UNREAD_NOTIFICATION_COUNT, {
    skip: !isLoggedIn() || !validUserId,
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
    pollInterval: 30000, // Poll every 30 seconds
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    errorPolicy: 'all',
  });

  // Fetch recent notifications for dropdown (kept for potential future use),
  // but primary UX is now redirecting to the full notifications page.
  const { data, loading, refetch } = useQuery(GET_NOTIFICATIONS, {
    skip: !isLoggedIn() || !validUserId || !isOpen,
    variables: {
      input: {
        page: 1,
        limit: 5,
        search: {
          read: null,
          type: null,
        },
      },
    },
    fetchPolicy: 'network-only',
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    errorPolicy: 'all',
  });

  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ, {
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    refetchQueries: [
      { query: GET_NOTIFICATIONS, variables: { input: { page: 1, limit: 5, search: { read: null, type: null } } } },
      { query: GET_UNREAD_NOTIFICATION_COUNT, variables: { input: { page: 1, limit: 1, search: { read: false, type: null } } } },
    ],
  });

  const [markAllAsReadMutation] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ, {
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    refetchQueries: [
      { query: GET_NOTIFICATIONS, variables: { input: { page: 1, limit: 5, search: { read: null, type: null } } } },
      { query: GET_UNREAD_NOTIFICATION_COUNT, variables: { input: { page: 1, limit: 1, search: { read: false, type: null } } } },
    ],
  });

  const notifications: Notification[] = data?.getMyNotifications?.list || [];
  const unreadCount = countData?.getUnreadNotificationCount || notifications.filter(n => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      try {
        await markAsRead({ variables: { notificationId: notification._id } });
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Navigate based on notification type and related quote
    if (notification.relatedQuoteId) {
      if (userRole === 'BUYER' || userRole === 'buyer') {
        router.push(`/service-requests?quoteId=${notification.relatedQuoteId}`);
      } else {
        router.push(`/provider/jobs?quoteId=${notification.relatedQuoteId}`);
      }
    }
    setIsOpen(false);
  };

  const markAllAsRead = async () => {
    try {
      await markAllAsReadMutation();
      if (refetch) await refetch();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const recentNotifications = notifications.slice(0, 5);
  const hasUnread = unreadCount > 0;

  return (
    <div className="relative">
      {/* Modern Bell Button */}
      <button
        ref={bellRef}
        onClick={() => {
          // Directly navigate to the full notifications page so users
          // always see the complete, up-to-date list and can mark all as read.
          router.push('/notifications');
        }}
        className="relative p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl active:scale-95"
      >
        <span 
          className={`material-symbols-outlined text-xl transition-all duration-300 ${
            isOpen ? 'rotate-12 scale-110' : 'hover:scale-110'
          }`}
        >
          notifications
        </span>
        
        {/* Modern Pulsing Indicator */}
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-2 border-white dark:border-slate-900 shadow-lg">
            <span className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-75"></span>
            {unreadCount > 0 && unreadCount <= 99 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-slate-900">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </span>
        )}
      </button>

      {/* NOTE:
          The dropdown UI is kept in code for potential future use,
          but the primary interaction now routes to /notifications.
          To avoid confusing states, we do not render the dropdown
          based on isOpen anymore.
      */}
      {false && isOpen && (
        <>
          {/* Backdrop to prevent page interaction */}
          <div 
            className="fixed inset-0 z-[99998]"
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={dropdownRef}
            className="fixed right-4 top-20 w-[420px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden z-[99999] animate-in slide-in-from-top-3 fade-in duration-300"
            style={{
              boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
          {/* Modern Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">notifications</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {hasUnread && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Modern Notifications List with Custom Scrollbar */}
          <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="px-5 py-8 text-center">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-3 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-lg animate-spin">sync</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Loading...</p>
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-3 opacity-20">
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
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">You're all caught up</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                {recentNotifications.map((notification) => (
                  <button
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className="w-full px-6 py-4 text-left hover:bg-gradient-to-r hover:from-slate-50/80 hover:to-white dark:hover:from-slate-800/50 dark:hover:to-slate-900/50 transition-all group relative"
                  >
                    {/* Modern Active Indicator */}
                    {!notification.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-r-full"></div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      {/* Modern Status Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${
                        notification.type === 'QUOTE_ACCEPTED'
                          ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40'
                          : 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40'
                      }`}>
                        <span className={`material-symbols-outlined text-base ${
                          notification.type === 'QUOTE_ACCEPTED'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {notification.type === 'QUOTE_ACCEPTED' ? 'check_circle' : 'request_quote'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-relaxed mb-1 ${
                          notification.read
                            ? 'text-slate-600 dark:text-slate-400'
                            : 'text-slate-900 dark:text-white font-semibold'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {new Date(notification.createdAt).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {new Date(notification.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Modern Unread Indicator */}
                      {!notification.read && (
                        <div className="flex-shrink-0 w-2.5 h-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full mt-1.5 shadow-sm"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Modern Footer */}
          {recentNotifications.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800/50 bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900/50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/notifications');
                }}
                className="w-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 group"
              >
                View all notifications
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
        </>
      )}
    </div>
  );
};
