import { BackendProviderListItem, BackendProviderDetail, Provider } from '../types';

function normalizeToStringArray(value: any): string[] {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter(item => typeof item === 'string').map(item => String(item));
  }
  if (typeof value === 'string') {
    return [value];
  }
  return [];
}

export function mapBackendProviderToList(backend: BackendProviderListItem): Provider {
  let subCategories: string[] = [];
  if (Array.isArray(backend.subCategory)) {
    subCategories = backend.subCategory.flatMap(subCat => {
      const mapped = mapSubCategoryFromBackend(subCat);
      return Array.isArray(mapped) ? mapped : [mapped];
    });
  } else {
    const mapped = mapSubCategoryFromBackend(backend.subCategory);
    subCategories = Array.isArray(mapped) ? mapped : [mapped];
  }
  
  const categoryIds = Array.isArray(backend.categoryId)
    ? backend.categoryId.map(mapCategoryFromBackend)
    : [mapCategoryFromBackend(backend.categoryId)];
  const mappedCategoryId = categoryIds.length === 1 ? categoryIds[0] : categoryIds;
  
  return {
    id: backend._id,
    categoryId: mappedCategoryId as any,
    subCategory: subCategories.length === 1 ? subCategories[0] : subCategories,
    serviceTitle: backend.serviceTitle,
    name: backend.organizationName || backend.orgName || '',
    description: backend.organizationDescription || (backend as any).orgDescription || '',
    bio: (backend as any).bio || backend.organizationDescription || (backend as any).orgDescription || '',
    icon: null,
    avatar: (backend.organizationImage && Array.isArray(backend.organizationImage) ? backend.organizationImage[0] : backend.organizationImage) || (backend.orgLogoImages?.[0]) || backend.avatar || '',
    badges: mapBadges(backend),
    rating: backend.orgAverageRating || 0,
    reviewsCount: backend.reviewsCount || 0,
    projectsCompleted: backend.orgTotalProjects || 0,
    responseTime: backend.orgResponseTimeAvg || '',
    startingRate: (() => {
      const raw = backend.organizationHourlyRate ?? backend.startingRate;
      if (raw == null || raw === '') return 0;
      const n = typeof raw === 'number' ? raw : parseFloat(String(raw).replace(/[^0-9.-]/g, ''));
      return Number.isFinite(n) ? n : 0;
    })(),
    budgetRange: backend.budgetRange != null ? (typeof backend.budgetRange === 'string' ? backend.budgetRange : String(backend.budgetRange)) : null,
    location: backend.organizationLocation || backend.location || backend.organizationCountry || '',
    city: (backend as any).orgCity || '',
    flag: backend.flag || '',
    expertise: normalizeToStringArray(backend.industries),
    caseStudies: [],
    color: backend.color || 'bg-indigo-50 text-indigo-600',
    orgVerified: backend.orgVerified,
    orgTotalLikes: backend.orgTotalLikes,
    orgTotalViews: backend.orgTotalViews,
    industries: normalizeToStringArray(backend.industries),
    createdAt:
      typeof backend.createdAt === 'string'
        ? backend.createdAt
        : backend.createdAt != null
          ? String(backend.createdAt)
          : '',
  };
}

export function mapBackendProviderDetail(backend: BackendProviderDetail): Provider {
  const base = mapBackendProviderToList(backend);
  
  // Support multiple possible backend field names
  const orgSkillsArray = normalizeToStringArray(
    (backend as any).orgSkills ?? (backend as any).organizationSpecialties
  );
  const industriesArray = normalizeToStringArray(backend.industries);
  
  return {
    ...base,
    bio: (backend as any).bio || backend.organizationDescription || (backend as any).orgDescription,
    establishmentYear: backend.establishmentYear,
    teamSize: (backend as any).teamSize ?? (backend as any).organizationTeamSize,
    minProjectSize: backend.minProjectSize,
    orgWebsiteUrl: (backend as any).orgWebsiteUrl ?? (backend as any).organizationWebsiteUrl,
    expertise: orgSkillsArray.length > 0 ? orgSkillsArray : industriesArray,
    email: (backend as any).email ?? (backend as any).organizationEmail,
    phone: (backend as any).phone ?? (backend as any).organizationPhoneNumber,
    linkedIn: (backend as any).linkedIn ?? (backend as any).socialLinks?.linkedIn,
    twitter: (backend as any).twitter ?? (backend as any).socialLinks?.twitter,
    github: (backend as any).github ?? (backend as any).socialLinks?.github,
  };
}

function mapBadges(backend: BackendProviderListItem): string[] {
  const badges: string[] = [];
  
  if (backend.orgVerified) {
    badges.push('VERIFIED');
  }
  
  if (backend.badges && Array.isArray(backend.badges)) {
    badges.push(...backend.badges);
  }
  
  if (backend.orgAverageRating != null && backend.orgAverageRating >= 4.8) {
    badges.push('TOP RATED');
  }
  
  return [...new Set(badges)];
}

export function mapSortOption(uiSort: string): string {
  const sortMap: Record<string, string> = {
    'Newest': 'createdAt',
    'Cheapest': 'organizationHourlyRate', // Updated to new field name
    'Highest Rated': 'orgAverageRating',
  };
  
  return sortMap[uiSort] || 'createdAt';
}

export function mapCategoryToBackend(uiCategory: string): string {
  const categoryMap: Record<string, string> = {
    'it-software': 'IT_AND_SOFTWARE',
    'business': 'BUSINESS_SERVICES',
    'marketing-sales': 'MARKETING_AND_SALES',
    'design-creative': 'DESIGN_AND_CREATIVE',
  };
  
  return categoryMap[uiCategory] || uiCategory;
}

export function mapCategoryFromBackend(backendCategory: string): string {
  const categoryMap: Record<string, string> = {
    'IT_AND_SOFTWARE': 'it-software',
    'BUSINESS_SERVICES': 'business',
    'MARKETING_AND_SALES': 'marketing-sales',
    'DESIGN_AND_CREATIVE': 'design-creative',
  };
  
  return categoryMap[backendCategory] || backendCategory;
}

export function mapSubCategoryToBackend(uiSubCategory: string | string[]): string | string[] {
  if (Array.isArray(uiSubCategory)) {
    return uiSubCategory.map(mapSingleSubCategoryToBackend);
  }
  return mapSingleSubCategoryToBackend(uiSubCategory);
}

function mapSingleSubCategoryToBackend(uiSubCategory: string): string {
  const subCategoryMap: Record<string, string> = {
    'web-app-development': 'WEB_APP_DEVELOPMENT',
    'data-ai': 'DATA_AND_AI',
    'software-testing-qa': 'SOFTWARE_TESTING_AND_QA',
    'infrastructure-cloud': 'INFRASTRUCTURE_AND_CLOUD',
    'admin-virtual-support': 'ADMIN_AND_VIRTUAL_SUPPORT',
    'financial-legal': 'FINANCIAL_AND_LEGAL',
    'strategy-consulting': 'STRATEGY_AND_CONSULTING',
    'hr-operations': 'HR_AND_OPERATIONS',
    'digital-marketing': 'DIGITAL_MARKETING',
    'social-media-management': 'SOCIAL_MEDIA_MANAGEMENT',
    'content-copywriting': 'CONTENT_AND_COPYWRITING',
    'sales-lead-gen': 'SALES_AND_LEAD_GEN',
    'visual-identity-branding': 'VISUAL_IDENTITY_AND_BRANDING',
    'uiux-web-design': 'UI_UX_AND_WEB_DESIGN',
    'motion-video': 'MOTION_AND_VIDEO',
    'illustrative-print': 'ILLUSTRATION_AND_PRINT',
  };
  
  return subCategoryMap[uiSubCategory] || uiSubCategory;
}

export function mapSubCategoryFromBackend(backendSubCategory: string | string[]): string | string[] {
  if (Array.isArray(backendSubCategory)) {
    return backendSubCategory.map(mapSingleSubCategoryFromBackend);
  }
  return mapSingleSubCategoryFromBackend(backendSubCategory);
}

function mapSingleSubCategoryFromBackend(backendSubCategory: string): string {
  const normalized = backendSubCategory.toUpperCase().trim();
  
  const subCategoryMap: Record<string, string> = {
    'WEB_APP_DEVELOPMENT': 'web-app-development',
    'DATA_AND_AI': 'data-ai',
    'SOFTWARE_TESTING_AND_QA': 'software-testing-qa',
    'INFRASTRUCTURE_AND_CLOUD': 'infrastructure-cloud',
    'ADMIN_AND_VIRTUAL_SUPPORT': 'admin-virtual-support',
    'FINANCIAL_AND_LEGAL': 'financial-legal',
    'STRATEGY_AND_CONSULTING': 'strategy-consulting',
    'HR_AND_OPERATIONS': 'hr-operations',
    'DIGITAL_MARKETING': 'digital-marketing',
    'SOCIAL_MEDIA_MANAGEMENT': 'social-media-management',
    'CONTENT_AND_COPYWRITING': 'content-copywriting',
    'SALES_AND_LEAD_GEN': 'sales-lead-gen',
    'VISUAL_IDENTITY_AND_BRANDING': 'visual-identity-branding',
    'UI_UX_AND_WEB_DESIGN': 'uiux-web-design',
    'MOTION_AND_VIDEO': 'motion-video',
    'ILLUSTRATION_AND_PRINT': 'illustrative-print',
  };
  
  if (subCategoryMap[normalized]) {
    return subCategoryMap[normalized];
  }
  
  if (subCategoryMap[backendSubCategory]) {
    return subCategoryMap[backendSubCategory];
  }
  
  return backendSubCategory;
}
