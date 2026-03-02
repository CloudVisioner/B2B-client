import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
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
import { mapBackendProviderDetail } from '../utils/providerMapper';
import { getHeaders } from '../../apollo/utils';
import { isLoggedIn } from '../auth';

interface ProviderProfileProps {
  providerId: string | null;
  onBrowseServices: () => void;
  onSelectProvider?: (id: string) => void;
}

const ProviderProfile: React.FC<ProviderProfileProps> = ({ providerId, onBrowseServices, onSelectProvider }) => {
  // ========== HOOKS & STATE ==========
  const router = useRouter();
  const userLoggedIn = isLoggedIn();
  const [useFallbackQuery, setUseFallbackQuery] = React.useState(false);

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

  // ========== UTILITIES ==========
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

  const dynamicTestimonials: ClientTestimonial[] = [];
  const dynamicPortfolios: PortfolioItem[] = [];

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

  // Fallback case studies (used only when backend returns no data)
  const fallbackCaseStudies = [
    {
      title: 'Nebula Bank Platform',
      metricLabel: 'OUTCOME',
      metricValue: 'Reduced processing time by 62%',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9BbX55NP6Kz0xjcEMeCkfIxpvSp2luvBoQm8765IlpnkWDuM5sdByfv4gz74tZWGQT2RNi2lFzkF2313fOqJIXT1q_GkfBIVLlPGSgfizHlG704OJ_Z4UVKEC9RVz1uNKVI-hJRJqrARbN4xqhqWzokU7ma009GlUSoxN3h-dOjW7aVYDON7Ztku2QU23dj4W-WSlK_8riC58BZb3I52k7MzDa5EJ9DibCUSsj_Vqf6e9Bw7ykySRWS-eS86VPCLBumCUuHgQsvg',
      tags: ['Next.js', 'Redis', 'AWS']
    },
    {
      title: 'EduLearn Global',
      metricLabel: 'OUTCOME',
      metricValue: 'Scaled to 1M+ active learners',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCItMdh2W4tRWDe1Jv7O2vB2pz-0FnvELT5vIa6B_G5k-xrOz6L1rcEom1TU_6oEQpik1snBIG8kudXYOzsESWULEzCk5pGQIUr-YPEYpGHkrdJL-Hljo68R5OFkhuojs-s24OkqMcJrLr7ico6ISld6N9UThTMhRCKeNRtum_7aeRDqn3wSGmB3U5j8kc_BPRt3CEJ49rRHQKC_EQwKObaKNpPhQedJJqu6LAhQuuGZD21JRWpw5wKHLxEl8agbI-TaHl9KJVGsr0',
      tags: ['React Native', 'GraphQL', 'Vercel']
    },
    {
      title: 'ShopFlow Pro',
      metricLabel: 'OUTCOME',
      metricValue: '+45% conversion rate increase',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw1gf1h3AcUrV1-KEMCBmOYaPAGqs_9EsyhM9fMq-rvXccB8hrREWL8BHyr2bqEJUL_mgP-orcXZku8kqZXETlgTEm82DyIChVgzei1Dlsd7dL9tJWx0k3eUGR8Mu_TW1GCaNVDfsOEeT7OWatg04OcQFw-S9HeS1DGDUpV80djHbIhTOMOToyXa8N5WbE-LLtnVHZ0sK2gq15o-DDc06rVSUQ1GjYK6D1UCOb-X_QC4PJ3bSlMuJzCZOKmTEuli0Qj4PQrOd8n5M',
      tags: ['TypeScript', 'Prisma', 'PostgreSQL']
    }
  ];

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
    },
    {
      id: 'fallback-2',
      text: "The high-performance architecture they built for our e-commerce platform handled a 300% traffic spike during Black Friday without a hitch.",
      rating: 5,
      author: "Product Manager",
      role: "Product Manager",
      company: "Global Retailer",
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
                <div className="relative w-40 h-40 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/50 dark:border-slate-800/50 shadow-2xl flex items-center justify-center overflow-hidden backdrop-blur-sm">
                  {provider.avatar ? (
                    <img 
                      alt={`${provider.name} Logo`} 
                      className="w-full h-full object-cover" 
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
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent tracking-tight">
                  {provider.name}
                </h1>
                {provider.badges.includes("VERIFIED") && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-lg shadow-lg">
                    VERIFIED
                  </span>
                )}
              </div>
              
              <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-300 mb-6 font-black leading-[1.8] max-w-2xl pb-2">
                {provider.description}
              </p>

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
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-black text-xl text-slate-900 dark:text-white">{provider.rating?.toFixed(1) || '4.9'}</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">({provider.reviewsCount || 0} reviews)</span>
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

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {userLoggedIn ? (
                  <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 dark:from-primary dark:via-primary dark:to-purple-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-500/30 dark:shadow-primary/30 hover:shadow-2xl hover:shadow-indigo-500/40 dark:hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 whitespace-nowrap">
                    <MessageCircle className="w-5 h-5 flex-shrink-0 text-white" />
                    <span className="text-white">Request Quote</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0 text-white" />
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => router.push('/signup?role=buyer')}
                      className="group px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 dark:from-primary dark:via-primary dark:to-purple-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-500/30 dark:shadow-primary/30 hover:shadow-2xl hover:shadow-indigo-500/40 dark:hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <MessageCircle className="w-5 h-5 flex-shrink-0 text-white" />
                      <span className="text-white">Get Started</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0 text-white" />
                    </button>
                    <button 
                      onClick={() => router.push('/signup?role=buyer')}
                      className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-black text-lg rounded-2xl hover:border-primary dark:hover:border-primary transition-all duration-300 whitespace-nowrap"
                    >
                      Sign Up to Contact
                    </button>
                  </>
                )}
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
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-[1.8] pb-2 font-semibold">
                With a dedicated team of senior developers and architects, we ensure every line of code is optimized for speed, SEO, and maintainability. From initial discovery to post-launch support, we are committed to technical excellence and transparent communication, ensuring our partners stay ahead in the digital landscape.
              </p>
            </div>

            {/* Stats Info - Clean Layout with Icons */}
            <div className="mt-10 pt-10 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-none mb-1 tracking-tight">
                      {provider.projectsCompleted || 18}
                    </p>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-[1.6] pb-0.5">
                      Projects
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-none mb-1 tracking-tight">
                      {provider.rating?.toFixed(1) || '4.9'}
                    </p>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-[1.6] pb-0.5">
                      Rating
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
                      ${provider.startingRate || 50}
                    </p>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-[1.6] pb-0.5">
                      Starting Rate
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
                <div 
                  key={idx} 
                  className="group relative bg-white dark:bg-slate-900 border-2 border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden"
                >
                  {/* Gradient Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-600 to-pink-600"></div>

                  <div className="relative z-10">
                    {/* Service Icon */}
                    <div className="mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    {/* Service Title */}
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                      {formatSubCategory(subCat)}
                    </h3>

                    {/* Specialties Section */}
                    <div className="space-y-3">
                      <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-4">
                        Available Specialties
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cardSpecialties.map((specialty, specIdx) => (
                          <span 
                            key={specIdx}
                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:border-primary/50 dark:group-hover:border-primary/50 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-all duration-300"
                          >
                            {specialty}
                          </span>
                        ))}
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
              <div key={idx} className="group relative bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
                <div className="relative h-56 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <img 
                    alt={study.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    src={study.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent dark:from-slate-900/80"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{study.title}</h3>
                  <div className="bg-primary/20 dark:bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-2xl p-5 mb-6">
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
              <button className="group px-10 py-5 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 dark:from-primary dark:via-primary dark:to-purple-600 text-white font-black rounded-2xl text-xl shadow-2xl shadow-indigo-500/30 dark:shadow-primary/30 hover:shadow-indigo-500/50 dark:hover:shadow-primary/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap">
                <MessageCircle className="w-6 h-6 flex-shrink-0 text-white" />
                <span className="text-white">Post a Request</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform flex-shrink-0 text-white" />
              </button>
            ) : (
              <button 
                onClick={() => router.push('/signup?role=buyer')}
                className="group px-10 py-5 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 dark:from-primary dark:via-primary dark:to-purple-600 text-white font-black rounded-2xl text-xl shadow-2xl shadow-indigo-500/30 dark:shadow-primary/30 hover:shadow-indigo-500/50 dark:hover:shadow-primary/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <MessageCircle className="w-6 h-6 flex-shrink-0 text-white" />
                <span className="text-white">Get Started</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform flex-shrink-0 text-white" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-center gap-4 text-slate-500 dark:text-slate-400">
            <div className="flex -space-x-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600"></div>
              ))}
            </div>
            <p className="text-base font-black">Trusted by <span className="text-primary font-black text-lg">500+</span> businesses worldwide</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProviderProfile;
