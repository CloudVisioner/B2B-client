import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn } from '../libs/auth';
import { getHeaders } from '../apollo/utils';
import { Sidebar } from '../libs/components/dashboard/Sidebar';
import { NotificationBell } from '../libs/components/dashboard/NotificationBell';
import { NotificationToast } from '../libs/components/NotificationToast';
import { GET_BUYER_SERVICE_REQUESTS, GET_QUOTES_BY_REQUEST, GET_QUOTE_BY_ID, GET_MY_PROFILE, GET_BUYER_ORGANIZATION } from '../apollo/user/query';
import { UPDATE_SERVICE_REQUEST, UPDATE_SERVICE_REQUEST_STATUS, ACCEPT_QUOTE, REJECT_QUOTE } from '../apollo/user/mutation';
import { getJwtToken, decodeJWT } from '../libs/auth';

/* ─── Service Request Interface ─── */
/* ✅ Using correct field names from backend */
interface ServiceRequest {
  _id: string;
  reqTitle: string;
  reqDescription: string;
  reqStatus: string;
  reqBudgetRange: string;
  reqDeadline: string;
  reqUrgency: string;
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
  updatedAt: string;
  // Note: GET_BUYER_SERVICE_REQUESTS may not include buyerOrgData, but interface is ready if backend adds it
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

/* ─── Status badge helper ─── */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-600 border-slate-200',
    OPEN: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    ACTIVE: 'bg-blue-50 text-blue-700 border-blue-100',
    COMPLETED: 'bg-purple-50 text-purple-700 border-purple-100',
    CLOSED: 'bg-slate-100 text-slate-500 border-slate-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-100',
  };
  const labels: Record<string, string> = {
    DRAFT: 'Draft',
    OPEN: 'Open',
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    CLOSED: 'Closed',
    CANCELLED: 'Cancelled',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border uppercase ${styles[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {labels[status] || status}
    </span>
  );
}

/* ─── Action button helper ─── */
function actionLabel(status: string) {
  switch (status) {
    case 'OPEN':
      return 'View Quotes';
    case 'ACTIVE':
      return 'View Progress';
    case 'DRAFT':
      return 'Publish Request';
    case 'COMPLETED':
      return 'Review';
    default:
      return 'View Details';
  }
}
function actionIcon(status: string) {
  if (status === 'DRAFT') return 'send';
  if (status === 'ACTIVE') return 'trending_up';
  return '';
}

/* ─── Format date helper ─── */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ─── Map category helper ─── */
function mapCategory(category?: string): string {
  if (!category) return 'Uncategorized';
  const categoryMap: Record<string, string> = {
    IT_AND_SOFTWARE: 'IT & Software',
    BUSINESS_SERVICES: 'Business Services',
    MARKETING_AND_SALES: 'Marketing & Sales',
    DESIGN_AND_CREATIVE: 'Design & Creative',
  };
  return categoryMap[category] || category.replace(/_/g, ' ');
}

/* ─── Reverse map category (frontend to backend) ─── */
function mapCategoryToBackend(category: string): string {
  const categoryMap: Record<string, string> = {
    'IT & Software': 'IT_AND_SOFTWARE',
    'Business Services': 'BUSINESS_SERVICES',
    'Marketing & Sales': 'MARKETING_AND_SALES',
    'Design & Creative': 'DESIGN_AND_CREATIVE',
  };
  return categoryMap[category] || category.toUpperCase().replace(/\s+/g, '_');
}

/* ─── Map subcategory to backend ─── */
function mapSubCategoryToBackend(subcategory: string): string {
  return subcategory.toUpperCase().replace(/\s+/g, '_').replace(/&/g, 'AND');
}

/* ─── Map urgency to backend ─── */
function mapUrgencyToBackend(urgency: string): string {
  switch (urgency.toLowerCase()) {
    case 'urgent': return 'URGENT';
    case 'critical': return 'CRITICAL';
    default: return 'NORMAL';
  }
}

/* ─── Map urgency from backend ─── */
function mapUrgencyFromBackend(urgency?: string): 'normal' | 'urgent' | 'critical' {
  if (!urgency) return 'normal';
  switch (urgency.toUpperCase()) {
    case 'URGENT': return 'urgent';
    case 'CRITICAL': return 'critical';
    default: return 'normal';
  }
}

/* ─── Category data for edit form ─── */
const CATEGORY_MAP: Record<string, { subcategories: string[]; skills: string[] }> = {
  'IT & Software': {
    subcategories: ['Web & App Development', 'Data & AI', 'Software Testing & QA', 'Infrastructure & Cloud'],
    skills: ['React', 'Python', 'Node.js', 'AWS', 'TypeScript', 'Docker', 'SQL', 'REST API'],
  },
  'Business Services': {
    subcategories: ['Admin & Virtual Support', 'Financial & Legal', 'Strategy & Consulting', 'HR & Operations'],
    skills: ['Business Analysis', 'Financial Modeling', 'Strategic Planning', 'Budgeting', 'Compliance', 'Project Management', 'Market Research', 'Contract Drafting'],
  },
  'Marketing & Sales': {
    subcategories: ['Digital Marketing', 'Social Media Management', 'Content & Copywriting', 'Sales & Lead Generation'],
    skills: ['SEO', 'Google Ads', 'Content Strategy', 'Copywriting', 'Social Media', 'Email Marketing', 'Google Analytics', 'Lead Generation'],
  },
  'Design & Creative': {
    subcategories: ['Visual Identity & Branding', 'UI/UX & Web Design', 'Motion & Video', 'Illustration & Print'],
    skills: ['Figma', 'Photoshop', 'Illustrator', 'UI/UX Design', 'Prototyping', 'Logo Design', 'After Effects', 'Brand Guidelines'],
  },
};

const CATEGORY_NAMES = Object.keys(CATEGORY_MAP);

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */
export default function ServiceRequestsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQuotesOpen, setIsQuotesOpen] = useState(false);
  const [quotesForRequest, setQuotesForRequest] = useState<ServiceRequest | null>(null);
  const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [progressRequest, setProgressRequest] = useState<ServiceRequest | null>(null);
  const [notificationToast, setNotificationToast] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  // Debounce search to avoid firing a query on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(id);
  }, [searchQuery]);

  // Fetch service requests from backend
  // Apollo auto-refetches when variables change, so no manual refetch effect needed
  const { data, loading, error } = useQuery(GET_BUYER_SERVICE_REQUESTS, {
    skip: !isLoggedIn(),
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    variables: {
      input: {
        status: statusFilter !== 'all' ? statusFilter.toUpperCase() : undefined,
        search: debouncedSearch || undefined,
        sortBy: sortBy === 'newest' ? 'createdAt' : sortBy === 'deadline' ? 'reqDeadline' : 'reqBudgetRange',
        sortOrder: 'desc',
        page: 1,
        limit: 50,
      },
    },
  });

  const serviceRequests = data?.getBuyerServiceRequests?.list || [];
  
  // Fetch user profile for image
  const getUserId = (): string | null => {
    if (currentUser?._id && currentUser._id.length === 24) return currentUser._id;
    const token = getJwtToken();
    if (token) {
      try {
        const claims = decodeJWT(token);
        return claims?._id || claims?.userId || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const validUserId = getUserId();
  const { data: profileData } = useQuery(GET_MY_PROFILE, {
    skip: !isLoggedIn() || !validUserId,
    variables: { userId: validUserId || '' },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
  });

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

  const rawUserImage = profileData?.getUser?.userImage || currentUser?.userImage || (() => {
    const token = getJwtToken();
    if (token) {
      try {
        const claims = decodeJWT(token);
        return claims?.userImage || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  })();
  
  const userImage = rawUserImage ? getImageUrl(rawUserImage) : null;
  
  // Fetch buyer organization
  const { data: orgData } = useQuery(GET_BUYER_ORGANIZATION, {
    skip: !isLoggedIn(),
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
  });

  // Handle quoteId from URL (from notification click)
  const quoteIdFromUrl = router.query.quoteId as string | undefined;
  
  // Fetch quote by ID to get requestId when quoteId is in URL
  const { data: quoteData, error: quoteError } = useQuery(GET_QUOTE_BY_ID, {
    variables: { quoteId: quoteIdFromUrl || '' },
    skip: !quoteIdFromUrl || !isLoggedIn() || quoteIdFromUrl.length !== 24,
    fetchPolicy: 'network-only',
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    errorPolicy: 'all',
  });

  // Effect to handle quoteId from URL and open quotes modal
  useEffect(() => {
    if (quoteIdFromUrl && quoteData?.getQuoteById && serviceRequests.length > 0) {
      const requestId = quoteData.getQuoteById.quoteServiceReqId;
      if (requestId) {
        // Find the request in the list and open quotes modal
        const request = serviceRequests.find((r: ServiceRequest) => r._id === requestId);
        if (request) {
          setQuotesForRequest(request);
          setIsQuotesOpen(true);
          // Clear the query parameter
          router.replace('/service-requests', undefined, { shallow: true });
        }
      }
    }
  }, [quoteIdFromUrl, quoteData, serviceRequests, router]);

  // Fetch quotes for selected request
  const quotesRequestId = quotesForRequest?._id;
  const shouldFetchQuotes = isQuotesOpen && !!quotesRequestId && quotesRequestId.length > 0;
  const {
    data: quotesData,
    loading: quotesLoading,
    refetch: refetchQuotes,
  } = useQuery(GET_QUOTES_BY_REQUEST, {
    variables: { requestId: quotesRequestId || '' },
    skip: !shouldFetchQuotes,
    fetchPolicy: 'network-only',
    context: { headers: isLoggedIn() ? getHeaders() : {} },
  });

  // Fetch quotes for progress request (to get accepted quote)
  const progressRequestId = progressRequest?._id;
  const shouldFetchProgressQuotes = isProgressModalOpen && !!progressRequestId && progressRequestId.length > 0;
  const {
    data: progressQuotesData,
    loading: progressQuotesLoading,
  } = useQuery(GET_QUOTES_BY_REQUEST, {
    variables: { requestId: progressRequestId || '' },
    skip: !shouldFetchProgressQuotes,
    fetchPolicy: 'network-only',
    context: { headers: isLoggedIn() ? getHeaders() : {} },
  });

  const acceptedQuote = progressQuotesData?.getQuotesByRequest?.find((q: any) => q.quoteStatus === 'ACCEPTED');
  const buyerOrganization = orgData?.getBuyerOrganization;

  const metaCounter = data?.getBuyerServiceRequests?.metaCounter || {
    total: 0,
    open: 0,
    active: 0,
    completed: 0,
    closed: 0,
    draft: 0,
    cancelled: 0,
  };

  // Accept/Reject Quote mutations
  const [acceptQuote, { loading: isAcceptingQuote }] = useMutation(ACCEPT_QUOTE, {
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    refetchQueries: [
      {
        query: GET_BUYER_SERVICE_REQUESTS,
        variables: {
          input: {
            status: statusFilter !== 'all' ? statusFilter.toUpperCase() : undefined,
            search: debouncedSearch || undefined,
            sortBy: sortBy === 'newest' ? 'createdAt' : sortBy === 'deadline' ? 'reqDeadline' : 'reqBudgetRange',
            sortOrder: 'desc',
            page: 1,
            limit: 50,
          },
        },
      },
      {
        query: GET_QUOTES_BY_REQUEST,
        variables: { requestId: quotesForRequest?._id || '' },
        skip: !isQuotesOpen || !quotesForRequest?._id,
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      // Success message could go here
    },
    onError: (error) => {
      alert(error?.graphQLErrors?.[0]?.message || error?.message || 'Failed to accept quote');
    },
  });

  const [rejectQuote, { loading: isRejectingQuote }] = useMutation(REJECT_QUOTE, {
    context: { headers: isLoggedIn() ? getHeaders() : {} },
    refetchQueries: [
      {
        query: GET_BUYER_SERVICE_REQUESTS,
        variables: {
          input: {
            status: statusFilter !== 'all' ? statusFilter.toUpperCase() : undefined,
            search: debouncedSearch || undefined,
            sortBy: sortBy === 'newest' ? 'createdAt' : sortBy === 'deadline' ? 'reqDeadline' : 'reqBudgetRange',
            sortOrder: 'desc',
            page: 1,
            limit: 50,
          },
        },
      },
      {
        query: GET_QUOTES_BY_REQUEST,
        variables: { requestId: quotesForRequest?._id || '' },
        skip: !isQuotesOpen || !quotesForRequest?._id,
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      // Success message could go here
    },
    onError: (error) => {
      setNotificationToast({
        isOpen: true,
        type: 'error',
        title: 'Quote Rejection Failed',
        message: error?.graphQLErrors?.[0]?.message || error?.message || 'Failed to reject quote. Please try again.',
      });
    },
    onCompleted: () => {
      setNotificationToast({
        isOpen: true,
        type: 'success',
        title: 'Quote Rejected',
        message: 'The quote has been successfully rejected.',
      });
    },
  });

  // Update mutation
  const [updateServiceRequest, { loading: isUpdating }] = useMutation(UPDATE_SERVICE_REQUEST, {
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    refetchQueries: [
      {
        query: GET_BUYER_SERVICE_REQUESTS,
        variables: {
          input: {
            status: statusFilter !== 'all' ? statusFilter.toUpperCase() : undefined,
            search: debouncedSearch || undefined,
            sortBy: sortBy === 'newest' ? 'createdAt' : sortBy === 'deadline' ? 'reqDeadline' : 'reqBudgetRange',
            sortOrder: 'desc',
            page: 1,
            limit: 50,
          },
        },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setIsEditModalOpen(false);
      setEditingRequest(null);
    },
    onError: (error) => {
      console.error('Error updating service request:', error);
      const errorMessage = error?.graphQLErrors?.[0]?.message || error?.message || 'Failed to update service request. Please try again.';
      alert(errorMessage);
    },
  });

  // Dedicated status mutation for actions like publishing a draft
  const [updateServiceRequestStatus, { loading: isUpdatingStatus }] = useMutation(UPDATE_SERVICE_REQUEST_STATUS, {
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    refetchQueries: [
      {
        query: GET_BUYER_SERVICE_REQUESTS,
        variables: {
          input: {
            status: statusFilter !== 'all' ? statusFilter.toUpperCase() : undefined,
            search: debouncedSearch || undefined,
            sortBy: sortBy === 'newest' ? 'createdAt' : sortBy === 'deadline' ? 'reqDeadline' : 'reqBudgetRange',
            sortOrder: 'desc',
            page: 1,
            limit: 50,
          },
        },
      },
    ],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('Error updating service request status:', error);
      const errorMessage = error?.graphQLErrors?.[0]?.message || error?.message || 'Failed to update service request status. Please try again.';
      alert(errorMessage);
    },
  });

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) router.push('/login');
  }, [router]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  /** HANDLERS **/

  const handlePrimaryAction = async (req: ServiceRequest) => {
    // DRAFT → publish immediately to OPEN
    if (req.reqStatus === 'DRAFT') {
      try {
        const result = await updateServiceRequestStatus({
          variables: {
            requestId: req._id,
            status: 'OPEN',
          },
        });
        // Success - the refetchQueries will update the list automatically
        console.log('Request published successfully:', result);
      } catch (error: any) {
        console.error('Failed to publish request:', error);
        // Show error to user
        alert(error?.message || 'Failed to publish request. Please try again.');
      }
      return;
    }

    // OPEN → view quotes
    if (req.reqStatus === 'OPEN') {
      setQuotesForRequest(req);
      setIsQuotesOpen(true);
      return;
    }

    // ACTIVE → view progress
    if (req.reqStatus === 'ACTIVE') {
      setProgressRequest(req);
      setIsProgressModalOpen(true);
      return;
    }

    // Other statuses → open details
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  /* SSR skeleton */
  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full border-r border-slate-200 bg-white" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-16 bg-white border-b" />
          <main className="flex-1 overflow-y-auto"         />
      </div>
      
      {/* Notification Toast */}
      <NotificationToast
        isOpen={notificationToast.isOpen}
        onClose={() => setNotificationToast({ ...notificationToast, isOpen: false })}
        type={notificationToast.type}
        title={notificationToast.title}
        message={notificationToast.message}
        duration={5000}
      />
    </div>
  );
}
  if (!isLoggedIn()) return null;

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden antialiased">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* ── Header ── */}
        <header className="bg-white border-b border-slate-200 flex-shrink-0">
          {/* Top row */}
          <div className="h-16 flex items-center justify-between px-8">
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Service Requests</h1>
              <p className="text-xs text-slate-500 font-medium">
                {loading ? 'Loading...' : `${metaCounter.total} Total Requests`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/post-job')}
                className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                Post New Job
              </button>

              <div className="h-8 w-px bg-slate-200 mx-2" />

              <NotificationBell userId={currentUser?._id} userRole={currentUser?.userRole} />

              <button className="flex items-center gap-2 pl-2 py-1 pr-2 hover:bg-slate-50 rounded-full transition-colors border border-slate-100">
                {userImage ? (
                  <img
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    src={userImage}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.userNick || 'U')}&background=4F46E5&color=fff`;
                    }}
                  />
                ) : (
                  <img
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.userNick || 'U')}&background=4F46E5&color=fff`}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Search & filters */}
          <div className="px-8 py-3 bg-white border-t border-slate-100 flex items-center gap-4">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-[var(--primary)] focus:border-[var(--primary)] placeholder:text-slate-400"
                placeholder="Search requests..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-[var(--primary)] focus:border-[var(--primary)] px-3 py-2.5 pr-10 min-w-[140px]"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-[var(--primary)] focus:border-[var(--primary)] px-3 py-2.5 pr-10 min-w-[140px]"
              >
                <option value="newest">Newest First</option>
                <option value="budget">Budget High-Low</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Summary row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Requests', value: metaCounter.total || 0, sub: 'Lifetime' },
                { label: 'Open', value: metaCounter.open || 0, sub: 'Published', subColor: 'text-emerald-600' },
                { label: 'Active', value: metaCounter.active || 0, sub: 'In Progress', subColor: 'text-blue-600' },
                { label: 'Completed', value: metaCounter.completed || 0, sub: 'Delivered', subColor: 'text-purple-600' },
              ].map((card) => (
                <div key={card.label} className="p-5 bg-white border border-transparent rounded-xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{card.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{card.value}</span>
                    <span className={`text-sm font-semibold ${card.subColor || 'text-slate-500'}`}>{card.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Request cards */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-lg p-6 animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="h-16 bg-slate-100 rounded"></div>
                      <div className="h-16 bg-slate-100 rounded"></div>
                      <div className="h-16 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-bold">Error loading service requests</p>
                <p className="text-sm text-red-500 mt-2">{error.message}</p>
              </div>
            ) : serviceRequests.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">description</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Service Requests Yet</h3>
                <p className="text-sm text-slate-500 mb-6">Create your first service request to get started</p>
                <button
                  onClick={() => router.push('/post-job')}
                  className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2 mx-auto"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  Post New Service Request
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {serviceRequests.map((req: ServiceRequest) => {
                  const isOpen = req.reqStatus === 'OPEN';
                  const isDraft = req.reqStatus === 'DRAFT';
                  const isActive = req.reqStatus === 'ACTIVE';

                  return (
                    <div
                      key={req._id}
                      className="bg-white border border-slate-200 rounded-lg overflow-hidden card-hover transition-all duration-200"
                    >
                      {/* Card body */}
                      <div className="p-6">
                        {/* Title row */}
                        <div className="flex justify-between items-start mb-5">
                          <div>
                            <span className="text-[11px] font-mono font-bold text-slate-400 tracking-widest uppercase mb-1 block">
                              #{req._id.slice(-6).toUpperCase()}
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 leading-tight">{req.reqTitle}</h3>
                          </div>
                          <StatusBadge status={req.reqStatus} />
                        </div>

                        {/* Meta grid */}
                        <div className="grid grid-cols-3 gap-6 mb-6">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">payments</span>
                            <div>
                              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wide">Budget</p>
                              <p className="font-bold text-slate-700 text-sm">{req.reqBudgetRange || 'Not set'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">calendar_month</span>
                            <div>
                              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wide">Deadline</p>
                              <p className="font-bold text-slate-700 text-sm">{req.reqDeadline ? formatDate(req.reqDeadline) : 'Not set'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">sell</span>
                            <div>
                              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wide">Category</p>
                              <p className="font-bold text-slate-700 text-sm">{req.reqCategory ? mapCategory(req.reqCategory) : 'Uncategorized'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Status-specific section */}
                        {isOpen && ((req.reqTotalQuotes != null && req.reqTotalQuotes > 0) || (req.reqNewQuotesCount != null && req.reqNewQuotesCount > 0)) && (
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-4">
                              {req.reqTotalQuotes != null && req.reqTotalQuotes > 0 && (
                                <p className="text-sm font-bold text-slate-700">{req.reqTotalQuotes} Quotes Received</p>
                              )}
                              {req.reqNewQuotesCount && req.reqNewQuotesCount > 0 && (
                                <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                  +{req.reqNewQuotesCount} New
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {isDraft && (
                          <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex items-center justify-center">
                            <p className="text-sm font-medium text-slate-500 italic">Review required before publishing to marketplace</p>
                          </div>
                        )}

                        {isActive && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-bold text-blue-700">Work in Progress</p>
                              <span className="text-xs font-bold text-blue-600">50%</span>
                            </div>
                            <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }}></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card footer */}
                      <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedRequest(req);
                            setIsModalOpen(true);
                          }}
                          className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => handlePrimaryAction(req)}
                          disabled={isUpdatingStatus}
                          className="bg-[var(--primary)] hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2"
                        >
                          {actionIcon(req.reqStatus) && (
                            <span className="material-symbols-outlined text-sm">{actionIcon(req.reqStatus)}</span>
                          )}
                          {actionLabel(req.reqStatus)}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination - Show only if there are requests */}
            {serviceRequests.length > 0 && (
              <div className="flex flex-col items-center gap-3 py-8">
                <p className="text-sm text-slate-400 font-medium">
                  Displaying {serviceRequests.length} of {metaCounter.total} Service Request{metaCounter.total !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Management Footer */}
            <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-[var(--border)]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-4">Management</p>
              <button
                onClick={() => router.push('/marketplace')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">groups</span>
                Browse Talent
              </button>
              <button
                onClick={() => router.push('/organizations')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">settings_suggest</span>
                Manage Organizations
              </button>
              <button
                onClick={() => router.push('/help-support')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">help</span>
                Help &amp; Support
              </button>
            </div>
            <div className="pb-8">
              <p className="text-xs text-slate-400 font-medium">© 2024 SME Connect. Enterprise Buyer Protocol v2.4.1</p>
            </div>
          </div>
        </main>
      </div>

      {/* ── View Progress Modal ── */}
      {isProgressModalOpen && progressRequest && (
        <>
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUpFadeIn {
              from { 
                opacity: 0;
                transform: translateY(20px);
              }
              to { 
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes slideInLeft {
              from {
                opacity: 0;
                transform: translateX(-30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            @keyframes slideInRight {
              from {
                opacity: 0;
                transform: translateX(30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            @keyframes slideInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .modal-backdrop {
              animation: fadeIn 0.3s ease-in;
            }
            .modal-content {
              animation: slideUpFadeIn 0.5s ease-out;
            }
            .animate-slide-left {
              animation: slideInLeft 0.7s ease-out;
            }
            .animate-slide-right {
              animation: slideInRight 0.7s ease-out;
            }
            .animate-slide-up {
              animation: slideInUp 0.7s ease-out;
            }
          `}</style>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] modal-backdrop"
            onClick={() => setIsProgressModalOpen(false)}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full my-8 modal-content">
              {/* Animated Header */}
              <div className="relative px-8 py-8 border-b border-slate-200 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                  <div className="relative flex items-start justify-between">
                  <div className="flex-1 animate-slide-left">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-2xl">trending_up</span>
                      </div>
                      <StatusBadge status={progressRequest.reqStatus} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">{progressRequest.reqTitle}</h2>
                    <p className="text-indigo-100 font-medium">Active Project Progress</p>
                  </div>
                  <button
                    onClick={() => setIsProgressModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
                  >
                    <span className="material-symbols-outlined text-white text-2xl">close</span>
                  </button>
                </div>
              </div>

              {/* Modal Body with Animations */}
              <div className="p-8 space-y-6">
                {progressQuotesLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Company Request Info - Animated */}
                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg animate-slide-left" style={{ animationDelay: '0.1s' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                          <span className="material-symbols-outlined text-white">business</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900">Company Request Information</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Organization</p>
                            <p className="text-base font-bold text-slate-900">{buyerOrganization?.organizationName || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Industry</p>
                            <p className="text-base font-medium text-slate-700">{buyerOrganization?.organizationIndustry || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</p>
                            <p className="text-base font-medium text-slate-700">{mapCategory(progressRequest.reqCategory)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Budget Range</p>
                            <p className="text-base font-bold text-indigo-600">{progressRequest.reqBudgetRange || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      {progressRequest.reqDescription && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</p>
                          <p className="text-sm text-slate-700 leading-relaxed">{progressRequest.reqDescription}</p>
                        </div>
                      )}
                    </div>

                    {/* Quote Provider Info - Animated */}
                    {acceptedQuote && (
                      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border-2 border-emerald-200 p-6 shadow-lg animate-slide-right" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-white">verified</span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900">Accepted Quote Provider</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Provider Organization</p>
                              <p className="text-base font-bold text-slate-900">{acceptedQuote.quoteProviderOrgData?.organizationName || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Quote Amount</p>
                              <p className="text-2xl font-black text-emerald-600">${acceptedQuote.quoteAmount?.toLocaleString() || '0'}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                                ACCEPTED
                              </span>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Valid Until</p>
                              <p className="text-base font-medium text-slate-700">
                                {acceptedQuote.quoteValidUntil ? formatDate(acceptedQuote.quoteValidUntil) : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                        {acceptedQuote.quoteMessage && (
                          <div className="mt-4 pt-4 border-t border-emerald-200">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Provider Message</p>
                            <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">{acceptedQuote.quoteMessage}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Project Timeline - Animated */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg animate-slide-up" style={{ animationDelay: '0.3s' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                          <span className="material-symbols-outlined text-white">schedule</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900">Project Timeline</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-indigo-600">event</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deadline</p>
                            <p className="text-base font-bold text-slate-900">{progressRequest.reqDeadline ? formatDate(progressRequest.reqDeadline) : 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-amber-600">priority_high</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Urgency</p>
                            <p className="text-base font-bold text-slate-900 capitalize">{progressRequest.reqUrgency?.toLowerCase() || 'Normal'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsProgressModalOpen(false)}
                  className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all shadow-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsProgressModalOpen(false);
                    setSelectedRequest(progressRequest);
                    setIsModalOpen(true);
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">visibility</span>
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Service Request Details Modal ── */}
      {isModalOpen && selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400 tracking-widest uppercase">
                      #{selectedRequest._id.slice(-6).toUpperCase()}
                    </span>
                    <StatusBadge status={selectedRequest.reqStatus} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedRequest.reqTitle}</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="ml-4 p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">description</span>
                    Description
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedRequest.reqDescription || 'No description provided.'}
                    </p>
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-5 border border-indigo-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">payments</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Budget Range</p>
                        <p className="text-lg font-bold text-slate-900">{selectedRequest.reqBudgetRange || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-5 border border-emerald-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">calendar_month</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deadline</p>
                        <p className="text-lg font-bold text-slate-900">
                          {selectedRequest.reqDeadline ? formatDate(selectedRequest.reqDeadline) : 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-5 border border-amber-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">sell</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</p>
                        <p className="text-lg font-bold text-slate-900">
                          {selectedRequest.reqCategory ? mapCategory(selectedRequest.reqCategory) : 'Uncategorized'}
                        </p>
                        {selectedRequest.reqSubCategory && (
                          <p className="text-sm text-slate-600 mt-1">{selectedRequest.reqSubCategory.replace(/_/g, ' ')}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-5 border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">speed</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Urgency</p>
                        <p className="text-lg font-bold text-slate-900 capitalize">
                          {selectedRequest.reqUrgency?.toLowerCase() || 'Normal'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Required Skills */}
                {selectedRequest.reqSkillsNeeded && selectedRequest.reqSkillsNeeded.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">psychology</span>
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.reqSkillsNeeded.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-lg border border-indigo-200"
                        >
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                          </span>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quotes Info (if open) */}
                {selectedRequest.reqStatus === 'OPEN' && ((selectedRequest.reqTotalQuotes != null && selectedRequest.reqTotalQuotes > 0) || (selectedRequest.reqNewQuotesCount != null && selectedRequest.reqNewQuotesCount > 0)) && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Quotes Received</p>
                        {selectedRequest.reqTotalQuotes != null && selectedRequest.reqTotalQuotes > 0 && (
                          <p className="text-2xl font-bold text-emerald-700">
                            {selectedRequest.reqTotalQuotes}
                          </p>
                        )}
                      </div>
                      {selectedRequest.reqNewQuotesCount && selectedRequest.reqNewQuotesCount > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            +{selectedRequest.reqNewQuotesCount} New
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Created</p>
                    <p className="text-sm font-semibold text-slate-600">
                      {selectedRequest.createdAt ? formatDate(selectedRequest.createdAt) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Last Updated</p>
                    <p className="text-sm font-semibold text-slate-600">
                      {selectedRequest.updatedAt ? formatDate(selectedRequest.updatedAt) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-white rounded-lg transition-colors border border-slate-200"
              >
                Close
              </button>
              <div className="flex items-center gap-3">
                {(selectedRequest.reqStatus === 'DRAFT' || selectedRequest.reqStatus === 'OPEN') && (
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingRequest(selectedRequest);
                      setIsEditModalOpen(true);
                    }}
                    className="px-5 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    Edit
                  </button>
                )}
                <button 
                  onClick={() => handlePrimaryAction(selectedRequest)}
                  disabled={isUpdatingStatus && selectedRequest.reqStatus === 'DRAFT'}
                  className="bg-[var(--primary)] hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2"
                >
                  {actionIcon(selectedRequest.reqStatus) && (
                    <span className="material-symbols-outlined text-sm">{actionIcon(selectedRequest.reqStatus)}</span>
                  )}
                  {actionLabel(selectedRequest.reqStatus)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Premium Edit Modal ── */}
      {isEditModalOpen && editingRequest && (
        <EditServiceRequestModal
          request={editingRequest}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingRequest(null);
          }}
          onSave={async (formData) => {
            try {
              const input: any = {
                _id: editingRequest._id,
              };

              if (formData.title) input.reqTitle = formData.title.trim();
              if (formData.description) input.reqDescription = formData.description.trim();
              if (formData.budgetRange) input.reqBudgetRange = formData.budgetRange.trim();
              if (formData.deadline) input.reqDeadline = new Date(formData.deadline).toISOString();
              if (formData.category) input.reqCategory = mapCategoryToBackend(formData.category);
              if (formData.subcategory) input.reqSubCategory = mapSubCategoryToBackend(formData.subcategory);
              if (formData.urgency) input.reqUrgency = mapUrgencyToBackend(formData.urgency);
              if (formData.skills && formData.skills.length > 0) input.reqSkillsNeeded = formData.skills;
              // Note: reqStatus is not updated here - only editable when DRAFT or OPEN
              // Status changes should use UPDATE_SERVICE_REQUEST_STATUS mutation

              await updateServiceRequest({ variables: { input } });
            } catch (error) {
              // Error handled in onError callback
            }
          }}
          isSaving={isUpdating}
        />
      )}

      {/* ── Premium Buyer Quotes Modal ── */}
      {isQuotesOpen && quotesForRequest && (
        <BuyerQuotesModal
          open={isQuotesOpen}
          onClose={() => {
            setIsQuotesOpen(false);
            setQuotesForRequest(null);
          }}
          request={quotesForRequest}
          quotes={quotesData?.getQuotesByRequest || []}
          loading={quotesLoading}
          onAcceptQuote={async (quoteId) => {
            try {
              await acceptQuote({ variables: { quoteId } });
              if (refetchQuotes) await refetchQuotes();
            } catch (error) {
              // Error handled in mutation onError
            }
          }}
          onRejectQuote={async (quoteId) => {
            try {
              await rejectQuote({ variables: { quoteId } });
              if (refetchQuotes) await refetchQuotes();
            } catch (error) {
              // Error handled in mutation onError
            }
          }}
          refetchQuotes={refetchQuotes}
          isAccepting={isAcceptingQuote}
          isRejecting={isRejectingQuote}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Premium Buyer Quotes Modal Component
   ═══════════════════════════════════════════════════════════ */
interface BuyerQuotesModalProps {
  open: boolean;
  onClose: () => void;
  request: ServiceRequest;
  quotes: any[];
  loading: boolean;
  onAcceptQuote: (quoteId: string) => Promise<void>;
  onRejectQuote: (quoteId: string) => Promise<void>;
  isAccepting?: boolean;
  isRejecting?: boolean;
  refetchQuotes?: () => Promise<any>;
}

function BuyerQuotesModal({ open, onClose, request, quotes, loading, onAcceptQuote, onRejectQuote, isAccepting, isRejecting, refetchQuotes }: BuyerQuotesModalProps) {
  const [acceptingQuote, setAcceptingQuote] = useState<string | null>(null);
  const [rejectingQuote, setRejectingQuote] = useState<string | null>(null);

  if (!open) return null;

  const handleAccept = async (quoteId: string) => {
    setAcceptingQuote(quoteId);
    try {
      await onAcceptQuote(quoteId);
      if (refetchQuotes) await refetchQuotes();
    } finally {
      setAcceptingQuote(null);
    }
  };

  const handleReject = async (quoteId: string) => {
    setRejectingQuote(quoteId);
    try {
      await onRejectQuote(quoteId);
      if (refetchQuotes) await refetchQuotes();
    } finally {
      setRejectingQuote(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 shadow-xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Simple Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Quotes Received</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {request.reqTitle || `Request #${request._id.slice(-6).toUpperCase()}`}
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-3 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-400 text-2xl animate-spin">sync</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading quotes...</p>
            </div>
          ) : quotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 opacity-20">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-slate-400">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No quotes yet</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Providers haven't submitted quotes for this request</p>
            </div>
          ) : (
            <div className="space-y-3">
              {quotes.map((quote: any) => (
                <div
                  key={quote._id}
                  className={`p-5 rounded-xl border transition-all ${
                    quote.quoteStatus === 'ACCEPTED'
                      ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                      : quote.quoteStatus === 'REJECTED'
                      ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Provider</p>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        {quote.quoteProviderOrgData?.organizationName || 'Unknown Provider'}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">${quote.quoteAmount?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                      {quote.quoteMessage}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </span>
                      {quote.quoteValidUntil && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-400">
                            Valid until {new Date(quote.quoteValidUntil).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        quote.quoteStatus === 'ACCEPTED' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : quote.quoteStatus === 'REJECTED'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {quote.quoteStatus}
                      </span>
                      {quote.quoteStatus === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleReject(quote._id)}
                            disabled={rejectingQuote === quote._id || acceptingQuote === quote._id || isRejecting || isAccepting}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {(rejectingQuote === quote._id || isRejecting) ? (
                              <>
                                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-sm">close</span>
                                Reject
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleAccept(quote._id)}
                            disabled={acceptingQuote === quote._id || rejectingQuote === quote._id || isAccepting || isRejecting}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {(acceptingQuote === quote._id || isAccepting) ? (
                              <>
                                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                                Accepting...
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Accept
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Premium Edit Modal Component
   ═══════════════════════════════════════════════════════════ */
interface EditFormData {
  title: string;
  category: string;
  subcategory: string;
  budgetRange: string;
  deadline: string;
  description: string;
  skills: string[];
  urgency: 'normal' | 'urgent' | 'critical';
}

interface EditServiceRequestModalProps {
  request: ServiceRequest;
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: EditFormData) => Promise<void>;
  isSaving: boolean;
}

function EditServiceRequestModal({ request, isOpen, onClose, onSave, isSaving }: EditServiceRequestModalProps) {
  const [formData, setFormData] = useState<EditFormData>({
    title: request.reqTitle || '',
    category: request.reqCategory ? mapCategory(request.reqCategory) : '',
    subcategory: request.reqSubCategory ? request.reqSubCategory.replace(/_/g, ' ') : '',
    budgetRange: request.reqBudgetRange
      ? request.reqBudgetRange.replace(/[^0-9]/g, '')
      : '',
    deadline: request.reqDeadline ? new Date(request.reqDeadline).toISOString().split('T')[0] : '',
    description: request.reqDescription || '',
    skills: request.reqSkillsNeeded || [],
    urgency: mapUrgencyFromBackend(request.reqUrgency),
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: request.reqTitle || '',
        category: request.reqCategory ? mapCategory(request.reqCategory) : '',
        subcategory: request.reqSubCategory ? request.reqSubCategory.replace(/_/g, ' ') : '',
        budgetRange: request.reqBudgetRange
          ? request.reqBudgetRange.replace(/[^0-9]/g, '')
          : '',
        deadline: request.reqDeadline ? new Date(request.reqDeadline).toISOString().split('T')[0] : '',
        description: request.reqDescription || '',
        skills: request.reqSkillsNeeded || [],
        urgency: mapUrgencyFromBackend(request.reqUrgency),
      });
      setSkillInput('');
    }
  }, [isOpen, request]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSaving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, isSaving, onClose]);

  const update = <K extends keyof EditFormData>(key: K, value: EditFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      update('skills', [...formData.skills, trimmed]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    update('skills', formData.skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields (Title and Description).');
      return;
    }
    await onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Premium Header */}
        <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-indigo-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-white text-xl">edit</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Edit Service Request</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Update your request details</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="ml-4 p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Request Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g. Web Design & Brand Identity Refresh"
                className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 placeholder:text-slate-300"
                required
                disabled={isSaving}
              />
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    update('category', e.target.value);
                    update('subcategory', '');
                    update('skills', []);
                  }}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                  required
                  disabled={isSaving}
                >
                  <option value="">Select Category</option>
                  {CATEGORY_NAMES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Subcategory
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => update('subcategory', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                  disabled={!formData.category || isSaving}
                >
                  <option value="">Select Subcategory</option>
                  {formData.category && CATEGORY_MAP[formData.category]?.subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget & Deadline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Budget Range <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min={0}
                    value={formData.budgetRange}
                    onChange={(e) => update('budgetRange', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="3500"
                    className="w-full border border-slate-200 rounded-lg pl-8 pr-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 placeholder:text-slate-300"
                    required
                    disabled={isSaving}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Deadline <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => update('deadline', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                  required
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Urgency
              </label>
              <div className="flex gap-2">
                {(['normal', 'urgent', 'critical'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => update('urgency', u)}
                    disabled={isSaving}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold capitalize transition-all border ${
                      formData.urgency === u
                        ? u === 'critical'
                          ? 'bg-red-50 text-red-700 border-red-200 shadow-sm'
                          : u === 'urgent'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                        : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={8}
                value={formData.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Describe the scope of work, deliverables, and any special requirements..."
                className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 resize-y placeholder:text-slate-300"
                required
                disabled={isSaving}
              />
              <p className="text-xs text-slate-400 mt-1.5 text-right">{formData.description.length} / 2000</p>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Required Skills
              </label>
              <div className="flex flex-wrap items-center gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50/50 mb-4 min-h-[48px]">
                {formData.skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md border border-indigo-100"
                  >
                    {s}
                    {!isSaving && (
                      <button
                        type="button"
                        onClick={() => removeSkill(s)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    )}
                  </span>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                  placeholder={formData.skills.length ? 'Add more...' : 'Type a skill and press Enter...'}
                  className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-300"
                  disabled={isSaving}
                />
              </div>
              {formData.category && CATEGORY_MAP[formData.category] && (
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_MAP[formData.category].skills
                    .filter((s) => !formData.skills.includes(s))
                    .map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addSkill(s)}
                        disabled={isSaving}
                        className="px-3 py-1.5 border border-dashed border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        + {s}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Premium Footer */}
        <div className="px-8 py-5 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-white rounded-lg transition-colors border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving || !formData.title.trim() || !formData.description.trim()}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">save</span>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
