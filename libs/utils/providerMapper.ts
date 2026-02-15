/**
 * Provider Data Mapper
 * Maps backend provider data to frontend Provider format
 */

import { BackendProviderListItem, BackendProviderDetail, Provider } from '../types';

/**
 * Map backend provider list item to frontend Provider format
 */
export function mapBackendProviderToList(backend: BackendProviderListItem): Provider {
  return {
    id: backend._id,
    categoryId: mapCategoryFromBackend(backend.categoryId) as any, // Map backend enum to UI format
    subCategory: mapSubCategoryFromBackend(backend.subCategory), // Map backend enum to UI format
    serviceTitle: backend.serviceTitle,
    name: backend.orgName,
    description: backend.orgDescription,
    bio: backend.orgDescription, // Use description as bio if bio not available
    icon: null, // Will be set by UI component based on category
    avatar: backend.orgLogoImages?.[0] || backend.avatar || '',
    badges: mapBadges(backend),
    rating: backend.orgAverageRating || 0,
    reviewsCount: backend.reviewsCount || 0,
    projectsCompleted: backend.orgTotalProjects || 0,
    responseTime: backend.orgResponseTimeAvg || '',
    startingRate: backend.startingRate || 0,
    location: backend.location || backend.orgCountry || '',
    city: backend.orgCity,
    flag: backend.flag || '',
    expertise: backend.industries || [],
    caseStudies: [], // Not in backend response yet
    color: backend.color || 'bg-indigo-50 text-indigo-600',
    orgVerified: backend.orgVerified,
    orgTotalLikes: backend.orgTotalLikes,
    orgTotalViews: backend.orgTotalViews,
    industries: backend.industries,
  };
}

/**
 * Map backend provider detail to frontend Provider format
 */
export function mapBackendProviderDetail(backend: BackendProviderDetail): Provider {
  const base = mapBackendProviderToList(backend);
  
  return {
    ...base,
    bio: backend.bio || backend.orgDescription,
    establishmentYear: backend.establishmentYear,
    teamSize: backend.teamSize,
    minProjectSize: backend.minProjectSize,
    orgWebsiteUrl: backend.orgWebsiteUrl,
    expertise: backend.orgSkills || backend.industries || [],
    email: backend.email,
    phone: backend.phone,
    linkedIn: backend.linkedIn,
    twitter: backend.twitter,
    github: backend.github,
  };
}

/**
 * Map backend badges to frontend badges array
 */
function mapBadges(backend: BackendProviderListItem): string[] {
  const badges: string[] = [];
  
  if (backend.orgVerified) {
    badges.push('VERIFIED');
  }
  
  // Add other badges from backend.badges if they exist
  if (backend.badges && Array.isArray(backend.badges)) {
    badges.push(...backend.badges);
  }
  
  // Add TOP RATED if rating is high
  if (backend.orgAverageRating >= 4.8) {
    badges.push('TOP RATED');
  }
  
  return [...new Set(badges)]; // Remove duplicates
}

/**
 * Map sort option from UI to backend format
 */
export function mapSortOption(uiSort: string): string {
  const sortMap: Record<string, string> = {
    'Premium Partners': 'rating', // Default to rating for premium
    'Highest Rated': 'rating',
    'Cheapest': 'startingRate',
    'Newest': 'createdAt', // If backend supports this
    'Most Projects': 'projects',
    'Fastest Response': 'responseTime',
  };
  
  return sortMap[uiSort] || 'rating';
}

/**
 * Map UI category to backend category enum format
 * Backend uses: IT_AND_SOFTWARE, BUSINESS_SERVICES, MARKETING_AND_SALES, DESIGN_AND_CREATIVE
 */
export function mapCategoryToBackend(uiCategory: string): string {
  const categoryMap: Record<string, string> = {
    'it-software': 'IT_AND_SOFTWARE',
    'business': 'BUSINESS_SERVICES',
    'marketing-sales': 'MARKETING_AND_SALES',
    'design-creative': 'DESIGN_AND_CREATIVE',
  };
  
  return categoryMap[uiCategory] || uiCategory;
}

/**
 * Map backend category enum to UI category format
 */
export function mapCategoryFromBackend(backendCategory: string): string {
  const categoryMap: Record<string, string> = {
    'IT_AND_SOFTWARE': 'it-software',
    'BUSINESS_SERVICES': 'business',
    'MARKETING_AND_SALES': 'marketing-sales',
    'DESIGN_AND_CREATIVE': 'design-creative',
  };
  
  return categoryMap[backendCategory] || backendCategory;
}

/**
 * Map UI subcategory to backend subcategory enum format
 */
export function mapSubCategoryToBackend(uiSubCategory: string): string {
  const subCategoryMap: Record<string, string> = {
    // IT_AND_SOFTWARE
    'web-app-development': 'WEB_APP_DEVELOPMENT',
    'data-ai': 'DATA_AND_AI',
    'software-testing-qa': 'SOFTWARE_TESTING_AND_QA',
    'infrastructure-cloud': 'INFRASTRUCTURE_AND_CLOUD',
    
    // BUSINESS_SERVICES
    'admin-virtual-support': 'ADMIN_AND_VIRTUAL_SUPPORT',
    'financial-legal': 'FINANCIAL_AND_LEGAL',
    'strategy-consulting': 'STRATEGY_AND_CONSULTING',
    'hr-operations': 'HR_AND_OPERATIONS',
    
    // MARKETING_AND_SALES
    'digital-marketing': 'DIGITAL_MARKETING',
    'social-media-management': 'SOCIAL_MEDIA_MANAGEMENT',
    'content-copywriting': 'CONTENT_AND_COPYWRITING',
    'sales-lead-gen': 'SALES_AND_LEAD_GEN',
    
    // DESIGN_AND_CREATIVE
    'visual-identity-branding': 'VISUAL_IDENTITY_AND_BRANDING',
    'uiux-web-design': 'UI_UX_AND_WEB_DESIGN',
    'motion-video': 'MOTION_AND_VIDEO',
    'illustrative-print': 'ILLUSTRATION_AND_PRINT',
  };
  
  return subCategoryMap[uiSubCategory] || uiSubCategory;
}

/**
 * Map backend subcategory enum to UI subcategory format
 */
export function mapSubCategoryFromBackend(backendSubCategory: string): string {
  const subCategoryMap: Record<string, string> = {
    // IT_AND_SOFTWARE
    'WEB_APP_DEVELOPMENT': 'web-app-development',
    'DATA_AND_AI': 'data-ai',
    'SOFTWARE_TESTING_AND_QA': 'software-testing-qa',
    'INFRASTRUCTURE_AND_CLOUD': 'infrastructure-cloud',
    
    // BUSINESS_SERVICES
    'ADMIN_AND_VIRTUAL_SUPPORT': 'admin-virtual-support',
    'FINANCIAL_AND_LEGAL': 'financial-legal',
    'STRATEGY_AND_CONSULTING': 'strategy-consulting',
    'HR_AND_OPERATIONS': 'hr-operations',
    
    // MARKETING_AND_SALES
    'DIGITAL_MARKETING': 'digital-marketing',
    'SOCIAL_MEDIA_MANAGEMENT': 'social-media-management',
    'CONTENT_AND_COPYWRITING': 'content-copywriting',
    'SALES_AND_LEAD_GEN': 'sales-lead-gen',
    
    // DESIGN_AND_CREATIVE
    'VISUAL_IDENTITY_AND_BRANDING': 'visual-identity-branding',
    'UI_UX_AND_WEB_DESIGN': 'uiux-web-design',
    'MOTION_AND_VIDEO': 'motion-video',
    'ILLUSTRATION_AND_PRINT': 'illustrative-print',
  };
  
  return subCategoryMap[backendSubCategory] || backendSubCategory;
}
