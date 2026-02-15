import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Star, ArrowRight, UserCheck, MapPin, Briefcase, Zap, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import { ALL_PROVIDERS, CATEGORIES, COUNTRIES } from './Marketplace';
import { CategoryId } from '../types/index';

interface ProvidersPageProps {
  onSelectProvider: (id: string) => void;
}

const ProvidersPage: React.FC<ProvidersPageProps> = ({ onSelectProvider }) => {
  const [activeCat, setActiveCat] = useState<CategoryId | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState('United States');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const providers = activeCat === 'all' 
    ? ALL_PROVIDERS 
    : ALL_PROVIDERS.filter(p => p.categoryId === activeCat);

  const totalPages = Math.ceil(providers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProviders = providers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCat, selectedLocation]);

  return (
    <div className="bg-slate-50 dark:bg-slate-800 min-h-screen py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Browse Expert Providers</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">Find verified agencies and independent professionals with proven track records in enterprise transformation.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 space-y-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filter by category</h4>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setActiveCat('all')}
                    className={`text-left px-4 py-3 rounded-xl border text-base font-semibold transition-all ${activeCat === 'all' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg dark:shadow-indigo-900/50' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-100 dark:hover:border-indigo-600 border-slate-100 dark:border-slate-700'}`}
                >
                  All Categories
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`text-left px-4 py-3 rounded-xl border text-base font-semibold transition-all ${activeCat === cat.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:border-indigo-100'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Provider Location</h4>
              <div className="relative">
                <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-4 pr-10 text-base dark:text-white focus:outline-none cursor-pointer"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.name} value={c.name}>{c.flag} &nbsp; {c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </aside>

          <div className="flex-1 w-full">
            <div className="space-y-3 mb-8">
              {paginatedProviders.map(p => (
              <div 
                key={p.id} 
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 group"
                onClick={() => onSelectProvider(p.id)}
              >
                <div className="flex items-start gap-5 p-6">
                  {/* Left: Provider Avatar */}
                  <div className="relative shrink-0">
                    <img 
                      src={p.avatar} 
                      alt={p.name} 
                      className="w-14 h-14 rounded-lg object-cover border-2 border-slate-100 group-hover:border-indigo-200 transition-colors shadow-sm"
                    />
                    {p.badges.includes("VERIFIED") && (
                      <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full p-1 border-2 border-white shadow-sm">
                        <UserCheck className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Center: Main Content - Structured Layout */}
                  <div className="flex-1 min-w-0">
                    {/* Row 1: Provider Name + Verified Badge */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {p.name}
                      </h3>
                      {p.badges.includes("VERIFIED") && (
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-md border border-indigo-100 uppercase tracking-wide">
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Row 2: Location + Expertise Tags */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 text-sm font-medium rounded-md">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {p.flag} {p.city}, {p.location}
                      </span>
                      {p.expertise.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 text-sm font-medium rounded-md">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          {p.expertise.slice(0, 3).join(', ')}
                        </span>
                      )}
                    </div>

                    {/* Row 3: Bio/Description */}
                    <p className="text-base text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {p.bio}
                    </p>

                    {/* Row 4: Metrics - Horizontal Stats Bar */}
                    <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        <span className="text-base font-bold text-slate-900">{p.rating}</span>
                        <span className="text-sm text-slate-500 font-medium">({p.reviewsCount})</span>
                      </div>
                      <div className="h-4 w-px bg-slate-200"></div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-slate-500 font-medium">From</span>
                        <span className="text-lg font-bold text-slate-900">${p.startingRate}</span>
                        <span className="text-sm text-slate-500 font-medium">/hr</span>
                      </div>
                      <div className="h-4 w-px bg-slate-200"></div>
                      <span className="text-sm text-slate-600 font-medium">{p.projectsCompleted}+ projects</span>
                    </div>
                  </div>

                  {/* Right: Action Button - Vertical Center */}
                  <div className="shrink-0 flex items-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProvider(p.id);
                      }}
                      className="px-6 py-3 bg-indigo-600 text-white text-base font-semibold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2 shadow-sm hover:shadow-md whitespace-nowrap"
                    >
                      View Profile
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>

            {/* Pagination - Below Products */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 text-sm font-semibold rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 hover:bg-indigo-50 bg-white border border-slate-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
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