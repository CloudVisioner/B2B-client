# Frontend GraphQL Implementation Guide

This document outlines how the frontend implements GraphQL queries and mutations, aligned with the backend API structure.

---

## Table of Contents
1. [Field Name Mapping](#1-field-name-mapping)
2. [Organization Queries & Mutations](#2-organization-queries--mutations)
3. [Service Request Queries & Mutations](#3-service-request-queries--mutations)
4. [File Uploads](#4-file-uploads)
5. [Implementation Notes](#5-implementation-notes)

---

## 1. Field Name Mapping

### 1.1 Backend vs Frontend Field Names

The backend uses specific field naming conventions that differ from our frontend form fields. We map between them:

| Backend Field | Frontend Form Field | Notes |
|--------------|---------------------|-------|
| `orgName` | `orgName` | Same |
| `orgIndustry` | `industry` | Mapped in settings page |
| `orgDescription` | `description` | Mapped in settings page |
| `orgWebsiteUrl` | `orgWebsiteUrl` | Same (optional) |
| `orgLogoImages` | `logoUrl` | Array in backend, single URL in form |

### 1.2 Mapping Implementation

**In `pages/settings.tsx`:**

```typescript
// When fetching from backend (orgIndustry → industry)
setFormData({
  orgName: org.orgName || '',
  industry: org.orgIndustry || '', // Map from backend
  location: org.location || '',
  description: org.orgDescription || '', // Map from backend
  logoUrl: org.orgLogoImages?.[0] || '',
});

// When sending to backend (industry → orgIndustry)
await createOrUpdateOrg({
  variables: {
    input: {
      orgName: formData.orgName.trim(),
      orgIndustry: formData.industry, // Map to backend
      location: formData.location.trim(),
      orgDescription: formData.description.trim(), // Map to backend
      orgLogoImages: logoUrl ? [logoUrl] : [],
    },
  },
});
```

---

## 2. Organization Queries & Mutations

### 2.1 Query: Get Buyer Organization

**Location:** `apollo/user/query.ts`

```graphql
query GetBuyerOrganization {
  getBuyerOrganization {
    _id
    orgName
    orgIndustry      # Backend field name
    location
    orgDescription   # Backend field name
    orgWebsiteUrl
    orgLogoImages
    orgVerified
    createdAt
    updatedAt
  }
}
```

**Usage in Components:**
- `pages/settings.tsx` - Fetches organization data to pre-fill form
- `libs/components/dashboard/Header.tsx` - Displays organization name and industry

### 2.2 Mutation: Create or Update Buyer Organization

**Location:** `apollo/user/mutation.ts`

```graphql
mutation CreateOrUpdateBuyerOrganization($input: BuyerOrganizationInput!) {
  createOrUpdateBuyerOrganization(input: $input) {
    _id
    orgName
    orgIndustry      # Backend field name
    location
    orgDescription   # Backend field name
    orgWebsiteUrl
    orgLogoImages
    orgVerified
    createdAt
    updatedAt
  }
}
```

**Input Type (from backend guide):**
```typescript
{
  orgName: string;           // Required
  orgIndustry: string;       // Required (mapped from form field "industry")
  location: string;          // Required
  orgDescription: string;   // Required (mapped from form field "description")
  orgWebsiteUrl?: string;    // Optional
  orgLogoImages: string[];   // Array of image URLs
}
```

**Implementation:** `pages/settings.tsx`

---

## 3. Service Request Queries & Mutations

### 3.1 Query: Get Buyer Service Requests

**Location:** `apollo/user/query.ts`

```graphql
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
```

**Note:** The backend guide shows fields with `req` prefix (e.g., `reqTitle`, `reqDescription`), but our current implementation uses simplified names. If the backend actually uses `req` prefixes, we'll need to update our queries.

### 3.2 Mutation: Create Service Request

**Location:** `apollo/user/mutation.ts`

```graphql
mutation CreateServiceRequest($input: ServiceRequestInput!) {
  createServiceRequest(input: $input) {
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
    organizationId
    buyerId
    createdAt
    updatedAt
  }
}
```

**Implementation:** `pages/post-job.tsx` (to be implemented)

---

## 4. File Uploads

### 4.1 Image Upload Mutation

**Location:** `apollo/user/mutation.ts`

```graphql
mutation ImageUploader($file: Upload!, $target: String!) {
  imageUploader(file: $file, target: $target)
}
```

**Implementation:** `pages/settings.tsx`

The upload uses GraphQL multipart request specification:

```typescript
const uploadLogoToBackend = async (file: File): Promise<string> => {
  const formData = new FormData();
  const token = getJwtToken();
  const apiUrl = process.env.NEXT_PUBLIC_API_GRAPHQL_URL || 'http://localhost:3010/graphql';

  // 1. Operations (GraphQL query)
  formData.append('operations', JSON.stringify({
    query: `mutation ImageUploader($file: Upload!, $target: String!) {
      imageUploader(file: $file, target: $target)
    }`,
    variables: { file: null, target: 'organization' }
  }));

  // 2. Map (file mapping)
  formData.append('map', JSON.stringify({ '0': ['variables.file'] }));

  // 3. File (actual file data)
  formData.append('0', file);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'apollo-require-preflight': 'true',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'Upload failed');
  }
  return result.data?.imageUploader;
};
```

**Flow:**
1. User selects image → Frontend shows preview immediately (blob URL)
2. User clicks "Save Changes" → Image uploads to backend
3. Backend returns image URL → Organization saves with image URL

---

## 5. Implementation Notes

### 5.1 Apollo Client Setup

**Location:** `apollo/client.ts`

- Uses `createHttpLink` for standard queries
- Uses `setContext` to add JWT token to headers
- Token retrieved from `localStorage.getItem('accessToken')`

### 5.2 Authentication Headers

**Location:** `apollo/utils.ts`

```typescript
export function getHeaders(): Record<string, string> {
  const token = getJwtToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
```

**Usage:**
```typescript
const { data } = useQuery(GET_BUYER_ORGANIZATION, {
  context: {
    headers: isLoggedIn() ? getHeaders() : {},
  },
});
```

### 5.3 Error Handling

All GraphQL operations use `errorPolicy: 'all'` to handle partial errors gracefully:

```typescript
const { data, error } = useQuery(GET_BUYER_ORGANIZATION, {
  errorPolicy: 'all',
  onError: (error) => {
    console.error('GraphQL error:', error);
    // Show user-friendly error message
  },
});
```

### 5.4 Field Name Consistency

**Important:** Always use backend field names in GraphQL queries/mutations:
- ✅ `orgIndustry` (not `industry`)
- ✅ `orgDescription` (not `description`)
- ✅ `orgLogoImages` (array, not single URL)

Map to frontend-friendly names only in component state/forms.

---

## 6. Backend API Alignment

This implementation aligns with the backend GraphQL API guide provided. Key alignments:

1. **Mutation Name:** `createOrUpdateBuyerOrganization` ✅
2. **Input Type:** `BuyerOrganizationInput` ✅
3. **Field Names:** `orgIndustry`, `orgDescription` ✅
4. **File Upload:** Multipart form data with operations/map/file ✅
5. **Authentication:** Bearer token in Authorization header ✅

---

## 7. Future Updates

If backend uses different field names (e.g., `reqTitle` instead of `title` for service requests), update:

1. GraphQL queries in `apollo/user/query.ts`
2. GraphQL mutations in `apollo/user/mutation.ts`
3. Component mappings in `pages/post-job.tsx`, `pages/service-requests.tsx`
4. TypeScript types in `libs/types/index.ts`

---

**Last Updated:** 2024-02-18
