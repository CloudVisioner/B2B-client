import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../libs/components/Navbar';
import Marketplace from '../libs/components/Marketplace';
import Footer from '../libs/components/Footer';
import { CategoryId } from '../libs/types';

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
    if (filters.budget && filters.budget !== 5000) query.budget = filters.budget.toString();
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
      <Navbar currentPage="marketplace" />
      <main className="main-content">
        <Marketplace 
          initialCategory={getInitialCategory()}
          initialFilters={{
            subcategory: subcategory ? (Array.isArray(subcategory) ? subcategory : [subcategory]) : [],
            location: (location as string) || 'All Countries',
            budget: budget ? parseInt(budget as string, 10) : 5000,
            sort: (sort as string) || 'Newest',
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
