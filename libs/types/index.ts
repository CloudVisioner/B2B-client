import React from 'react';

export type CategoryId = 'it-software' | 'business' | 'marketing-sales' | 'design-creative';

export type PageId = 'home' | 'marketplace' | 'providers' | 'provider-profile';

export interface ServiceSubCategory {
  id: string;
  name: string;
}

export interface CaseStudy {
  title: string;
  metricLabel: string;
  metricValue: string;
  image: string;
}

// ============================================
// Backend Provider Types (from GraphQL)
// ============================================

export interface BackendProviderListItem {
  _id: string;
  orgName: string;
  orgDescription: string;
  orgAverageRating: number;
  reviewsCount: number;
  orgTotalProjects: number;
  orgResponseTimeAvg: string;
  startingRate: number;
  orgCountry: string;
  orgCity: string;
  location: string;
  flag: string;
  categoryId: string;
  subCategory: string;
  serviceTitle: string;
  avatar: string;
  badges: string[];
  color: string;
  orgVerified: boolean;
  orgLogoImages: string[];
  orgTotalLikes: number;
  orgTotalViews: number;
  industries: string[];
  createdAt: string;
}

export interface BackendProviderDetail extends BackendProviderListItem {
  bio: string;
  minProjectSize: number;
  establishmentYear: number;
  teamSize: number;
  orgWebsiteUrl: string;
  orgSkills: string[];
  email?: string; // Only shown if logged in
  phone?: string; // Only shown if logged in
  linkedIn?: string;
  twitter?: string;
  github?: string;
  updatedAt: string;
  orgOwnerData?: {
    _id: string;
    userNick: string;
    userEmail: string;
    userRole: string;
  };
}

export interface ProviderListResponse {
  list: BackendProviderListItem[];
  metaCounter: {
    total: number;
  };
}

// ============================================
// Frontend Provider Types (for UI components)
// ============================================

export interface Provider {
  id: string; // MongoDB ObjectId (e.g., "69864f6efcf99b93d1eca978")
  categoryId: CategoryId;
  subCategory: string;
  serviceTitle: string; // The primary service they offer in marketplace
  name: string; // Provider/Company name (mapped from orgName)
  description: string; // Mapped from orgDescription
  bio: string;
  icon: any; // For UI icons (not from backend)
  avatar: string; // Mapped from orgLogoImages[0] or avatar
  badges: string[]; // Mapped from orgVerified and other fields
  rating: number; // Mapped from orgAverageRating
  reviewsCount: number;
  projectsCompleted: number; // Mapped from orgTotalProjects
  responseTime: string; // Mapped from orgResponseTimeAvg
  startingRate: number; // in USD
  location: string; // Mapped from orgCountry or location
  city?: string; // Mapped from orgCity
  flag: string;
  expertise: string[]; // Mapped from orgSkills or industries
  caseStudies: CaseStudy[]; // Not in backend yet, keep for UI
  color: string;
  // Additional fields from backend
  establishmentYear?: number;
  teamSize?: number;
  industries?: string[];
  minProjectSize?: number;
  orgVerified?: boolean;
  orgTotalLikes?: number;
  orgTotalViews?: number;
  orgWebsiteUrl?: string;
  email?: string;
  phone?: string;
  linkedIn?: string;
  twitter?: string;
  github?: string;
}

export interface ServiceCategory {
  id: CategoryId;
  name: string;
  description: string;
  icon: any;
  subCategories: ServiceSubCategory[];
  count: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Testimonial {
  text: string;
  author: string;
  role: string;
  avatar: string;
}
