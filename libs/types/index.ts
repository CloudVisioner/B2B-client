import React from 'react';

export type CategoryId = 'it-software' | 'business' | 'marketing-sales' | 'design-creative';

export type PageId = 'home' | 'marketplace' | 'results' | 'provider-profile' | 'articles';

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


export interface BackendProviderListItem {
  _id: string;
  // New field names (preferred)
  organizationName?: string;
  organizationDescription?: string;
  organizationHourlyRate?: number;
  organizationLocation?: string;
  organizationImage?: string | string[];
  // Old field names (for backward compatibility)
  orgName?: string;
  orgDescription?: string;
  startingRate?: number;
  location?: string;
  orgLogoImages?: string[];
  // Common fields
  orgAverageRating?: number | null;
  reviewsCount: number;
  orgTotalProjects: number;
  orgResponseTimeAvg: string;
  organizationCountry: string;
  orgCity?: string; // Optional - not always returned by backend
  flag: string;
  budgetRange?: string | number | null; // Budget range as string (e.g., "1000-10000") or number
      categoryId: string | string[];
      subCategory: string | string[];
  serviceTitle: string;
  avatar: string;
  badges: string[];
  color: string;
  orgVerified: boolean;
  orgTotalLikes: number;
  orgTotalViews: number;
  industries?: string[] | null;
  createdAt: string;
}

export interface BackendProviderDetail extends BackendProviderListItem {
  bio: string;
  minProjectSize: number;
  establishmentYear: number;
  teamSize: number;
  orgWebsiteUrl: string;
  orgSkills?: string[] | null;
  email?: string;
  phone?: string;
  linkedIn?: string;
  twitter?: string;
  github?: string;
  updatedAt: string;
  myRating?: number | null;
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


export interface Provider {
  id: string;
      categoryId: CategoryId | CategoryId[];
      subCategory: string | string[];
  serviceTitle: string;
  name: string;
  description: string;
  bio: string;
  icon: any;
  avatar: string;
  badges: string[];
  rating: number;
  reviewsCount: number;
  projectsCompleted: number;
  responseTime: string;
  startingRate: number;
  budgetRange?: string | number | null; // Budget range as string (e.g., "1000-10000") or number
  location: string;
  city?: string;
  flag: string;
  expertise: string[];
  caseStudies: CaseStudy[];
  color: string;
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


export interface BackendTestimonial {
  _id: string;
  providerId?: string;
  text: string;
  rating: number;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  authorAvatar?: string;
  projectTitle?: string;
  isVerified?: boolean;
  createdAt: string;
}

export interface TestimonialListResponse {
  list: BackendTestimonial[];
  metaCounter: {
    total: number;
  };
}


export interface PortfolioMetric {
  label: string;
  value: string;
}

export interface BackendPortfolio {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  images: string[];
  metrics: PortfolioMetric[];
  tags?: string[];
  clientName?: string;
  clientLogo?: string;
  industry?: string;
  projectUrl?: string;
  providerId?: string;
  providerName?: string;
  providerAvatar?: string;
  completedAt?: string;
  createdAt: string;
}


export interface LandingStatistics {
  totalProviders: number;
  totalProjectsCompleted: number;
  totalIndustriesServed: number;
  totalClientsServed: number;
  totalCountriesReached: number;
  averageSatisfactionRate: number;
  totalActiveServiceRequests: number;
  platformEstablishedYear: number;
}


export interface ClientTestimonial {
  id: string;
  text: string;
  rating: number;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  projectTitle?: string;
  isVerified?: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  images: string[];
  metrics: PortfolioMetric[];
  tags: string[];
  clientName?: string;
  clientLogo?: string;
  industry?: string;
  projectUrl?: string;
  providerName?: string;
  providerAvatar?: string;
  completedAt?: string;
}
