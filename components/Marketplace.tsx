import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronDown, Shield, Cloud, Network, 
  Headphones, Database, FileCode, Star, 
  CheckCircle, ArrowRight, ChevronLeft, ChevronRight,
  Code, Briefcase, Megaphone, Palette, Calculator, Scale, Target, PenTool, Layout, Video, MapPin, Building2, DollarSign
} from 'lucide-react';
import { CategoryId, ServiceCategory, Provider } from '../types';

export const CATEGORIES: ServiceCategory[] = [
  {
    id: 'it-software',
    name: 'IT & Software',
    description: 'Access high-end technical expertise for your business infrastructure.',
    icon: Code,
    color: 'bg-indigo-50 text-indigo-600',
    count: '1,200+',
    subCategories: [
      { id: 'web-app-development', name: 'Web & App Development' },
      { id: 'data-ai', name: 'Data & AI' },
      { id: 'software-testing-qa', name: 'Software Testing & QA' },
      { id: 'infrastructure-cloud', name: 'Infrastructure & Cloud' }
    ]
  },
  {
    id: 'business',
    name: 'Business Services',
    description: 'Premium operational and strategic support for growing enterprises.',
    icon: Briefcase,
    color: 'bg-emerald-50 text-emerald-600',
    count: '950+',
    subCategories: [
      { id: 'admin-virtual-support', name: 'Admin & Virtual Support' },
      { id: 'financial-legal', name: 'Financial & Legal' },
      { id: 'strategy-consulting', name: 'Strategy & Consulting' },
      { id: 'hr-operations', name: 'HR & Operations' }
    ]
  },
  {
    id: 'marketing-sales',
    name: 'Marketing & Sales',
    description: 'Grow your reach with data-driven marketing and performance sales.',
    icon: Megaphone,
    color: 'bg-orange-50 text-orange-600',
    count: '870+',
    subCategories: [
      { id: 'digital-marketing', name: 'Digital Marketing' },
      { id: 'social-media-management', name: 'Social Media Management' },
      { id: 'content-copywriting', name: 'Content & Copywriting' },
      { id: 'sales-lead-gen', name: 'Sales & Lead Gen' }
    ]
  },
  {
    id: 'design-creative',
    name: 'Design & Creative',
    description: 'Build your identity with world-class visual design and branding.',
    icon: Palette,
    color: 'bg-pink-50 text-pink-600',
    count: '1,500+',
    subCategories: [
      { id: 'visual-identity-branding', name: 'Visual Identity & Branding' },
      { id: 'uiux-web-design', name: 'UI/UX & Web Design' },
      { id: 'motion-video', name: 'Motion & Video' },
      { id: 'illustrative-print', name: 'Illustrative & Print' }
    ]
  }
];

export const COUNTRIES = [
  { name: 'United States', flag: '🇺🇸' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'France', flag: '🇫🇷' },
];

export const ALL_PROVIDERS: Provider[] = [
  { 
    id: 1, 
    categoryId: 'it-software', 
    subCategory: 'infrastructure-cloud', 
    serviceTitle: "Advanced Threat Intelligence",
    name: "Fortress Cyber Defense", 
    description: "High-end threat intelligence and managed detection for growing enterprises.", 
    bio: "Established in 2015, Fortress has pioneered a human-centric approach to digital security. Our team consists of former government intelligence officers and startup veterans.",
    icon: Shield, 
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
    badges: ["TOP RATED", "VERIFIED"], 
    rating: 4.9, 
    reviewsCount: 42,
    projectsCompleted: 128,
    responseTime: '< 2 hours',
    startingRate: 150,
    location: 'United States',
    city: 'San Francisco',
    flag: '🇺🇸',
    expertise: ['Strategy', 'Data', 'Operations', 'IT Systems'],
    caseStudies: [
      { title: 'Global Logistics Optimization', metricLabel: 'REVENUE', metricValue: '+40%', image: '' },
      { title: 'Retail Digital Transformation', metricLabel: 'OPEX', metricValue: '-25%', image: '' }
    ],
    color: "bg-blue-50 text-blue-600" 
  },
  { 
    id: 2, 
    categoryId: 'it-software', 
    subCategory: 'infrastructure-cloud', 
    serviceTitle: "Azure Global Migration",
    name: "Azure Scale Systems", 
    description: "Cloud native experts helping SMEs scale globally on Azure and AWS ecosystems.", 
    bio: "We specialize in complex cloud migrations and architecture optimization for global operations.",
    icon: Cloud, 
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200',
    badges: ["CLOUD PARTNER"], 
    rating: 5.0, 
    reviewsCount: 12,
    projectsCompleted: 84,
    responseTime: '< 1 hour',
    startingRate: 200,
    location: 'Germany',
    city: 'Berlin',
    flag: '🇩🇪',
    expertise: ['Cloud Architecture', 'DevOps', 'Azure', 'AWS'],
    caseStudies: [
      { title: 'SaaS Platform Scalability', metricLabel: 'UPTIME', metricValue: '99.99%', image: '' }
    ],
    color: "bg-sky-50 text-sky-600" 
  },
  { id: 4, categoryId: 'business', subCategory: 'financial-legal', serviceTitle: "Tax & Financial Strategy", name: "Precision Ledger", description: "Full-service accounting and tax advisory for high-growth startups.", bio: "Financial excellence for the modern age.", icon: Calculator, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200', badges: ["VERIFIED", "TOP RATED"], rating: 4.9, reviewsCount: 89, projectsCompleted: 210, responseTime: '< 3 hours', startingRate: 120, location: 'United Kingdom', city: 'London', flag: '🇬🇧', expertise: ['Tax', 'Audit', 'M&A'], caseStudies: [], color: "bg-emerald-50 text-emerald-600" },
  { id: 8, categoryId: 'design-creative', subCategory: 'uiux-web-design', serviceTitle: "Enterprise UI/UX Audit", name: "Pixel Perfect UI", description: "Modern interface design and user experience research for digital products.", bio: "Design that drives user engagement and conversion.", icon: Layout, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200', badges: ["TOP RATED"], rating: 5.0, reviewsCount: 34, projectsCompleted: 45, responseTime: '< 4 hours', startingRate: 180, location: 'France', city: 'Paris', flag: '🇫🇷', expertise: ['UI', 'UX', 'Research', 'Figma'], caseStudies: [], color: "bg-pink-50 text-pink-600" },
];

interface MarketplaceProps {
  initialCategory: CategoryId;
  onSelectProvider: (id: number) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ initialCategory, onSelectProvider }) => {
  const [selectedCatId, setSelectedCatId] = useState<CategoryId>(initialCategory);
  const [sortBy, setSortBy] = useState('Premium Partners');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [budget, setBudget] = useState([100, 5000]);
  const [activeSubCats, setActiveSubCats] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('United States');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currentCategory = CATEGORIES.find(c => c.id === selectedCatId)!;
  const filteredProviders = ALL_PROVIDERS.filter(p => p.categoryId === selectedCatId);
  
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProviders = filteredProviders.slice(startIndex, endIndex);

  useEffect(() => {
    setSelectedCatId(initialCategory);
    setCurrentPage(1);
  }, [initialCategory]);

  useEffect(() => {
    setSelectedCatId(initialCategory);
  }, [initialCategory]);

  const toggleSubCat = (id: string) => {
    setActiveSubCats(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-6">
          <a href="#" className="hover:text-indigo-600">Home</a>
          <span>/</span>
          <a href="#" className="hover:text-indigo-600">Marketplace</a>
          <span>/</span>
          <span className="text-slate-600">{currentCategory.name}</span>
        </nav>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{currentCategory.name}</h1>
          <p className="text-slate-500 max-w-3xl leading-relaxed">
            {currentCategory.description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 space-y-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Category</h4>
              <div className="grid grid-cols-1 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCatId(cat.id);
                      setActiveSubCats([]);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-base font-semibold transition-all ${selectedCatId === cat.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/50'}`}
                  >
                    <cat.icon className={`w-5 h-5 ${selectedCatId === cat.id ? 'text-white' : 'text-indigo-600'}`} />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Reach</h4>
              <div className="relative">
                <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg py-3 pl-4 pr-10 text-base focus:outline-none cursor-pointer hover:border-indigo-200 transition-colors"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.name} value={c.name}>{c.flag} &nbsp; {c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sub-categories</h4>
                <ChevronDown className="w-5 h-5 text-slate-300" />
              </div>
              <div className="space-y-3">
                {currentCategory.subCategories.map((item) => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 border border-slate-200 rounded checked:bg-indigo-600 checked:border-indigo-600 transition-all" 
                        checked={activeSubCats.includes(item.id)}
                        onChange={() => toggleSubCat(item.id)}
                      />
                      <CheckCircle className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-base text-slate-600 group-hover:text-slate-900 transition-colors">{item.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Budget</h4>
                <button 
                  onClick={() => setBudget([100, 5000])}
                  className="text-xs font-bold text-indigo-600 uppercase hover:underline"
                >
                  Reset
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                  <span>${budget[0]}</span>
                  <span>${budget[1]}+</span>
                </div>
                <input 
                  type="range" min="0" max="10000" step="100"
                  value={budget[1]}
                  onChange={(e) => setBudget([budget[0], parseInt(e.target.value)])}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <p className="text-base text-slate-500 font-medium">
                Showing <span className="text-slate-900 font-bold">{filteredProviders.length}</span> expert providers
              </p>
              
              <div className="relative">
                <div className="flex items-center gap-2 text-base">
                  <span className="text-slate-400 font-medium">Sort by</span>
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-1.5 font-bold text-indigo-600 focus:outline-none"
                  >
                    {sortBy}
                    <ChevronDown className={`w-5 h-5 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1">
                    {['Premium Partners', 'Cheapest', 'Newest', 'Highest Rated'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setSortBy(opt); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-base transition-colors ${sortBy === opt ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="space-y-3 mb-8">
                {paginatedProviders.map((provider) => (
                <div 
                  key={provider.id} 
                  className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 group"
                  onClick={() => onSelectProvider(provider.id)}
                >
                  <div className="flex items-start gap-5 p-6">
                    {/* Left: Service Icon */}
                    <div className="relative shrink-0">
                      <div className={`w-14 h-14 rounded-lg ${provider.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                        <provider.icon className="w-7 h-7" />
                      </div>
                      {provider.badges.includes("VERIFIED") && (
                        <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full p-1 border-2 border-white shadow-sm">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Center: Main Content - Structured Layout */}
                    <div className="flex-1 min-w-0">
                      {/* Row 1: Service Title */}
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors">
                          {provider.serviceTitle || provider.name}
                        </h3>
                      </div>

                      {/* Row 2: Category, Provider, Location - Clean Badges */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-md border border-indigo-100">
                          <Briefcase className="w-4 h-4" />
                          {provider.subCategory}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 text-sm font-medium rounded-md">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          {provider.name}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 text-sm font-medium rounded-md">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {provider.city}, {provider.location}
                        </span>
                      </div>

                      {/* Row 3: Description */}
                      <p className="text-base text-slate-600 leading-relaxed mb-4 line-clamp-2">
                        {provider.description || provider.bio}
                      </p>

                      {/* Row 4: Metrics - Horizontal Stats Bar */}
                      <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                          <span className="text-base font-bold text-slate-900">{provider.rating}</span>
                          <span className="text-sm text-slate-500 font-medium">({provider.reviewsCount})</span>
                        </div>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm text-slate-500 font-medium">From</span>
                          <span className="text-lg font-bold text-slate-900">${provider.startingRate}</span>
                          <span className="text-sm text-slate-500 font-medium">/hr</span>
                        </div>
                        {provider.projectsCompleted && (
                          <>
                            <div className="h-4 w-px bg-slate-200"></div>
                            <span className="text-sm text-slate-600 font-medium">{provider.projectsCompleted}+ projects</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right: Action Button - Vertical Center */}
                    <div className="shrink-0 flex items-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProvider(provider.id);
                        }}
                        className="px-6 py-3 bg-indigo-600 text-white text-base font-semibold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2 shadow-sm hover:shadow-md whitespace-nowrap"
                      >
                        View Details
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
    </div>
  );
};

export default Marketplace;