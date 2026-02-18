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
        orgName
        orgDescription
        orgAverageRating
        reviewsCount
        orgTotalProjects
        orgResponseTimeAvg
        startingRate
        orgCountry
        orgCity
        location
        flag
        categoryId
        subCategory
        serviceTitle
        avatar
        badges
        color
        orgVerified
        orgLogoImages
        orgTotalLikes
        orgTotalViews
        industries
        createdAt
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
      orgName
      orgDescription
      bio
      orgAverageRating
      reviewsCount
      orgTotalProjects
      orgResponseTimeAvg
      startingRate
      minProjectSize
      establishmentYear
      orgTeamSize
      industries
      orgCountry
      orgCity
      location
      flag
      categoryId
      subCategory
      serviceTitle
      avatar
      badges
      color
      orgVerified
      orgLogoImages
      orgTotalLikes
      orgTotalViews
      orgWebsiteUrl
      orgSkills
      email
      phone
      linkedIn
      twitter
      github
      createdAt
      updatedAt
      orgOwnerData {
        _id
        userNick
        userEmail
        userRole
      }
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
        orgName
        orgDescription
        orgAverageRating
        reviewsCount
        orgTotalProjects
        orgResponseTimeAvg
        startingRate
        orgCountry
        orgCity
        location
        flag
        categoryId
        subCategory
        serviceTitle
        avatar
        badges
        color
        orgVerified
        orgLogoImages
        orgTotalLikes
        orgTotalViews
        industries
        createdAt
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
 * Get Featured Testimonials for Landing Page
 * Public query - fetches highlighted testimonials for the homepage
 */
export const GET_FEATURED_TESTIMONIALS = gql`
  query GetFeaturedTestimonials($limit: Int) {
    getFeaturedTestimonials(limit: $limit) {
      _id
      text
      rating
      authorName
      authorRole
      authorCompany
      authorAvatar
      isVerified
      createdAt
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
      name
      serviceTitle
      rating
      startingRate
      avatar
      badges
      location
      city
      flag
      description
      reviewsCount
      projectsCompleted
      responseTime
      subCategory
      color
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
// BUYER ORGANIZATION QUERIES
// ============================================

/**
 * Get Buyer Organization
 * Fetches the organization details for the logged-in buyer
 * Note: Backend returns orgIndustry and orgDescription, but we map them to industry and description for frontend consistency
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
// SERVICE REQUEST QUERIES (Buyer)
// ============================================

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
