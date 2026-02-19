import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn } from '../../libs/auth';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';

interface JobPost {
  id: string;
  jobNumber: string;
  title: string;
  budget: string;
  location: string;
  description: string;
  category: string;
  postedAgo: string;
  urgency?: 'normal' | 'urgent' | 'very-urgent';
  applicants?: number;
}

const MOCK_JOBS: JobPost[] = [
  {
    id: '123',
    jobNumber: '#123',
    title: 'ABC Website',
    budget: '$2.5k',
    location: 'Busan',
    description: 'Need React/Next.js developer',
    category: 'Web Development',
    postedAgo: '2 hours ago',
    urgency: 'urgent',
    applicants: 3,
  },
  {
    id: '124',
    jobNumber: '#124',
    title: 'XYZ Mobile App',
    budget: '$4.2k',
    location: 'Seoul',
    description: 'Full-stack developer for e-commerce platform',
    category: 'Mobile Development',
    postedAgo: '5 hours ago',
    applicants: 8,
  },
  {
    id: '125',
    jobNumber: '#125',
    title: 'E-commerce Platform',
    budget: '$8.5k',
    location: 'Busan',
    description: 'Senior developer needed for scalable platform',
    category: 'Full Stack',
    postedAgo: '1 day ago',
    urgency: 'very-urgent',
    applicants: 12,
  },
  {
    id: '126',
    jobNumber: '#126',
    title: 'Cloud Migration',
    budget: '$12k',
    location: 'Seoul',
    description: 'AWS expert for infrastructure migration',
    category: 'DevOps',
    postedAgo: '2 days ago',
    applicants: 5,
  },
  {
    id: '127',
    jobNumber: '#127',
    title: 'UI/UX Redesign',
    budget: '$3.8k',
    location: 'Busan',
    description: 'Designer + Developer for modern interface',
    category: 'Design & Development',
    postedAgo: '3 days ago',
    applicants: 15,
  },
  {
    id: '128',
    jobNumber: '#128',
    title: 'API Integration',
    budget: '$2.1k',
    location: 'Seoul',
    description: 'Backend developer for third-party integrations',
    category: 'Backend',
    postedAgo: '4 days ago',
    applicants: 7,
  },
];

export default function ProviderJobsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

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

  const categories = ['all', 'Web Development', 'Mobile Development', 'Full Stack', 'DevOps', 'Design & Development', 'Backend'];
  const locations = ['all', 'Busan', 'Seoul', 'Incheon', 'Daegu'];

  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'very-urgent':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'urgent':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const getUrgencyLabel = (urgency?: string) => {
    switch (urgency) {
      case 'very-urgent':
        return 'VERY URGENT';
      case 'urgent':
        return 'URGENT';
      default:
        return 'NORMAL';
    }
  };

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
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="capitalize">
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    {locations.map(loc => (
                      <option key={loc} value={loc}>
                        {loc === 'all' ? 'All Locations' : loc}
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
                <select className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                  <option>Newest First</option>
                  <option>Highest Budget</option>
                  <option>Most Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400 text-3xl">work_off</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No jobs found</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">{job.jobNumber}</span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
                            {job.urgency && (
                              <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getUrgencyColor(job.urgency)}`}>
                                {getUrgencyLabel(job.urgency)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                            <span className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-200">
                              <span className="material-symbols-outlined text-base">payments</span>
                              {job.budget}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base">location_on</span>
                              {job.location}
                            </span>
                            {job.applicants !== undefined && (
                              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                                <span className="material-symbols-outlined text-base">people</span>
                                {job.applicants} applicants
                              </span>
                            )}
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base">schedule</span>
                              {job.postedAgo}
                            </span>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 mb-3 border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <span className="material-symbols-outlined text-base">description</span>
                              <span className="italic">"{job.description}"</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                              {job.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">visibility</span>
                          View
                        </button>
                        <button className="px-4 py-2 bg-[var(--primary)] hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">send</span>
                          Propose
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredJobs.length > 0 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Page 1 of 1
                </span>
                <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
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
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-lg">help</span>
                Help & Support
              </button>
            </div>
            <div className="pb-8">
              <p className="text-xs text-slate-400 font-medium">© 2026 SME Marketplace Provider v2.1</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
