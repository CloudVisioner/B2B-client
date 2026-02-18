/**
 * Provider Data Mapper
 * Maps backend provider data to frontend Provider format
 */

import { BackendProviderListItem, BackendProviderDetail, Provider } from '../types';

/**
 * Safely normalize a value to an array of strings
 * Handles null, undefined, non-array values, and ensures all items are strings
 */
function normalizeToStringArray(value: any): string[] {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter(item => typeof item === 'string').map(item => String(item));
  }
  // If it's a single string, wrap it in an array
  if (typeof value === 'string') {
    return [value];
  }
  // For any other type, return empty array
  return [];
}

/**
 * Map backend provider list item to frontend Provider format
 */
export function mapBackendProviderToList(backend: BackendProviderListItem): Provider {
  // Handle subCategory as string or array
  // Flatten nested arrays and ensure we always get string[]
  let subCategories: string[] = [];
  if (Array.isArray(backend.subCategory)) {
    subCategories = backend.subCategory.flatMap(subCat => {
      const mapped = mapSubCategoryFromBackend(subCat);
      // If mapped is array, flatten it; if string, wrap in array
      return Array.isArray(mapped) ? mapped : [mapped];
    });
  } else {
    const mapped = mapSubCategoryFromBackend(backend.subCategory);
    subCategories = Array.isArray(mapped) ? mapped : [mapped];
  }
  
  // Handle categoryId as string or array - provider can belong to multiple categories
  const categoryIds = Array.isArray(backend.categoryId)
    ? backend.categoryId.map(mapCategoryFromBackend)
    : [mapCategoryFromBackend(backend.categoryId)];
  const mappedCategoryId = categoryIds.length === 1 ? categoryIds[0] : categoryIds; // Return string if single, array if multiple
  
  return {
    id: backend._id,
    categoryId: mappedCategoryId as any, // Map backend enum to UI format, can be string or array
    subCategory: subCategories.length === 1 ? subCategories[0] : subCategories, // Return string if single, array if multiple
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
    expertise: normalizeToStringArray(backend.industries),
    caseStudies: [], // Not in backend response yet
    color: backend.color || 'bg-indigo-50 text-indigo-600',
    orgVerified: backend.orgVerified,
    orgTotalLikes: backend.orgTotalLikes,
    orgTotalViews: backend.orgTotalViews,
    industries: normalizeToStringArray(backend.industries),
  };
}

/**
 * Map backend provider detail to frontend Provider format
 */
export function mapBackendProviderDetail(backend: BackendProviderDetail): Provider {
  const base = mapBackendProviderToList(backend);
  
  // Safely normalize orgSkills and industries to arrays
  const orgSkillsArray = normalizeToStringArray(backend.orgSkills);
  const industriesArray = normalizeToStringArray(backend.industries);
  
  return {
    ...base,
    bio: backend.bio || backend.orgDescription,
    establishmentYear: backend.establishmentYear,
    teamSize: backend.orgTeamSize || backend.teamSize, // Support both field names for backward compatibility
    minProjectSize: backend.minProjectSize,
    orgWebsiteUrl: backend.orgWebsiteUrl,
    expertise: orgSkillsArray.length > 0 ? orgSkillsArray : industriesArray,
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
    'Newest': 'createdAt',        // createdAt DESC — 80% buyer preference
    'Cheapest': 'startingRate',   // reqBudgetMin ASC — price-sensitive SMEs
    'Ending Soon': 'reqDeadline', // reqDeadline ASC — urgency driver
  };
  
  return sortMap[uiSort] || 'createdAt';
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
 * Handles both single string and array of strings
 */
export function mapSubCategoryToBackend(uiSubCategory: string | string[]): string | string[] {
  if (Array.isArray(uiSubCategory)) {
    return uiSubCategory.map(mapSingleSubCategoryToBackend);
  }
  return mapSingleSubCategoryToBackend(uiSubCategory);
}

/**
 * Map single UI subcategory to backend subcategory enum format
 */
function mapSingleSubCategoryToBackend(uiSubCategory: string): string {
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
 * Handles both single string and array of strings
 */
export function mapSubCategoryFromBackend(backendSubCategory: string | string[]): string | string[] {
  if (Array.isArray(backendSubCategory)) {
    return backendSubCategory.map(mapSingleSubCategoryFromBackend);
  }
  return mapSingleSubCategoryFromBackend(backendSubCategory);
}

/**
 * Map single backend subcategory enum to UI subcategory format
 */
function mapSingleSubCategoryFromBackend(backendSubCategory: string): string {
  // Handle case-insensitive matching and different formats
  const normalized = backendSubCategory.toUpperCase().trim();
  
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
  
  // Try exact match first
  if (subCategoryMap[normalized]) {
    return subCategoryMap[normalized];
  }
  
  // Try original format
  if (subCategoryMap[backendSubCategory]) {
    return subCategoryMap[backendSubCategory];
  }
  
  // If no mapping found, return as-is (might already be in UI format)
  return backendSubCategory;
}
