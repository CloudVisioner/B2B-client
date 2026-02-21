/* ═══════════════════════════════════════════════════════════
   Provider Organization API Handler
   Complete API implementation with fetch
   ═══════════════════════════════════════════════════════════ */

import { getJwtToken } from '../../libs/auth';

const API_URL = process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:3010/graphql';

/* ═══════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════ */

export enum Category {
  IT_AND_SOFTWARE = 'IT_AND_SOFTWARE',
  BUSINESS_SERVICES = 'BUSINESS_SERVICES',
  MARKETING_AND_SALES = 'MARKETING_AND_SALES',
  DESIGN_AND_CREATIVE = 'DESIGN_AND_CREATIVE',
}

export enum SubCategory {
  // IT_AND_SOFTWARE
  WEB_APP_DEVELOPMENT = 'WEB_APP_DEVELOPMENT',
  DATA_AND_AI = 'DATA_AND_AI',
  SOFTWARE_TESTING_AND_QA = 'SOFTWARE_TESTING_AND_QA',
  INFRASTRUCTURE_AND_CLOUD = 'INFRASTRUCTURE_AND_CLOUD',
  // BUSINESS_SERVICES
  ADMIN_AND_VIRTUAL_SUPPORT = 'ADMIN_AND_VIRTUAL_SUPPORT',
  FINANCIAL_AND_LEGAL = 'FINANCIAL_AND_LEGAL',
  STRATEGY_AND_CONSULTING = 'STRATEGY_AND_CONSULTING',
  HR_AND_OPERATIONS = 'HR_AND_OPERATIONS',
  // MARKETING_AND_SALES
  DIGITAL_MARKETING = 'DIGITAL_MARKETING',
  SOCIAL_MEDIA_MANAGEMENT = 'SOCIAL_MEDIA_MANAGEMENT',
  CONTENT_AND_COPYWRITING = 'CONTENT_AND_COPYWRITING',
  SALES_AND_LEAD_GEN = 'SALES_AND_LEAD_GEN',
  // DESIGN_AND_CREATIVE
  VISUAL_IDENTITY_AND_BRANDING = 'VISUAL_IDENTITY_AND_BRANDING',
  UI_UX_AND_WEB_DESIGN = 'UI_UX_AND_WEB_DESIGN',
  MOTION_AND_VIDEO = 'MOTION_AND_VIDEO',
  ILLUSTRATION_AND_PRINT = 'ILLUSTRATION_AND_PRINT',
}

export interface ProviderOrganizationInput {
  organizationName: string; // REQUIRED
  organizationDescription?: string;
  organizationContactEmail?: string;
  organizationCountry?: string;
  organizationCategories?: Category[];
  organizationSubCategories?: SubCategory[];
  organizationImage?: string;
}

export interface UpdateProviderOrganizationInput {
  organizationId: string; // REQUIRED
  organizationName?: string;
  organizationDescription?: string;
  organizationContactEmail?: string;
  organizationCountry?: string;
  organizationCategories?: Category[];
  organizationSubCategories?: SubCategory[];
  organizationImage?: string;
}

export interface UpdateProviderProfileInput {
  providerFullName?: string;
  providerDisplayName?: string;
  providerEmail?: string;
  providerPhone?: string;
}

export interface ProviderOrganization {
  _id: string;
  organizationType: string;
  organizationStatus: string;
  organizationName: string;
  organizationDescription?: string;
  organizationContactEmail?: string;
  organizationCountry?: string;
  organizationImage?: string;
  categoryId?: Category[] | Category | null;
  subCategory?: SubCategory[] | SubCategory | null;
  orgOwnerUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderProfile {
  _id: string;
  userNick: string;
  userEmail?: string;
  userPhone?: string;
  userImage?: string;
  userDescription?: string;
  userRole: string;
  userStatus: string;
  userAuthType?: string;
  userTotalServiceRequests?: number;
  userTotalQuotes?: number;
  userOrgCount?: number;
  createdAt: string;
  updatedAt: string;
}

/* ═══════════════════════════════════════════════════════════
   GraphQL Queries & Mutations
   ═══════════════════════════════════════════════════════════ */

const GET_PROVIDER_ORGANIZATION_QUERY = `
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
      categoryId
      subCategory
      orgOwnerUserId
      createdAt
      updatedAt
    }
  }
`;

const CREATE_PROVIDER_ORG_PROF_MUTATION = `
  mutation CreateProviderOrgProf($input: ProviderOrganizationInput!) {
    createProviderOrgProf(input: $input) {
      _id
      organizationType
      organizationStatus
      organizationName
      organizationDescription
      organizationContactEmail
      organizationCountry
      organizationImage
      categoryId
      subCategory
      orgOwnerUserId
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_PROVIDER_ORG_PROF_MUTATION = `
  mutation UpdateProviderOrgProf($input: UpdateProviderOrganizationInput!) {
    updateProviderOrgProf(input: $input) {
      _id
      organizationType
      organizationStatus
      organizationName
      organizationDescription
      organizationContactEmail
      organizationCountry
      organizationImage
      categoryId
      subCategory
      orgOwnerUserId
      createdAt
      updatedAt
    }
  }
`;

const GET_MY_PROFILE_QUERY = `
  query GetMyProfile {
    getMyProfile {
      _id
      userNick
      userEmail
      userPhone
      userImage
      userDescription
      userRole
      userStatus
      userAuthType
      userTotalServiceRequests
      userTotalQuotes
      userOrgCount
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_PROVIDER_PROFILE_MUTATION = `
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

/* ═══════════════════════════════════════════════════════════
   Helper: GraphQL Fetch
   ═══════════════════════════════════════════════════════════ */

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; extensions?: any }>;
}

async function graphqlFetch<T>(query: string, variables?: any): Promise<T> {
  const token = getJwtToken();
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors && result.errors.length > 0) {
    const error = result.errors[0];
    throw new Error(error.message || 'GraphQL error occurred');
  }

  if (!result.data) {
    throw new Error('No data returned from GraphQL query');
  }

  return result.data;
}

/* ═══════════════════════════════════════════════════════════
   API Functions
   ═══════════════════════════════════════════════════════════ */

/**
 * 1. GET PROVIDER ORGANIZATION
 * Returns provider's organization data or null if not exists
 */
export async function getProviderOrganization(): Promise<ProviderOrganization | null> {
  try {
    const data = await graphqlFetch<{ getProviderOrganization: ProviderOrganization | null }>(
      GET_PROVIDER_ORGANIZATION_QUERY
    );
    return data.getProviderOrganization;
  } catch (error: any) {
    console.error('Error fetching provider organization:', error);
    throw error;
  }
}

/**
 * 2. CREATE PROVIDER ORGANIZATION PROFILE
 * Creates a new provider organization
 */
export async function createProviderOrganization(
  input: ProviderOrganizationInput
): Promise<ProviderOrganization> {
  try {
    if (!input.organizationName || !input.organizationName.trim()) {
      throw new Error('Organization name is required');
    }

    const data = await graphqlFetch<{ createProviderOrgProf: ProviderOrganization }>(
      CREATE_PROVIDER_ORG_PROF_MUTATION,
      { input }
    );
    return data.createProviderOrgProf;
  } catch (error: any) {
    console.error('Error creating provider organization:', error);
    throw error;
  }
}

/**
 * 3. UPDATE PROVIDER ORGANIZATION PROFILE
 * Updates an existing provider organization
 */
export async function updateProviderOrganization(
  input: UpdateProviderOrganizationInput
): Promise<ProviderOrganization> {
  try {
    if (!input.organizationId) {
      throw new Error('Organization ID is required');
    }

    const data = await graphqlFetch<{ updateProviderOrgProf: ProviderOrganization }>(
      UPDATE_PROVIDER_ORG_PROF_MUTATION,
      { input }
    );
    return data.updateProviderOrgProf;
  } catch (error: any) {
    console.error('Error updating provider organization:', error);
    throw error;
  }
}

/**
 * 4. GET MY PROFILE
 * Returns provider's user profile
 */
export async function getMyProfile(): Promise<ProviderProfile> {
  try {
    const data = await graphqlFetch<{ getMyProfile: ProviderProfile }>(
      GET_MY_PROFILE_QUERY
    );
    return data.getMyProfile;
  } catch (error: any) {
    console.error('Error fetching provider profile:', error);
    throw error;
  }
}

/**
 * 5. UPDATE PROVIDER PROFILE
 * Updates provider's user profile
 */
export async function updateProviderProfile(
  input: UpdateProviderProfileInput
): Promise<ProviderProfile> {
  try {
    const data = await graphqlFetch<{ updateProviderProfile: ProviderProfile }>(
      UPDATE_PROVIDER_PROFILE_MUTATION,
      { input }
    );
    return data.updateProviderProfile;
  } catch (error: any) {
    console.error('Error updating provider profile:', error);
    throw error;
  }
}
