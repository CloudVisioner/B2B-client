# Backend API Requirements for Buyer Dashboard

This document provides complete API specifications for the buyer dashboard features.

---

## Table of Contents
1. [Organization Management](#1-organization-management)
2. [File Upload (Logo)](#2-file-upload-logo)
3. [Service Request Management](#3-service-request-management)
4. [GraphQL Schema Definitions](#4-graphql-schema-definitions)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Error Handling](#6-error-handling)

---

## 1. Organization Management

### 1.1 Query: `getBuyerOrganization`

**Purpose:** Fetch the logged-in buyer's organization details

**Authentication:** Required (JWT token)

**GraphQL Query:**
```graphql
query GetBuyerOrganization {
  getBuyerOrganization {
    _id
    orgName
    industry
    location
    description
    orgWebsiteUrl
    orgLogoImages
    orgVerified
    createdAt
    updatedAt
  }
}
```

**Return Behavior:**
- If organization exists: Return `Organization` object
- If no organization exists: Return `null` (not an error)

**Usage:** Called on Settings page load to populate form

---

### 1.2 Mutation: `createOrUpdateBuyerOrganization`

**Purpose:** Create a new organization OR update existing one for the logged-in buyer

**Authentication:** Required (JWT token)

**GraphQL Mutation:**
```graphql
mutation CreateOrUpdateBuyerOrganization($input: OrganizationInput!) {
  createOrUpdateBuyerOrganization(input: $input) {
    _id
    orgName
    industry
    location
    description
    orgWebsiteUrl
    orgLogoImages
    orgVerified
    createdAt
    updatedAt
  }
}
```

**Input Type:**
```graphql
input OrganizationInput {
  orgName: String!          # Organization name (required)
  industry: String!         # Industry (required)
  location: String!         # Location (required)
  description: String!      # Company description (required, max 2000 chars)
  orgWebsiteUrl: String     # Optional website URL
  orgLogoImages: [String!]  # Array of logo image URLs (optional)
}
```

**Return Type:**
```graphql
type Organization {
  _id: String!
  orgName: String!
  industry: String!
  location: String!
  description: String!
  orgWebsiteUrl: String
  orgLogoImages: [String!]   # Array of image URLs
  orgVerified: Boolean!
  createdAt: String!        # ISO date string
  updatedAt: String!       # ISO date string
}
```

**Backend Logic:**
1. Extract `buyerId` from JWT token
2. Check if buyer already has an organization:
   - **If NO organization exists:**
     - CREATE new organization
     - Link to buyer via `buyerId`
     - Set `orgVerified: false` (default)
     - Return created organization
   - **If organization EXISTS:**
     - UPDATE existing organization
     - Update all provided fields
     - Update `updatedAt` timestamp
     - Return updated organization

**Validation Rules:**
- `orgName`: Required, min 2 characters, max 100 characters
- `industry`: Required, must be from predefined list or "Other"
- `location`: Required, min 3 characters, max 200 characters
- `description`: Required, min 10 characters, max 2000 characters
- `orgWebsiteUrl`: Optional, must be valid URL format if provided
- `orgLogoImages`: Optional, array of valid image URLs

**Error Cases:**
- Missing required fields → Return validation error
- Invalid URL format → Return validation error
- Description too long → Return validation error
- Unauthorized (no valid JWT) → Return authentication error

**Usage:** 
- Called when user clicks "Create Organization" (first time)
- Called when user clicks "Save Changes" (updating existing)

**Note:** The mutation name is `createOrUpdateBuyerOrganization` (not `createOrUpdateOrganization`)

---

## 2. File Upload (Logo)

### 2.1 Mutation: `imageUploader`

**Purpose:** Upload images (logo, attachments) using GraphQL multipart upload protocol

**Authentication:** Required (JWT token)

**GraphQL Mutation:**
```graphql
mutation ImageUploader($file: Upload!, $target: String!) {
  imageUploader(file: $file, target: $target)
}
```

**Input:**
- `file: Upload!` - The file to upload (GraphQL Upload scalar)
- `target: String!` - Target type: `'organization'`, `'member'`, `'service-request'`, etc.

**Return Type:** `String` (URL of uploaded image)

**Multipart Upload Protocol:**

The frontend sends a `multipart/form-data` request with:

1. **`operations`** (JSON string):
   ```json
   {
     "query": "mutation ImageUploader($file: Upload!, $target: String!) { imageUploader(file: $file, target: $target) }",
     "variables": {
       "file": null,
       "target": "organization"
     }
   }
   ```

2. **`map`** (JSON string):
   ```json
   {
     "0": ["variables.file"]
   }
   ```

3. **`0`** (file binary data):
   - The actual file content

**File Validation:**
- **Allowed types:** `image/jpeg`, `image/jpg`, `image/png`
- **Max file size:** 5MB
- **Storage:** Upload to cloud storage (S3, Cloudinary, etc.) or local storage
- **Return:** Public URL of uploaded image

**Backend Processing:**
1. Validate file type and size
2. Generate unique filename (UUID + timestamp)
3. Upload to storage service
4. Return public URL
5. Optionally: Create thumbnail/resized versions

**Error Cases:**
- Invalid file type → Return error: "Only JPG, JPEG, PNG images are allowed"
- File too large → Return error: "File size must be less than 5MB"
- Upload failure → Return error: "Failed to upload image"

**Usage:** Called when user selects logo file and clicks "Save Changes"

---

## 3. Service Request Management

### 3.1 Mutation: `createServiceRequest`

**Purpose:** Create a new service request/job posting

**Authentication:** Required (JWT token)

**GraphQL Mutation:**
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
    quotesCount
    newQuotesCount
    createdAt
    updatedAt
  }
}
```

**Input Type:**
```graphql
input ServiceRequestInput {
  organizationId: String!   # ID of the buyer's organization (required)
  title: String!            # Request title (required)
  description: String!      # Detailed description (required)
  category: String!         # Main category (e.g., "IT & Software")
  subCategory: String!      # Subcategory (e.g., "Web & App Development")
  budgetMin: Float!         # Minimum budget in USD (required)
  budgetMax: Float          # Maximum budget in USD (optional)
  deadline: String!         # ISO date string (required)
  urgency: Urgency!         # Enum: NORMAL, URGENT, CRITICAL
  skills: [String!]         # Array of required skills (optional)
  attachments: [String!]    # Array of attachment URLs (optional)
  status: ServiceRequestStatus  # Optional, defaults to DRAFT
}
```

**Return Type:**
```graphql
type ServiceRequest {
  _id: String!
  title: String!
  description: String!
  category: String!
  subCategory: String!
  budgetMin: Float!
  budgetMax: Float
  deadline: String!         # ISO date string
  urgency: Urgency!
  skills: [String!]!
  status: ServiceRequestStatus!
  organizationId: String!
  buyerId: String!
  providerId: String       # Set when provider is assigned
  quotesCount: Int!         # Total quotes received
  newQuotesCount: Int!      # New quotes since last view
  provider: Provider        # Provider info if assigned
  phase: String            # Current phase if in progress
  createdAt: String!
  updatedAt: String!
}
```

**Backend Logic:**
1. Extract `buyerId` from JWT token
2. Validate `organizationId` belongs to the buyer
3. Set default `status: DRAFT` if not provided
4. Set `quotesCount: 0` and `newQuotesCount: 0`
5. Create service request
6. Return created request

**Validation Rules:**
- `title`: Required, min 10 characters, max 200 characters
- `description`: Required, min 50 characters, max 5000 characters
- `category`: Required, must be valid category
- `subCategory`: Required, must be valid subcategory for the category
- `budgetMin`: Required, must be > 0
- `budgetMax`: Optional, if provided must be >= `budgetMin`
- `deadline`: Required, must be future date
- `urgency`: Required, must be NORMAL, URGENT, or CRITICAL
- `skills`: Optional, array of strings, max 20 skills

**Error Cases:**
- Missing required fields → Validation error
- Invalid organizationId → Error: "Organization not found"
- Organization doesn't belong to buyer → Error: "Unauthorized"
- Invalid deadline (past date) → Error: "Deadline must be in the future"

**Usage:** Called when user clicks "Publish Request" in Post Job page

---

### 3.2 Mutation: `updateServiceRequestStatus`

**Purpose:** Update the status of a service request

**Authentication:** Required (JWT token)

**GraphQL Mutation:**
```graphql
mutation UpdateServiceRequestStatus($requestId: String!, $status: ServiceRequestStatus!) {
  updateServiceRequestStatus(requestId: $requestId, status: $status) {
    _id
    status
    updatedAt
  }
}
```

**Input:**
- `requestId: String!` - Service request ID
- `status: ServiceRequestStatus!` - New status

**Backend Logic:**
1. Verify request belongs to buyer (from JWT)
2. Validate status transition (e.g., DRAFT → OPEN, OPEN → CLOSED)
3. Update status
4. If status changes to OPEN, notify providers
5. Return updated request

**Status Transitions:**
- `DRAFT` → `OPEN` (Publish)
- `OPEN` → `IN_PROGRESS` (Provider assigned)
- `OPEN` → `CLOSED` (Buyer closes)
- `IN_PROGRESS` → `CLOSED` (Completed)

**Usage:** 
- Called when user clicks "Publish Request" (DRAFT → OPEN)
- Called when user closes a request (OPEN → CLOSED)

---

### 3.3 Query: `getBuyerServiceRequests`

**Purpose:** Fetch all service requests created by the logged-in buyer

**Authentication:** Required (JWT token)

**GraphQL Query:**
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

**Input Type (Optional):**
```graphql
input ServiceRequestFilterInput {
  status: ServiceRequestStatus    # Filter by status
  category: String                # Filter by category
  page: Int                       # Pagination page (default: 1)
  limit: Int                      # Items per page (default: 10)
  sortBy: String                  # Sort field: "createdAt", "deadline", "budgetMin"
  sortOrder: String              # "asc" or "desc" (default: "desc")
  search: String                  # Search in title/description
}
```

**Return Type:**
```graphql
type ServiceRequestListResponse {
  list: [ServiceRequest!]!
  metaCounter: ServiceRequestMeta!
}

type ServiceRequestMeta {
  total: Int!        # Total requests
  open: Int!         # Open requests count
  inProgress: Int!   # In progress count
  closed: Int!       # Closed count
  draft: Int!        # Draft count
}
```

**Backend Logic:**
1. Extract `buyerId` from JWT token
2. Query service requests where `buyerId` matches
3. Apply filters (status, category, search)
4. Apply sorting
5. Apply pagination
6. Calculate meta counters
7. Return results

**Usage:** Called on "My Service Requests" page

---

## 4. GraphQL Schema Definitions

### 4.1 Enums

```graphql
enum Urgency {
  NORMAL
  URGENT
  CRITICAL
}

enum ServiceRequestStatus {
  DRAFT
  PUBLISHED
  OPEN
  IN_PROGRESS
  CLOSED
  CANCELLED
}
```

### 4.2 Scalar Types

```graphql
scalar Upload  # GraphQL scalar for file uploads (multipart/form-data)
```

### 4.3 Input Types

```graphql
input OrganizationInput {
  orgName: String!
  industry: String!
  location: String!
  description: String!
  orgWebsiteUrl: String
  orgLogoImages: [String!]
}

input ServiceRequestInput {
  organizationId: String!
  title: String!
  description: String!
  category: String!
  subCategory: String!
  budgetMin: Float!
  budgetMax: Float
  deadline: String!
  urgency: Urgency!
  skills: [String!]
  attachments: [String!]
  status: ServiceRequestStatus
}

input ServiceRequestFilterInput {
  status: ServiceRequestStatus
  category: String
  page: Int
  limit: Int
  sortBy: String
  sortOrder: String
  search: String
}
```

### 4.4 Return Types

```graphql
type Organization {
  _id: String!
  orgName: String!
  industry: String!
  location: String!
  description: String!
  orgWebsiteUrl: String
  orgLogoImages: [String!]
  orgVerified: Boolean!
  createdAt: String!
  updatedAt: String!
}

type ServiceRequest {
  _id: String!
  title: String!
  description: String!
  category: String!
  subCategory: String!
  budgetMin: Float!
  budgetMax: Float
  deadline: String!
  urgency: Urgency!
  skills: [String!]!
  status: ServiceRequestStatus!
  organizationId: String!
  buyerId: String!
  providerId: String
  quotesCount: Int!
  newQuotesCount: Int!
  provider: Provider
  phase: String
  createdAt: String!
  updatedAt: String!
}

type ServiceRequestListResponse {
  list: [ServiceRequest!]!
  metaCounter: ServiceRequestMeta!
}

type ServiceRequestMeta {
  total: Int!
  open: Int!
  inProgress: Int!
  closed: Int!
  draft: Int!
}

type Provider {
  _id: String!
  orgName: String!
  orgAverageRating: Float!
  reviewsCount: Int!
  avatar: String
}
```

### 4.5 Query Type

```graphql
type Query {
  getBuyerOrganization: Organization
  getBuyerServiceRequests(input: ServiceRequestFilterInput): ServiceRequestListResponse!
}
```

### 4.6 Mutation Type

```graphql
type Mutation {
  imageUploader(file: Upload!, target: String!): String!
  createOrUpdateBuyerOrganization(input: OrganizationInput!): Organization!
  createServiceRequest(input: ServiceRequestInput!): ServiceRequest!
  updateServiceRequestStatus(requestId: String!, status: ServiceRequestStatus!): ServiceRequest!
}
```

---

## 5. Authentication & Authorization

### 5.1 JWT Token Structure

All mutations and queries require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

**Token Claims Expected:**
- `_id` or `userId` - User ID
- `userRole` - User role (should be "BUYER" for buyer features)
- `userEmail` - User email
- Other user claims as needed

### 5.2 Authorization Rules

1. **Organization Access:**
   - Buyer can only access their own organization
   - `getBuyerOrganization` returns organization linked to buyer's `_id`
   - `createOrUpdateOrganization` creates/updates organization for buyer's `_id`

2. **Service Request Access:**
   - Buyer can only create requests for their own organization
   - Buyer can only view/update their own service requests
   - Verify `buyerId` matches JWT `_id` on all operations

3. **File Upload:**
   - Only authenticated users can upload files
   - Validate `target` parameter matches user's permissions

---

## 6. Error Handling

### 6.1 Error Response Format

```graphql
type Error {
  message: String!
  code: String
  field: String
  extensions: JSON
}
```

### 6.2 Common Error Codes

| Code | Message | HTTP Status |
|------|---------|-------------|
| `UNAUTHENTICATED` | Authentication required | 401 |
| `FORBIDDEN` | Not authorized | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `VALIDATION_ERROR` | Invalid input data | 400 |
| `FILE_TOO_LARGE` | File exceeds size limit | 400 |
| `INVALID_FILE_TYPE` | File type not allowed | 400 |
| `ORGANIZATION_NOT_FOUND` | Organization does not exist | 404 |
| `INVALID_STATUS_TRANSITION` | Cannot change status | 400 |

### 6.3 Validation Error Format

For field-level validation errors:
```json
{
  "errors": [{
    "message": "Organization name is required",
    "extensions": {
      "code": "VALIDATION_ERROR",
      "field": "orgName"
    }
  }]
}
```

---

## 7. Database Schema Recommendations

### 7.1 Organization Collection/Table

```javascript
{
  _id: ObjectId,
  buyerId: ObjectId,        // Reference to User
  orgName: String,
  industry: String,
  location: String,
  description: String,
  orgWebsiteUrl: String,
  orgLogoImages: [String],  // Array of image URLs
  orgVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - buyerId (unique) - One organization per buyer
// - orgName (text index for search)
```

### 7.2 Service Request Collection/Table

```javascript
{
  _id: ObjectId,
  organizationId: ObjectId,  // Reference to Organization
  buyerId: ObjectId,         // Reference to User
  providerId: ObjectId,       // Reference to Provider (if assigned)
  title: String,
  description: String,
  category: String,
  subCategory: String,
  budgetMin: Number,
  budgetMax: Number,
  deadline: Date,
  urgency: String,            // "NORMAL", "URGENT", "CRITICAL"
  skills: [String],
  attachments: [String],      // Array of file URLs
  status: String,            // "DRAFT", "OPEN", "IN_PROGRESS", "CLOSED"
  quotesCount: Number,
  newQuotesCount: Number,
  phase: String,            // Current phase if in progress
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - buyerId
// - organizationId
// - status
// - createdAt (descending)
// - category
// - deadline
```

---

## 8. Implementation Checklist

### Backend Team Tasks:

- [ ] Implement `getBuyerOrganization` query
  - [ ] Extract buyerId from JWT
  - [ ] Query organization by buyerId
  - [ ] Return null if not found (not error)

- [ ] Implement `createOrUpdateBuyerOrganization` mutation
  - [ ] Check if organization exists for buyer
  - [ ] CREATE if not exists
  - [ ] UPDATE if exists
  - [ ] Validate all input fields
  - [ ] Return organization object

- [ ] Implement `imageUploader` mutation
  - [ ] Handle multipart/form-data upload
  - [ ] Validate file type (JPG, JPEG, PNG)
  - [ ] Validate file size (max 5MB)
  - [ ] Upload to storage (S3/Cloudinary/local)
  - [ ] Return public URL

- [ ] Implement `createServiceRequest` mutation
  - [ ] Validate organizationId belongs to buyer
  - [ ] Set default status to DRAFT
  - [ ] Validate all required fields
  - [ ] Create service request
  - [ ] Return created request

- [ ] Implement `updateServiceRequestStatus` mutation
  - [ ] Verify request belongs to buyer
  - [ ] Validate status transitions
  - [ ] Update status
  - [ ] Return updated request

- [ ] Implement `getBuyerServiceRequests` query
  - [ ] Filter by buyerId
  - [ ] Support filtering by status, category
  - [ ] Support pagination
  - [ ] Support sorting
  - [ ] Support search
  - [ ] Calculate meta counters
  - [ ] Return list with metadata

- [ ] Set up file storage
  - [ ] Configure S3/Cloudinary/local storage
  - [ ] Set up image processing (optional)
  - [ ] Configure CORS for file access

- [ ] Add authentication middleware
  - [ ] Verify JWT token
  - [ ] Extract user info
  - [ ] Check user role (BUYER)

- [ ] Add validation
  - [ ] Input validation for all mutations
  - [ ] Business rule validation
  - [ ] Return clear error messages

---

## 9. Testing Examples

### 9.1 Create Organization (First Time)

**Request:**
```graphql
mutation {
  createOrUpdateBuyerOrganization(input: {
    orgName: "Acme Corp"
    industry: "Technology & Software"
    location: "San Francisco, CA"
    description: "Leading enterprise technology solutions company..."
    orgLogoImages: ["https://storage.example.com/logo.png"]
  }) {
    _id
    orgName
    industry
  }
}
```

**Expected:** Creates new organization, returns with `_id`

### 9.2 Update Organization (After Creation)

**Request:** Same as above, but organization already exists

**Expected:** Updates existing organization, returns updated object

### 9.3 Upload Logo

**Request:** Multipart form-data (see section 2.1)

**Expected:** Returns image URL string

### 9.4 Create Service Request

**Request:**
```graphql
mutation {
  createServiceRequest(input: {
    organizationId: "org123"
    title: "Web Design & Brand Identity Refresh"
    description: "We need a complete redesign..."
    category: "Design & Creative"
    subCategory: "Visual Identity & Branding"
    budgetMin: 4500
    budgetMax: 6000
    deadline: "2024-12-31"
    urgency: URGENT
    skills: ["Figma", "Photoshop", "Brand Guidelines"]
    status: DRAFT
  }) {
    _id
    title
    status
  }
}
```

**Expected:** Creates service request with status DRAFT

### 9.5 Get Service Requests

**Request:**
```graphql
query {
  getBuyerServiceRequests(input: {
    status: OPEN
    page: 1
    limit: 10
    sortBy: "createdAt"
    sortOrder: "desc"
  }) {
    list {
      _id
      title
      status
      quotesCount
    }
    metaCounter {
      total
      open
    }
  }
}
```

**Expected:** Returns filtered and paginated list

---

## 10. Environment Variables Needed

Backend should configure:
- `JWT_SECRET` - For verifying JWT tokens
- `FILE_STORAGE_TYPE` - "s3", "cloudinary", or "local"
- `AWS_S3_BUCKET` - If using S3
- `CLOUDINARY_URL` - If using Cloudinary
- `MAX_FILE_SIZE` - Max upload size in bytes (default: 5MB)
- `ALLOWED_FILE_TYPES` - Comma-separated list (default: "image/jpeg,image/jpg,image/png")

---

## 11. Notes

1. **One Organization Per Buyer:** Each buyer can have only one organization. The `createOrUpdateOrganization` mutation handles both create and update.

2. **Service Request Status Flow:**
   - New requests start as `DRAFT`
   - User publishes → `DRAFT` → `OPEN`
   - Provider assigned → `OPEN` → `IN_PROGRESS`
   - Completed/Closed → `IN_PROGRESS`/`OPEN` → `CLOSED`

3. **File Upload:** Use a library like `graphql-upload` or `apollo-server-upload` to handle multipart uploads.

4. **Pagination:** Default page size should be 10, max 100.

5. **Date Format:** All dates should be ISO 8601 strings (e.g., "2024-12-31T00:00:00Z").

---

**Last Updated:** 2024-02-18

**Contact:** Frontend team for any clarifications
