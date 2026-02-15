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
      teamSize
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

export const GET_PROVIDER_PORTFOLIO = gql`
  query GetProviderPortfolio($providerId: String!) {
    getProviderPortfolio(providerId: $providerId) {
      _id
      title
      description
      images
      metrics {
        label
        value
      }
      clientName
      completedAt
    }
  }
`;

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
