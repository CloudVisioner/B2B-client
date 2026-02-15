/**
 * Category & SubCategory Enums
 * Matches backend enum system
 */

// ============================================
// MAIN CATEGORIES
// ============================================

export enum CategoryEnum {
  IT_AND_SOFTWARE = 'IT_AND_SOFTWARE',
  BUSINESS_SERVICES = 'BUSINESS_SERVICES',
  MARKETING_AND_SALES = 'MARKETING_AND_SALES',
  DESIGN_AND_CREATIVE = 'DESIGN_AND_CREATIVE',
}

// ============================================
// SUB CATEGORIES - IT_AND_SOFTWARE
// ============================================

export enum ITSoftwareSubCategoryEnum {
  WEB_APP_DEVELOPMENT = 'WEB_APP_DEVELOPMENT',
  DATA_AND_AI = 'DATA_AND_AI',
  SOFTWARE_TESTING_AND_QA = 'SOFTWARE_TESTING_AND_QA',
  INFRASTRUCTURE_AND_CLOUD = 'INFRASTRUCTURE_AND_CLOUD',
}

// ============================================
// SUB CATEGORIES - BUSINESS_SERVICES
// ============================================

export enum BusinessServicesSubCategoryEnum {
  ADMIN_AND_VIRTUAL_SUPPORT = 'ADMIN_AND_VIRTUAL_SUPPORT',
  FINANCIAL_AND_LEGAL = 'FINANCIAL_AND_LEGAL',
  STRATEGY_AND_CONSULTING = 'STRATEGY_AND_CONSULTING',
  HR_AND_OPERATIONS = 'HR_AND_OPERATIONS',
}

// ============================================
// SUB CATEGORIES - MARKETING_AND_SALES
// ============================================

export enum MarketingSalesSubCategoryEnum {
  DIGITAL_MARKETING = 'DIGITAL_MARKETING',
  SOCIAL_MEDIA_MANAGEMENT = 'SOCIAL_MEDIA_MANAGEMENT',
  CONTENT_AND_COPYWRITING = 'CONTENT_AND_COPYWRITING',
  SALES_AND_LEAD_GEN = 'SALES_AND_LEAD_GEN',
}

// ============================================
// SUB CATEGORIES - DESIGN_AND_CREATIVE
// ============================================

export enum DesignCreativeSubCategoryEnum {
  VISUAL_IDENTITY_AND_BRANDING = 'VISUAL_IDENTITY_AND_BRANDING',
  UI_UX_AND_WEB_DESIGN = 'UI_UX_AND_WEB_DESIGN',
  MOTION_AND_VIDEO = 'MOTION_AND_VIDEO',
  ILLUSTRATION_AND_PRINT = 'ILLUSTRATION_AND_PRINT',
}

// ============================================
// UNION TYPE - ALL SUB CATEGORIES
// ============================================

export type SubCategoryEnum =
  | ITSoftwareSubCategoryEnum
  | BusinessServicesSubCategoryEnum
  | MarketingSalesSubCategoryEnum
  | DesignCreativeSubCategoryEnum;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all subcategories for a category
 */
export function getSubCategoriesForCategory(category: CategoryEnum): SubCategoryEnum[] {
  switch (category) {
    case CategoryEnum.IT_AND_SOFTWARE:
      return Object.values(ITSoftwareSubCategoryEnum);
    case CategoryEnum.BUSINESS_SERVICES:
      return Object.values(BusinessServicesSubCategoryEnum);
    case CategoryEnum.MARKETING_AND_SALES:
      return Object.values(MarketingSalesSubCategoryEnum);
    case CategoryEnum.DESIGN_AND_CREATIVE:
      return Object.values(DesignCreativeSubCategoryEnum);
    default:
      return [];
  }
}

/**
 * Check if a subcategory belongs to a category
 */
export function isSubCategoryOfCategory(
  subCategory: SubCategoryEnum,
  category: CategoryEnum
): boolean {
  return getSubCategoriesForCategory(category).includes(subCategory);
}
