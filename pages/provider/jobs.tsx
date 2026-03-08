import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn } from '../../libs/auth';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';
import { GET_SERVICE_REQUESTS, GET_PROVIDER_ORGANIZATION, GET_QUOTES_BY_REQUEST, GET_QUOTE_BY_ID } from '../../apollo/user/query';
import { getHeaders } from '../../apollo/utils';
import { CREATE_QUOTE, UPDATE_QUOTE, DELETE_QUOTE } from '../../apollo/user/mutation';

interface ServiceRequest {
  _id: string;
  reqTitle: string;
  reqDescription: string;
  reqStatus: string;
  reqBudgetRange: string;
  reqDeadline?: string;
  reqUrgency?: string;
  reqTotalQuotes?: number;
  reqNewQuotesCount?: number;
  reqTotalLikes?: number;
  reqTotalViews?: number;
  reqCategory?: string;
  reqSubCategory?: string;
  reqSkillsNeeded?: string[];
  reqAttachments?: string[];
  reqBuyerOrgId?: string;
  reqCreatedByUserId?: string;
  createdAt: string;
  updatedAt?: string;
  // ✅ CORRECT field names from backend
  reqBuyerOrgData?: {
    _id: string;
    organizationName?: string;
    organizationIndustry?: string;
    organizationLocation?: string;
    organizationDescription?: string;
    organizationImage?: string;
    organizationContactEmail?: string;
    organizationType?: string;
    organizationStatus?: string;
  };
  reqCreatedByUserData?: {
    _id: string;
    userNick?: string;
    userEmail?: string;
  };
}

// Helper function to format date as "X hours/days ago"
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
};

export default function ProviderJobsPage() {
  // ========== HOOKS & STATE ==========
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'budget' | 'urgent'>('newest');
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteTarget, setQuoteTarget] = useState<ServiceRequest | null>(null);
  const [isQuotesViewOpen, setIsQuotesViewOpen] = useState(false);
  const [quotesTarget, setQuotesTarget] = useState<ServiceRequest | null>(null);
  const [editingQuote, setEditingQuote] = useState<any | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number | null>(null);
  const [quoteMessage, setQuoteMessage] = useState<string>('');
  const [quoteValidUntil, setQuoteValidUntil] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const cardsPerPage = 4;

  // ========== UTILITIES ==========
  const getSortField = (): string => {
    switch (sortBy) {
      case 'newest': return 'createdAt';
      case 'budget': return 'reqBudgetRange';
      case 'urgent': return 'reqUrgency';
      default: return 'createdAt';
    }
  };

  // ========== APOLLO REQUESTS ==========
  const { data, loading, error, refetch } = useQuery(GET_SERVICE_REQUESTS, {
    skip: !isLoggedIn() || !mounted,
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    variables: {
      input: {
        page: 1,
        limit: 50,
        sort: getSortField(),
        sortOrder: sortBy === 'budget' ? 'desc' : 'desc',
        search: {
          reqStatus: 'OPEN', // Only fetch OPEN requests - DRAFT, ACTIVE, COMPLETED, CLOSED are hidden
          reqCategory: selectedCategory !== 'all' ? selectedCategory : undefined,
          // Note: reqSubCategory is not supported by backend ServiceRequestSearch type
          // Filtering by subcategory will be done client-side instead
        },
      },
    },
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
  });

  const { data: providerOrgData } = useQuery(GET_PROVIDER_ORGANIZATION, {
    skip: !isLoggedIn(),
    fetchPolicy: 'network-only',
    context: { headers: isLoggedIn() ? getHeaders() : {} },
  });
  const providerOrgId: string | undefined = providerOrgData?.getProviderOrganization?._id;

  const [createQuote, { loading: creatingQuote }] = useMutation(CREATE_QUOTE, {
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    onCompleted: async () => {
      setIsQuoteOpen(false);
      setQuoteTarget(null);
      setQuoteAmount(null);
      setQuoteMessage('');
      setQuoteValidUntil('');
      await refetch();
      await refetchQuotes();
    },
    onError: (err) => {
      alert(err?.graphQLErrors?.[0]?.message || err.message || 'Failed to submit quote');
    },
  });

  const [updateQuote, { loading: updatingQuote }] = useMutation(UPDATE_QUOTE, {
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    onCompleted: async () => {
      setIsQuoteOpen(false);
      setQuoteTarget(null);
      setQuoteAmount(null);
      setQuoteMessage('');
      setQuoteValidUntil('');
      await refetch();
      await refetchQuotes();
    },
    onError: (err) => {
      alert(err?.graphQLErrors?.[0]?.message || err.message || 'Failed to update quote');
    },
  });

  const [deleteQuote, { loading: deletingQuote }] = useMutation(DELETE_QUOTE, {
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    onCompleted: async () => {
      await refetch();
      await refetchQuotes();
    },
    onError: (err) => {
      alert(err?.graphQLErrors?.[0]?.message || err.message || 'Failed to delete quote');
    },
  });

  // Handle quoteId from URL (from notification click)
  const quoteIdFromUrl = router.query.quoteId as string | undefined;
  
  // Fetch quote by ID to get requestId when quoteId is in URL
  const { data: quoteData, error: quoteError } = useQuery(GET_QUOTE_BY_ID, {
    variables: { quoteId: quoteIdFromUrl || '' },
    skip: !quoteIdFromUrl || !isLoggedIn() || !mounted || quoteIdFromUrl.length !== 24,
    fetchPolicy: 'network-only',
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    errorPolicy: 'all',
  });

  // Quotes for a given request (for "View" action and Propose modal)
  const currentRequestId = quotesTarget?._id || quoteTarget?._id;
  const isValidRequestId = currentRequestId && currentRequestId.length === 24;
  const shouldFetchQuotes = (isQuotesViewOpen || isQuoteOpen) && isValidRequestId;
  const {
    data: quotesData,
    loading: quotesLoading,
    refetch: refetchQuotes,
  } = useQuery(GET_QUOTES_BY_REQUEST, {
    variables: { requestId: isValidRequestId ? currentRequestId : '' },
    skip: !shouldFetchQuotes || !isValidRequestId,
    fetchPolicy: 'network-only',
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    errorPolicy: 'all',
  });

  // ========== LIFECYCLES ==========
  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    const role = currentUser?.userRole;
    if (role && role !== 'PROVIDER' && role !== 'provider') {
      router.push('/dashboard');
    }
  }, [router, currentUser]);

  // ========== CONSTANTS ==========
  const CATEGORY_MAP: Record<string, { label: string; subcategories: string[] }> = {
    'IT_AND_SOFTWARE': {
      label: 'IT & Software',
      subcategories: ['WEB_APP_DEVELOPMENT', 'DATA_AND_AI', 'SOFTWARE_TESTING_AND_QA', 'INFRASTRUCTURE_AND_CLOUD'],
    },
    'BUSINESS_SERVICES': {
      label: 'Business Services',
      subcategories: ['ADMIN_AND_VIRTUAL_SUPPORT', 'FINANCIAL_AND_LEGAL', 'STRATEGY_AND_CONSULTING', 'HR_AND_OPERATIONS'],
    },
    'MARKETING_AND_SALES': {
      label: 'Marketing & Sales',
      subcategories: ['DIGITAL_MARKETING', 'SOCIAL_MEDIA_MANAGEMENT', 'CONTENT_AND_COPYWRITING', 'SALES_AND_LEAD_GENERATION'],
    },
    'DESIGN_AND_CREATIVE': {
      label: 'Design & Creative',
      subcategories: ['VISUAL_IDENTITY_AND_BRANDING', 'UI_UX_AND_WEB_DESIGN', 'MOTION_AND_VIDEO', 'ILLUSTRATION_AND_PRINT'],
    },
  };

  // Subcategory labels for display
  const SUBCATEGORY_LABELS: Record<string, string> = {
    'WEB_APP_DEVELOPMENT': 'Web & App Development',
    'DATA_AND_AI': 'Data & AI',
    'SOFTWARE_TESTING_AND_QA': 'Software Testing & QA',
    'INFRASTRUCTURE_AND_CLOUD': 'Infrastructure & Cloud',
    'ADMIN_AND_VIRTUAL_SUPPORT': 'Admin & Virtual Support',
    'FINANCIAL_AND_LEGAL': 'Financial & Legal',
    'STRATEGY_AND_CONSULTING': 'Strategy & Consulting',
    'HR_AND_OPERATIONS': 'HR & Operations',
    'DIGITAL_MARKETING': 'Digital Marketing',
    'SOCIAL_MEDIA_MANAGEMENT': 'Social Media Management',
    'CONTENT_AND_COPYWRITING': 'Content & Copywriting',
    'SALES_AND_LEAD_GENERATION': 'Sales & Lead Generation',
    'VISUAL_IDENTITY_AND_BRANDING': 'Visual Identity & Branding',
    'UI_UX_AND_WEB_DESIGN': 'UI/UX & Web Design',
    'MOTION_AND_VIDEO': 'Motion & Video',
    'ILLUSTRATION_AND_PRINT': 'Illustration & Print',
  };

  const CATEGORY_NAMES = ['all', ...Object.keys(CATEGORY_MAP)];

  // Extract service requests from API response
  const serviceRequests: ServiceRequest[] = data?.getServiceRequests?.list || [];
  
  // Filter out any non-OPEN requests (backend should handle this via search.reqStatus, but double-check for safety)
  const openRequests = serviceRequests.filter(req => req.reqStatus === 'OPEN');

  // Effect to handle quoteId from URL and open quotes modal (moved after openRequests definition)
  useEffect(() => {
    if (quoteIdFromUrl && quoteData?.getQuoteById && openRequests.length > 0) {
      const requestId = quoteData.getQuoteById.quoteServiceReqId;
      if (requestId) {
        // Find the request in the list and open quotes modal
        const request = openRequests.find((r: ServiceRequest) => r._id === requestId);
        if (request) {
          setQuotesTarget(request);
          setIsQuotesViewOpen(true);
          // Clear the query parameter
          router.replace('/provider/jobs', undefined, { shallow: true });
        }
      }
    }
  }, [quoteIdFromUrl, quoteData, openRequests, router]);

  // ========== COMPUTED VALUES ==========
  const categories = CATEGORY_NAMES;

  const availableSubcategories = selectedCategory !== 'all' && CATEGORY_MAP[selectedCategory]
    ? ['all', ...CATEGORY_MAP[selectedCategory].subcategories]
    : ['all'];

  // ========== UTILITIES ==========
  let filteredJobs = openRequests.filter(job => {
    const matchesSearch = !searchQuery || 
      job.reqTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.reqDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    // Match category - backend uses values like IT_AND_SOFTWARE
    const matchesCategory = selectedCategory === 'all' || job.reqCategory === selectedCategory;
    // Match subcategory - backend uses values like WEB_APP_DEVELOPMENT
    const matchesSubcategory = selectedSubcategory === 'all' || job.reqSubCategory === selectedSubcategory;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  // Sort jobs
  filteredJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'budget':
        // Extract budget numbers for comparison
        const budgetA = parseFloat(a.reqBudgetRange?.replace(/[^0-9.]/g, '') || '0');
        const budgetB = parseFloat(b.reqBudgetRange?.replace(/[^0-9.]/g, '') || '0');
        return budgetB - budgetA;
      case 'urgent':
        // Sort by urgency: critical > urgent > normal
        const urgencyOrder: Record<string, number> = { 'CRITICAL': 3, 'VERY_URGENT': 3, 'URGENT': 2, 'NORMAL': 1 };
        const urgencyA = urgencyOrder[a.reqUrgency?.toUpperCase() || 'NORMAL'] || 1;
        const urgencyB = urgencyOrder[b.reqUrgency?.toUpperCase() || 'NORMAL'] || 1;
        return urgencyB - urgencyA;
      default:
        return 0;
    }
  });

  const getUrgencyColor = (urgency?: string) => {
    if (!urgency) return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    const urgencyLower = urgency.toLowerCase();
    if (urgencyLower.includes('very') || urgencyLower.includes('critical')) {
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
    } else if (urgencyLower.includes('urgent')) {
      return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  };

  const getUrgencyLabel = (urgency?: string) => {
    if (!urgency) return 'NORMAL';
    const urgencyUpper = urgency.toUpperCase();
    if (urgencyUpper.includes('VERY') || urgencyUpper.includes('CRITICAL')) {
      return 'VERY URGENT';
    } else if (urgencyUpper.includes('URGENT')) {
      return 'URGENT';
    }
    return 'NORMAL';
  };

  // ========== CONDITIONAL RENDERING ==========
  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800" />
          <main className="flex-1 overflow-y-auto" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn()) return null;

  // ========== RENDER ==========
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden antialiased">
      <ProviderSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ProviderHeader title="Find Jobs" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Find Jobs</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Discover premium opportunities from businesses looking for your expertise
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Search Jobs
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // Reset to first page
                      }}
                      placeholder="Search by title or description..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Category
                  </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedSubcategory('all'); // Reset subcategory when category changes
                        setCurrentPage(1); // Reset to first page
                      }}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : CATEGORY_MAP[cat]?.label || cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Subcategory
                  </label>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => {
                        setSelectedSubcategory(e.target.value);
                        setCurrentPage(1); // Reset to first page
                      }}
                      disabled={selectedCategory === 'all'}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {availableSubcategories.map(sub => (
                      <option key={sub} value={sub}>
                        {sub === 'all' ? 'All Subcategories' : SUBCATEGORY_LABELS[sub] || sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Found <span className="text-indigo-600 dark:text-indigo-400 font-bold">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sort:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as 'newest' | 'budget' | 'urgent');
                    setCurrentPage(1); // Reset to first page
                  }}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="budget">Highest Budget</option>
                  <option value="urgent">Most Urgent</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-3xl animate-spin">sync</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Loading available jobs...</p>
              </div>
            ) : error ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-3xl">work_off</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Jobs Available</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  We couldn't find any open job opportunities at the moment.
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
                  Try adjusting your filters or check back later for new opportunities.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSubcategory('all');
                    setSearchQuery('');
                    refetch();
                  }}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 mx-auto"
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div>
                {filteredJobs.length === 0 ? (
                  <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-[40px] rounded-[40px] border border-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 p-12 text-center shadow-xl">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400 text-3xl">work_off</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No open jobs found</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Try adjusting your filters or check back later</p>
                  </div>
                ) : (
                  <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(() => {
                      const startIndex = (currentPage - 1) * cardsPerPage;
                      const endIndex = startIndex + cardsPerPage;
                      return filteredJobs.slice(startIndex, endIndex).map((job) => (
                        <div
                          key={job._id}
                          className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                          >
                          <div className="p-6 flex flex-col flex-1">
                              {/* Tags Row */}
                            <div className="flex items-center gap-2 flex-wrap mb-4">
                              <span className="px-2.5 py-1 rounded-md text-xs font-bold text-slate-600 bg-slate-100">
                                  #{job._id.slice(-6)}
                                </span>
                                {job.reqUrgency && (
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                  getUrgencyLabel(job.reqUrgency) === 'VERY URGENT'
                                    ? 'bg-red-100 text-red-700 border border-red-200' 
                                    : getUrgencyLabel(job.reqUrgency) === 'URGENT'
                                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                                  }`}>
                                    {getUrgencyLabel(job.reqUrgency)}
                                  </span>
                                )}
                              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                  OPEN
                                </span>
                              </div>
                              
                              {/* Title */}
                            <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight line-clamp-2">
                                {job.reqTitle || 'Untitled Request'}
                              </h3>
                              
                              {/* Description */}
                              {job.reqDescription && (
                              <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-2 flex-1">
                                  {job.reqDescription}
                                </p>
                              )}
                              
                            {/* Details Section */}
                            <div className="space-y-2.5 mb-4">
                                {job.reqBudgetRange && (
                                  <div className="flex items-center gap-2">
                                  <span className="material-symbols-outlined text-base text-slate-400">payments</span>
                                  <span className="text-sm font-bold text-slate-900">{job.reqBudgetRange}</span>
                                  </div>
                                )}
                                {job.reqTotalQuotes !== undefined && job.reqTotalQuotes > 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="material-symbols-outlined text-base text-amber-500">people</span>
                                  <span className="text-sm font-semibold text-amber-600">{job.reqTotalQuotes} quotes</span>
                                  </div>
                                )}
                              {job.reqBuyerOrgData?.organizationName && (
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base text-slate-400">business</span>
                                  <span className="text-sm font-semibold text-slate-700 truncate">
                                    {job.reqBuyerOrgData.organizationName}
                                    </span>
                                  </div>
                                )}
                                {job.reqBuyerOrgData?.organizationLocation && (
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base text-slate-400">location_on</span>
                                  <span className="text-xs text-slate-500">{job.reqBuyerOrgData.organizationLocation}</span>
                                  </div>
                                )}
                                {job.reqCategory && (
                                <div className="pt-1">
                                  <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                                    {CATEGORY_MAP[job.reqCategory]?.label || job.reqCategory}
                                  </span>
                                </div>
                                )}
                              </div>
                              
                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-100">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setQuotesTarget(job);
                                    setIsQuotesViewOpen(true);
                                  }}
                                className="px-4 py-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all"
                                >
                                  View
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setQuoteTarget(job);
                                    setIsQuoteOpen(true);
                                  }}
                                className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-sm"
                                >
                                  Propose
                                </button>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                  
                  {/* Pagination */}
                  {filteredJobs.length > cardsPerPage && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-base">chevron_left</span>
                        Previous
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.ceil(filteredJobs.length / cardsPerPage) }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                              currentPage === page
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredJobs.length / cardsPerPage), prev + 1))}
                        disabled={currentPage >= Math.ceil(filteredJobs.length / cardsPerPage)}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        Next
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </button>
                    </div>
                  )}
                </>
                )}
              </div>
            )}


            <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-[var(--border)]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-4">Management</p>
              <button
                onClick={() => router.push('/provider/jobs')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">work</span>
                Find Jobs
              </button>
              <button
                onClick={() => router.push('/provider/organizations')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">settings_suggest</span>
                Manage Organizations
              </button>
              <Link
                href="/provider/help-support"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">help</span>
                Help & Support
              </Link>
            </div>
            <div className="pb-8">
              <p className="text-xs text-slate-400 font-medium">© 2026 SME Marketplace Provider v2.1</p>
            </div>
          </div>
        </main>
        {/* Propose Quote Modal Mount */}
        <ProposeQuoteModal
          open={isQuoteOpen}
          onClose={() => {
            setIsQuoteOpen(false);
            setQuoteTarget(null);
            setQuoteAmount(null);
            setQuoteMessage('');
            setQuoteValidUntil('');
            setEditingQuote(null);
          }}
          job={quoteTarget}
          disabled={creatingQuote || updatingQuote}
          providerOrgId={providerOrgId}
          existingQuote={editingQuote || (quoteTarget ? (quotesData?.getQuotesByRequest || []).find((q: any) => 
            (providerOrgId && q?.quoteProviderOrgData?._id === providerOrgId) || 
            (currentUser?._id && q?.quoteCreatedByUserData?._id === currentUser?._id)
          ) : undefined)}
          initialAmount={quoteAmount}
          initialMessage={quoteMessage}
          initialValidUntil={quoteValidUntil}
          onSubmit={({ amount, message, validUntil }) => {
            if (!providerOrgId || !quoteTarget) return;
            // Disallow quoting if request is not OPEN
            if (quoteTarget.reqStatus !== 'OPEN') {
              alert('This request is not open for quotes.');
              return;
            }
            // Check if quote already exists
            const existingQuote = (quotesData?.getQuotesByRequest || []).find((q: any) => 
              (providerOrgId && q?.quoteProviderOrgData?._id === providerOrgId) || 
              (currentUser?._id && q?.quoteCreatedByUserData?._id === currentUser?._id)
            );
            
            // If editing an existing PENDING quote, use UPDATE_QUOTE
            if (existingQuote && existingQuote.quoteStatus === 'PENDING') {
              updateQuote({
                variables: {
                  input: {
                    quoteId: existingQuote._id, // Use quoteId (not _id) as per API spec
                    quoteMessage: message.trim(),
                    quoteAmount: amount,
                    quoteValidUntil: new Date(validUntil).toISOString(),
                  },
                },
              });
            } else if (existingQuote && existingQuote.quoteStatus === 'REJECTED') {
              // If quote was rejected, allow provider to submit a new/modified quote
              // This creates a new quote (not updating the rejected one)
              createQuote({
                variables: {
                  orgId: providerOrgId,
                  input: {
                    quoteServiceReqId: quoteTarget._id,
                    quoteMessage: message.trim(),
                    quoteAmount: amount,
                    quoteValidUntil: new Date(validUntil).toISOString(),
                  },
                },
              });
            } else if (existingQuote && existingQuote.quoteStatus === 'ACCEPTED') {
              alert('You already have an accepted quote for this request. You cannot submit a new quote.');
              return;
            } else {
              // Create new quote (no existing quote or first time submitting)
              createQuote({
                variables: {
                  orgId: providerOrgId,
                  input: {
                    quoteServiceReqId: quoteTarget._id,
                    quoteMessage: message.trim(),
                    quoteAmount: amount,
                    quoteValidUntil: new Date(validUntil).toISOString(),
                  },
                },
              });
            }
          }}
        />
        {/* View Quotes Modal */}
        <ViewQuotesModal
          open={isQuotesViewOpen}
          onClose={() => {
            setIsQuotesViewOpen(false);
            setQuotesTarget(null);
          }}
          job={quotesTarget}
          quotes={quotesData?.getQuotesByRequest || []}
          loading={quotesLoading}
          providerOrgId={providerOrgId}
          currentUserId={currentUser?._id}
          onEditQuote={(quote) => {
            // Store the quote being edited first
            setEditingQuote(quote);
            // Set the job target (use quotesTarget which is the current job being viewed)
            setQuoteTarget(quotesTarget);
            // Pre-fill form data
            setQuoteAmount(quote.quoteAmount);
            setQuoteMessage(quote.quoteMessage);
            if (quote.quoteValidUntil) {
              const date = new Date(quote.quoteValidUntil);
              setQuoteValidUntil(date.toISOString().slice(0, 16));
            } else {
              setQuoteValidUntil('');
            }
            // Close View Quotes modal
            setIsQuotesViewOpen(false);
            setQuotesTarget(null);
            // Open edit modal after a small delay to ensure state is set
            setTimeout(() => {
              setIsQuoteOpen(true);
            }, 100);
          }}
          onResubmitQuote={(quote) => {
            // For rejected quotes, allow resubmission with modified quote
            // Set the job target
            setQuoteTarget(quotesTarget);
            // Pre-fill form data from rejected quote (provider can modify)
            setQuoteAmount(quote.quoteAmount);
            setQuoteMessage(quote.quoteMessage);
            if (quote.quoteValidUntil) {
              const date = new Date(quote.quoteValidUntil);
              setQuoteValidUntil(date.toISOString().slice(0, 16));
            } else {
              setQuoteValidUntil('');
            }
            // Clear editing quote since this is a new submission
            setEditingQuote(null);
            // Close View Quotes modal
            setIsQuotesViewOpen(false);
            setQuotesTarget(null);
            // Open propose modal after a small delay to ensure state is set
            setTimeout(() => {
              setIsQuoteOpen(true);
            }, 100);
          }}
          onDeleteQuote={(quoteId) => {
            if (confirm('Are you sure you want to delete this quote? You can submit a new one after deletion.')) {
              deleteQuote({ variables: { quoteId } });
            }
          }}
          deletingQuote={deletingQuote}
        />
      </div>
    </div>
  );
}

// ── Propose Quote Modal
function ProposeQuoteModal({
  open,
  onClose,
  job,
  onSubmit,
  disabled,
  providerOrgId,
  existingQuote,
  initialAmount,
  initialMessage,
  initialValidUntil,
}: {
  open: boolean;
  onClose: () => void;
  job: ServiceRequest | null;
  onSubmit: (params: { amount: number; message: string; validUntil: string }) => void;
  disabled?: boolean;
  providerOrgId?: string;
  existingQuote?: any;
  initialAmount?: number | null;
  initialMessage?: string;
  initialValidUntil?: string;
}) {
  const [amount, setAmount] = React.useState<number | ''>('');
  const [message, setMessage] = React.useState('');
  const [validUntil, setValidUntil] = React.useState('');

  React.useEffect(() => {
    // Set initial values if provided (for editing) or reset
    if (open) {
      // Priority: initial props > existingQuote > reset
      if (initialAmount !== null && initialAmount !== undefined) {
        setAmount(initialAmount);
        setMessage(initialMessage || '');
        setValidUntil(initialValidUntil || '');
      } else if (existingQuote) {
        setAmount(existingQuote.quoteAmount || '');
        setMessage(existingQuote.quoteMessage || '');
        if (existingQuote.quoteValidUntil) {
          const date = new Date(existingQuote.quoteValidUntil);
          setValidUntil(date.toISOString().slice(0, 16));
        } else {
          setValidUntil('');
        }
      } else {
        setAmount('');
        setMessage('');
        setValidUntil('');
      }
    } else {
      // Reset when modal closes
      setAmount('');
      setMessage('');
      setValidUntil('');
    }
  }, [open, initialAmount, initialMessage, initialValidUntil, existingQuote]);

  if (!open || !job) return null;
  const canSubmit = !!providerOrgId && typeof amount === 'number' && amount > 0 && message.trim().length > 0 && validUntil;
  const isEditing = !!existingQuote;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 shadow-xl rounded-2xl overflow-hidden">
        {/* Simple Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {isEditing ? 'Edit Quote' : 'Propose Quote'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {job.reqTitle || `Request #${job._id.slice(-6)}`}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Simple Form Body */}
        <div className="px-6 py-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {!providerOrgId && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                You must create your provider organization profile before sending quotes.
              </p>
            </div>
          )}

          {isEditing && existingQuote && (
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Status: <span className="font-semibold">{existingQuote.quoteStatus}</span>
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Quote Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="7500"
                className="w-full pl-7 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Valid Until <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your approach, timeline, and scope..."
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y"
            />
          </div>
        </div>

        {/* Simple Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!canSubmit || disabled}
            onClick={() => onSubmit({ amount: amount as number, message, validUntil })}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isEditing ? 'Update' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── View Quotes Modal (split mine vs others)
function ViewQuotesModal({
  open,
  onClose,
  job,
  quotes,
  loading,
  providerOrgId,
  currentUserId,
  onEditQuote,
  onDeleteQuote,
  onResubmitQuote,
  deletingQuote,
}: {
  open: boolean;
  onClose: () => void;
  job: ServiceRequest | null;
  quotes: any[];
  loading: boolean;
  providerOrgId?: string;
  currentUserId?: string;
  onEditQuote?: (quote: any) => void;
  onDeleteQuote?: (quoteId: string) => void;
  onResubmitQuote?: (quote: any) => void;
  deletingQuote?: boolean;
}) {
  if (!open || !job) return null;
  // Classify quotes based on provider organization ID and (fallback) creator user ID
  const mine = (quotes || []).filter((q: any) => {
    const orgId = q?.quoteProviderOrgData?._id;
    const creatorId = q?.quoteCreatedByUserData?._id;
    return (providerOrgId && orgId === providerOrgId) || (currentUserId && creatorId === currentUserId);
  });
  const others = (quotes || []).filter((q: any) => {
    const orgId = q?.quoteProviderOrgData?._id;
    const creatorId = q?.quoteCreatedByUserData?._id;
    const isMine =
      (providerOrgId && orgId === providerOrgId) || (currentUserId && creatorId === currentUserId);
    return !isMine;
  });
  const myQuote = mine[0];
  const canEditDelete = myQuote && myQuote.quoteStatus === 'PENDING';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 shadow-xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Simple Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Quotes</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{job.reqTitle || job._id.slice(-6)}</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-3 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-400 text-2xl animate-spin">sync</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading quotes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Others Left */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Other Quotes ({others.length})
                </h4>
                {others.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto mb-3 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400">inbox</span>
                    </div>
                    <p className="text-sm font-medium text-slate-600">No other quotes yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {others.map((q: any) => (
                      <div key={q._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Provider</p>
                            <p className="text-base font-bold text-slate-900 truncate">
                              {q.quoteProviderOrgData?.organizationName || 'Unknown Org'}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-2xl font-bold text-slate-900">${q.quoteAmount?.toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 mb-4 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{q.quoteMessage}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <span className="text-xs font-medium text-slate-500">
                            {new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            q.quoteStatus === 'ACCEPTED' 
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : q.quoteStatus === 'REJECTED'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {q.quoteStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mine Right */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">My Quote</h4>
                {!myQuote ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto mb-3 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400">request_quote</span>
                    </div>
                    <p className="text-sm font-medium text-slate-600">You have not proposed a quote for this request.</p>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-indigo-200 rounded-xl p-6 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">My Organization</p>
                        <p className="text-base font-bold text-slate-900">
                          {myQuote.quoteProviderOrgData?.organizationName || 'My Organization'}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-indigo-600">${myQuote.quoteAmount?.toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 mb-4 leading-relaxed bg-indigo-50 p-3 rounded-lg border border-indigo-100">{myQuote.quoteMessage}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mb-4">
                      <span className="text-xs font-medium text-slate-500">
                        {new Date(myQuote.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        myQuote.quoteStatus === 'ACCEPTED' 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : myQuote.quoteStatus === 'REJECTED'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      }`}>
                        {myQuote.quoteStatus}
                      </span>
                    </div>
                    
                    {/* Edit & Delete Buttons for PENDING quotes */}
                    {canEditDelete && (
                      <div className="pt-4 border-t border-slate-100 flex gap-3">
                        {onEditQuote && (
                          <button
                            onClick={() => {
                              onEditQuote(myQuote);
                            }}
                            className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                            Edit Quote
                          </button>
                        )}
                        {onDeleteQuote && (
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this quote? You can submit a new one after deletion.')) {
                                onDeleteQuote(myQuote._id);
                              }
                            }}
                            disabled={deletingQuote}
                            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                          >
                            {deletingQuote ? (
                              <>
                                <span className="material-symbols-outlined text-base animate-spin">sync</span>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-base">delete</span>
                                Delete
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                    
                    {/* Resubmit Button for REJECTED quotes */}
                    {myQuote.quoteStatus === 'REJECTED' && onResubmitQuote && job && job.reqStatus === 'OPEN' && (
                      <div className="pt-4 border-t border-slate-100">
                        <button
                          onClick={() => {
                            onResubmitQuote(myQuote);
                          }}
                          className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-base">refresh</span>
                          Resubmit Modified Quote
                        </button>
                        <p className="text-xs text-slate-500 mt-2 text-center">
                          Submit a revised quote with updated terms, pricing, or approach
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
