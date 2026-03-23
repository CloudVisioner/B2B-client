import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Marketplace from '../libs/components/Marketplace';
import Footer from '../libs/components/Footer';
import { CategoryId } from '../libs/types';

const MARKETPLACE_SORT_OPTIONS = ['Newest', 'Cheapest', 'Highest Rated'] as const;

export default function MarketplacePage() {
  // ========== HOOKS & STATE ==========
  const router = useRouter();
  const { category, subcategory, location, budget, sort, page, search } = router.query;
  const lastQueryRef = useRef<string>('');

  // ========== UTILITIES ==========
  const getInitialCategory = (): CategoryId => {
    const categoryParam = category as CategoryId;
    if (categoryParam && ['it-software', 'business', 'marketing-sales', 'design-creative'].includes(categoryParam)) {
      return categoryParam;
    }
    return 'it-software';
  };

  const getInitialSort = (): (typeof MARKETPLACE_SORT_OPTIONS)[number] => {
    const s = typeof sort === 'string' ? sort : Array.isArray(sort) ? sort[0] : '';
    return MARKETPLACE_SORT_OPTIONS.includes(s as (typeof MARKETPLACE_SORT_OPTIONS)[number])
      ? (s as (typeof MARKETPLACE_SORT_OPTIONS)[number])
      : 'Newest';
  };

  // ========== HANDLERS ==========
  const handleSelectProvider = (id: string) => {
    // Preserve category filter when navigating to provider detail
    const categoryParam = category as CategoryId;
    if (categoryParam) {
      router.push(`/provider/${id}?fromCategory=${categoryParam}`);
    } else {
      router.push(`/provider/${id}`);
    }
  };

  const handleFilterChange = (filters: {
    category?: CategoryId;
    subcategory?: string[];
    location?: string;
    budget?: number;
    sort?: string;
    page?: number;
    search?: string;
  }) => {
    const query: Record<string, string | string[] | number> = {};
    
    if (filters.category) query.category = filters.category;
    if (filters.subcategory && filters.subcategory.length > 0) query.subcategory = filters.subcategory;
    if (filters.location && filters.location !== 'All Countries') query.location = filters.location;
    if (filters.budget != null && filters.budget < 10000) query.budget = filters.budget.toString();
    if (filters.sort && filters.sort !== 'Newest') query.sort = filters.sort;
    if (filters.page && filters.page > 1) query.page = filters.page.toString();
    if (filters.search) query.search = filters.search;

    // Check if query actually changed to prevent unnecessary updates
    const queryString = JSON.stringify(query);
    if (queryString !== lastQueryRef.current) {
      lastQueryRef.current = queryString;
      router.push({
        pathname: '/marketplace',
        query,
      }, undefined, { shallow: true });
    }
  };

  // ========== RENDER ==========
  return (
    <div className="app-container">
      <main className="main-content">
        <Marketplace 
          initialCategory={getInitialCategory()}
          initialFilters={{
            subcategory: subcategory ? (Array.isArray(subcategory) ? subcategory : [subcategory]) : [],
            location: (location as string) || 'All Countries',
            budget: budget ? parseInt(budget as string, 10) : 10000,
            sort: getInitialSort(),
            page: page ? parseInt(page as string, 10) : 1,
            search: (search as string) || '',
          }}
          onSelectProvider={handleSelectProvider}
          onFilterChange={handleFilterChange}
        />
      </main>
      <Footer />
    </div>
  );
}
