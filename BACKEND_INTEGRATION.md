# 🔌 Backend Integration Guide

## 📋 Overview
This document explains how the frontend integrates with the backend GraphQL API for provider data.

---

## 🔍 **Available Queries**

### **1. GET_PROVIDERS_BY_CATEGORY**
Filter providers by category with optional filters.

**Query:**
```graphql
query GetProvidersByCategory($input: ProviderCategoryInput!) {
  getProvidersByCategory(input: $input) {
    list { ... }
    metaCounter { total }
  }
}
```

**Minimal Variables:**
```json
{
  "input": {
    "categoryId": "web-development"
  }
}
```

**Complete Variables (with filters):**
```json
{
  "input": {
    "categoryId": "web-development",
    "subCategory": "e-commerce",
    "location": "USA",
    "minBudget": 1000,
    "maxBudget": 10000,
    "page": 1,
    "limit": 12
  }
}
```

**Usage:**
```typescript
import { useQuery } from '@apollo/client';
import { GET_PROVIDERS_BY_CATEGORY } from '../apollo/user/query';
import { mapBackendProviderToList } from '../libs/utils/providerMapper';

const { data, loading } = useQuery(GET_PROVIDERS_BY_CATEGORY, {
  variables: {
    input: {
      categoryId: 'web-development',
      page: 1,
      limit: 12,
    },
  },
});

const providers = data?.getProvidersByCategory?.list?.map(mapBackendProviderToList) || [];
const total = data?.getProvidersByCategory?.metaCounter?.total || 0;
```

---

### **2. GET_PROVIDER_DETAIL**
Get detailed information about a single provider.

**Query:**
```graphql
query GetProviderDetail($orgId: String!) {
  getProviderDetail(orgId: $orgId) { ... }
}
```

**Variables:**
```json
{
  "orgId": "69864f6efcf99b93d1eca978"
}
```

**Usage:**
```typescript
import { useQuery } from '@apollo/client';
import { GET_PROVIDER_DETAIL } from '../apollo/user/query';
import { mapBackendProviderDetail } from '../libs/utils/providerMapper';
import { isLoggedIn } from '../libs/auth';

const { data, loading } = useQuery(GET_PROVIDER_DETAIL, {
  variables: {
    orgId: '69864f6efcf99b93d1eca978',
  },
  // Pass auth token if logged in (email/phone only shown if authenticated)
  context: {
    headers: isLoggedIn() ? getHeaders() : {},
  },
});

const provider = data?.getProviderDetail 
  ? mapBackendProviderDetail(data.getProviderDetail)
  : null;
```

**Note:** `email` and `phone` fields are only returned if the user is logged in (pass auth token in headers).

---

### **3. GET_PROVIDERS_SORTED**
Get providers with sorting options.

**Query:**
```graphql
query GetProvidersSorted($input: ProviderSortInput!) {
  getProvidersSorted(input: $input) {
    list { ... }
    metaCounter { total }
  }
}
```

**Sort Options:**
- `"rating"` - Sort by average rating (highest first)
- `"projects"` - Sort by total projects (most first)
- `"responseTime"` - Sort by response time (fastest first)
- `"startingRate"` - Sort by starting rate (lowest first)

**Example Variables:**

**Sort by Rating:**
```json
{
  "input": {
    "sortBy": "rating",
    "categoryId": "web-development",
    "page": 1,
    "limit": 12
  }
}
```

**Sort by Projects:**
```json
{
  "input": {
    "sortBy": "projects",
    "subCategory": "e-commerce",
    "location": "USA",
    "page": 1,
    "limit": 12
  }
}
```

**Sort by Response Time:**
```json
{
  "input": {
    "sortBy": "responseTime",
    "categoryId": "web-development",
    "minBudget": 5000,
    "maxBudget": 50000,
    "page": 1,
    "limit": 12
  }
}
```

**Sort by Starting Rate with Search:**
```json
{
  "input": {
    "sortBy": "startingRate",
    "searchQuery": "react nodejs",
    "location": "New York",
    "page": 1,
    "limit": 12
  }
}
```

**Usage:**
```typescript
import { useQuery } from '@apollo/client';
import { GET_PROVIDERS_SORTED } from '../apollo/user/query';
import { mapBackendProviderToList, mapSortOption } from '../libs/utils/providerMapper';

const uiSort = 'Highest Rated'; // From UI dropdown
const backendSort = mapSortOption(uiSort); // Converts to "rating"

const { data, loading } = useQuery(GET_PROVIDERS_SORTED, {
  variables: {
    input: {
      sortBy: backendSort,
      categoryId: 'web-development',
      page: 1,
      limit: 12,
    },
  },
});

const providers = data?.getProvidersSorted?.list?.map(mapBackendProviderToList) || [];
const total = data?.getProvidersSorted?.metaCounter?.total || 0;
```

---

## 🔄 **Data Mapping**

### **Backend Field Names → Frontend Field Names**

The backend uses `org*` prefixed fields. We map them to frontend-friendly names:

| Backend Field | Frontend Field | Notes |
|--------------|----------------|-------|
| `_id` | `id` | MongoDB ObjectId |
| `orgName` | `name` | Company name |
| `orgDescription` | `description` | Short description |
| `orgAverageRating` | `rating` | Average rating (0-5) |
| `orgTotalProjects` | `projectsCompleted` | Total projects |
| `orgResponseTimeAvg` | `responseTime` | Response time string |
| `orgCountry` | `location` | Country name |
| `orgCity` | `city` | City name |
| `orgLogoImages[0]` | `avatar` | First logo image |
| `orgVerified` | `badges` | Converted to ["VERIFIED"] |
| `orgSkills` or `industries` | `expertise` | Skills/expertise array |

### **Mapper Functions**

**Location:** `libs/utils/providerMapper.ts`

**Functions:**
- `mapBackendProviderToList(backend)` - Maps list item to frontend format
- `mapBackendProviderDetail(backend)` - Maps detail to frontend format
- `mapSortOption(uiSort)` - Maps UI sort option to backend format
- `mapCategoryToBackend(uiCategory)` - Maps UI category to backend format

**Example:**
```typescript
import { mapBackendProviderToList } from '../libs/utils/providerMapper';

const backendData = {
  _id: '69864f6efcf99b93d1eca978',
  orgName: 'Fortress Cyber Defense',
  orgDescription: 'High-end threat intelligence...',
  orgAverageRating: 4.9,
  // ... other backend fields
};

const frontendProvider = mapBackendProviderToList(backendData);
// Result: { id, name, description, rating, ... }
```

---

## 📊 **Response Structure**

### **List Response:**
```typescript
{
  getProvidersByCategory: {
    list: BackendProviderListItem[],
    metaCounter: {
      total: number  // Total count for pagination
    }
  }
}
```

### **Detail Response:**
```typescript
{
  getProviderDetail: BackendProviderDetail
}
```

---

## 🔐 **Authentication**

### **Public Queries (No Auth Required):**
- ✅ `GET_PROVIDERS_BY_CATEGORY`
- ✅ `GET_PROVIDERS_SORTED`
- ✅ `GET_PROVIDER_DETAIL` (basic fields)

### **Authenticated Fields:**
- `GET_PROVIDER_DETAIL` returns `email` and `phone` **only if user is logged in**

**How to Pass Auth Token:**
```typescript
import { getHeaders } from '../apollo/utils';
import { isLoggedIn } from '../libs/auth';

const { data } = useQuery(GET_PROVIDER_DETAIL, {
  variables: { orgId: '...' },
  context: {
    headers: isLoggedIn() ? getHeaders() : {},
  },
});
```

---

## 🎯 **Usage Examples**

### **Example 1: Marketplace Page with Filters**

```typescript
import { useQuery } from '@apollo/client';
import { GET_PROVIDERS_BY_CATEGORY } from '../apollo/user/query';
import { mapBackendProviderToList } from '../libs/utils/providerMapper';

function MarketplacePage() {
  const router = useRouter();
  const { category, location, budget, page } = router.query;

  const { data, loading } = useQuery(GET_PROVIDERS_BY_CATEGORY, {
    variables: {
      input: {
        categoryId: category as string,
        location: location as string,
        maxBudget: budget ? parseInt(budget as string) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: 12,
      },
    },
  });

  const providers = data?.getProvidersByCategory?.list?.map(mapBackendProviderToList) || [];
  const total = data?.getProvidersByCategory?.metaCounter?.total || 0;

  return (
    <div>
      {providers.map(provider => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
      <Pagination total={total} currentPage={page} />
    </div>
  );
}
```

### **Example 2: Provider Detail Page**

```typescript
import { useQuery } from '@apollo/client';
import { GET_PROVIDER_DETAIL } from '../apollo/user/query';
import { mapBackendProviderDetail } from '../libs/utils/providerMapper';
import { getHeaders } from '../apollo/utils';
import { isLoggedIn } from '../libs/auth';

function ProviderDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading } = useQuery(GET_PROVIDER_DETAIL, {
    variables: { orgId: id as string },
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
  });

  const provider = data?.getProviderDetail 
    ? mapBackendProviderDetail(data.getProviderDetail)
    : null;

  if (loading) return <Loading />;
  if (!provider) return <NotFound />;

  return (
    <div>
      <h1>{provider.name}</h1>
      <p>{provider.bio}</p>
      {provider.email && <p>Email: {provider.email}</p>}
      {provider.phone && <p>Phone: {provider.phone}</p>}
    </div>
  );
}
```

### **Example 3: Sorted Providers**

```typescript
import { useQuery } from '@apollo/client';
import { GET_PROVIDERS_SORTED } from '../apollo/user/query';
import { mapBackendProviderToList, mapSortOption } from '../libs/utils/providerMapper';

function SortedProvidersList() {
  const [sortBy, setSortBy] = useState('Highest Rated');

  const { data, loading } = useQuery(GET_PROVIDERS_SORTED, {
    variables: {
      input: {
        sortBy: mapSortOption(sortBy), // Converts "Highest Rated" → "rating"
        categoryId: 'web-development',
        page: 1,
        limit: 12,
      },
    },
  });

  const providers = data?.getProvidersSorted?.list?.map(mapBackendProviderToList) || [];

  return (
    <div>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option>Highest Rated</option>
        <option>Cheapest</option>
        <option>Most Projects</option>
        <option>Fastest Response</option>
      </select>
      {providers.map(provider => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </div>
  );
}
```

---

## 📝 **Important Notes**

1. **All queries are public** - No authentication required for basic data
2. **Email/Phone only for logged-in users** - Pass auth token in headers for `GET_PROVIDER_DETAIL`
3. **Pagination** - Use `page` and `limit` in input, get total from `metaCounter.total`
4. **Only ACTIVE providers** - Backend returns only `SERVICE_PROVIDER` organizations with `ACTIVE` status
5. **Field Mapping** - Always use mapper functions to convert backend format to frontend format
6. **Sort Options** - Use `mapSortOption()` to convert UI sort options to backend format

---

## 🚀 **Next Steps**

1. ✅ Update GraphQL queries to match backend schema
2. ✅ Create TypeScript types for backend data
3. ✅ Create mapper functions for data conversion
4. ⏳ Update components to use new queries
5. ⏳ Test with real backend data
6. ⏳ Handle loading and error states

---

**Ready for implementation!** 🎯
