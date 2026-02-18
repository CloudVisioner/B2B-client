import { gql } from '@apollo/client';

// ============================================
// AUTHENTICATION MUTATIONS
// ============================================

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      _id
      userRole
      userStatus
      userAuthType
      userEmail
      userPhone
      userNick
      userImage
      userOrganizationId
      userCountry
      userCity
      userDescription
      userLanguages
      userTotalServiceRequests
      userTotalQuotes
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`;

export const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($token: String!) {
    googleLogIn(token: $token) {
      _id
      memberNick
      memberType
      memberStatus
      memberImage
      accessToken
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      accessToken
      user {
        _id
        userEmail
        userNick
        userRole
      }
    }
  }
`;

// ============================================
// PROVIDER ACTION MUTATIONS
// ============================================

export const REQUEST_QUOTE = gql`
  mutation RequestQuote($input: QuoteRequestInput!) {
    requestQuote(input: $input) {
      _id
      providerId
      buyerId
      status
      message
      createdAt
    }
  }
`;

export const BOOK_CONSULTATION = gql`
  mutation BookConsultation($input: ConsultationInput!) {
    bookConsultation(input: $input) {
      _id
      providerId
      buyerId
      scheduledAt
      status
    }
  }
`;

// ============================================
// LEGACY MUTATIONS (Keep for backward compatibility)
// ============================================

export const SIGN_UP = gql`
  mutation SignupLegacy($input: MemberInput!) {
    signup(input: $input) {
      _id
      memberNick
      accessToken
    }
  }
`;

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($input: MemberInput!) {
    updateMember(input: $input) {
      _id
      memberNick
    }
  }
`;

export const LIKE_TARGET_PROPERTY = gql`
  mutation LikeTargetProperty($input: String!) {
    likeTargetProperty(input: $input) {
      _id
    }
  }
`;

export const CREATE_PROPERTY = gql`
  mutation CreateProperty($input: PropertyInput!) {
    createProperty(input: $input) {
      _id
      propertyTitle
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      _id
      commentContent
    }
  }
`;

// ============================================
// ORGANIZATION MUTATIONS (Buyer)
// ============================================

/**
 * Create or Update Buyer Organization
 * Creates a new organization or updates existing one for the logged-in buyer
 * Note: Backend expects orgIndustry and orgDescription in input, returns same fields
 */
export const CREATE_OR_UPDATE_ORGANIZATION = gql`
  mutation CreateOrUpdateBuyerOrganization($input: BuyerOrganizationInput!) {
    createOrUpdateBuyerOrganization(input: $input) {
      _id
      orgName
      orgIndustry
      location
      orgDescription
      orgWebsiteUrl
      orgLogoImages
      orgVerified
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get Buyer Organization
 * Fetches the organization details for the logged-in buyer
 * Note: Backend returns orgIndustry and orgDescription
 */
export const GET_BUYER_ORGANIZATION = gql`
  query GetBuyerOrganization {
    getBuyerOrganization {
      _id
      orgName
      orgIndustry
      location
      orgDescription
      orgWebsiteUrl
      orgLogoImages
      orgVerified
      createdAt
      updatedAt
    }
  }
`;

// ============================================
// SERVICE REQUEST MUTATIONS (Buyer)
// ============================================

/**
 * Create Service Request (Post New Job)
 * Creates a new service request/job posting
 */
export const CREATE_SERVICE_REQUEST = gql`
  mutation CreateServiceRequest($input: ServiceRequestInput!) {
    createServiceRequest(input: $input) {
      _id
      title
      description
      category
      subCategory
      budgetMin
      budgetMax
      deadline
      urgency
      skills
      status
      organizationId
      buyerId
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get Buyer Service Requests (My Requests)
 * Fetches all service requests created by the logged-in buyer
 */
export const GET_BUYER_SERVICE_REQUESTS = gql`
  query GetBuyerServiceRequests($input: ServiceRequestFilterInput) {
    getBuyerServiceRequests(input: $input) {
      list {
        _id
        title
        description
        category
        subCategory
        budgetMin
        budgetMax
        deadline
        urgency
        skills
        status
        quotesCount
        newQuotesCount
        organizationId
        buyerId
        providerId
        provider {
          _id
          orgName
          orgAverageRating
          reviewsCount
          avatar
        }
        phase
        createdAt
        updatedAt
      }
      metaCounter {
        total
        open
        inProgress
        closed
        draft
      }
    }
  }
`;

/**
 * Update Service Request Status
 * Updates the status of a service request (e.g., publish draft, close request)
 */
export const UPDATE_SERVICE_REQUEST_STATUS = gql`
  mutation UpdateServiceRequestStatus($requestId: String!, $status: ServiceRequestStatus!) {
    updateServiceRequestStatus(requestId: $requestId, status: $status) {
      _id
      status
      updatedAt
    }
  }
`;
