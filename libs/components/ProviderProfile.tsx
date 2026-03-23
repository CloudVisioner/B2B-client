import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { 
  CheckCircle, Star, Users, MapPin, 
  Loader2, AlertCircle, Monitor, 
  Verified, Shield, Award, Code, 
  Cloud, Database, Globe, Lock,
  Clock, DollarSign, TrendingUp, Zap,
  ArrowRight, MessageCircle, Calendar,
  Building2, Briefcase, Sparkles
} from 'lucide-react';
import { Provider, BackendTestimonial, BackendPortfolio, ClientTestimonial, PortfolioItem } from '../types/index';
import { GET_PROVIDER_DETAIL, GET_PROVIDER_DETAIL_FALLBACK } from '../../apollo/user/query';
import { RATE_ORGANIZATION } from '../../apollo/user/mutation';
import { mapBackendProviderDetail } from '../utils/providerMapper';
import { getHeaders } from '../../apollo/utils';
import { isLoggedIn } from '../auth';

interface ProviderProfileProps {
  providerId: string | null;
  onBrowseServices: () => void;
  onSelectProvider?: (id: string) => void;
}

/** Matches homepage `HowItWorks` step cards: lift + shadow, no harsh whole-card color flip. */
const coreServiceCardClass =
  'group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-8 shadow-[0_2px_8px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:border-slate-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1),0_8px_24px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900 dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)] dark:hover:border-white/40 dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.45),0_12px_32px_rgba(0,0,0,0.35)]';

const coreServiceCardShine =
  'pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 dark:from-white/[0.08] dark:via-transparent';

/** GraphQL myRating: 1–5 = voted; 0 / null / undefined = no vote (keeps stars in sync after navigation). */
function parseMyRating(raw: unknown): number | null {
  if (raw == null) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return null;
  return Math.min(5, Math.max(1, Math.round(n)));
}

const MY_RATING_STORAGE_PREFIX = 'smeconnect:orgMyRating:';

function readStoredMyRating(orgId: string): number | null {
  if (typeof window === 'undefined' || !orgId) return null;
  try {
    return parseMyRating(window.localStorage.getItem(`${MY_RATING_STORAGE_PREFIX}${orgId}`));
  } catch {
    return null;
  }
}

function writeStoredMyRating(orgId: string, rating: number): void {
  if (typeof window === 'undefined' || !orgId) return;
  try {
    window.localStorage.setItem(`${MY_RATING_STORAGE_PREFIX}${orgId}`, String(rating));
  } catch {
    /* ignore quota / private mode */
  }
}

const ProviderProfile: React.FC<ProviderProfileProps> = ({ providerId, onBrowseServices, onSelectProvider }) => {
  // ========== HOOKS & STATE ==========
  const router = useRouter();
  const userLoggedIn = isLoggedIn();
  const [useFallbackQuery, setUseFallbackQuery] = React.useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isRatingAnimating, setIsRatingAnimating] = useState(false);
  const [ratingJustSubmitted, setRatingJustSubmitted] = useState(false);
  const [showRatingSelector, setShowRatingSelector] = useState(false);

  // ========== APOLLO REQUESTS ==========
  const { data, loading, error, refetch } = useQuery(
    useFallbackQuery ? GET_PROVIDER_DETAIL_FALLBACK : GET_PROVIDER_DETAIL,
    {
    variables: { orgId: providerId || '' },
    skip: !providerId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: {
      headers: userLoggedIn ? getHeaders() : {},
      },
    }
  );

  const [rateOrganization, { loading: isRatingLoading }] = useMutation(RATE_ORGANIZATION, {
    context: {
      headers: userLoggedIn ? getHeaders() : {},
    },
    refetchQueries: [
      {
        query: useFallbackQuery ? GET_PROVIDER_DETAIL_FALLBACK : GET_PROVIDER_DETAIL,
        variables: { orgId: providerId || '' },
      },
    ],
    onCompleted: () => {
      setIsRatingAnimating(false);
      setRatingJustSubmitted(true);
      setTimeout(() => setRatingJustSubmitted(false), 2000);
    },
    onError: (error) => {
      console.error('Error rating organization:', error);
      setIsRatingAnimating(false);
      void refetch();
    },
  });

  // ========== LIFECYCLES ==========
  useEffect(() => {
    if (error && !useFallbackQuery) {
      // Check if error is due to orgAverageRating being null
      const isRatingError = error.graphQLErrors?.some(
        (e: any) => e.message?.includes('orgAverageRating') && e.message?.includes('non-nullable')
      ) || error.message?.includes('orgAverageRating');
      
      if (isRatingError) {
        console.warn('orgAverageRating is null, switching to fallback query');
        setUseFallbackQuery(true);
        return;
      }
      
      console.error('Error fetching provider detail:', {
        error: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        providerId: providerId,
        variables: { orgId: providerId || '' },
      });
    }
  }, [error, providerId, useFallbackQuery]);

  // Close rating selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showRatingSelector && !target.closest('.rating-selector-container')) {
        setShowRatingSelector(false);
      }
    };

    if (showRatingSelector) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showRatingSelector]);

  // Align star UI with server when detail loads or refetches; fall back to local persistence if API omits myRating.
  useEffect(() => {
    const bd = data?.getProviderDetail;
    if (!bd || !providerId) return;
    if (bd._id && bd._id !== providerId) return;
    if (isRatingLoading) return;
    if (isRatingAnimating) return;

    const fromServer = parseMyRating(bd.myRating);
    if (fromServer != null) {
      setSelectedRating(fromServer);
      writeStoredMyRating(providerId, fromServer);
      return;
    }
    const stored = readStoredMyRating(providerId);
    setSelectedRating(stored);
  }, [
    providerId,
    data?.getProviderDetail?._id,
    data?.getProviderDetail?.myRating,
    isRatingLoading,
    isRatingAnimating,
  ]);

  // ========== UTILITIES ==========
  const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:4001/graphql';
    const baseUrl = apiUrl.replace('/graphql', '');
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${baseUrl}/${cleanPath}`;
  };

  // ========== COMPUTED VALUES ==========
  const provider: Provider | null = data?.getProviderDetail 
    ? (() => {
        try {
          return mapBackendProviderDetail(data.getProviderDetail);
        } catch (err) {
          console.error('Error mapping provider detail:', err);
          return null;
        }
      })()
    : null;

  // Get raw backend data for budgetRange
  const backendData = data?.getProviderDetail;
  const budgetRange = backendData?.budgetRange 
    ? (typeof backendData.budgetRange === 'string' ? parseFloat(backendData.budgetRange) : backendData.budgetRange)
    : null;
  const displayPrice = budgetRange || provider?.startingRate || 0;

  const dynamicTestimonials: ClientTestimonial[] = [];
  const dynamicPortfolios: PortfolioItem[] = [];

  // ========== HANDLERS ==========
  const handleRatingClick = async (rating: number) => {
    if (!userLoggedIn) {
      router.push('/signup?role=buyer');
      return;
    }

    if (!providerId) return;

    // Persistent vote: never send 0 or clear. Same star = no-op (count/average unchanged on server).
    if (selectedRating === rating) {
      setShowRatingSelector(false);
      return;
    }

    const priorSelected = selectedRating;
    setIsRatingAnimating(true);
    setSelectedRating(rating);
    setShowRatingSelector(false);

    try {
      await rateOrganization({
        variables: {
          input: {
            orgId: providerId,
            rating,
          },
        },
      });
      writeStoredMyRating(providerId, rating);
    } catch {
      setSelectedRating(priorSelected ?? readStoredMyRating(providerId));
    }
  };

  const handleStarHover = (starIndex: number) => {
    if (!isRatingLoading && !isRatingAnimating) {
      setHoveredRating(starIndex);
    }
  };

  const handleStarLeave = () => {
    setHoveredRating(null);
  };

  const handlePostRequest = () => {
    if (!userLoggedIn) {
      router.push('/login');
      return;
    }
    router.push('/post-job');
  };

  /** User has a locked-in vote (stable UI; review count is owned by the API). */
  const isVoted = selectedRating != null && selectedRating > 0;
  const starHighlight = hoveredRating ?? selectedRating ?? 0;

  // ========== CONDITIONAL RENDERING ==========
  if (loading && !provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
            <Sparkles className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading provider profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  const hasCriticalError = error && !data?.getProviderDetail;
  
  if (hasCriticalError) {
    const errorMessage = error?.graphQLErrors?.[0]?.message || error?.networkError?.message || error?.message || 'Failed to load provider details.';
    const errorDetails = error?.graphQLErrors?.[0]?.extensions || {};
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-red-200/50 dark:border-red-800/50 rounded-3xl p-8 max-w-md shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">Error loading provider</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
            {errorMessage}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-slate-500 dark:text-slate-500 mb-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <p><strong>Provider ID:</strong> {providerId || 'Not provided'}</p>
              {error?.graphQLErrors?.[0] && (
                <p><strong>GraphQL Error:</strong> {JSON.stringify(error.graphQLErrors[0], null, 2)}</p>
              )}
            </div>
          )}
          <button
            onClick={() => {
              setUseFallbackQuery(false);
              refetch();
            }}
            className="w-full px-6 py-3.5 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (error && data?.getProviderDetail) {
    console.warn('GraphQL field errors (non-critical):', error);
  }

  // No provider found
  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Provider not found</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8">The provider you're looking for doesn't exist.</p>
          <button
            onClick={onBrowseServices}
            className="px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  // Format subcategory for display (convert kebab-case to readable format)
  const formatSubCategory = (subCat: string): string => {
    return subCat
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/And/g, '&')
      .replace(/Ai/g, 'AI')
      .replace(/Qa/g, 'QA')
      .replace(/Ux/g, 'UX')
      .replace(/Ui/g, 'UI');
  };

  // Get subcategories for Core Services
  const subCategories = provider.subCategory 
    ? (Array.isArray(provider.subCategory) ? provider.subCategory : [provider.subCategory])
    : [];

  // Get technologies/skills for Technologies section
  const technologies = provider.expertise && provider.expertise.length > 0 
    ? provider.expertise 
    : ['Next.js', 'TypeScript', 'Tailwind CSS', 'AWS Lambda', 'PostgreSQL', 'Redis', 'Vercel', 'Prisma', 'GraphQL', 'Docker'];

  const primaryCategoryId = Array.isArray(provider.categoryId) ? provider.categoryId[0] : provider.categoryId;

  // Fallback case studies (used only when backend returns no data)
  const fallbackCaseStudies = (() => {
    switch (primaryCategoryId) {
      case 'it-software':
        return [
          {
          title: 'AI-Powered Analytics Platform',
          metricLabel: 'AI',
          metricValue: 'Real-time insights across millions of events',
          image: '/portfolios/IT_SOFTWARE/AI.webp',
          tags: ['Machine Learning', 'Data Engineering', 'Python'],
          },
          {
          title: 'Cloud Infrastructure Migration',
          metricLabel: 'CLOUD',
          metricValue: '99.99% uptime on modern cloud stack',
          image: '/portfolios/IT_SOFTWARE/cloud-infrastructure.webp',
          tags: ['AWS', 'Kubernetes', 'Scalability'],
          },
          {
          title: 'Enterprise Cybersecurity Overhaul',
          metricLabel: 'SECURITY',
          metricValue: '96% reduction in critical incidents',
          image: '/portfolios/IT_SOFTWARE/cyber-security.webp',
          tags: ['Zero Trust', 'Monitoring', 'Incident Response'],
          },
        ];
      case 'business':
        return [
          {
            title: 'Global Operations Transformation',
            metricLabel: 'EFFICIENCY',
            metricValue: '30% reduction in operating costs',
            image: '/portfolios/BUSINESS_SERVICES/photo-1661956602116-aa6865609028.webp',
            tags: ['Process Design', 'Automation'],
          },
          {
            title: 'SME Growth Playbook',
            metricLabel: 'GROWTH',
            metricValue: '3.2x revenue in 18 months',
            image: '/portfolios/BUSINESS_SERVICES/949d121c4eecc542ca29d2506c311e5a.webp',
            tags: ['Strategy', 'Go-To-Market'],
          },
          {
            title: 'Outsourced Ops Hub',
            metricLabel: 'SCALABILITY',
            metricValue: '24/7 support across 4 regions',
            image: '/portfolios/BUSINESS_SERVICES/cfc9087b9eb4488c2d540bdcca540564.webp',
            tags: ['BPO', 'CX Operations'],
          },
        ];
      case 'marketing-sales':
        return [
          {
          title: 'Multi-Channel Advertising Campaign',
          metricLabel: 'ADVERTISING',
          metricValue: '5.4x return on ad spend',
          image: '/portfolios/MARKETING_SALES/advertising.webp',
          tags: ['Paid Media', 'Display', 'Social Ads'],
          },
          {
          title: 'SEO Growth Program',
          metricLabel: 'SEO',
          metricValue: 'Top-3 rankings for 60+ keywords',
          image: '/portfolios/MARKETING_SALES/SEO.webp',
          tags: ['SEO', 'Content Marketing', 'Technical SEO'],
          },
          {
          title: 'Go-To-Market Strategy',
          metricLabel: 'STRATEGY',
          metricValue: '3x qualified pipeline in 9 months',
          image: '/portfolios/MARKETING_SALES/strategy.webp',
          tags: ['Positioning', 'Messaging', 'Sales Enablement'],
          },
        ];
      case 'design-creative':
      default:
        return [
          {
            title: 'Global Brand Refresh',
            metricLabel: 'BRAND LIFT',
            metricValue: '+38% top‑of‑mind awareness',
            image: '/portfolios/DESIGN_CREATIVE/photo-1516131206008-dd041a9764fd.webp',
            tags: ['Brand Identity', 'Guidelines'],
          },
          {
            title: 'Product Experience Redesign',
            metricLabel: 'ENGAGEMENT',
            metricValue: '+27% time on product',
            image: '/portfolios/DESIGN_CREATIVE/photo-1652449823136-b279fbe5dfd3.webp',
            tags: ['UX/UI', 'Design Systems'],
          },
          {
            title: 'Campaign Visual System',
            metricLabel: 'CONVERSION',
            metricValue: '+19% campaign CTR',
            image: '/portfolios/DESIGN_CREATIVE/photo-1690228254548-31ef53e40cd1.webp',
            tags: ['Art Direction', 'Motion Graphics'],
          },
        ];
    }
  })();

  // Use dynamic portfolios from backend, fallback to legacy case studies or mock data
  const caseStudies = dynamicPortfolios.length > 0
    ? dynamicPortfolios.map(p => ({
        title: p.title,
        metricLabel: p.metrics?.[0]?.label || 'OUTCOME',
        metricValue: p.metrics?.[0]?.value || 'Completed successfully',
        image: p.coverImage || (p.images?.[0]) || '',
        tags: p.tags || [],
      }))
    : provider.caseStudies && provider.caseStudies.length > 0
      ? provider.caseStudies
      : fallbackCaseStudies;

  const fallbackTestimonials: ClientTestimonial[] = [
    {
      id: 'fallback-1',
      text: "Acme delivered our MVP two weeks ahead of schedule. The code quality is exceptional, and their communication made the entire process seamless.",
      rating: 5,
      author: "CTO",
      role: "CTO",
      company: "Fintech Startup",
      avatar: "/people/CTO.webp",
    },
    {
      id: 'fallback-2',
      text: "The high-performance architecture they built for our e-commerce platform handled a 300% traffic spike during Black Friday without a hitch.",
      rating: 5,
      author: "Product Manager",
      role: "Product Manager",
      company: "Global Retailer",
      avatar: "/people/product_manager.jpg",
    }
  ];

  // Use dynamic testimonials from backend, fallback to mock data
  const testimonials = dynamicTestimonials.length > 0 ? dynamicTestimonials : fallbackTestimonials;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 w-full overflow-x-hidden">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden w-full">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 dark:from-primary/10 dark:via-purple-500/10 dark:to-pink-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(80,72,229,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(139,92,246,0.1),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
            {/* Left: Logo & Badges */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-3xl border-2 border-slate-200/50 bg-slate-100 shadow-2xl ring-1 ring-black/5 dark:border-slate-800/50 dark:bg-slate-800 dark:ring-white/10">
                  {provider.avatar ? (
                    <img 
                      alt={`${provider.name} Logo`} 
                      className="block h-full w-full min-h-0 object-cover object-center"
                      src={getImageUrl(provider.avatar)}
                      onError={(e) => {
                        // Fallback to placeholder if image fails
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/160';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-4xl font-bold">
                      {provider.name
                        ? provider.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)
                        : 'OR'}
                    </div>
                  )}
                </div>
                {provider.badges.includes("VERIFIED") && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-2.5 rounded-2xl shadow-xl border-4 border-white dark:border-slate-900">
                    <Verified className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>

            {/* Center: Main Info */}
            <div className="flex-1 min-w-0">
              <div className="mb-4 flex min-w-0 flex-wrap items-start gap-3">
                <h1 className="min-w-0 max-w-full flex-1 text-5xl font-black leading-[1.12] tracking-tight text-slate-900 dark:text-white md:text-6xl lg:text-7xl break-words pb-0.5">
                  {provider.name}
                </h1>
                {provider.badges.includes("VERIFIED") && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-lg shadow-lg">
                    VERIFIED
                  </span>
                )}
              </div>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold leading-[1.6] pb-0.5">{provider.location || 'Location'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-black text-lg leading-[1.6] pb-0.5">
                    {Array.isArray(provider.subCategory) ? provider.subCategory[0] : provider.subCategory || 'Service'}
                  </span>
                </div>
                {/* Premium Rating Display with Interactive Button */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl px-4 py-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="font-black text-xl text-slate-900 dark:text-white">
                        {backendData?.orgAverageRating?.toFixed(1) || provider.rating?.toFixed(1) || '0.0'}
                      </span>
                  </div>
                    <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">
                      ({backendData?.reviewsCount || provider.reviewsCount || 0} reviews)
                    </span>
                  </div>
                  
                  {/* Premium Rating Button with Star Selector */}
                  {userLoggedIn && (
                    <div className="relative rating-selector-container">
                      <button
                        type="button"
                        aria-label={isVoted ? 'Update your rating' : 'Rate this provider'}
                        onClick={() => setShowRatingSelector(!showRatingSelector)}
                        disabled={isRatingLoading || isRatingAnimating}
                        className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                          isRatingAnimating || ratingJustSubmitted
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                            : showRatingSelector
                            ? 'bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-800/40 dark:to-amber-700/40 border-2 border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-300 shadow-lg scale-105'
                            : 'bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 hover:from-amber-100 hover:to-amber-200 dark:hover:from-amber-800/30 dark:hover:to-amber-700/30 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-lg hover:scale-105'
                        } ${isRatingLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <Star 
                          className={`w-5 h-5 transition-all duration-300 ${
                            isRatingAnimating || ratingJustSubmitted
                              ? 'fill-white text-white animate-pulse scale-125'
                              : showRatingSelector
                              ? 'fill-amber-500 text-amber-500 scale-110 rotate-12'
                              : 'fill-amber-400 text-amber-400 group-hover:scale-110 group-hover:rotate-12'
                          }`}
                        />
                        <span className={isRatingAnimating || ratingJustSubmitted ? 'text-white' : ''}>
                          {ratingJustSubmitted ? 'Rated!' : isRatingLoading ? 'Rating...' : 'Rate Us'}
                        </span>
                        {isRatingAnimating && (
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 animate-pulse"></div>
                        )}
                      </button>

                      {/* Premium Star Rating Selector */}
                      {showRatingSelector && !isRatingLoading && !isRatingAnimating && (
                        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-amber-700 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3 text-center">
                            Select Your Rating
                          </p>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => {
                              const filled = rating <= starHighlight;
                              const hoverPreview =
                                hoveredRating != null && rating <= hoveredRating;
                              return (
                              <button
                                type="button"
                                key={rating}
                                onClick={() => handleRatingClick(rating)}
                                onMouseEnter={() => handleStarHover(rating)}
                                onMouseLeave={handleStarLeave}
                                className="group relative transition-transform duration-200 hover:scale-125 active:scale-95"
                              >
                                <Star
                                  className={`w-8 h-8 transition-colors duration-200 ${
                                    filled
                                      ? `fill-yellow-400 text-yellow-400${hoverPreview ? ' scale-110' : ''}`
                                      : 'fill-slate-200 text-slate-300 dark:fill-slate-700 dark:text-slate-600 hover:fill-yellow-200 hover:text-yellow-300 dark:hover:fill-slate-600 dark:hover:text-slate-500'
                                  }`}
                                />
                                {rating === hoveredRating && (
                                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                                    {rating} {rating === 1 ? 'star' : 'stars'}
                                  </div>
                                )}
                              </button>
                            );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Industry Tags */}
              {provider.industries && provider.industries.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {provider.industries.slice(0, 4).map((industry, idx) => (
                    <span key={idx} className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary dark:text-purple-300 text-sm font-bold border border-primary/20 dark:border-purple-500/20">
                      {industry}
                    </span>
                  ))}
                </div>
              )}

              {/* Pricing & CTA Section */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Dynamic Budget Display */}
                <div className="flex items-baseline gap-1.5 px-6 py-3 bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Starting from</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">${displayPrice}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold">/hr</span>
                </div>

                {/* CTA — post a service request (buyer flow) */}
                <button
                  type="button"
                  onClick={handlePostRequest}
                  className="group flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 px-8 py-4 text-lg font-black text-white shadow-xl shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/40 dark:from-primary dark:via-primary dark:to-purple-600 dark:shadow-primary/30 dark:hover:shadow-primary/40"
                >
                  <span className="text-white">Post a request</span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-white transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-12 bg-gradient-to-b from-primary to-purple-600 rounded-full"></div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">About Us</h2>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 leading-[1.8] mb-6 pb-2 font-bold">
                {provider.bio || provider.description}
              </p>
            </div>

            {/* Stats Info - Clean Layout with Icons */}
            <div className="mt-10 pt-10 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-none mb-1 tracking-tight">
                      {provider.projectsCompleted ?? 0}
                    </p>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-[1.6] pb-0.5">
                      Projects
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500 flex-shrink-0" />
                    {ratingJustSubmitted && (
                      <div className="absolute -inset-2 bg-amber-400/30 rounded-full animate-ping"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-none mb-1 tracking-tight">
                      {backendData?.orgAverageRating?.toFixed(1) || provider.rating?.toFixed(1) || '0.0'}
                    </p>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-[1.6] pb-0.5">
                      Rating ({backendData?.reviewsCount || provider.reviewsCount || 0} reviews)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-none mb-1 tracking-tight">
                      {provider.responseTime || '24h'}
                    </p>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-[1.6] pb-0.5">
                      Response
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-none mb-1 tracking-tight">
                      ${displayPrice}
                    </p>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-[1.6] pb-0.5">
                      Starting Rate /hr
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Team Size Card */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Team Size</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{provider.teamSize || '6-20'} Specialists</p>
                </div>
              </div>
            </div>

            {/* Industries Card */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Industries Served</p>
              <div className="flex flex-wrap gap-2">
                {provider.industries && provider.industries.length > 0 ? (
                  provider.industries.map((industry, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary dark:text-purple-300 rounded-xl text-sm font-bold border border-primary/20 dark:border-purple-500/20">
                      {industry}
                    </span>
                  ))
                ) : (
                  ['FinTech', 'EdTech', 'SaaS', 'HealthCare', 'E-commerce'].map((industry, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary dark:text-purple-300 rounded-xl text-sm font-bold border border-primary/20 dark:border-purple-500/20">
                      {industry}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-3">
              {provider.badges.includes("VERIFIED") && (
                <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4">
                  <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Verified Business</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Legal documentation approved</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4">
                <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Top Performer</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Top 5% of agencies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services - Premium Cards */}
      <section className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-y border-slate-200/50 dark:border-slate-800/50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          {/* Main Title */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              Core Services
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-full mx-auto"></div>
          </div>

          {/* Premium Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(subCategories.length > 0 ? subCategories : [
              'web-app-development',
              'data-ai',
              'software-testing-qa',
              'infrastructure-cloud'
            ]).map((subCat, idx) => {
              // Map subcategories to relevant specialties
              const getSpecialtiesForSubCategory = (category: string): string[] => {
                const categoryLower = category.toLowerCase();
                if (categoryLower.includes('web') || categoryLower.includes('app')) {
                  return ['Next.js', 'React', 'TypeScript', 'Node.js', 'Express', 'MongoDB'];
                } else if (categoryLower.includes('data') || categoryLower.includes('ai')) {
                  return ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn'];
                } else if (categoryLower.includes('testing') || categoryLower.includes('qa')) {
                  return ['Jest', 'Cypress', 'Selenium', 'Playwright', 'Mocha', 'Chai'];
                } else if (categoryLower.includes('infrastructure') || categoryLower.includes('cloud')) {
                  return ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'];
                }
                // Default specialties if no match
                return technologies.slice(0, 6);
              };

              const cardSpecialties = getSpecialtiesForSubCategory(subCat);

              return (
                <div key={idx} className={coreServiceCardClass}>
                  <div className={coreServiceCardShine} aria-hidden />

                  <div className="relative z-10 flex flex-col">
                    <div className="mb-6 inline-flex rounded-xl bg-indigo-50 p-4 dark:bg-indigo-900/30">
                      <CheckCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" aria-hidden />
                    </div>

                    <h3 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white md:text-[1.65rem]">
                      {formatSubCategory(subCat)}
                    </h3>

                    <div className="mb-6 h-px w-12 bg-slate-200 dark:bg-slate-600" />

                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        Available Specialties
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cardSpecialties.map((specialty, specIdx) => (
                          <span
                            key={specIdx}
                            className="rounded-lg border border-slate-200/90 bg-slate-50/90 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-[border-color,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-indigo-200 hover:bg-white hover:shadow-sm dark:border-slate-700/90 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-slate-800"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 border-t border-slate-200/80 pt-6 dark:border-slate-700/80">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="material-symbols-outlined text-base text-indigo-600/80 dark:text-indigo-400/90">
                          verified
                        </span>
                        <span>Professional Service</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-1.5 h-10 bg-gradient-to-b from-primary to-purple-600 rounded-full"></div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Client Testimonials</h2>
          {false && (
            <Loader2 className="w-5 h-5 text-primary animate-spin ml-2" />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={testimonial.id || idx} className="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xl text-slate-700 dark:text-slate-300 leading-[1.8] mb-6 italic pb-2 font-bold">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                {testimonial.avatar ? (
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-lg text-slate-900 dark:text-white">{testimonial.author}</p>
                    {testimonial.isVerified && (
                      <Verified className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                    {testimonial.role && testimonial.role !== testimonial.author ? `${testimonial.role}, ` : ''}{testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies / Portfolio */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-24 overflow-hidden w-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(80,72,229,0.1),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,_rgba(80,72,229,0.1),transparent)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 leading-[1.2] pb-1 tracking-tight">Impact-First Case Studies</h2>
                {false && (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                )}
              </div>
              <p className="text-2xl text-slate-600 dark:text-slate-300 leading-[1.6] pb-1 font-bold">Featured work that drives real business value</p>
            </div>
            <button className="mt-6 md:mt-0 px-6 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-white/20 transition-all duration-300">
              View All Portfolio
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study, idx) => (
              <div key={idx} className="group relative bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
                <div className="relative h-56 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <img 
                    alt={study.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    src={study.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent dark:from-slate-900/80"></div>
                </div>
                <div className="p-7">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{study.title}</h3>
                  <div className="bg-primary/20 dark:bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-xl p-4 mb-6">
                    <p className="text-xs font-bold text-primary/70 dark:text-primary/70 uppercase tracking-widest mb-2">{study.metricLabel}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{study.metricValue}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(study as any).tags && (study as any).tags.map((tag: string, tagIdx: number) => (
                      <span key={tagIdx} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-300 dark:border-slate-600/50 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="relative max-w-4xl mx-auto text-center w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary">Ready to Get Started?</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent mb-6 leading-[1.2] pb-1 tracking-tight">
            Let's Build Something Amazing Together
          </h2>
          <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-[1.7] pb-1 font-bold">
            Join hundreds of successful businesses who trust {provider.name} with their digital transformation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {userLoggedIn ? (
              <button 
                onClick={() => router.push('/dashboard')}
                className="group px-10 py-5 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 dark:from-primary dark:via-primary dark:to-purple-600 text-white font-black rounded-2xl text-xl shadow-2xl shadow-indigo-500/30 dark:shadow-primary/30 hover:shadow-indigo-500/50 dark:hover:shadow-primary/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <MessageCircle className="w-6 h-6 flex-shrink-0 text-white" />
                <span className="text-white">Post a Request</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform flex-shrink-0 text-white" />
              </button>
            ) : (
              <button 
                onClick={() => router.push('/login?role=buyer')}
                className="group px-10 py-5 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 dark:from-primary dark:via-primary dark:to-purple-600 text-white font-black rounded-2xl text-xl shadow-2xl shadow-indigo-500/30 dark:shadow-primary/30 hover:shadow-indigo-500/50 dark:hover:shadow-primary/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <MessageCircle className="w-6 h-6 flex-shrink-0 text-white" />
                <span className="text-white">Post a Request</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform flex-shrink-0 text-white" />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProviderProfile;
