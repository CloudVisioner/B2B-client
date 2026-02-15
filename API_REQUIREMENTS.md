# 📋 Buttons, Functions & API Requirements

## 🔐 Authentication Pages

### **Login Page** (`/login`)

#### Buttons & Functions:
1. **Role Selection Buttons**
   - `onClick={() => setSelectedRole('buyer')}` - Select buyer role
   - `onClick={() => setSelectedRole('provider')}` - Select provider role

2. **Sign In Button**
   - `type="submit"` - Submit login form
   - **Function**: Authenticate user with email/password

3. **Sign in with Google Button**
   - `type="button"` - OAuth Google login
   - **Function**: Authenticate via Google OAuth

#### Required APIs:
```graphql
# Mutation
mutation LOGIN($email: String!, $password: String!) {
  logIn(email: $email, password: $password) {
    _id
    memberNick
    memberType
    memberStatus
    memberImage
    memberPhone
    memberAddress
    memberDesc
    accessToken
  }
}

mutation GOOGLE_LOGIN($token: String!) {
  googleLogIn(token: $token) {
    _id
    memberNick
    memberType
    memberStatus
    memberImage
    accessToken
  }
}
```

---

### **Signup Page** (`/signup`)

#### Buttons & Functions:
1. **Role Selection Radio Buttons**
   - `onChange={() => setSelectedRole('buyer')}` - Select buyer role
   - `onChange={() => setSelectedRole('provider')}` - Select provider role

2. **Create Account Button**
   - `type="submit"` - Submit signup form
   - **Function**: Register new user account

#### Required APIs:
```graphql
mutation SIGNUP($input: SignUpInput!) {
  signUp(input: $input) {
    _id
    memberNick
    memberType
    memberStatus
    memberImage
    accessToken
  }
}

# Input Type
input SignUpInput {
  fullName: String!
  email: String!
  password: String!
  memberType: String! # "buyer" or "provider"
}
```

---

## 🏠 Home Page (`/`)

### **Hero Section**

#### Buttons & Functions:
1. **"I want to Hire" Button**
   - `onClick={onWantToHire}` → `router.push('/signup?role=buyer')`
   - **Function**: Navigate to signup as buyer

2. **"I want to Work" Button**
   - `onClick={onWantToWork}` → `router.push('/signup?role=provider')`
   - **Function**: Navigate to signup as provider

#### Required APIs:
- None (navigation only)

---

### **Top Categories Section**

#### Buttons & Functions:
1. **Category Cards**
   - `onClick={() => onBrowse(cat.id)}` → `router.push('/marketplace?category=${categoryId}')`
   - **Function**: Navigate to marketplace with category filter

2. **"View all categories" Button**
   - `onClick={() => onBrowse('it-software')}` → Navigate to marketplace
   - **Function**: Navigate to marketplace

#### Required APIs:
- None (navigation only)

---

## 🛒 Marketplace Page (`/marketplace`)

### **Filter Sidebar**

#### Buttons & Functions:
1. **Category Selection Buttons**
   - `onClick={() => handleCategoryChange(cat.id)}`
   - **Function**: Filter providers by category
   - **Updates URL**: `?category=it-software`

2. **Location Dropdown**
   - `onChange={(e) => handleLocationChange(e.target.value)}`
   - **Function**: Filter by country/location
   - **Updates URL**: `?location=United%20States`

3. **Sub-category Checkboxes**
   - `onChange={() => toggleSubCat(item.id)}`
   - **Function**: Filter by sub-category
   - **Updates URL**: `?subcategory=web-app-development`

4. **Budget Reset Button**
   - `onClick={() => handleBudgetChange(5000)}`
   - **Function**: Reset budget filter to default

5. **Budget Slider**
   - `onChange={(e) => handleBudgetChange(parseInt(e.target.value))}`
   - **Function**: Filter by maximum budget
   - **Updates URL**: `?budget=5000`

6. **Sort Dropdown**
   - `onClick={() => handleSortChange(opt)}`
   - **Options**: "Premium Partners", "Cheapest", "Newest", "Highest Rated"
   - **Function**: Sort providers
   - **Updates URL**: `?sort=Premium%20Partners`

#### Required APIs:
```graphql
query GET_PROVIDERS($input: ProviderSearchInput!) {
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

# Input Type
input ProviderSearchInput {
  categoryId: String
  subCategory: [String]
  location: String
  maxBudget: Int
  sortBy: String # "Premium Partners" | "Cheapest" | "Newest" | "Highest Rated"
  page: Int
  limit: Int
  search: String
}
```

---

### **Provider Cards**

#### Buttons & Functions:
1. **Provider Card Click**
   - `onClick={() => onSelectProvider(provider.id)}`
   - **Function**: Navigate to provider detail page
   - **URL**: `/provider/${providerId}?fromCategory=${category}`

2. **"View Details" Button** (on provider card)
   - `onClick={() => onSelectProvider(provider.id)}`
   - **Function**: Navigate to provider detail

#### Required APIs:
- Uses same `GET_PROVIDERS` query

---

### **Pagination**

#### Buttons & Functions:
1. **Previous Page Button**
   - `onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}`
   - **Function**: Go to previous page
   - **Updates URL**: `?page=1`

2. **Page Number Buttons**
   - `onClick={() => setCurrentPage(page)}`
   - **Function**: Jump to specific page
   - **Updates URL**: `?page=2`

3. **Next Page Button**
   - `onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}`
   - **Function**: Go to next page
   - **Updates URL**: `?page=3`

#### Required APIs:
- Uses same `GET_PROVIDERS` query with pagination

---

## 👤 Provider Detail Page (`/provider/[id]`)

### **Header Actions**

#### Buttons & Functions:
1. **"Request Quote" Button** (Logged in only)
   - **Function**: Create quote request for provider
   - **Required**: User must be logged in

2. **"Book Consultation" Button** (Logged in only)
   - **Function**: Schedule consultation with provider
   - **Required**: User must be logged in

3. **"Sign Up to Contact" Button** (Guest)
   - `onClick={() => router.push('/signup?role=buyer')}`
   - **Function**: Navigate to signup

#### Required APIs:
```graphql
mutation REQUEST_QUOTE($input: QuoteRequestInput!) {
  requestQuote(input: $input) {
    _id
    providerId
    buyerId
    status
    message
    createdAt
  }
}

mutation BOOK_CONSULTATION($input: ConsultationInput!) {
  bookConsultation(input: $input) {
    _id
    providerId
    buyerId
    scheduledAt
    status
  }
}

query GET_PROVIDER($id: String!) {
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
  }
}
```

---

### **Portfolio Section**

#### Buttons & Functions:
1. **"Sign Up" Button** (Guest - Portfolio locked)
   - `onClick={() => router.push('/signup?role=buyer')}`
   - **Function**: Navigate to signup to view portfolio

#### Required APIs:
```graphql
query GET_PROVIDER_PORTFOLIO($providerId: String!) {
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
```

---

### **Contact Information Section**

#### Buttons & Functions:
1. **"Get Contact Details" Button** (Logged in only)
   - **Function**: Reveal provider contact information
   - **Required**: User must be logged in

2. **"Sign Up" Button** (Guest)
   - `onClick={() => router.push('/signup?role=buyer')}`
   - **Function**: Navigate to signup

#### Required APIs:
```graphql
query GET_PROVIDER_CONTACT($providerId: String!) {
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
```

---

### **Recommended Providers Section**

#### Buttons & Functions:
1. **Recommended Provider Card Click**
   - `onClick={() => onSelectProvider(recProvider.id)}`
   - **Function**: Navigate to another provider detail page

2. **"View Details" Button**
   - `onClick={() => onSelectProvider(recProvider.id)}`
   - **Function**: Navigate to provider detail

#### Required APIs:
```graphql
query GET_RECOMMENDED_PROVIDERS($providerId: String!, $categoryId: String!) {
  getRecommendedProviders(providerId: $providerId, categoryId: $categoryId) {
    _id
    name
    serviceTitle
    rating
    startingRate
    avatar
    badges
    # ... same fields as GET_PROVIDERS
  }
}
```

---

### **CTA Footer**

#### Buttons & Functions:
1. **"Browse Services" Button**
   - `onClick={onBrowseServices}` → `router.push('/marketplace')`
   - **Function**: Navigate back to marketplace

#### Required APIs:
- None (navigation only)

---

## 👥 Providers Page (`/providers`)

### **Category Filter**

#### Buttons & Functions:
1. **"All" Button**
   - `onClick={() => setActiveCat('all')}`
   - **Function**: Show all providers

2. **Category Buttons**
   - `onClick={() => setActiveCat(cat.id)}`
   - **Function**: Filter by category

#### Required APIs:
- Uses same `GET_PROVIDERS` query

---

### **Provider Cards**

#### Buttons & Functions:
1. **Provider Card Click**
   - `onClick={() => onSelectProvider(p.id)}`
   - **Function**: Navigate to provider detail

2. **"View Details" Button**
   - `onClick={() => onSelectProvider(p.id)}`
   - **Function**: Navigate to provider detail

#### Required APIs:
- Uses same `GET_PROVIDERS` query

---

### **Pagination**

#### Buttons & Functions:
- Same as Marketplace pagination

#### Required APIs:
- Uses same `GET_PROVIDERS` query with pagination

---

## 🧭 Navigation (Navbar)

#### Buttons & Functions:
1. **Logo Click**
   - `href="/"` - Navigate to home

2. **Home Link**
   - `href="/"` - Navigate to home

3. **Categories Link**
   - `href="/marketplace"` - Navigate to marketplace

4. **Providers Link**
   - `href="/providers"` - Navigate to providers page

5. **Dark Mode Toggle**
   - `onClick={toggleTheme}` - Toggle dark/light mode
   - **Function**: Update theme (localStorage)

6. **Sign Up Link**
   - `href="/signup"` - Navigate to signup

7. **Login Link**
   - `href="/login"` - Navigate to login

#### Required APIs:
- None (navigation only)

---

## 📊 Summary of Required GraphQL APIs

### **Queries (GET Operations)**

1. **GET_PROVIDERS** - Search/filter providers
2. **GET_PROVIDER** - Get single provider details
3. **GET_PROVIDER_PORTFOLIO** - Get provider case studies/portfolio
4. **GET_PROVIDER_CONTACT** - Get provider contact info
5. **GET_RECOMMENDED_PROVIDERS** - Get similar providers

### **Mutations (POST/PUT/DELETE Operations)**

1. **LOGIN** - User authentication
2. **GOOGLE_LOGIN** - OAuth authentication
3. **SIGNUP** - User registration
4. **REQUEST_QUOTE** - Create quote request
5. **BOOK_CONSULTATION** - Schedule consultation

### **Subscriptions (Real-time Updates)**

1. **QUOTE_STATUS_CHANGED** - Real-time quote updates
2. **CONSULTATION_UPDATED** - Real-time consultation updates

---

## 🔑 Authentication Flow

### **Required Functions in `libs/auth/index.ts`:**

```typescript
// Login
logIn(email: string, password: string): Promise<User>

// Signup
signUp(input: SignUpInput): Promise<User>

// Google OAuth
googleLogIn(token: string): Promise<User>

// Logout
logOut(): void

// Update user info from JWT
updateUserInfo(token: string): void

// Check if logged in
isLoggedIn(): boolean

// Get current user
getCurrentUser(): User | null
```

---

## 📝 Notes

- All provider IDs are **strings** (MongoDB-style: `fs4o8o3hfuhgf7sfh`)
- All filters are synced with URL query parameters
- Filters persist on page reload
- Category context is preserved when navigating to provider details
- User must be logged in to:
  - View provider portfolios
  - Request quotes
  - Book consultations
  - View contact information
