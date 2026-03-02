import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { 
  Search, ChevronDown, Shield, Cloud, Network, 
  Headphones, Database, FileCode, Star, 
  CheckCircle, ArrowRight, ChevronLeft, ChevronRight,
  Code, Briefcase, Megaphone, Palette, Calculator, Scale, Target, PenTool, Layout, Video, MapPin, Building2, DollarSign, Users, Loader2, AlertCircle
} from 'lucide-react';
import { CategoryId, ServiceCategory, Provider } from '../types/index';
import { GET_PROVIDERS_BY_CATEGORY, GET_PROVIDERS_SORTED } from '../../apollo/user/query';
import { mapBackendProviderToList, mapSortOption, mapCategoryToBackend, mapSubCategoryToBackend, mapSubCategoryFromBackend } from '../utils/providerMapper';

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
  { name: 'All Countries', flag: '🌍' },
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
    id: 'fs4o8o3hfuhgf7sfh', 
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
    id: "fs4o8o3hfuhgf7sf2", 
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
  { 
    id: "fs4o8o3hfuhgf7sf3", 
    categoryId: 'it-software', 
    subCategory: 'web-app-development', 
    serviceTitle: "Full-Stack Web Development",
    name: "CodeCraft Solutions", 
    description: "Enterprise-grade web applications built with modern frameworks and best practices.", 
    bio: "We build scalable web applications that power businesses worldwide.",
    icon: FileCode, 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    badges: ["VERIFIED"], 
    rating: 4.7, 
    reviewsCount: 56,
    projectsCompleted: 192,
    responseTime: '< 3 hours',
    startingRate: 140,
    location: 'United States',
    city: 'New York',
    flag: '🇺🇸',
    expertise: ['React', 'Node.js', 'TypeScript', 'AWS'],
    caseStudies: [],
    color: "bg-purple-50 text-purple-600" 
  },
  { 
    id: "fs4o8o3hfuhgf7sf4", 
    categoryId: 'business', 
    subCategory: 'financial-legal', 
    serviceTitle: "Tax & Financial Strategy",
    name: "Precision Ledger", 
    description: "Full-service accounting and tax advisory for high-growth startups.", 
    bio: "Financial excellence for the modern age.",
    icon: Calculator, 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200', 
    badges: ["VERIFIED", "TOP RATED"], 
    rating: 4.9, 
    reviewsCount: 89, 
    projectsCompleted: 210, 
    responseTime: '< 3 hours', 
    startingRate: 120, 
    location: 'United Kingdom', 
    city: 'London', 
    flag: '🇬🇧', 
    expertise: ['Tax', 'Audit', 'M&A'], 
    caseStudies: [], 
    color: "bg-emerald-50 text-emerald-600" 
  },
  { 
    id: "fs4o8o3hfuhgf7sf5", 
    categoryId: 'business', 
    subCategory: 'strategy-consulting', 
    serviceTitle: "Business Strategy Consulting",
    name: "Strategic Edge Partners", 
    description: "Transform your business with data-driven strategy and execution excellence.", 
    bio: "Helping businesses achieve their strategic goals through expert consulting.",
    icon: Target, 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
    badges: ["TOP RATED"], 
    rating: 4.8, 
    reviewsCount: 67,
    projectsCompleted: 145,
    responseTime: '< 4 hours',
    startingRate: 250,
    location: 'United States',
    city: 'Chicago',
    flag: '🇺🇸',
    expertise: ['Strategy', 'Consulting', 'Growth'],
    caseStudies: [],
    color: "bg-amber-50 text-amber-600" 
  },
  { 
    id: "fs4o8o3hfuhgf7sf6", 
    categoryId: 'marketing-sales', 
    subCategory: 'digital-marketing', 
    serviceTitle: "Digital Marketing Excellence",
    name: "Growth Marketing Pro", 
    description: "Data-driven digital marketing campaigns that deliver measurable ROI.", 
    bio: "We help businesses grow through strategic digital marketing.",
    icon: Megaphone, 
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200&h=200',
    badges: ["VERIFIED"], 
    rating: 4.6, 
    reviewsCount: 78,
    projectsCompleted: 167,
    responseTime: '< 2 hours',
    startingRate: 110,
    location: 'United States',
    city: 'Los Angeles',
    flag: '🇺🇸',
    expertise: ['SEO', 'PPC', 'Social Media'],
    caseStudies: [],
    color: "bg-orange-50 text-orange-600" 
  },
  { 
    id: "fs4o8o3hfuhgf7sf7", 
    categoryId: 'marketing-sales', 
    subCategory: 'content-copywriting', 
    serviceTitle: "Content Strategy & Copywriting",
    name: "Content Masters", 
    description: "Compelling content that converts visitors into customers.", 
    bio: "We create content that drives engagement and conversions.",
    icon: PenTool, 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
    badges: ["TOP RATED"], 
    rating: 4.9, 
    reviewsCount: 45,
    projectsCompleted: 98,
    responseTime: '< 1 hour',
    startingRate: 95,
    location: 'United Kingdom',
    city: 'Manchester',
    flag: '🇬🇧',
    expertise: ['Copywriting', 'Content Strategy', 'SEO'],
    caseStudies: [],
    color: "bg-rose-50 text-rose-600" 
  },
  { 
    id: "fs4o8o3hfuhgf7sf8", 
    categoryId: 'design-creative', 
    subCategory: 'uiux-web-design', 
    serviceTitle: "Enterprise UI/UX Audit",
    name: "Pixel Perfect UI", 
    description: "Modern interface design and user experience research for digital products.", 
    bio: "Design that drives user engagement and conversion.",
    icon: Layout, 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200', 
    badges: ["TOP RATED"], 
    rating: 5.0, 
    reviewsCount: 34, 
    projectsCompleted: 45, 
    responseTime: '< 4 hours', 
    startingRate: 180, 
    location: 'France', 
    city: 'Paris', 
    flag: '🇫🇷', 
    expertise: ['UI', 'UX', 'Research', 'Figma'], 
    caseStudies: [], 
    color: "bg-pink-50 text-pink-600" 
  },
  { 
    id: "fs4o8o3hfuhgf7sf9", 
    categoryId: 'design-creative', 
    subCategory: 'visual-identity-branding', 
    serviceTitle: "Brand Identity Design",
    name: "Brand Forge Studio", 
    description: "Complete brand identity packages that tell your story.", 
    bio: "We create memorable brand identities that resonate with audiences.",
    icon: Palette, 
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&h=200',
    badges: ["VERIFIED"], 
    rating: 4.8, 
    reviewsCount: 52,
    projectsCompleted: 76,
    responseTime: '< 5 hours',
    startingRate: 160,
    location: 'Germany',
    city: 'Munich',
    flag: '🇩🇪',
    expertise: ['Branding', 'Logo Design', 'Identity'],
    caseStudies: [],
    color: "bg-violet-50 text-violet-600" 
  },
  { 
    id: "fs4o8o3hfuhgf7sf10", 
    categoryId: 'it-software', 
    subCategory: 'data-ai', 
    serviceTitle: "AI & Machine Learning Solutions",
    name: "DataMind AI", 
    description: "Cutting-edge AI solutions to transform your business operations.", 
    bio: "We leverage AI to solve complex business challenges.",
    icon: Database, 
    avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=200&h=200',
    badges: ["VERIFIED", "TOP RATED"], 
    rating: 4.9, 
    reviewsCount: 91,
    projectsCompleted: 203,
    responseTime: '< 2 hours',
    startingRate: 220,
    location: 'United States',
    city: 'Seattle',
    flag: '🇺🇸',
    expertise: ['AI', 'ML', 'Data Science', 'Python'],
    caseStudies: [],
    color: "bg-cyan-50 text-cyan-600" 
  },
  { 
    id: "fs4o8o3hfuhgf7sf11", 
    categoryId: 'it-software', 
    subCategory: 'software-testing-qa', 
    serviceTitle: "QA & Testing Services",
    name: "Quality Assurance Pro", 
    description: "Comprehensive testing services to ensure your software is bug-free.", 
    bio: "We ensure your software meets the highest quality standards.",
    icon: CheckCircle, 
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200',
    badges: ["VERIFIED"], 
    rating: 4.7, 
    reviewsCount: 38,
    projectsCompleted: 112,
    responseTime: '< 3 hours',
    startingRate: 130,
    location: 'India',
    city: 'Bangalore',
    flag: '🇮🇳',
    expertise: ['Testing', 'QA', 'Automation'],
    caseStudies: [],
    color: "bg-teal-50 text-teal-600" 
  },
  { 
    id: "fs4o8o3hfuhgf7sf12", 
    categoryId: 'business', 
    subCategory: 'hr-operations', 
    serviceTitle: "HR & Talent Management",
    name: "TalentBridge HR", 
    description: "Strategic HR solutions to attract, retain, and develop top talent.", 
    bio: "We help companies build winning teams.",
    icon: Users, 
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200&h=200',
    badges: ["TOP RATED"], 
    rating: 4.8, 
    reviewsCount: 63,
    projectsCompleted: 134,
    responseTime: '< 4 hours',
    startingRate: 135,
    location: 'United Kingdom',
    city: 'Birmingham',
    flag: '🇬🇧',
    expertise: ['HR', 'Recruitment', 'Talent'],
    caseStudies: [],
    color: "bg-indigo-50 text-indigo-600" 
  },
];

interface MarketplaceFilters {
  subcategory?: string[];
  location?: string;
  budget?: number;
  sort?: string;
  page?: number;
  search?: string;
}

interface MarketplaceProps {
  initialCategory: CategoryId;
  initialFilters?: MarketplaceFilters;
  onSelectProvider: (id: string) => void;
  onFilterChange?: (filters: { category?: CategoryId } & MarketplaceFilters) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ 
  initialCategory, 
  initialFilters = {},
  onSelectProvider,
  onFilterChange 
}) => {
  // ========== HOOKS & STATE ==========
  const [selectedCatId, setSelectedCatId] = useState<CategoryId>(initialCategory);
  const [sortBy, setSortBy] = useState(initialFilters.sort || 'Newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [maxBudget, setMaxBudget] = useState(initialFilters.budget || 5000);
  const [activeSubCats, setActiveSubCats] = useState<string[]>(initialFilters.subcategory || []);
  const [selectedLocation, setSelectedLocation] = useState(initialFilters.location || 'All Countries');
  const [currentPage, setCurrentPage] = useState(initialFilters.page || 1);
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
  const itemsPerPage = 9;
  
  const isInitialMount = useRef(true);
  const lastFiltersRef = useRef<string>('');

  const currentCategory = CATEGORIES.find(c => c.id === selectedCatId)!;
  
  // Helper function to convert relative image paths to full URLs
  const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:3010/graphql';
    const baseUrl = apiUrl.replace('/graphql', '');
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${baseUrl}/${cleanPath}`;
  };
  
  const backendCategoryId = mapCategoryToBackend(selectedCatId);
  const backendSortBy = mapSortOption(sortBy);
  
  const queryVariables = useMemo(() => {
    // Validate categoryId - must be a valid backend category
    if (!backendCategoryId || !['IT_AND_SOFTWARE', 'BUSINESS_SERVICES', 'MARKETING_AND_SALES', 'DESIGN_AND_CREATIVE'].includes(backendCategoryId)) {
      console.warn('Invalid categoryId:', backendCategoryId);
      return null;
    }

    const input: any = {
      categoryId: backendCategoryId,
      page: Math.max(1, currentPage || 1),
      limit: Math.max(1, Math.min(100, itemsPerPage || 5)), // Ensure limit is between 1 and 100
    };
    
    // Validate and add sortBy - only valid provider sort options
    const validSortOptions = ['createdAt', 'organizationHourlyRate', 'orgAverageRating', 'orgTotalProjects'];
    if (backendSortBy && validSortOptions.includes(backendSortBy)) {
      input.sortBy = backendSortBy;
    } else {
      input.sortBy = 'createdAt'; // Default sort
    }
    
    // Note: We don't send subCategory filter to backend
    // Instead, we fetch all providers for the category and filter client-side
    // This is because providers can have multiple subcategories in an array,
    // and backend filtering might not match providers with subcategory in array
    // Client-side filtering handles this correctly by checking if selected
    // subcategory exists in provider's subCategory array
    
    if (selectedLocation && selectedLocation !== 'All Countries') {
      input.location = selectedLocation;
    }
    
    if (maxBudget && maxBudget > 0 && maxBudget !== 5000) {
      input.maxBudget = maxBudget;
    }
    
    if (searchQuery && searchQuery.trim()) {
      input.searchQuery = searchQuery.trim();
    }
    
    return { input };
  }, [backendCategoryId, activeSubCats, selectedLocation, maxBudget, currentPage, itemsPerPage, searchQuery, backendSortBy]);
  
  // ========== APOLLO REQUESTS ==========
  const useSortedQuery = true;
  const shouldSkip = !backendCategoryId || !queryVariables || !['IT_AND_SOFTWARE', 'BUSINESS_SERVICES', 'MARKETING_AND_SALES', 'DESIGN_AND_CREATIVE'].includes(backendCategoryId);
  
  const { data, loading, error, refetch } = useQuery(
    useSortedQuery ? GET_PROVIDERS_SORTED : GET_PROVIDERS_BY_CATEGORY,
    {
      variables: queryVariables || { 
        input: { 
          categoryId: 'IT_AND_SOFTWARE', 
          page: 1, 
          limit: 100, // Fetch more for client-side filtering
          sortBy: 'createdAt'
        } 
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
      skip: shouldSkip, // Skip query if category is not set or invalid
      errorPolicy: 'all' // Continue even if there are errors
    }
  );

  // ========== LIFECYCLES ==========
  useEffect(() => {
    if (error) {
      console.error('Marketplace query error:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        variables: queryVariables
      });
    }
  }, [error, queryVariables]);
  
  useEffect(() => {
    setSelectedCatId(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (isInitialMount.current) {
      setSortBy(initialFilters.sort || 'Newest');
      setMaxBudget(initialFilters.budget || 5000);
      setActiveSubCats(initialFilters.subcategory || []);
      setSelectedLocation(initialFilters.location || 'All Countries');
      setCurrentPage(initialFilters.page || 1);
      setSearchQuery(initialFilters.search || '');
      isInitialMount.current = false;
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      lastFiltersRef.current = JSON.stringify({
        category: selectedCatId,
        subcategory: activeSubCats,
        location: selectedLocation,
        budget: maxBudget,
        sort: sortBy,
        page: currentPage,
        search: searchQuery,
      });
      return;
    }
    
    if (!onFilterChange) return;
    
    const currentFiltersString = JSON.stringify({
      category: selectedCatId,
      subcategory: activeSubCats,
      location: selectedLocation,
      budget: maxBudget,
      sort: sortBy,
      page: currentPage,
      search: searchQuery,
    });
    
    if (currentFiltersString !== lastFiltersRef.current) {
      lastFiltersRef.current = currentFiltersString;
      
      const timeoutId = setTimeout(() => {
        onFilterChange({
          category: selectedCatId,
          subcategory: activeSubCats.length > 0 ? activeSubCats : undefined,
          location: selectedLocation !== 'All Countries' ? selectedLocation : undefined,
          budget: maxBudget !== 5000 ? maxBudget : undefined,
          sort: sortBy !== 'Newest' ? sortBy : undefined,
          page: currentPage > 1 ? currentPage : undefined,
          search: searchQuery || undefined,
        });
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedCatId, activeSubCats, selectedLocation, maxBudget, sortBy, currentPage, searchQuery, onFilterChange]);
  
  // ========== COMPUTED VALUES ==========
  const providers = useMemo(() => {
    if (!data) return [];
    
    const list = useSortedQuery 
      ? data?.getProvidersSorted?.list || []
      : data?.getProvidersByCategory?.list || [];

    let mappedProviders = list.map(mapBackendProviderToList);

    // Filter out any invalid providers (must have at least an ID and name)
    mappedProviders = mappedProviders.filter(provider => provider.id && provider.name);

    // Apply client-side filtering
    // 1. Filter by categoryId (provider must belong to selected category)
    // 2. Filter by subCategory (provider must have selected subcategory)
    mappedProviders = mappedProviders.filter(provider => {
      // Step 1: Check if provider belongs to the selected category
      const providerCategoryIds = Array.isArray(provider.categoryId) 
        ? provider.categoryId 
        : [provider.categoryId];
      
      const categoryMatches = providerCategoryIds.includes(selectedCatId);
      
      // Step 2: Check subcategory filter (if any subcategories are selected)
      let subCategoryMatches = true; // Default to true (show all if no filter)
      
      if (activeSubCats.length > 0) {
        // Normalize provider subcategories to array
        const providerSubCats = Array.isArray(provider.subCategory) 
          ? provider.subCategory 
          : [provider.subCategory];
        
        // Normalize to strings and trim for comparison (case-insensitive)
        const normalizedProviderSubCats = providerSubCats.map(cat => String(cat).trim().toLowerCase());
        const normalizedActiveSubCats = activeSubCats.map(cat => String(cat).trim().toLowerCase());
        
        // Check if any of the provider's subcategories match any selected subcategory
        subCategoryMatches = normalizedActiveSubCats.some(selectedSubCat => 
          normalizedProviderSubCats.includes(selectedSubCat)
        );
      }
      
      // Provider must match both category AND subcategory (if subcategory filter is active)
      return categoryMatches && subCategoryMatches;
    });

    return mappedProviders;
  }, [data, useSortedQuery, activeSubCats, selectedCatId]);
  
  const totalCount = useMemo(() => {
    return providers.length;
  }, [providers]);
  
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  const paginatedProviders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return providers.slice(startIndex, endIndex);
  }, [providers, currentPage, itemsPerPage]);

  // ========== HANDLERS ==========
  const toggleSubCat = (id: string) => {
    setActiveSubCats(prev => {
      const newSubCats = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      setCurrentPage(1); // Reset to page 1 when filter changes
      return newSubCats;
    });
  };

  const handleCategoryChange = (categoryId: CategoryId) => {
    setSelectedCatId(categoryId);
    setActiveSubCats([]); // Reset subcategories when category changes
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setIsSortOpen(false);
    setCurrentPage(1);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setCurrentPage(1);
  };

  const handleBudgetChange = (budget: number) => {
    setMaxBudget(budget);
    setCurrentPage(1);
  };

  // ========== RENDER ==========
  return (
    <div className="bg-slate-50 dark:bg-slate-800 min-h-screen py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-400 dark:text-slate-500 mb-6">
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</a>
          <span>/</span>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Marketplace</a>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300">{currentCategory.name}</span>
        </nav>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{currentCategory.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
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
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-base font-semibold transition-all ${selectedCatId === cat.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/50' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20'}`}
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
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-4 pr-10 text-base dark:text-white focus:outline-none cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-600 transition-colors"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.name} value={c.name}>{c.flag} &nbsp; {c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sub-categories</h4>
                <ChevronDown className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              </div>
              <div className="space-y-3">
                {currentCategory.subCategories.map((item) => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 border border-slate-200 dark:border-slate-600 rounded checked:bg-indigo-600 checked:border-indigo-600 transition-all bg-white dark:bg-slate-700" 
                        checked={activeSubCats.includes(item.id)}
                        onChange={() => toggleSubCat(item.id)}
                      />
                      <CheckCircle className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-base text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Budget</h4>
                <button 
                  onClick={() => handleBudgetChange(5000)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase hover:underline"
                >
                  Reset
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-base font-bold text-slate-500 dark:text-slate-400">
                  <span>Up to</span>
                  <span>${maxBudget.toLocaleString()}/hr</span>
                </div>
                <input 
                  type="range" min="0" max="10000" step="100"
                  value={maxBudget}
                  onChange={(e) => handleBudgetChange(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
                {loading ? (
                  <span>Loading providers...</span>
                ) : (
                  <>
                    Showing <span className="text-slate-900 dark:text-white font-bold">{providers.length}</span> of <span className="text-slate-900 dark:text-white font-bold">{totalCount}</span> expert providers
                  </>
                )}
              </p>
              
              <div className="relative">
                <div className="flex items-center gap-2 text-base">
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Sort by</span>
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-1.5 font-bold text-indigo-600 focus:outline-none"
                  >
                    {sortBy}
                    <ChevronDown className={`w-5 h-5 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl dark:shadow-2xl z-20 py-1">
                    {['Newest', 'Cheapest', 'Highest Rated', 'Most Projects'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSortChange(opt)}
                        className={`w-full text-left px-4 py-2.5 text-base transition-colors ${sortBy === opt ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full">
              {/* Loading State */}
              {loading && providers.length === 0 && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">Loading providers...</p>
                  </div>
                </div>
              )}
              
              {/* Error State */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    <div className="flex-1">
                      <h3 className="font-bold text-red-900 dark:text-red-200 mb-1">Error loading provider organizations</h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                        {error.graphQLErrors?.[0]?.message || error.networkError?.message || error.message || 'Failed to load provider organizations. Please check your connection and try again.'}
                      </p>
                      {error.graphQLErrors?.[0] && (
                        <details className="mt-2">
                          <summary className="text-xs text-red-600 dark:text-red-400 cursor-pointer font-semibold">
                            View Error Details
                          </summary>
                          <pre className="text-xs text-red-600 dark:text-red-400 font-mono mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded overflow-auto">
                            {JSON.stringify(error.graphQLErrors[0], null, 2)}
                          </pre>
                        </details>
                      )}
                      {error.networkError && 'statusCode' in error.networkError && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                          Status Code: {error.networkError.statusCode}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => refetch()}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCatId('it-software');
                        setSortBy('Newest');
                        setCurrentPage(1);
                        setActiveSubCats([]);
                        setSelectedLocation('All Countries');
                        setMaxBudget(5000);
                        setSearchQuery('');
                        setTimeout(() => refetch(), 100);
                      }}
                      className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-semibold"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
              
              {/* Providers List */}
              {!loading && !error && providers.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">No providers found</p>
                  <p className="text-slate-500 dark:text-slate-500 text-sm">Try adjusting your filters</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedProviders.map((provider) => {
                  // Find icon based on category (used for fallback if no image)
                  const category = CATEGORIES.find(c => c.id === provider.categoryId);
                  const IconComponent = category?.icon || Code;
                  
                  // Use organization image or avatar, or fallback to a placeholder gradient
                  const imageUrl = provider.avatar ? getImageUrl(provider.avatar) : null;
                  const hasImage = imageUrl && imageUrl.length > 0;
                  
                  return (
                    <div 
                      key={provider.id} 
                      className="group relative aspect-[3/4] overflow-hidden rounded-[4px] bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/10 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer"
                      onClick={() => onSelectProvider(provider.id)}
                    >
                      {/* Top 60% Image Area */}
                      <div className="h-[60%] w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {hasImage ? (
                          <img 
                            src={imageUrl} 
                            alt={provider.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              // Fallback to icon if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('.fallback-icon')) {
                                const fallback = document.createElement('div');
                                fallback.className = `w-full h-full ${provider.color} flex items-center justify-center fallback-icon`;
                                fallback.innerHTML = `<svg class="w-16 h-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>`;
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          <div className={`w-full h-full ${provider.color} flex items-center justify-center`}>
                            <IconComponent className="w-16 h-16 opacity-50" />
                          </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Verified Badge - Top Right */}
                        {provider.badges.includes("VERIFIED") && (
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
                            {provider.name}
                          </h3>
                          
                          {/* Category + Rating Row */}
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[11px] font-semibold tracking-wide text-slate-600 dark:text-slate-400 uppercase px-2 py-1 bg-slate-100 dark:bg-white/5 rounded backdrop-blur-sm">
                              {Array.isArray(provider.subCategory) ? provider.subCategory[0] : provider.subCategory}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{provider.rating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Pricing + CTA */}
                        <div className="flex items-center justify-between w-full pt-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Starting from</span>
                            <span className="text-base font-bold text-slate-900 dark:text-white">${provider.startingRate}</span>
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

              {/* Pagination - Below Products */}
              {!loading && !error && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading}
                    className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                      // Show max 10 pages, with smart pagination
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
                          disabled={loading}
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
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || loading}
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
    </div>
  );
};

export default Marketplace;
