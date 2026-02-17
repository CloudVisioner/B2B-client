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
  image: string;
}

export const CASE_STUDIES: CaseStudyCard[] = [
  {
    slug: 'acme-studio-cost-savings',
    headline: '60% Cost Savings',
    client: 'Acme Studio',
    provider: 'TechFlow',
    category: 'Web App Development',
    beforeLabel: '$25K agency',
    afterLabel: '$10K SMEConnect',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCzdTbN_lkqchN410RhsvAhUWAhMKuW36xHtzjdZQI4xNtSeqfqUWXayWFUuOwwWxsGyMoxeWLvyJOIWxHM0BKF3QnrVZW2eyjtqy9KHXeeJDaJpyO5mAWXL8n5Ff1UsB1IWNgxyclUXGSt1WK4eRCHa6KSpcQnYl2om5jutfJe8cyNpzLgRuw98K2P5H6GA5Bq3jGYccMx4kz2LWyqTlmXTV23QPJAjOW1CiF3SnDUoLaf54r3kkGA-RGD7nHmOpz05cC6U6QkvjQ',
  },
  {
    slug: 'pulse-media-faster-delivery',
    headline: '3x Faster Delivery',
    client: 'Pulse Media',
    provider: 'CloudCore',
    category: 'UI Design & Strategy',
    beforeLabel: '6 months',
    afterLabel: '8 weeks total',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmjYaHocmQxlaBOtmeaeTV2CSii9MwnsqBYszIhAQa-k7WHLxKjmwXCwcB6SWBmRZ_Cv7hMBYejQYiGcmXWC5vVtCU5BXu8HWizO4HeWhGgDV9YGikXJTyjxuvCVXkYt93tkvv0hwgjA__EzyLtAY90chEPM3QjrFRsIjalB7HXuwObhNOqFZ8Ek63FxI765WY2MR8RR1T9tlKO-PTxsJYJSqWAGacRgY0nDa1mBX5-3u_BZQiKgGSozPM4ORw9DC_pQvFCeFvL7I',
  },
  {
    slug: 'greenly-zero-overhead',
    headline: 'Zero Overhead',
    client: 'Greenly',
    provider: 'DevCo',
    category: 'Backend Infrastructure',
    beforeLabel: '$50k/yr FTE',
    afterLabel: '$12k Project',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCv9yZHNoWI6dsv4v_jzdLtHnS2e8DELPDs5LSKGm46qk1yw-n8IJtdadfRRvhEjxMWIn3--u9hxoIurjIzTMAZKkYRFPbYM3fA0n-Or6d_UcMhyCINuhxsRRX-IOXvVSpO-PDw6r7b6vUyor5Mxyz2OmgnyHHQFhtSgiXLE2TzzSRDJ10dNfBy5S2S6ySarS7lkxb5eMtTWYbbXh5fM82Qz69K79VFa9ZXv6PESR431ezC-45a3R5pkW5Ry0T9QUM9thqHrL4Qtb0',
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
              Case Studies
            </h1>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Real Results. Zero Friction.
            </p>
          </div>

          {/* ── Case Study Cards ── */}
          {CASE_STUDIES.map((cs, idx) => (
            <div key={cs.slug} className="mb-[120px] group">
              {/* Image */}
              <div className="overflow-hidden rounded-xl mb-8 bg-slate-100 dark:bg-slate-800 aspect-[21/9]">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${cs.image}')` }}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-6">
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {cs.headline}
                </h2>

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
