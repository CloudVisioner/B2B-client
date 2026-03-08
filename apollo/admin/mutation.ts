import { gql } from '@apollo/client';

// ============================================
// USER MANAGEMENT MUTATIONS
// ============================================

export const SUSPEND_USER = gql`
  mutation SuspendUser($userId: String!) {
    suspendUser(userId: $userId) {
      _id
      userStatus
    }
  }
`;

export const ACTIVATE_USER = gql`
  mutation ActivateUser($userId: String!) {
    activateUser(userId: $userId) {
      _id
      userStatus
    }
  }
`;

export const RESET_USER_PASSWORD = gql`
  mutation ResetUserPassword($userId: String!) {
    resetUserPassword(userId: $userId) {
      success
    }
  }
`;

// ============================================
// ORGANIZATION MANAGEMENT MUTATIONS
// ============================================

export const APPROVE_ORGANIZATION = gql`
  mutation ApproveOrganization($organizationId: String!) {
    approveOrganization(organizationId: $organizationId) {
      _id
      organizationStatus
    }
  }
`;

export const REJECT_ORGANIZATION = gql`
  mutation RejectOrganization($input: RejectOrganizationInput!) {
    rejectOrganization(input: $input) {
      _id
      organizationStatus
    }
  }
`;

export const SUSPEND_ORGANIZATION = gql`
  mutation SuspendOrganization($organizationId: String!) {
    suspendOrganization(organizationId: $organizationId) {
      _id
      organizationStatus
    }
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($input: UpdateOrganizationInput!) {
    updateOrganization(input: $input) {
      _id
      organizationName
      organizationDescription
      organizationWebsite
      organizationIndustry
    }
  }
`;

// ============================================
// SERVICE REQUEST MANAGEMENT MUTATIONS
// ============================================

export const CLOSE_SERVICE_REQUEST = gql`
  mutation CloseServiceRequest($requestId: String!) {
    closeServiceRequest(requestId: $requestId) {
      _id
      reqStatus
    }
  }
`;

export const FLAG_SERVICE_REQUEST = gql`
  mutation FlagServiceRequest($input: FlagServiceRequestInput!) {
    flagServiceRequest(input: $input) {
      _id
    }
  }
`;

export const DELETE_SERVICE_REQUEST = gql`
  mutation DeleteServiceRequest($requestId: String!) {
    deleteServiceRequest(requestId: $requestId) {
      success
    }
  }
`;

// ============================================
// QUOTE MANAGEMENT MUTATIONS
// ============================================

export const FLAG_QUOTE = gql`
  mutation FlagQuote($input: FlagQuoteInput!) {
    flagQuote(input: $input) {
      _id
    }
  }
`;

export const HARD_DELETE_QUOTE = gql`
  mutation HardDeleteQuote($quoteId: String!) {
    hardDeleteQuote(quoteId: $quoteId) {
      success
    }
  }
`;

// ============================================
// ORDER MANAGEMENT MUTATIONS
// ============================================

export const CHANGE_ORDER_STATUS = gql`
  mutation ChangeOrderStatus($input: ChangeOrderStatusInput!) {
    changeOrderStatus(input: $input) {
      _id
      orderStatus
      adminNotes
    }
  }
`;

export const ADD_ORDER_ADMIN_NOTES = gql`
  mutation AddOrderAdminNotes($input: AddOrderAdminNotesInput!) {
    addOrderAdminNotes(input: $input) {
      _id
      adminNotes
    }
  }
`;

// ============================================
// ARTICLE MANAGEMENT MUTATIONS
// ============================================

export const CREATE_ARTICLE = gql`
  mutation CreateArticle($input: CreateArticleInput!) {
    createArticle(input: $input) {
      _id
      title
      slug
      status
      createdAt
    }
  }
`;

export const UPDATE_ARTICLE = gql`
  mutation UpdateArticle($input: UpdateArticleInput!) {
    updateArticle(input: $input) {
      _id
      title
      slug
      status
      updatedAt
    }
  }
`;

export const PUBLISH_ARTICLE = gql`
  mutation PublishArticle($articleId: String!) {
    publishArticle(articleId: $articleId) {
      _id
      status
      publishedAt
    }
  }
`;

export const UNPUBLISH_ARTICLE = gql`
  mutation UnpublishArticle($articleId: String!) {
    unpublishArticle(articleId: $articleId) {
      _id
      status
    }
  }
`;

export const DELETE_ARTICLE = gql`
  mutation DeleteArticle($articleId: String!) {
    deleteArticle(articleId: $articleId) {
      success
    }
  }
`;

// ============================================
// DISPUTE MANAGEMENT MUTATIONS
// ============================================

export const CHANGE_DISPUTE_STATUS = gql`
  mutation ChangeDisputeStatus($input: ChangeDisputeStatusInput!) {
    changeDisputeStatus(input: $input) {
      _id
      disputeStatus
    }
  }
`;

export const ADD_DISPUTE_ADMIN_NOTES = gql`
  mutation AddDisputeAdminNotes($input: AddDisputeAdminNotesInput!) {
    addDisputeAdminNotes(input: $input) {
      _id
      adminNotes
    }
  }
`;

export const RESOLVE_DISPUTE = gql`
  mutation ResolveDispute($input: ResolveDisputeInput!) {
    resolveDispute(input: $input) {
      _id
      disputeStatus
      resolvedAt
    }
  }
`;

// ============================================
// ADMIN MANAGEMENT MUTATIONS
// ============================================

export const INVITE_ADMIN = gql`
  mutation InviteAdmin($input: InviteAdminInput!) {
    inviteAdmin(input: $input) {
      success
      invitationSent
      adminUserId
    }
  }
`;

export const REMOVE_ADMIN = gql`
  mutation RemoveAdmin($adminUserId: String!) {
    removeAdmin(adminUserId: $adminUserId) {
      success
    }
  }
`;

// ============================================
// PLATFORM SETTINGS MUTATIONS
// ============================================

export const UPDATE_PLATFORM_SETTINGS = gql`
  mutation UpdatePlatformSettings($input: UpdatePlatformSettingsInput!) {
    updatePlatformSettings(input: $input) {
      _id
      siteName
      supportEmail
      quoteRulesText
      termsLink
      privacyLink
      updatedAt
    }
  }
`;
