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
