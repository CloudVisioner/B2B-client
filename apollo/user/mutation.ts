import { gql } from '@apollo/client';

// ============================================
// AUTHENTICATION MUTATIONS
// ============================================

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      _id
      userNick
      userEmail
      userRole
      userStatus
      userAuthType
      accessToken
      createdAt
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
        userNick
        userEmail
        userRole
        userStatus
        userAuthType
        createdAt
        userOrganization {
          _id
          organizationName
          organizationIndustry
          organizationLocation
          organizationDescription
          organizationWebsiteUrl
          organizationImage
        }
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
// USER PROFILE MUTATIONS
// ============================================

/**
 * Update My Profile
 * Updates the current user's profile information
 * Requires authentication - backend uses auth token to identify user
 */
export const UPDATE_MY_PROFILE = gql`
  mutation UpdateMyProfile($input: UserUpdate!) {
    updateUser(input: $input) {
      _id
      userNick
      userEmail
      userPhone
      userImage
      userDescription
      updatedAt
      accessToken
    }
  }
`;

/**
 * Change My Password
 * Changes the current user's password
 * Requires current password for verification
 */
export const CHANGE_MY_PASSWORD = gql`
  mutation ChangeMyPassword($input: ChangePasswordInput!) {
    changeMyPassword(input: $input)
  }
`;

/**
 * Upload Profile Image
 * Uploads a profile image for the current user
 */
export const UPLOAD_PROFILE_IMAGE = gql`
  mutation UploadProfileImage($file: Upload!, $target: String!) {
    imageUploader(file: $file, target: $target)
  }
`;

// ============================================
// ORGANIZATION MUTATIONS (Buyer)
// ============================================

export const CREATE_ORGANIZATION = gql`
mutation CreateOrUpdateBuyerOrganization($input: BuyerOrganizationInput!) {
  createOrUpdateBuyerOrganization(input: $input) {
    _id
    organizationName
    organizationIndustry
    organizationLocation
    organizationDescription
    organizationImage
    budgetRange
    createdAt
    updatedAt
  }
}
`;

export const UPDATE_ORGANIZATION = gql`
 mutation UpdateOrganization($input: OrganizationUpdate!) {
  updateOrganization(input: $input) {
    _id
    organizationName
    organizationIndustry
    organizationLocation
    organizationDescription
    organizationImage
    budgetRange
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
 * Uses backend field names: reqTitle, reqDescription, reqBuyerOrgId, etc.
 */
export const CREATE_SERVICE_REQUEST = gql`
  mutation CreateServiceRequest($input: ServiceRequestInput!) {
    createServiceRequest(input: $input) {
      _id
      reqTitle
      reqDescription
      reqBuyerOrgId
      reqCategory
      reqSubCategory
      reqBudgetRange
      reqDeadline
      reqUrgency
      reqSkillsNeeded
      reqStatus
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
 * Update Service Request
 * Updates a service request (editable only when status is DRAFT or OPEN)
 * Supports partial updates - only provided fields are updated
 */
export const UPDATE_SERVICE_REQUEST = gql`
  mutation UpdateServiceRequest($input: ServiceRequestUpdate!) {
    updateServiceRequest(input: $input) {
      _id
      reqTitle
      reqDescription
      reqBuyerOrgId
      reqCategory
      reqSubCategory
      reqBudgetRange
      reqDeadline
      reqUrgency
      reqSkillsNeeded
      reqAttachments
      reqStatus
      reqTotalLikes
      reqTotalViews
      reqTotalQuotes
      reqNewQuotesCount
      reqCreatedByUserId
      createdAt
      updatedAt
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
      reqStatus
      updatedAt
    }
  }
`;

// ============================================
// QUOTE MUTATIONS
// ============================================

/**
 * Create Quote (Provider)
 * Role: PROVIDER
 * Args: orgId, input: QuoteInput
 */
export const CREATE_QUOTE = gql`
  mutation CreateQuote($orgId: String!, $input: QuoteInput!) {
    createQuote(orgId: $orgId, input: $input) {
      _id
      quoteProviderOrgId
      quoteServiceReqId
      quoteCreatedByUserId
      quoteMessage
      quoteAmount
      quoteValidUntil
      quoteStatus
      quoteTotalLikes
      createdAt
      updatedAt
      quoteProviderOrgData {
        _id
        organizationName
      }
      quoteServiceReqData {
        _id
        reqTitle
        reqStatus
      }
    }
  }
`;

/**
 * Accept Quote (Buyer)
 * Role: BUYER
 */
export const ACCEPT_QUOTE = gql`
  mutation AcceptQuote($quoteId: String!) {
    acceptQuote(quoteId: $quoteId) {
      quote {
        _id
        quoteServiceReqId
        quoteProviderOrgId
        quoteMessage
        quoteAmount
        quoteStatus
        createdAt
      }
      serviceRequest {
        _id
        reqTitle
        reqStatus
        reqBuyerOrgId
        createdAt
      }
      order {
        _id
        orderBuyerOrgId
        orderProviderOrgId
        orderServiceReqId
        orderQuoteId
        orderAmount
        orderStatus
        createdAt
      }
    }
  }
`;

/**
 * Reject Quote (Buyer)
 * Role: BUYER
 */
export const REJECT_QUOTE = gql`
  mutation RejectQuote($quoteId: String!) {
    rejectQuote(quoteId: $quoteId) {
      _id
      quoteServiceReqId
      quoteProviderOrgId
      quoteMessage
      quoteAmount
      quoteStatus
      createdAt
      updatedAt
    }
  }
`;

/**
 * Update Quote (Provider)
 * Role: PROVIDER
 * Updates a PENDING quote created by the current provider org
 */
export const UPDATE_QUOTE = gql`
  mutation UpdateQuote($input: QuoteUpdate!) {
    updateQuote(input: $input) {
      _id
      quoteProviderOrgId
      quoteServiceReqId
      quoteCreatedByUserId
      quoteMessage
      quoteAmount
      quoteValidUntil
      quoteStatus
      quoteTotalLikes
      createdAt
      updatedAt
      quoteProviderOrgData {
        _id
        organizationName
      }
      quoteServiceReqData {
        _id
        reqTitle
        reqStatus
      }
    }
  }
`;

/**
 * Delete Quote (Provider)
 * Role: PROVIDER
 * Deletes a PENDING quote created by the current provider org
 */
export const DELETE_QUOTE = gql`
  mutation DeleteQuote($quoteId: String!) {
    deleteQuote(quoteId: $quoteId) {
      _id
      quoteStatus
    }
  }
`;

// ============================================
// PROVIDER ORGANIZATION MUTATIONS
// ============================================

/**
 * Create Provider Organization Profile
 * Role: PROVIDER only
 */
export const CREATE_PROVIDER_ORG_PROF = gql`
  mutation CreateProviderOrgProf($input: ProviderOrganizationInput!) {
    createProviderOrgProf(input: $input) {
      _id
      organizationName
      organizationEmail
      organizationCountry
      organizationDescription
      categoryId
      subCategory
      organizationImage
      minProjectSize
      createdAt
      deletedAt
    }
  }
`;

/**
 * Update Provider Organization Profile
 * Role: PROVIDER only
 */
export const UPDATE_PROVIDER_ORG_PROF = gql`
  mutation UpdateProviderOrgProf($input: UpdateProviderOrganizationInput!) {
    updateProviderOrgProf(input: $input) {
      _id
      organizationName
      organizationEmail
      organizationCountry
      organizationDescription
      categoryId
      subCategory
      organizationImage
      minProjectSize
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

/**
 * Update Provider User Profile
 * Role: PROVIDER only
 */
export const UPDATE_PROVIDER_PROFILE = gql`
  mutation UpdateProviderProfile($input: UpdateProviderProfileInput!) {
    updateProviderProfile(input: $input) {
      _id
      userNick
      userEmail
      userPhone
      userDescription
      userRole
      userStatus
      createdAt
      updatedAt
    }
  }
`;

// ============================================
// REVIEW MUTATIONS
// ============================================

/**
 * Create Review
 * Creates a review for a provider organization
 */
export const CREATE_REVIEW = gql`
  mutation CreateReview($input: ReviewInput!) {
    createReview(input: $input) {
      _id
      providerOrgId
      buyerId
      rating
      comment
      createdAt
      updatedAt
    }
  }
`;

/**
 * Update Review
 * Updates an existing review
 */
export const UPDATE_REVIEW = gql`
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
      _id
      providerOrgId
      buyerId
      rating
      comment
      createdAt
      updatedAt
    }
  }
`;

// ============================================
// RATING MUTATIONS
// ============================================

/**
 * Rate Organization
 * Allows users to rate a provider organization (1-5 stars)
 * Updates totalRatingValue, reviewsCount, and recalculates orgAverageRating
 */
export const RATE_ORGANIZATION = gql`
  mutation RateOrganization($input: RateOrganizationInput!) {
    rateOrganization(input: $input) {
      _id
      orgAverageRating
      reviewsCount
      totalRatingValue
    }
  }
`;
