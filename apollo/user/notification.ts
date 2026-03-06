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

// Alternative query that handles nullable type field (if backend allows it)
// Note: This is a fallback - the backend should fix the null type issue
export const GET_NOTIFICATIONS_SAFE = gql`
  query GetMyNotificationsSafe($input: NotificationInquiry!) {
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

/**
 * Delete Single Notification
 * Deletes a single notification by ID
 */
export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($notificationId: String!) {
    deleteNotification(notificationId: $notificationId) {
      _id
    }
  }
`;

/**
 * Delete All Notifications
 * Deletes all notifications for the current user
 * TODO: This mutation needs to be implemented in the backend
 */
export const DELETE_ALL_NOTIFICATIONS = gql`
  mutation DeleteAllNotifications {
    deleteAllNotifications
  }
`;
