import { gql } from '@apollo/client';

// ============================================
// PROVIDER QUERIES
// ============================================

/**
 * Get Providers by Category (with filters)
 * Public query - no authentication required
 */
export const GET_PROVIDERS_BY_CATEGORY = gql`
  query GetProvidersByCategory($input: ProviderCategoryInput!) {
    getProvidersByCategory(input: $input) {
      list {
        _id
        organizationName
        organizationEmail
        organizationCountry
        organizationDescription
        categoryId
        subCategory
        organizationImage
        organizationHourlyRate
        orgAverageRating
        reviewsCount
        budgetRange
        createdAt
        deletedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

/**
 * Get Provider Detail
 * Public query - email/phone only shown if user is logged in (pass auth token)
 */
export const GET_PROVIDER_DETAIL = gql`
  query GetProviderDetail($orgId: String!) {
    getProviderDetail(orgId: $orgId) {
      _id
      organizationName
      organizationDescription
      organizationImage
      avatar
      organizationEmail
      organizationPhoneNumber
      organizationWebsiteUrl
      organizationCountry
      organizationLocation
      flag
      
      # Rating & Social Proof
      orgAverageRating
      reviewsCount
      myRating
      orgTotalLikes
      orgTotalViews
      orgTotalProjects
      orgVerified
      
      # Budget & Pricing
      budgetRange
      organizationHourlyRate
      minProjectSize
      
      # Services & Categorization
      categoryId
      subCategory
      serviceTitle
      organizationSpecialties
      industries
      orgSkills
      
      # Additional Profile Info
      bio
      organizationIndustry
      establishmentYear
      organizationTeamSize
      badges
      color
      
      # Social Links
      linkedIn
      twitter
      github
      
      # Owner Information
      orgOwnerUserId
      orgOwnerData {
        _id
        userNick
        userEmail
        userImage
      }
      
      # Metadata
      organizationType
      organizationStatus
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get Provider Detail (Fallback - without orgAverageRating)
 * Used as fallback when orgAverageRating is null but schema requires non-null
 */
export const GET_PROVIDER_DETAIL_FALLBACK = gql`
  query GetProviderDetailFallback($orgId: String!) {
    getProviderDetail(orgId: $orgId) {
      _id
      organizationName
      organizationDescription
      organizationImage
      avatar
      organizationEmail
      organizationPhoneNumber
      organizationWebsiteUrl
      organizationCountry
      organizationLocation
      flag
      
      # Rating & Social Proof (orgAverageRating omitted - will default to 0 in mapper)
      reviewsCount
      myRating
      orgTotalLikes
      orgTotalViews
      orgTotalProjects
      orgVerified
      
      # Budget & Pricing
      budgetRange
      organizationHourlyRate
      minProjectSize
      
      # Services & Categorization
      categoryId
      subCategory
      serviceTitle
      organizationSpecialties
      industries
      orgSkills
      
      # Additional Profile Info
      bio
      organizationIndustry
      establishmentYear
      organizationTeamSize
      badges
      color
      
      # Social Links
      linkedIn
      twitter
      github
      
      # Owner Information
      orgOwnerUserId
      orgOwnerData {
        _id
        userNick
        userEmail
        userImage
      }
      
      # Metadata
      organizationType
      organizationStatus
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROVIDER_DETAIL_WITH_OWNER = gql`
  query ProviderDetailWithOwner($orgId: String!) {
    getProviderDetail(orgId: $orgId) {
      _id
      organizationName
      organizationCountry
      organizationDescription
      organizationImage
      categoryId
      subCategory
      orgOwnerData {
        _id
        userNick
        userEmail
        userPhone
        userImage
        userRole
        userStatus
      }
      createdAt
      deletedAt
    }
  }
`;

/**
 * Get Providers Sorted
 * Public query - supports sorting by rating, projects, responseTime, startingRate
 */
export const GET_PROVIDERS_SORTED = gql`
  query GetProvidersSorted($input: ProviderSortInput!) {
    getProvidersSorted(input: $input) {
      list {
        _id
        organizationName
        organizationEmail
        organizationCountry
        organizationDescription
        categoryId
        subCategory
        organizationImage
        organizationHourlyRate
        orgAverageRating
        reviewsCount
        budgetRange
        createdAt
        deletedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

// ============================================
// LEGACY QUERIES (Keep for backward compatibility)
// ============================================

/**
 * @deprecated Use GET_PROVIDERS_BY_CATEGORY or GET_PROVIDERS_SORTED instead
 */
export const GET_PROVIDERS = gql`
  query GetProviders($input: ProviderSearchInput!) {
    getProviders(input: $input) {
      _id
      categoryId
      subCategory
      serviceTitle
      name
      description
      bio
      avatar
      badges
      rating
      reviewsCount
      projectsCompleted
      responseTime
      startingRate
      location
      city
      flag
      expertise
      caseStudies {
        title
        metricLabel
        metricValue
        image
      }
      color
    }
  }
`;

/**
 * @deprecated Use GET_PROVIDER_DETAIL instead
 */
export const GET_PROVIDER = gql`
  query GetProvider($id: String!) {
    getProvider(id: $id) {
      _id
      categoryId
      subCategory
      serviceTitle
      name
      description
      bio
      avatar
      badges
      rating
      reviewsCount
      projectsCompleted
      responseTime
      startingRate
      location
      city
      flag
      expertise
      caseStudies {
        title
        metricLabel
        metricValue
        image
      }
      establishmentYear
      teamSize
      industries
      minProjectSize
      color
    }
  }
`;

// ============================================
// PORTFOLIO QUERIES
// ============================================

/**
 * Get Provider Portfolio / Case Studies
 * Public query - fetches portfolio items for a provider's profile page
 */
export const GET_PROVIDER_PORTFOLIO = gql`
  query GetProviderPortfolio($providerId: String!) {
    getProviderPortfolio(providerId: $providerId) {
      _id
      title
      description
      images
      coverImage
      metrics {
        label
        value
      }
      tags
      clientName
      clientLogo
      industry
      projectUrl
      completedAt
      createdAt
    }
  }
`;

// ============================================
// TESTIMONIAL QUERIES
// ============================================

/**
 * Get Provider Testimonials
 * Public query - fetches client testimonials for a provider
 */
export const GET_PROVIDER_TESTIMONIALS = gql`
  query GetProviderTestimonials($input: TestimonialInput!) {
    getProviderTestimonials(input: $input) {
      list {
        _id
        providerId
        text
        rating
        authorName
        authorRole
        authorCompany
        authorAvatar
        projectTitle
        isVerified
        createdAt
      }
      metaCounter {
        total
      }
    }
  }
`;

// ============================================
// LANDING PAGE / STATISTICS QUERIES
// ============================================

/**
 * Get Landing Page Statistics
 * Public query - fetches dynamic stats for landing page (About Us section)
 * Returns: total providers, total projects completed, industries served count, etc.
 */
export const GET_LANDING_STATISTICS = gql`
  query GetLandingStatistics {
    getLandingStatistics {
      totalProviders
      totalProjectsCompleted
      totalIndustriesServed
      totalClientsServed
      totalCountriesReached
      averageSatisfactionRate
      totalActiveServiceRequests
      platformEstablishedYear
    }
  }
`;


/**
 * Get Featured Portfolios for Landing Page
 * Public query - fetches highlighted portfolio items/case studies for the homepage
 */
export const GET_FEATURED_PORTFOLIOS = gql`
  query GetFeaturedPortfolios($limit: Int) {
    getFeaturedPortfolios(limit: $limit) {
      _id
      title
      description
      coverImage
      images
      metrics {
        label
        value
      }
      tags
      clientName
      clientLogo
      industry
      providerId
      providerName
      providerAvatar
      completedAt
      createdAt
    }
  }
`;

// ============================================
// CONTACT & RECOMMENDATION QUERIES
// ============================================

export const GET_PROVIDER_CONTACT = gql`
  query GetProviderContact($providerId: String!) {
    getProviderContact(providerId: $providerId) {
      email
      phone
      website
      socialLinks {
        linkedin
        twitter
        github
      }
    }
  }
`;

export const GET_RECOMMENDED_PROVIDERS = gql`
  query GetRecommendedProviders($providerId: String!, $categoryId: String!) {
    getRecommendedProviders(providerId: $providerId, categoryId: $categoryId) {
      _id
      organizationName
      serviceTitle
      orgAverageRating
      organizationHourlyRate
      avatar
      badges
      organizationLocation
      flag
      organizationDescription
      reviewsCount
      orgTotalProjects
      orgResponseTimeAvg
      subCategory
      color
    }
  }
`;

// ============================================
// QUOTE QUERIES
// ============================================

/**
 * Get Quote by ID (to get requestId from quoteId)
 */
export const GET_QUOTE_BY_ID = gql`
  query GetQuoteById($quoteId: String!) {
    getQuoteById(quoteId: $quoteId) {
      _id
      quoteServiceReqId
      quoteMessage
      quoteAmount
      quoteStatus
      quoteValidUntil
      createdAt
      quoteServiceReqData {
        _id
        reqTitle
        reqStatus
      }
      quoteProviderOrgData {
        _id
        organizationName
      }
      quoteCreatedByUserData {
        _id
        userNick
        userEmail
      }
    }
  }
`;

/**
 * Get Quotes by Service Request (Buyer/Provider views)
 */
export const GET_QUOTES_BY_REQUEST = gql`
  query QuotesByRequest($requestId: String!) {
    getQuotesByRequest(requestId: $requestId) {
      _id
      quoteMessage
      quoteAmount
      quoteStatus
      quoteValidUntil
      createdAt
      quoteProviderOrgData {
        _id
        organizationName
      }
      quoteCreatedByUserData {
        _id
        userNick
        userEmail
      }
    }
  }
`;

/**
 * Get Quotes by Provider Organization
 */
export const GET_QUOTES_BY_ORGANIZATION = gql`
  query QuotesByOrganization($orgId: String!) {
    getQuotesByOrganization(orgId: $orgId) {
      _id
      quoteMessage
      quoteAmount
      quoteStatus
      quoteValidUntil
      createdAt
      updatedAt
      quoteServiceReqData {
        _id
        reqTitle
        reqStatus
        reqCategory
        reqSubCategory
        reqBudgetRange
        reqDeadline
      }
      quoteProviderOrgData {
        _id
        organizationName
      }
    }
  }
`;

// ============================================
// LEGACY QUERIES (Keep for backward compatibility)
// ============================================

export const GET_AGENTS = gql`
  query GetAgents($input: AgentsInquiry!) {
    getAgents(input: $input) {
      list {
        _id
        memberNick
        memberImage
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_PROPERTIES = gql`
  query GetProperties($input: PropertiesInquiry!) {
    getProperties(input: $input) {
      list {
        _id
        propertyTitle
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_MEMBER = gql`
  query GetMember($input: String!) {
    getMember(input: $input) {
      _id
      memberNick
      memberImage
    }
  }
`;

// ============================================
// USER PROFILE QUERIES
// ============================================

/**
 * Get My Profile
 * Fetches the current user's profile information
 * Requires authentication - uses authenticated user's ID automatically
 */
export const GET_MY_PROFILE = gql`
  query GetMyProfile($userId: String!) {
    getUser(userId: $userId) {
      _id
      userNick
      userEmail
      userPhone
      userImage
      userDescription
      createdAt
      updatedAt
    }
  }
`;

/**
 * Current session user (Bearer) — use for PROVIDER/BUYER self profile; no userId variable.
 * Prefer this over getUser(userId) when the schema exposes getMyProfile.
 */
export const GET_MY_PROFILE_SELF = gql`
  query GetMyProfileSelf {
    getMyProfile {
      _id
      userNick
      userEmail
      userPhone
      userImage
      userDescription
      userRole
      createdAt
      updatedAt
    }
  }
`;

// ============================================
// BUYER ORGANIZATION QUERIES
// ============================================

/**
 * Get Buyer Organization
 * Fetches the organization details for the logged-in buyer
 * ⚠️ IMPORTANT: Uses NEW field names (organizationName, organizationIndustry, etc.)
 * DO NOT use old field names (orgName, orgIndustry, etc.) - they no longer exist!
 * 
 * Fields Returned:
 * - _id - Organization ID
 * - organizationType - Always "BUYER" (✅ CORRECT - not orgType)
 * - organizationStatus - "ACTIVE" | "INACTIVE" (✅ CORRECT - not orgStatus)
 * - orgOwnerUserId - User ID who owns this organization
 * - organizationName - Company Name (Required)
 * - organizationIndustry - Industry (Required)
 * - organizationCountry - Country / location (Required)
 * - organizationDescription - Description (Required)
 * - organizationImage - Company Logo/Image (Optional)
 * - createdAt - Created timestamp
 * - updatedAt - Updated timestamp
 */
export const GET_BUYER_ORGANIZATION = gql`
  query GetBuyerOrganization {
    getBuyerOrganization {
      _id
      organizationType
      organizationStatus
      orgOwnerUserId
      organizationName
      organizationIndustry
      organizationCountry
      organizationLocation
      organizationDescription
      organizationImage
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get Provider Organization
 * Fetches the provider organization for the logged-in provider
 */
export const GET_PROVIDER_ORGANIZATION = gql`
  query GetProviderOrganization {
    getProviderOrganization {
      _id
      organizationType
      organizationStatus
      organizationName
      organizationDescription
      organizationContactEmail
      organizationCountry
      organizationImage
      # Backend Organization type exposes categoryId / subCategory (not organizationCategories)
      categoryId
      subCategory
      orgOwnerUserId
      budgetRange
      organizationHourlyRate
      minProjectSize
      orgAverageRating
      reviewsCount
      totalRatingValue
      createdAt
      updatedAt
    }
  }
`;

// ============================================
// SERVICE REQUEST QUERIES (Buyer)
// ============================================

/**
 * Get Buyer Service Requests (My Requests)
 * Fetches all service requests created by the logged-in buyer
 * Uses backend field names: reqTitle, reqStatus, reqBudgetRange, etc.
 */
export const GET_BUYER_SERVICE_REQUESTS = gql`
  query GetBuyerServiceRequests($input: BuyerServiceRequestFilterInput) {
    getBuyerServiceRequests(input: $input) {
      list {
        _id
        reqTitle
        reqDescription
        reqStatus
        reqBudgetRange
        reqDeadline
        reqUrgency
        reqTotalQuotes
        reqNewQuotesCount
        reqCategory
        reqSubCategory
        reqSkillsNeeded
        reqBuyerOrgId
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
 * Get Service Requests (Browse - for Providers to see buyer requests)
 * Fetches all service requests that providers can browse and quote on
 * Filter by status (OPEN, ACTIVE, etc.), category, search keywords
 * Supports pagination
 * Returns buyer organization data
 * 
 * ✅ CORRECT Field Names:
 * - reqBuyerOrgData (not buyerOrg)
 * - reqCreatedByUserData (not createdBy)
 * - organizationType (not orgType)
 * - organizationStatus (not orgStatus)
 */
export const GET_SERVICE_REQUESTS = gql`
  query GetServiceRequests($input: ServiceRequestInquiry!) {
    getServiceRequests(input: $input) {
      list {
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
        reqBuyerOrgData {
          _id
          organizationName
          organizationIndustry
          organizationCountry
          organizationDescription
          organizationImage
          organizationContactEmail
          organizationType
          organizationStatus
        }
        reqCreatedByUserData {
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
 * Get Single Service Request Details
 * Fetches full details of a specific service request
 * Includes buyer organization details, creator info, and all quotes
 * 
 * ✅ CORRECT Field Names:
 * - reqBuyerOrgData (not buyerOrg)
 * - reqCreatedByUserData (not createdBy)
 */
export const GET_SERVICE_REQUEST = gql`
  query GetServiceRequest($requestId: String!) {
    getServiceRequest(requestId: $requestId) {
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
      reqBuyerOrgData {
        _id
        organizationName
        organizationIndustry
        organizationCountry
        organizationDescription
        organizationImage
        organizationContactEmail
        organizationType
        organizationStatus
      }
      reqCreatedByUserData {
        _id
        userNick
        userEmail
        userPhone
      }
      quotes {
        _id
        quotePrice
        quoteDescription
        quoteStatus
        createdAt
      }
    }
  }
`;

// ============================================
// REVIEW QUERIES
// ============================================

/**
 * Get Reviews by Provider Organization
 * Fetches all reviews for a provider organization
 */
export const GET_REVIEWS_BY_PROVIDER = gql`
  query GetReviewsByProvider($input: ReviewFilterInput!) {
    getReviewsByProvider(input: $input) {
      list {
        _id
        providerOrgId
        buyerId
        rating
        comment
        buyerData {
          _id
          userNick
          userEmail
          userImage
        }
        createdAt
        updatedAt
      }
      metaCounter {
        total
        averageRating
      }
    }
  }
`;

/**
 * Get My Reviews
 * Fetches reviews created by the current user
 */
export const GET_MY_REVIEWS = gql`
  query GetMyReviews($input: ReviewFilterInput) {
    getMyReviews(input: $input) {
      list {
        _id
        providerOrgId
        buyerId
        rating
        comment
        providerOrgData {
          _id
          organizationName
          organizationImage
        }
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;
