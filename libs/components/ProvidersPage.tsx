import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import {
  Search, ChevronDown, Star, ArrowRight, CheckCircle, MapPin,
  Briefcase, Building2, ChevronLeft, ChevronRight, Loader2, AlertCircle,
  Code, Palette, Megaphone,
} from 'lucide-react';
import { ALL_PROVIDERS, CATEGORIES, COUNTRIES } from './Marketplace';
import { CategoryId, Provider } from '../types/index';
import { GET_PROVIDERS_BY_CATEGORY } from '../../apollo/user/query';
import { mapBackendProviderToList, mapCategoryToBackend } from '../utils/providerMapper';

interface ProvidersPageProps {
  onSelectProvider: (id: string) => void;
}

const ProvidersPage: React.FC<ProvidersPageProps> = ({ onSelectProvider }) => {
  const [activeCat, setActiveCat] = useState<CategoryId | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState('All Countries');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Backend query — only fires when a specific category is selected
  const backendCategoryId = activeCat !== 'all' ? mapCategoryToBackend(activeCat) : null;

  const { data, loading, error, refetch } = useQuery(GET_PROVIDERS_BY_CATEGORY, {
    variables: {
      input: {
        categoryId: backendCategoryId,
        page: 1,
        limit: 100, // fetch all for client-side pagination
      },
    },
    skip: !backendCategoryId,
    fetchPolicy: 'cache-and-network',
  });

  // Build provider list: backend when available, otherwise mock
  const providers = useMemo(() => {
    let list: Provider[];

    if (activeCat !== 'all' && data?.getProvidersByCategory?.list?.length > 0) {
      list = data.getProvidersByCategory.list.map(mapBackendProviderToList);
    } else if (activeCat === 'all') {
      list = ALL_PROVIDERS;
    } else {
      // Specific category selected but no backend data — filter mock
      list = ALL_PROVIDERS.filter((p) => {
        const catIds = Array.isArray(p.categoryId) ? p.categoryId : [p.categoryId];
        return catIds.includes(activeCat);
      });
    }

    // Location filter
    if (selectedLocation !== 'All Countries') {
      list = list.filter((p) => p.location === selectedLocation);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.serviceTitle?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }

    return list;
  }, [activeCat, data, selectedLocation, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(providers.length / itemsPerPage);
  const paginatedProviders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return providers.slice(start, start + itemsPerPage);
  }, [providers, currentPage]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCat, selectedLocation, searchQuery]);

  // Find category icon for a provider
  const getCategoryIcon = (provider: Provider) => {
    const catId = Array.isArray(provider.categoryId) ? provider.categoryId[0] : provider.categoryId;
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (cat) return cat.icon;
    return Code; // fallback
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800 min-h-screen py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-400 dark:text-slate-500 mb-6">
          <a href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</a>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300">Providers</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Browse Organizations</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Discover verified organizations and agencies with proven track records across IT, Business, Marketing, and Design.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ───── Sidebar Filters ───── */}
          <aside className="w-full lg:w-64 space-y-8">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-3 text-base focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 dark:focus:ring-indigo-900 dark:text-white transition-all outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filter by Category</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveCat('all')}
                  className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border text-base font-semibold transition-all ${
                    activeCat === 'all'
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/50'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-600 border-slate-100 dark:border-slate-700'
                  }`}
                >
                  All Organizations
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border text-base font-semibold transition-all ${
                      activeCat === cat.id
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/50'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-600 border-slate-100 dark:border-slate-700'
                    }`}
                  >
                    <cat.icon className={`w-5 h-5 ${activeCat === cat.id ? 'text-white' : 'text-indigo-600'}`} />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</h4>
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-4 pr-10 text-base dark:text-white focus:outline-none cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-600 transition-colors"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.flag} &nbsp; {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
              </div>
            </div>
          </aside>

          {/* ───── Main Content ───── */}
          <div className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
                {loading && activeCat !== 'all' ? (
                  <span>Loading organizations...</span>
                ) : (
                  <>
                    Showing{' '}
                    <span className="text-slate-900 dark:text-white font-bold">{paginatedProviders.length}</span> of{' '}
                    <span className="text-slate-900 dark:text-white font-bold">{providers.length}</span> organizations
                  </>
                )}
              </p>
            </div>

            {/* Loading State */}
            {loading && activeCat !== 'all' && providers.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Loading organizations...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  <div>
                    <h3 className="font-bold text-red-900 dark:text-red-200 mb-1">Error loading organizations</h3>
                    <p className="text-sm text-red-700 dark:text-red-300">{error.message}</p>
                  </div>
                </div>
                <button
                  onClick={() => refetch()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && providers.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">No organizations found</p>
                <p className="text-slate-500 dark:text-slate-500 text-sm">Try adjusting your filters or search terms</p>
              </div>
            )}

            {/* ───── Organization Cards (Marketplace Style) ───── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedProviders.map((p) => {
                const IconComponent = getCategoryIcon(p);
                const subCats = Array.isArray(p.subCategory) ? p.subCategory : [p.subCategory];
                
                // Use organization image or avatar, or fallback to a placeholder gradient
                const imageUrl = p.avatar || p.icon;
                const hasImage = imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('http');

                return (
                  <div
                    key={p.id}
                    className="group relative aspect-[3/4] overflow-hidden rounded-[4px] bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/10 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer"
                    onClick={() => onSelectProvider(p.id)}
                  >
                    {/* Top 60% Image Area */}
                    <div className="h-[60%] w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {hasImage ? (
                        <img 
                          src={imageUrl} 
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className={`w-full h-full ${p.color || 'bg-indigo-50 text-indigo-600'} flex items-center justify-center`}>
                          <IconComponent className="w-16 h-16 opacity-50" />
                        </div>
                      )}
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Verified Badge - Top Right */}
                      {(p.badges?.includes('VERIFIED') || p.orgVerified) && (
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
                          <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      )}
                    </div>

                    {/* Bottom 40% Content Area - Glass Effect */}
                    <div className="h-[40%] p-5 flex flex-col justify-between bg-white dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-100 dark:border-white/5 relative z-10">
                      <div className="space-y-2">
                        {/* Organization Name */}
                        <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-tight tracking-tight">
                          {p.name}
                        </h3>
                        
                        {/* Category + Rating Row */}
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[11px] font-semibold tracking-wide text-slate-600 dark:text-slate-400 uppercase px-2 py-1 bg-slate-100 dark:bg-white/5 rounded backdrop-blur-sm">
                            {subCats.filter(s => s)[0] || 'Provider'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {(p.rating ?? 0).toFixed(1)}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              ({p.reviewsCount ?? 0})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing + CTA */}
                      <div className="flex items-center justify-between w-full pt-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Starting from</span>
                            <span className="text-base font-bold text-slate-900 dark:text-white">
                              ${p.startingRate ?? 0}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/hr</span>
                          </div>
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                          See details →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ───── Pagination ───── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 10) {
                      pageNum = i + 1;
                    } else if (currentPage <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 4) {
                      pageNum = totalPages - 9 + i;
                    } else {
                      pageNum = currentPage - 4 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 text-sm font-semibold rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvidersPage;
