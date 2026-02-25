import { gql } from '@apollo/client';

// ============================================
// NOTIFICATION QUERIES
// ============================================

/**
 * Get Notifications
 * Fetches notifications for the current user (Buyer or Provider)
 */
export const GET_NOTIFICATIONS = gql`
  query GetMyNotifications($input: NotificationInquiry!) {
    getMyNotifications(input: $input) {
      list {
        _id
        type
        message
        read
        relatedQuoteId
        senderUserId
        receiverUserId
        createdAt
        updatedAt
        senderUserData {
          _id
          userNick
          userEmail
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/**
 * Get Unread Notifications Count
 * Quick query to get just the count of unread notifications
 */
export const GET_UNREAD_NOTIFICATION_COUNT = gql`
  query GetUnreadNotificationCount($input: NotificationInquiry) {
    getUnreadNotificationCount(input: $input)
  }
`;

// ============================================
// NOTIFICATION MUTATIONS
// ============================================

/**
 * Mark Notification as Read
 * Marks a single notification as read
 */
export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($notificationId: String!) {
    markNotificationAsRead(notificationId: $notificationId) {
      _id
      type
      message
      read
      relatedQuoteId
      createdAt
      updatedAt
    }
  }
`;

/**
 * Mark All Notifications as Read
 * Marks all notifications for the current user as read
 */
export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;
