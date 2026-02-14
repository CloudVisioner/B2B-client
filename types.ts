// Fix: Added React import to resolve "Cannot find namespace 'React'" error when using React.ReactNode
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

export interface Provider {
  id: number;
  categoryId: CategoryId;
  subCategory: string;
  serviceTitle: string; // The primary service they offer in marketplace
  name: string; // Provider/Company name
  description: string;
  bio: string;
  icon: any;
  avatar: string;
  badges: string[];
  rating: number;
  reviewsCount: number; // Added reviews count
  projectsCompleted: number;
  responseTime: string;
  startingRate: number; // in USD
  location: string;
  city?: string; // Added city
  flag: string;
  expertise: string[];
  caseStudies: CaseStudy[];
  color: string;
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