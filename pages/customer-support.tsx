import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import Footer from '../libs/components/Footer';
import { GET_CS_CENTER_CONTENT } from '../apollo/admin/query';
import { NotificationToast } from '../libs/components/NotificationToast';
import Image from 'next/image';

export default function CustomerSupportPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toast, setToast] = useState({ isOpen: false, type: 'info' as 'success' | 'error' | 'warning' | 'info', title: '', message: '' });

  const { data: csData, loading: csLoading } = useQuery(GET_CS_CENTER_CONTENT, {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const csContent = csData?.getCSCenterContent;
  
  // Static contact methods (not editable)
  const contactMethods = [
    { type: 'email', label: 'Email', value: 'support@smeconnect.com', availability: 'Response within 24 hours', icon: 'email' },
    { type: 'phone', label: 'Phone', value: '+1 (555) 123-4567', availability: 'Mon-Fri, 9AM-6PM EST', icon: 'phone' },
    { type: 'chat', label: 'Live Chat', value: 'Available now', availability: 'Available 24/7', icon: 'chat' },
    { type: 'schedule', label: 'Schedule Call', value: 'Book a call', availability: 'Mon-Fri, 9AM-6PM EST', icon: 'schedule' },
  ];

  const allFaqs = csContent?.faqs || [];
  
  // Get unique categories
  const categories: string[] = useMemo(() => {
    const unique = Array.from(
      new Set(
        allFaqs
          .map((faq: any) => (typeof faq?.category === 'string' ? faq.category : ''))
          .filter((v: string) => Boolean(v))
      )
    );
    const cats = ['all', ...unique];
    return cats as string[];
  }, [allFaqs]);

  // Filter FAQs by category
  const filteredFaqs = useMemo(() => {
    if (selectedCategory === 'all') return allFaqs;
    return allFaqs.filter((faq: any) => faq.category === selectedCategory);
  }, [allFaqs, selectedCategory]);

  // Sort FAQs by order
  const sortedFaqs = useMemo(() => {
    return [...filteredFaqs].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  }, [filteredFaqs]);

  const formatCategory = (cat: string) => {
    return cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="app-container relative min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
      <main className="main-content relative z-10">
        {/* Hero Section with FAQ Animation */}
        <section className="relative w-full min-h-[400px] overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Animation */}
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <Image
                    src="/animations/faq.webp"
                    alt="FAQ Support"
                    width={500}
                    height={500}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>
              
              {/* Right: Info */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                  How can we <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">help you?</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 font-medium leading-relaxed">
                  Find answers to common questions, get in touch with our support team, or explore our knowledge base. We're here to help you succeed.
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">support_agent</span>
                    <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">forum</span>
                    <span className="text-sm font-bold text-purple-700 dark:text-purple-300">Quick Answers</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">verified</span>
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Expert Help</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods Section */}
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              Contact Methods
            </h2>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Method
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Availability
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {contactMethods.map((method, index) => (
                    <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">{method.icon}</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {method.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {method.value}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {method.availability}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                Frequently Asked Questions
              </h2>
              
              {/* Category Filter */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Filter by Category:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : formatCategory(cat)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {csLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : sortedFaqs.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-500 mb-4">help_outline</span>
                <p className="text-lg font-medium text-slate-600 dark:text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                  No FAQs found{selectedCategory !== 'all' ? ` in ${formatCategory(selectedCategory)}` : ''}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedFaqs.map((faq: any, index: number) => (
                  <div
                    key={faq._id || index}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">help</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {faq.question}
                          </h3>
                          <span className="flex-shrink-0 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase rounded-full">
                            {formatCategory(faq.category || 'general')}
                          </span>
                        </div>
                        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Toast Notification */}
      <NotificationToast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={5000}
      />
    </div>
  );
}
