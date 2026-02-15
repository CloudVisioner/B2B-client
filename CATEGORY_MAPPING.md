# 📋 Category & SubCategory Mapping Guide

## 🎯 Overview
This document explains how frontend UI categories map to backend enum values.

---

## 🔄 **Category Mapping**

### **Frontend → Backend**

| Frontend UI | Backend Enum |
|------------|--------------|
| `it-software` | `IT_AND_SOFTWARE` |
| `business` | `BUSINESS_SERVICES` |
| `marketing-sales` | `MARKETING_AND_SALES` |
| `design-creative` | `DESIGN_AND_CREATIVE` |

**Function:** `mapCategoryToBackend(uiCategory: string): string`

---

## 🔄 **SubCategory Mapping**

### **IT_AND_SOFTWARE**

| Frontend UI | Backend Enum |
|------------|--------------|
| `web-app-development` | `WEB_APP_DEVELOPMENT` |
| `data-ai` | `DATA_AND_AI` |
| `software-testing-qa` | `SOFTWARE_TESTING_AND_QA` |
| `infrastructure-cloud` | `INFRASTRUCTURE_AND_CLOUD` |

### **BUSINESS_SERVICES**

| Frontend UI | Backend Enum |
|------------|--------------|
| `admin-virtual-support` | `ADMIN_AND_VIRTUAL_SUPPORT` |
| `financial-legal` | `FINANCIAL_AND_LEGAL` |
| `strategy-consulting` | `STRATEGY_AND_CONSULTING` |
| `hr-operations` | `HR_AND_OPERATIONS` |

### **MARKETING_AND_SALES**

| Frontend UI | Backend Enum |
|------------|--------------|
| `digital-marketing` | `DIGITAL_MARKETING` |
| `social-media-management` | `SOCIAL_MEDIA_MANAGEMENT` |
| `content-copywriting` | `CONTENT_AND_COPYWRITING` |
| `sales-lead-gen` | `SALES_AND_LEAD_GEN` |

### **DESIGN_AND_CREATIVE**

| Frontend UI | Backend Enum |
|------------|--------------|
| `visual-identity-branding` | `VISUAL_IDENTITY_AND_BRANDING` |
| `uiux-web-design` | `UI_UX_AND_WEB_DESIGN` |
| `motion-video` | `MOTION_AND_VIDEO` |
| `illustrative-print` | `ILLUSTRATION_AND_PRINT` |

**Function:** `mapSubCategoryToBackend(uiSubCategory: string): string`

---

## 🔄 **Reverse Mapping (Backend → Frontend)**

### **Category Mapping**
**Function:** `mapCategoryFromBackend(backendCategory: string): string`

### **SubCategory Mapping**
**Function:** `mapSubCategoryFromBackend(backendSubCategory: string): string`

---

## 📝 **Usage Examples**

### **Example 1: Sending Category to Backend**

```typescript
import { mapCategoryToBackend } from '../utils/providerMapper';

const uiCategory = 'it-software';
const backendCategory = mapCategoryToBackend(uiCategory);
// Result: 'IT_AND_SOFTWARE'

// Use in GraphQL query
const { data } = useQuery(GET_PROVIDERS_BY_CATEGORY, {
  variables: {
    input: {
      categoryId: backendCategory, // 'IT_AND_SOFTWARE'
    },
  },
});
```

### **Example 2: Sending SubCategory to Backend**

```typescript
import { mapSubCategoryToBackend } from '../utils/providerMapper';

const uiSubCategory = 'web-app-development';
const backendSubCategory = mapSubCategoryToBackend(uiSubCategory);
// Result: 'WEB_APP_DEVELOPMENT'

// Use in GraphQL query
const { data } = useQuery(GET_PROVIDERS_BY_CATEGORY, {
  variables: {
    input: {
      categoryId: 'IT_AND_SOFTWARE',
      subCategory: [backendSubCategory], // ['WEB_APP_DEVELOPMENT']
    },
  },
});
```

### **Example 3: Receiving Data from Backend**

```typescript
import { mapCategoryFromBackend, mapSubCategoryFromBackend } from '../utils/providerMapper';

// Backend returns: { categoryId: 'IT_AND_SOFTWARE', subCategory: 'WEB_APP_DEVELOPMENT' }
const uiCategory = mapCategoryFromBackend(backendData.categoryId);
// Result: 'it-software'

const uiSubCategory = mapSubCategoryFromBackend(backendData.subCategory);
// Result: 'web-app-development'
```

---

## ✅ **Automatic Mapping**

The mapper functions in `libs/utils/providerMapper.ts` automatically handle:

1. **Outgoing Requests:**
   - `mapCategoryToBackend()` - Converts UI category to backend enum
   - `mapSubCategoryToBackend()` - Converts UI subcategory to backend enum

2. **Incoming Responses:**
   - `mapCategoryFromBackend()` - Converts backend enum to UI category
   - `mapSubCategoryFromBackend()` - Converts backend enum to UI subcategory

3. **Provider Data Mapping:**
   - `mapBackendProviderToList()` - Automatically maps category/subcategory when converting provider data
   - `mapBackendProviderDetail()` - Automatically maps category/subcategory for detail view

---

## 🎯 **Backend Enum Values Reference**

### **Categories:**
- `IT_AND_SOFTWARE`
- `BUSINESS_SERVICES`
- `MARKETING_AND_SALES`
- `DESIGN_AND_CREATIVE`

### **SubCategories:**

**IT_AND_SOFTWARE:**
- `WEB_APP_DEVELOPMENT`
- `DATA_AND_AI`
- `SOFTWARE_TESTING_AND_QA`
- `INFRASTRUCTURE_AND_CLOUD`

**BUSINESS_SERVICES:**
- `ADMIN_AND_VIRTUAL_SUPPORT`
- `FINANCIAL_AND_LEGAL`
- `STRATEGY_AND_CONSULTING`
- `HR_AND_OPERATIONS`

**MARKETING_AND_SALES:**
- `DIGITAL_MARKETING`
- `SOCIAL_MEDIA_MANAGEMENT`
- `CONTENT_AND_COPYWRITING`
- `SALES_AND_LEAD_GEN`

**DESIGN_AND_CREATIVE:**
- `VISUAL_IDENTITY_AND_BRANDING`
- `UI_UX_AND_WEB_DESIGN`
- `MOTION_AND_VIDEO`
- `ILLUSTRATION_AND_PRINT`

---

**All mappings are handled automatically - no manual conversion needed!** ✅
