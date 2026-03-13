import React from 'react';
import Link from 'next/link';
import Navbar from '../../libs/components/Navbar';
import Footer from '../../libs/components/Footer';

/* ────────────────────────────────────────────────
   Case Study Data
   ──────────────────────────────────────────────── */
export interface CaseStudyCard {
  slug: string;
  headline: string;
  client: string;
  provider: string;
  category: string;
  beforeLabel: string;
  afterLabel: string;
  animation: string;
  summary: string;
}

export const CASE_STUDIES: CaseStudyCard[] = [
  {
    slug: 'global-access-worldwide-services',
    headline: 'Global Access',
    client: 'Worldwide',
    provider: 'SMEConnect Network',
    category: 'Global Marketplace',
    beforeLabel: 'Local only',
    afterLabel: 'Worldwide access',
    animation: '/animations/global access.mov',
    summary: 'Work with talented service providers and access premium services from anywhere in the world. SMEConnect connects businesses globally, breaking down geographic barriers and enabling seamless collaboration across borders.',
  },
  {
    slug: 'pulse-media-faster-delivery',
    headline: '3x Faster Delivery',
    client: 'Pulse Media',
    provider: 'CloudCore',
    category: 'UI Design & Strategy',
    beforeLabel: '6 months',
    afterLabel: '8 weeks total',
    animation: '/animations/3x_faster_delivery.mov',
    summary: 'Pulse Media cut their delivery time from 6 months to 8 weeks by working with a specialized SMEConnect design squad.',
  },
  {
    slug: 'acme-studio-cost-savings',
    headline: '60% Cost Savings',
    client: 'Acme Studio',
    provider: 'TechFlow',
    category: 'Web App Development',
    beforeLabel: '$25K agency',
    afterLabel: '$10K SMEConnect',
    animation: '/animations/cost_savings.mov',
    summary: 'Acme Studio replaced a $25K agency contract with a $10K SMEConnect project while keeping the same launch scope and quality.',
  },
];

/* ────────────────────────────────────────────────
   Page Component
   ──────────────────────────────────────────────── */
export default function ResultsPage() {
  return (
    <div className="app-container">
      <Navbar currentPage="results" />

      <main className="main-content bg-[#f6f6f8] dark:bg-slate-900 min-h-screen">
        <div className="max-w-[800px] mx-auto px-6 py-20">
          {/* ── Section Title ── */}
          <div className="mb-24 text-center">
            <h1 className="text-sm font-bold tracking-[0.2em] text-indigo-600 dark:text-indigo-400 uppercase mb-4">
              About Us
            </h1>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Real Results. Zero Friction.
            </p>
          </div>

          {/* ── Case Study Cards ── */}
          {CASE_STUDIES.map((cs, idx) => (
            <div key={cs.slug} className="mb-[120px] group">
              {/* Animation */}
              <div className="overflow-hidden rounded-xl mb-8 bg-slate-100 dark:bg-slate-800 aspect-[21/9] flex items-center justify-center">
                <video
                  className="w-full h-full object-contain"
                  src={cs.animation}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-6">
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {cs.headline}
                </h2>

                <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cs.summary}
                </p>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {cs.client} → {cs.provider}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {cs.category}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      <span className="line-through text-slate-400 dark:text-slate-500 mr-2">
                        {cs.beforeLabel}
                      </span>
                      <span className="material-symbols-outlined align-middle text-xs text-slate-400">
                        arrow_forward
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-2">
                        {cs.afterLabel}
                      </span>
                    </p>
                  </div>
                </div>

                <Link
                  href={`/results/${cs.slug}`}
                  className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-sm tracking-widest uppercase mt-4 hover:gap-3 transition-all group/link"
                >
                  Read Full Story
                  <span className="material-symbols-outlined ml-2 text-lg">arrow_right_alt</span>
                </Link>
              </div>

              {/* Divider (except last) */}
              {idx < CASE_STUDIES.length - 1 && (
                <div className="h-px bg-slate-200 dark:bg-slate-700 w-full mt-16" />
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
