# 📋 Provider Data Requirements - Complete Backend Schema

## 🎯 Overview
This document outlines **ALL** the information needed from the backend to render providers dynamically in the marketplace, provider listings, and provider detail pages.

---

## 🔍 **Provider Listing/Card View** (`GET_PROVIDERS` query)

### **Required Fields for Provider Cards:**

```graphql
query GetProviders($input: ProviderSearchInput!) {
  getProviders(input: $input) {
    # ============================================
    # IDENTIFICATION
    # ============================================
    _id: String!                    # Provider ID (MongoDB ObjectId format: "fs4o8o3hfuhgf7sfh")
    
    # ============================================
    # CATEGORY & CLASSIFICATION
    # ============================================
    categoryId: String!              # Main category: "it-software" | "business" | "marketing-sales" | "design-creative"
    subCategory: String!             # Sub-category ID: "web-app-development" | "data-ai" | "digital-marketing" | etc.
    serviceTitle: String!            # Primary service title shown in marketplace (e.g., "Advanced Threat Intelligence")
    
    # ============================================
    # BASIC INFORMATION
    # ============================================
    name: String!                    # Provider/Company name (e.g., "Fortress Cyber Defense")
    description: String!             # Short description (shown in cards, max ~150 chars)
    bio: String!                     # Longer bio/about text (shown in detail page)
    
    # ============================================
    # VISUAL ASSETS
    # ============================================
    avatar: String!                  # Profile/logo image URL
    badges: [String!]!               # Array of badges: ["VERIFIED", "TOP RATED", "CLOUD PARTNER"]
    color: String!                   # Theme color class: "bg-indigo-50 text-indigo-600"
    
    # ============================================
    # LOCATION & GEOGRAPHY
    # ============================================
    location: String!                # Country name: "United States" | "Germany" | "United Kingdom" | etc.
    city: String!                    # City name: "San Francisco" | "Berlin" | "London"
    flag: String!                    # Country flag emoji: "🇺🇸" | "🇩🇪" | "🇬🇧"
    
    # ============================================
    # PRICING
    # ============================================
    startingRate: Float!             # Starting hourly rate in USD (e.g., 150.0)
    
    # ============================================
    # PERFORMANCE METRICS
    # ============================================
    rating: Float!                   # Average rating (0.0 - 5.0, e.g., 4.9)
    reviewsCount: Int!               # Total number of reviews (e.g., 42)
    projectsCompleted: Int!          # Total projects completed (e.g., 128)
    responseTime: String!            # Average response time: "< 2 hours" | "< 1 hour" | "< 3 hours"
    
    # ============================================
    # EXPERTISE & SKILLS
    # ============================================
    expertise: [String!]!            # Array of skills/expertise: ["Strategy", "Data", "Operations", "IT Systems"]
    
    # ============================================
    # CASE STUDIES (Optional for listing)
    # ============================================
    caseStudies: [CaseStudy!]        # Array of case studies (optional in listing)
      title: String!
      metricLabel: String!           # e.g., "REVENUE", "UPTIME", "OPEX"
      metricValue: String!           # e.g., "+40%", "99.99%", "-25%"
      image: String!                 # Case study image URL
  }
}
```

---

## 👤 **Provider Detail Page** (`GET_PROVIDER` query)

### **Additional Fields Needed for Detail Page:**

```graphql
query GetProvider($id: String!) {
  getProvider(id: $id) {
    # ============================================
    # ALL FIELDS FROM LISTING (above)
    # ============================================
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
    caseStudies
    color
    
    # ============================================
    # ADDITIONAL DETAIL FIELDS
    # ============================================
    establishmentYear: Int!          # Year company was established (e.g., 2015)
    teamSize: Int!                   # Number of team members (e.g., 45)
    industries: [String!]!           # Industries served: ["Technology", "Finance", "Healthcare", "Retail", "Manufacturing"]
    minProjectSize: Float!           # Minimum project size in USD (e.g., 5000.0)
  }
}
```

---

## 📸 **Provider Portfolio** (`GET_PROVIDER_PORTFOLIO` query)

### **Portfolio/Case Studies Data:**

```graphql
query GetProviderPortfolio($providerId: String!) {
  getProviderPortfolio(providerId: $providerId) {
    _id: String!
    title: String!                   # Project/case study title
    description: String!             # Detailed description
    images: [String!]!               # Array of image URLs
    metrics: [Metric!]!              # Key metrics/achievements
      label: String!                 # Metric label: "Revenue Growth", "Cost Reduction"
      value: String!                 # Metric value: "+40%", "-25%"
    clientName: String!              # Client name (if allowed to share)
    completedAt: String!             # ISO date string: "2024-01-15T00:00:00.000Z"
  }
}
```

---

## 📞 **Provider Contact Information** (`GET_PROVIDER_CONTACT` query)

### **Contact Details (Only for Logged-in Users):**

```graphql
query GetProviderContact($providerId: String!) {
  getProviderContact(providerId: $providerId) {
    email: String!                   # Contact email
    phone: String!                   # Contact phone number
    website: String!                 # Company website URL
    socialLinks: SocialLinks!       # Social media links
      linkedin: String
      twitter: String
      github: String
  }
}
```

---

## 🔍 **Filtering & Search Input** (`ProviderSearchInput`)

### **Input Parameters for Filtering:**

```graphql
input ProviderSearchInput {
  # ============================================
  # CATEGORY FILTERS
  # ============================================
  categoryId: String                 # Filter by main category
  subCategory: [String!]              # Filter by sub-categories (array)
  
  # ============================================
  # LOCATION FILTERS
  # ============================================
  location: String                    # Filter by country: "United States" | "Germany" | "All Countries"
  city: String                        # Filter by city (optional)
  
  # ============================================
  # PRICING FILTERS
  # ============================================
  maxBudget: Float                    # Maximum hourly rate (e.g., 5000.0)
  minBudget: Float                   # Minimum hourly rate (e.g., 50.0)
  
  # ============================================
  # SORTING
  # ============================================
  sortBy: String                      # Sort option: "Premium Partners" | "Cheapest" | "Highest Rated" | "Newest"
  
  # ============================================
  # PAGINATION
  # ============================================
  page: Int                           # Page number (default: 1)
  limit: Int                          # Items per page (default: 12)
  
  # ============================================
  # SEARCH
  # ============================================
  search: String                      # Search query (searches name, description, serviceTitle)
  
  # ============================================
  # ADDITIONAL FILTERS (Optional)
  # ============================================
  minRating: Float                    # Minimum rating filter (e.g., 4.0)
  verifiedOnly: Boolean              # Only show verified providers
  badges: [String!]                   # Filter by specific badges: ["VERIFIED", "TOP RATED"]
}
```

---

## 📊 **Recommended Providers** (`GET_RECOMMENDED_PROVIDERS` query)

### **Fields for Similar/Recommended Providers:**

```graphql
query GetRecommendedProviders($providerId: String!, $categoryId: String!) {
  getRecommendedProviders(providerId: $providerId, categoryId: $categoryId) {
    _id: String!
    name: String!
    serviceTitle: String!
    rating: Float!
    startingRate: Float!
    avatar: String!
    badges: [String!]!
    location: String!
    city: String!
    flag: String!
    description: String!
    reviewsCount: Int!
    projectsCompleted: Int!
    responseTime: String!
    subCategory: String!
    color: String!
  }
}
```

---

## 🎨 **UI Display Mapping**

### **Where Each Field is Used:**

| Field | Used In | Display Location |
|-------|---------|------------------|
| `_id` | All | URL routing, API calls |
| `categoryId` | Marketplace | Category filter, navigation |
| `subCategory` | Marketplace, Cards | Sub-category badge |
| `serviceTitle` | Cards, Detail | Main heading |
| `name` | Cards, Detail | Company name badge |
| `description` | Cards | Short description (line-clamp-2) |
| `bio` | Detail Page | About section |
| `avatar` | Cards, Detail | Profile image |
| `badges` | Cards, Detail | Verified badge indicator |
| `color` | Cards | Service icon background |
| `location` | Cards, Detail | Location badge |
| `city` | Cards, Detail | City name |
| `flag` | Cards, Detail | Country flag emoji |
| `startingRate` | Cards, Detail | Pricing display |
| `rating` | Cards, Detail | Star rating |
| `reviewsCount` | Cards, Detail | Review count |
| `projectsCompleted` | Cards, Detail | Projects stat |
| `responseTime` | Cards, Detail | Response time stat |
| `expertise` | Detail | Skills tags |
| `establishmentYear` | Detail | About section |
| `teamSize` | Detail | About section |
| `industries` | Detail | Industries served section |
| `minProjectSize` | Detail | Project size info |
| `caseStudies` | Detail | Portfolio section |

---

## 🔄 **Data Flow Example**

### **1. Marketplace Page Load:**
```
User visits: /marketplace?category=it-software&location=United States&budget=5000

Backend receives:
{
  categoryId: "it-software",
  location: "United States",
  maxBudget: 5000,
  page: 1,
  limit: 12,
  sortBy: "Premium Partners"
}

Backend returns: Array of Provider objects with all listing fields
```

### **2. Provider Detail Page:**
```
User clicks provider: /provider/fs4o8o3hfuhgf7sfh

Backend receives: { id: "fs4o8o3hfuhgf7sfh" }

Backend returns: Full Provider object + Portfolio + Contact (if logged in)
```

### **3. Filter Change:**
```
User selects subcategory: "web-app-development"

Backend receives:
{
  categoryId: "it-software",
  subCategory: ["web-app-development"],
  location: "United States",
  maxBudget: 5000,
  page: 1
}

Backend returns: Filtered Provider array
```

---

## ✅ **Summary Checklist**

### **Minimum Required Fields for Basic Display:**
- ✅ `_id`, `name`, `serviceTitle`, `description`
- ✅ `categoryId`, `subCategory`
- ✅ `location`, `city`, `flag`
- ✅ `avatar`, `badges`, `color`
- ✅ `rating`, `reviewsCount`, `startingRate`
- ✅ `responseTime`, `projectsCompleted`

### **Additional Fields for Full Detail Page:**
- ✅ `bio`, `establishmentYear`, `teamSize`
- ✅ `industries`, `minProjectSize`
- ✅ `expertise`, `caseStudies`

### **Optional but Recommended:**
- ✅ Portfolio data (separate query)
- ✅ Contact information (separate query, logged-in only)
- ✅ Recommended providers (separate query)

---

## 🚀 **Backend Implementation Notes**

1. **Filtering**: Support filtering by `categoryId`, `subCategory`, `location`, `maxBudget`
2. **Sorting**: Support sorting by `sortBy` parameter (Premium Partners = verified + top rated)
3. **Pagination**: Support `page` and `limit` for pagination
4. **Search**: Support text search across `name`, `description`, `serviceTitle`
5. **Performance**: Consider caching frequently accessed provider data
6. **Image URLs**: Ensure all image URLs are absolute and accessible
7. **Badges**: Return array of badge strings that match UI expectations
8. **Location**: Return both `location` (country) and `city` for granular filtering

---

**This document provides a complete reference for all provider data needed from the backend!** 🎯
