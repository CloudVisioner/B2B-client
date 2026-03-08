import { gql } from '@apollo/client';

// ============================================
// AUTHENTICATION
// ============================================

export const ADMIN_LOGIN = gql`
  mutation AdminLogin($input: AdminLoginInput!) {
    adminLogin(input: $input) {
      token
      user {
        _id
        userNick
        userEmail
        role
        status
        createdAt
      }
    }
  }
`;

export const ADMIN_SIGNUP = gql`
  mutation AdminSignup($input: AdminSignupInput!) {
    adminSignup(input: $input) {
      token
      user {
        _id
        userNick
        userEmail
        role
        status
        createdAt
      }
    }
  }
`;

// ============================================
// USER MANAGEMENT
// ============================================

export const GET_ALL_USERS = gql`
  query GetAllUsers($input: GetAllUsersInput!) {
    getAllUsers(input: $input) {
      list {
        _id
        userNick
        userEmail
        userPhone
        userDescription
        userRole
        userStatus
        userImage
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: String!) {
    getUserById(userId: $userId) {
      _id
      userNick
      userEmail
      userPhone
      userRole
      userStatus
      createdAt
      updatedAt
    }
  }
`;

// ============================================
// ORGANIZATION MANAGEMENT
// ============================================

export const GET_ALL_ORGANIZATIONS = gql`
  query GetAllOrganizations($input: GetAllOrganizationsInput!) {
    getAllOrganizations(input: $input) {
      list {
        _id
        organizationName
        organizationType
        organizationStatus
        organizationCountry
        organizationIndustry
        organizationDescription
        organizationImage
        organizationWebsite
        isFlagged
        createdAt
        updatedAt
        memberCount
        requestCount
        quoteCount
        orderCount
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_ORGANIZATION_BY_ID = gql`
  query GetOrganizationById($organizationId: String!) {
    getOrganizationById(organizationId: $organizationId) {
      _id
      organizationName
      organizationType
      organizationStatus
      organizationCountry
      organizationIndustry
      organizationDescription
      organizationImage
      organizationWebsite
      createdAt
      updatedAt
      memberCount
      requestCount
      quoteCount
      orderCount
    }
  }
`;

// ============================================
// SERVICE REQUEST MANAGEMENT
// ============================================

export const GET_ALL_SERVICE_REQUESTS = gql`
  query GetAllServiceRequests($input: GetAllServiceRequestsInput!) {
    getAllServiceRequests(input: $input) {
      list {
        _id
        reqTitle
        reqDescription
        reqStatus
        reqBuyerOrgId
        reqTotalQuotes
        reqNewQuotesCount
        reqDeadline
        isFlagged
        createdAt
        updatedAt
        reqBuyerOrgData {
          _id
          organizationName
          organizationImage
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_SERVICE_REQUEST_BY_ID = gql`
  query GetServiceRequestById($requestId: String!) {
    getServiceRequestById(requestId: $requestId) {
      _id
      reqTitle
      reqDescription
      reqStatus
      reqBuyerOrgId
      reqTotalQuotes
      reqNewQuotesCount
      reqDeadline
      createdAt
      updatedAt
      reqBuyerOrgData {
        _id
        organizationName
        organizationImage
      }
    }
  }
`;

// ============================================
// QUOTE MANAGEMENT
// ============================================

export const GET_ALL_QUOTES = gql`
  query GetAllQuotes($input: GetAllQuotesInput!) {
    getAllQuotes(input: $input) {
      list {
        _id
        quoteServiceReqId
        quoteProviderOrgId
        quoteProviderOrgData {
          _id
          organizationName
          organizationImage
        }
        quoteAmount
        quoteMessage
        quoteStatus
        isFlagged
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_QUOTE_BY_ID = gql`
  query GetQuoteById($quoteId: String!) {
    getQuoteById(quoteId: $quoteId) {
      _id
      quoteServiceReqId
      quoteProviderOrgId
      quoteProviderOrgData {
        _id
        organizationName
        organizationImage
      }
      quoteAmount
      quoteMessage
      quoteStatus
      createdAt
      updatedAt
    }
  }
`;

// ============================================
// ORDER MANAGEMENT
// ============================================

export const GET_ALL_ORDERS = gql`
  query GetAllOrders($input: GetAllOrdersInput!) {
    getAllOrders(input: $input) {
      list {
        _id
        orderQuoteId
        orderBuyerOrgId
        orderProviderOrgId
        orderBuyerOrgData {
          _id
          organizationName
        }
        orderProviderOrgData {
          _id
          organizationName
        }
        orderAmount
        orderStatus
        adminNotes
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_ORDER_BY_ID = gql`
  query GetOrderById($orderId: String!) {
    getOrderById(orderId: $orderId) {
      _id
      orderQuoteId
      orderBuyerOrgId
      orderProviderOrgId
      orderBuyerOrgData {
        _id
        organizationName
      }
      orderProviderOrgData {
        _id
        organizationName
      }
      orderAmount
      orderStatus
      adminNotes
      createdAt
      updatedAt
    }
  }
`;

// ============================================
// ARTICLE MANAGEMENT
// ============================================

export const GET_ALL_ARTICLES = gql`
  query GetAllArticles($input: GetAllArticlesInput!) {
    getAllArticles(input: $input) {
      list {
        _id
        title
        slug
        shortDescription
        body
        thumbnail
        tags
        status
        publishedAt
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_ARTICLE_BY_ID = gql`
  query GetArticleById($articleId: String!) {
    getArticleById(articleId: $articleId) {
      _id
      title
      slug
      shortDescription
      body
      thumbnail
      tags
      status
      publishedAt
      createdAt
      updatedAt
      createdBy
      updatedBy
    }
  }
`;

export const GET_ARTICLE_BY_SLUG = gql`
  query GetArticleBySlug($slug: String!) {
    getArticleBySlug(slug: $slug) {
      _id
      title
      slug
      shortDescription
      body
      thumbnail
      tags
      status
      publishedAt
      createdAt
      updatedAt
    }
  }
`;

// ============================================
// DISPUTE MANAGEMENT
// ============================================

export const GET_ALL_DISPUTES = gql`
  query GetAllDisputes($input: GetAllDisputesInput!) {
    getAllDisputes(input: $input) {
      list {
        _id
        disputeType
        disputeStatus
        orderId
        userId
        requestId
        quoteId
        title
        description
        reason
        amount
        buyerOrg
        providerOrg
        userName
        userEmail
        adminNotes
        createdAt
        updatedAt
        resolvedAt
        resolvedBy
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_DISPUTE_BY_ID = gql`
  query GetDisputeById($disputeId: String!) {
    getDisputeById(disputeId: $disputeId) {
      _id
      disputeType
      disputeStatus
      orderId
      userId
      requestId
      quoteId
      title
      description
      reason
      amount
      buyerOrg
      providerOrg
      userName
      userEmail
      adminNotes
      createdAt
      updatedAt
      resolvedAt
      resolvedBy
    }
  }
`;

// ============================================
// AUDIT LOGS
// ============================================

export const GET_AUDIT_LOGS = gql`
  query GetAuditLogs($input: GetAuditLogsInput!) {
    getAuditLogs(input: $input) {
      list {
        _id
        timestamp
        adminUserId
        adminUser {
          _id
          userNick
          userEmail
        }
        action
        targetType
        targetId
        targetName
        details
        metadata
        createdAt
      }
      metaCounter {
        total
      }
    }
  }
`;

// ============================================
// ADMIN MANAGEMENT
// ============================================

export const GET_ALL_ADMINS = gql`
  query GetAllAdmins($input: GetAllAdminsInput) {
    getAllAdmins(input: $input) {
      list {
        _id
        userNick
        userEmail
        role
        status
        createdAt
        lastLogin
      }
      metaCounter {
        total
      }
    }
  }
`;

// ============================================
// DASHBOARD STATISTICS
// ============================================

export const GET_DASHBOARD_STATISTICS = gql`
  query GetDashboardStatistics {
    getDashboardStatistics {
      totalBuyers {
        current
        previous
        change
      }
      totalProviders {
        current
        previous
        change
      }
      activeRequests {
        current
        previous
        change
      }
      openQuotes {
        current
        previous
        change
      }
      activeOrders {
        current
        previous
        change
      }
      recentServiceRequests {
        _id
        reqTitle
        reqStatus
        createdAt
      }
      recentOrders {
        _id
        orderAmount
        orderStatus
        createdAt
      }
      recentArticles {
        _id
        title
        status
        createdAt
      }
    }
  }
`;

// ============================================
// PLATFORM SETTINGS
// ============================================

export const GET_PLATFORM_SETTINGS = gql`
  query GetPlatformSettings {
    getPlatformSettings {
      _id
      siteName
      supportEmail
      quoteRulesText
      termsLink
      privacyLink
      updatedAt
      updatedBy
    }
  }
`;
