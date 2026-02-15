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
  const [selectedCatId, setSelectedCatId] = useState<CategoryId>(initialCategory);
  const [sortBy, setSortBy] = useState(initialFilters.sort || 'Premium Partners');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [maxBudget, setMaxBudget] = useState(initialFilters.budget || 5000);
  const [activeSubCats, setActiveSubCats] = useState<string[]>(initialFilters.subcategory || []);
  const [selectedLocation, setSelectedLocation] = useState(initialFilters.location || 'All Countries');
  const [currentPage, setCurrentPage] = useState(initialFilters.page || 1);
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
  const itemsPerPage = 5;
  
  // Use refs to track if we're initializing from URL (prevent infinite loop)
  const isInitialMount = useRef(true);
  const lastFiltersRef = useRef<string>('');

  const currentCategory = CATEGORIES.find(c => c.id === selectedCatId)!;
  
  // Map UI category to backend category format
  const backendCategoryId = mapCategoryToBackend(selectedCatId);
  
  // Map UI sort option to backend sort format
  const backendSortBy = mapSortOption(sortBy);
  
  // Prepare query variables
  const queryVariables = useMemo(() => {
    const input: any = {
      categoryId: backendCategoryId,
      page: currentPage,
      limit: itemsPerPage,
    };
    
    // Note: We don't send subCategory filter to backend
    // Instead, we fetch all providers for the category and filter client-side
    // This is because providers can have multiple subcategories in an array,
    // and backend filtering might not match providers with subcategory in array
    // Client-side filtering handles this correctly by checking if selected
    // subcategory exists in provider's subCategory array
    
    if (selectedLocation !== 'All Countries') {
      input.location = selectedLocation;
    }
    
    if (maxBudget !== 5000) {
      input.maxBudget = maxBudget;
    }
    
    if (searchQuery) {
      input.searchQuery = searchQuery;
    }
    
    return { input };
  }, [backendCategoryId, activeSubCats, selectedLocation, maxBudget, currentPage, itemsPerPage, searchQuery]);
  
  // Use GET_PROVIDERS_SORTED if sortBy is not "Premium Partners", otherwise use GET_PROVIDERS_BY_CATEGORY
  const useSortedQuery = sortBy !== 'Premium Partners';
  
  const { data, loading, error, refetch } = useQuery(
    useSortedQuery ? GET_PROVIDERS_SORTED : GET_PROVIDERS_BY_CATEGORY,
    {
      variables: useSortedQuery 
        ? { 
            input: {
              ...queryVariables.input,
              sortBy: backendSortBy,
            }
          }
        : queryVariables,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
      skip: !backendCategoryId, // Skip query if category is not set
      onCompleted: (data) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Query completed:', {
            hasData: !!data,
            listLength: useSortedQuery 
              ? data?.getProvidersSorted?.list?.length || 0
              : data?.getProvidersByCategory?.list?.length || 0,
            firstProvider: useSortedQuery 
              ? data?.getProvidersSorted?.list?.[0]
              : data?.getProvidersByCategory?.list?.[0],
          });
        }
      },
      onError: (error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Query error:', error);
        }
      },
    }
  );
  
  // Extract providers from response and apply client-side filtering
  const providers = useMemo(() => {
    if (!data) return [];
    
    const list = useSortedQuery 
      ? data?.getProvidersSorted?.list || []
      : data?.getProvidersByCategory?.list || [];
    
    // Debug: Log raw backend data
    if (process.env.NODE_ENV === 'development' && list.length > 0) {
      console.log('🔍 Raw backend data (first provider):', {
        orgName: list[0]?.orgName,
        categoryId: list[0]?.categoryId,
        categoryIdType: typeof list[0]?.categoryId,
        categoryIdIsArray: Array.isArray(list[0]?.categoryId),
        subCategory: list[0]?.subCategory,
        subCategoryType: typeof list[0]?.subCategory,
        subCategoryIsArray: Array.isArray(list[0]?.subCategory),
      });
    }
    
    let mappedProviders = list.map(mapBackendProviderToList);
    
    // Debug: Log mapped data
    if (process.env.NODE_ENV === 'development' && mappedProviders.length > 0) {
      console.log('🔍 Mapped provider (first):', {
        name: mappedProviders[0]?.name,
        categoryId: mappedProviders[0]?.categoryId,
        categoryIdType: typeof mappedProviders[0]?.categoryId,
        categoryIdIsArray: Array.isArray(mappedProviders[0]?.categoryId),
        subCategory: mappedProviders[0]?.subCategory,
        subCategoryType: typeof mappedProviders[0]?.subCategory,
        subCategoryIsArray: Array.isArray(mappedProviders[0]?.subCategory),
      });
      console.log('🔍 Active filters:', {
        selectedCategory: selectedCatId,
        activeSubCats,
      });
    }
    
    // Apply client-side filtering
    // 1. Filter by categoryId (provider must belong to selected category)
    // 2. Filter by subCategory (provider must have selected subcategory)
    const beforeFilter = mappedProviders.length;
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
      const matches = categoryMatches && subCategoryMatches;
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Provider filter check:', {
          providerName: provider.name,
          providerCategoryIds,
          selectedCatId,
          categoryMatches,
          providerSubCats: Array.isArray(provider.subCategory) ? provider.subCategory : [provider.subCategory],
          activeSubCats,
          subCategoryMatches,
          finalMatch: matches
        });
      }
      
      return matches;
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Filtering: ${beforeFilter} → ${mappedProviders.length} providers`, {
        selectedCategory: selectedCatId,
        activeSubCats,
        totalProviders: beforeFilter,
        filteredProviders: mappedProviders.length
      });
    }
    
    return mappedProviders;
  }, [data, useSortedQuery, activeSubCats]);
  
  // Get total count for pagination (use filtered providers count since we filter client-side)
  const totalCount = useMemo(() => {
    return providers.length;
  }, [providers]);
  
  // Calculate pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  // Paginate filtered providers
  const paginatedProviders = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
    return providers.slice(startIndex, endIndex);
  }, [providers, currentPage, itemsPerPage]);
  
  // Refetch when filters change
  useEffect(() => {
    if (!isInitialMount.current) {
      refetch();
    }
  }, [backendCategoryId, activeSubCats, selectedLocation, maxBudget, sortBy, currentPage, searchQuery, refetch]);

  // Sync category when initialCategory changes (from URL)
  useEffect(() => {
    setSelectedCatId(initialCategory);
  }, [initialCategory]);
  
  // Sync initial filters from URL on mount
  useEffect(() => {
    if (isInitialMount.current) {
      setSortBy(initialFilters.sort || 'Premium Partners');
      setMaxBudget(initialFilters.budget || 5000);
      setActiveSubCats(initialFilters.subcategory || []);
      setSelectedLocation(initialFilters.location || 'All Countries');
      setCurrentPage(initialFilters.page || 1);
      setSearchQuery(initialFilters.search || '');
      isInitialMount.current = false;
    }
  }, []); // Only run once on mount

  // Update URL when filters change (but only if user changed them, not from URL sync)
  useEffect(() => {
    // Skip on initial mount (filters are synced from URL in separate effect)
    if (isInitialMount.current) {
      // Set initial filters string to prevent false positives
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
    
    // Create a string representation of current filters to compare
    const currentFiltersString = JSON.stringify({
      category: selectedCatId,
      subcategory: activeSubCats,
      location: selectedLocation,
      budget: maxBudget,
      sort: sortBy,
      page: currentPage,
      search: searchQuery,
    });
    
    // Only update URL if filters actually changed
    if (currentFiltersString !== lastFiltersRef.current) {
      lastFiltersRef.current = currentFiltersString;
      
      // Use setTimeout to debounce and prevent rapid-fire updates
      const timeoutId = setTimeout(() => {
        onFilterChange({
          category: selectedCatId,
          subcategory: activeSubCats.length > 0 ? activeSubCats : undefined,
          location: selectedLocation !== 'All Countries' ? selectedLocation : undefined,
          budget: maxBudget !== 5000 ? maxBudget : undefined,
          sort: sortBy !== 'Premium Partners' ? sortBy : undefined,
          page: currentPage > 1 ? currentPage : undefined,
          search: searchQuery || undefined,
        });
      }, 100); // 100ms debounce
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedCatId, activeSubCats, selectedLocation, maxBudget, sortBy, currentPage, searchQuery, onFilterChange]);

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
                    {['Premium Partners', 'Cheapest', 'Newest', 'Highest Rated'].map((opt) => (
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
                    <div>
                      <h3 className="font-bold text-red-900 dark:text-red-200 mb-1">Error loading providers</h3>
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
              
              {/* Providers List */}
              {!loading && !error && providers.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">No providers found</p>
                  <p className="text-slate-500 dark:text-slate-500 text-sm">Try adjusting your filters</p>
                </div>
              )}
              
              <div className="space-y-3 mb-8">
                {paginatedProviders.map((provider) => {
                  // Find icon based on category
                  const category = CATEGORIES.find(c => c.id === provider.categoryId);
                  const IconComponent = category?.icon || Code;
                  
                  return (
                <div 
                  key={provider.id} 
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 group"
                  onClick={() => onSelectProvider(provider.id)}
                >
                  <div className="flex items-start gap-5 p-6">
                    {/* Left: Service Icon */}
                    <div className="relative shrink-0">
                      <div className={`w-14 h-14 rounded-lg ${provider.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                        <IconComponent className="w-7 h-7" />
                    </div>
                      {provider.badges.includes("VERIFIED") && (
                        <div className="absolute -top-1 -right-1 bg-indigo-600 dark:bg-indigo-500 rounded-full p-1 border-2 border-white dark:border-slate-800 shadow-sm">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Center: Main Content - Structured Layout */}
                    <div className="flex-1 min-w-0">
                      {/* Row 1: Service Title */}
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {provider.serviceTitle || provider.name}
                        </h3>
                  </div>

                      {/* Row 2: Category, Provider, Location - Clean Badges */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        {/* Display all subcategories if array, or single if string */}
                        {(Array.isArray(provider.subCategory) ? provider.subCategory : [provider.subCategory]).map((subCat, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-md border border-indigo-100 dark:border-indigo-800">
                          <Briefcase className="w-4 h-4" />
                            {subCat}
                     </span>
                        ))}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-md">
                          <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          {provider.name}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-md">
                          <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          {provider.city}, {provider.location}
                     </span>
                  </div>

                      {/* Row 3: Description */}
                      <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                        {provider.description || provider.bio}
                      </p>

                      {/* Row 4: Metrics - Horizontal Stats Bar */}
                      <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                          <span className="text-base font-bold text-slate-900 dark:text-white">{provider.rating}</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">({provider.reviewsCount})</span>
                        </div>
                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">From</span>
                          <span className="text-lg font-bold text-slate-900 dark:text-white">${provider.startingRate}</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">/hr</span>
                       </div>
                        {provider.projectsCompleted && (
                          <>
                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{provider.projectsCompleted}+ projects</span>
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