import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../libs/components/Navbar';
import Footer from '../../libs/components/Footer';

/* ────────────────────────────────────────────────
   Full Case Study Data
   ──────────────────────────────────────────────── */
interface CaseStudyDetail {
  slug: string;
  tag: string;
  headline: string;
  subtitle: string;
  client: string;
  provider: string;
  timeline: string;
  totalSaved: string;
  intro: string;
  challengeTitle: string;
  challenge: string;
  advantageTitle: string;
  advantage: string;
  implementationTitle: string;
  implementation: string;
  quote: string;
  quoteAuthor: string;
  resultsTitle: string;
  resultsIntro: string;
  results: string[];
}

const CASE_STUDY_DETAILS: Record<string, CaseStudyDetail> = {
  'acme-studio-cost-savings': {
    slug: 'acme-studio-cost-savings',
    tag: 'Efficiency Case Study',
    headline: '60% Cost Savings',
    subtitle:
      'How Acme Studio utilized TechFlow via SME Connect to overhaul their digital operations in record time.',
    client: 'Acme Studio',
    provider: 'TechFlow Systems',
    timeline: '6 Weeks',
    totalSaved: '$15,200 USD',
    intro:
      'In late 2023, Acme Studio faced a critical bottleneck. Their internal creative workflows were fragmented across four different legacy platforms, leading to redundant manual data entry and a mounting technical debt that threatened their Q4 delivery targets.',
    challengeTitle: 'The Challenge',
    challenge:
      "The primary issue wasn't just the tools—it was the integration. For every dollar spent on design talent, forty cents were lost to administrative overhead. Acme needed a specialized partner who understood lean infrastructure but didn't come with the overhead of a global consultancy.",
    advantageTitle: 'The SME Connect Advantage',
    advantage:
      'Through our intelligent matching algorithm, Acme Studio was connected with TechFlow within 48 hours. TechFlow\'s verified expertise in "Workflow Automation" was the exact puzzle piece Acme was missing.',
    implementationTitle: 'The Implementation',
    implementation:
      "TechFlow proposed a phased migration. Over a six-week sprint, they centralized Acme's data architecture and implemented a custom middleware solution. The transition was managed entirely through the SME Connect dashboard, providing full transparency on project milestones and escrow-backed payments.",
    quote:
      '"Finding a provider who actually understood our niche felt impossible until we tried SME Connect. TechFlow didn\'t just build a tool; they fixed our entire business model."',
    quoteAuthor: '— Sarah Jenkins, COO at Acme Studio',
    resultsTitle: 'Tangible Results',
    resultsIntro:
      'By the end of the engagement, the results were undeniable. Acme Studio reported:',
    results: [
      '60% reduction in operational costs per project.',
      '$15,000+ saved in annual licensing fees by consolidating tools.',
      '100% project delivery rate for the following quarter.',
      'Transition from 3-day turnaround to same-day delivery for core assets.',
    ],
  },
  'pulse-media-faster-delivery': {
    slug: 'pulse-media-faster-delivery',
    tag: 'Speed Case Study',
    headline: '3x Faster Delivery',
    subtitle:
      'How Pulse Media leveraged CloudCore through SME Connect to slash their design-to-production timeline by 75%.',
    client: 'Pulse Media',
    provider: 'CloudCore Design',
    timeline: '8 Weeks',
    totalSaved: '$32,000 USD',
    intro:
      'Pulse Media, a mid-market media agency, was losing clients due to slow turnaround on UI deliverables. Their in-house team was stretched thin, and freelancers lacked the quality control to meet enterprise standards.',
    challengeTitle: 'The Challenge',
    challenge:
      'With a legacy waterfall process, each design cycle took 6 months from brief to deployment. By the time assets shipped, client needs had already evolved. Pulse needed a partner who could operate in agile sprints without compromising visual standards.',
    advantageTitle: 'The SME Connect Advantage',
    advantage:
      'SME Connect matched Pulse Media with CloudCore within 72 hours. CloudCore specializes in rapid UI system design and had a verified track record of delivering component libraries in under 4 weeks.',
    implementationTitle: 'The Implementation',
    implementation:
      'CloudCore embedded a two-person squad directly into Pulse Media\'s Slack and Figma environment. Over 8 weeks, they rebuilt the entire design system, created a shared component library, and implemented automated handoff workflows — all managed through SME Connect\'s milestone-based payment system.',
    quote:
      '"We went from dreading client deadlines to actually enjoying the process. CloudCore felt like an extension of our own team."',
    quoteAuthor: '— Marcus Lee, Creative Director at Pulse Media',
    resultsTitle: 'Tangible Results',
    resultsIntro:
      'By the end of the engagement, Pulse Media achieved:',
    results: [
      '75% reduction in design-to-production time (6 months → 8 weeks).',
      '3x more projects delivered per quarter.',
      '$32,000 saved annually by replacing 3 freelance contracts with one provider.',
      'Client satisfaction scores increased from 7.2 to 9.4 out of 10.',
    ],
  },
  'greenly-zero-overhead': {
    slug: 'greenly-zero-overhead',
    tag: 'Cost Optimization Case Study',
    headline: 'Zero Overhead',
    subtitle:
      'How Greenly replaced a $50K/year full-time hire with a $12K project engagement through SME Connect.',
    client: 'Greenly',
    provider: 'DevCo Systems',
    timeline: '4 Weeks',
    totalSaved: '$38,000 USD',
    intro:
      'Greenly, a sustainability SaaS startup, needed robust backend infrastructure but couldn\'t justify the cost of a senior full-time engineer at $50K+/year. Their MVP was held together by duct-tape code and every new feature risked breaking production.',
    challengeTitle: 'The Challenge',
    challenge:
      'Hiring a full-time backend engineer meant 3-6 months of recruiting, onboarding, and salary overhead — time and money Greenly didn\'t have. They needed production-grade infrastructure work completed in weeks, not months, with zero long-term commitment.',
    advantageTitle: 'The SME Connect Advantage',
    advantage:
      'SME Connect identified DevCo Systems as a 98% match based on Greenly\'s tech stack (Node.js, PostgreSQL, AWS). DevCo had completed 47 similar projects with a 4.9 average rating, and was available to start within 5 business days.',
    implementationTitle: 'The Implementation',
    implementation:
      'DevCo executed a focused 4-week sprint: week 1 for architecture audit, weeks 2-3 for migration and optimization, and week 4 for load testing and documentation. Everything was tracked through SME Connect\'s dashboard with escrow payments released at each milestone.',
    quote:
      '"We got senior-level infrastructure work at a fraction of the cost of a full-time hire. SME Connect made the entire process feel effortless."',
    quoteAuthor: '— Lisa Chen, CTO at Greenly',
    resultsTitle: 'Tangible Results',
    resultsIntro:
      'After DevCo\'s engagement, Greenly reported:',
    results: [
      '$38,000 saved compared to a full-time hire (first year).',
      'API response times improved by 340%.',
      'Zero downtime during the complete infrastructure migration.',
      'Production deployment frequency increased from monthly to daily.',
    ],
  },
};

/* ────────────────────────────────────────────────
   Page Component
   ──────────────────────────────────────────────── */
export default function CaseStudyPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [scrollProgress, setScrollProgress] = useState(0);

  // Reading progress bar
  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    };

    // Initialize once (so progress bar is correct even before scrolling)
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const study = slug ? CASE_STUDY_DETAILS[slug as string] : null;

  if (!slug) return null; // Still loading router

  if (!study) {
    return (
      <div className="app-container">
        <Navbar currentPage="results" />
        <main className="main-content flex items-center justify-center min-h-screen bg-[#f6f6f8] dark:bg-slate-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Case Study Not Found</h1>
            <Link href="/results" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              ← Back to Success Stories
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar currentPage="results" />

      {/* Reading Progress Bar */}
      <div className="fixed top-20 left-0 right-0 z-40 h-[2px] bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full bg-indigo-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <main className="main-content bg-[#f6f6f8] dark:bg-slate-900 flex flex-col items-center pt-12 pb-24 px-6">
        {/* Breadcrumb */}
        <div className="w-full max-w-[720px] mb-12">
          <Link
            href="/results"
            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors group"
          >
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Back to Success Stories
          </Link>
        </div>

        {/* Hero */}
        <div className="w-full max-w-[840px] text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
            {study.tag}
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
            {study.headline}
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-[720px] mx-auto font-medium">
            {study.subtitle}
          </p>
        </div>

        {/* Meta Grid */}
        <div className="w-full max-w-[720px] grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-slate-200 dark:border-slate-700 mb-16">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">Client</p>
            <p className="font-semibold text-slate-900 dark:text-white">{study.client}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">Provider</p>
            <p className="font-semibold text-indigo-600 dark:text-indigo-400 underline underline-offset-4 decoration-indigo-200 dark:decoration-indigo-800">
              {study.provider}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">Timeline</p>
            <p className="font-semibold text-slate-900 dark:text-white">{study.timeline}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">Total Saved</p>
            <p className="font-semibold text-emerald-600">{study.totalSaved}</p>
          </div>
        </div>

        {/* Narrative Content */}
        <article className="w-full max-w-[720px] text-lg leading-[1.8] text-slate-600 dark:text-slate-300">
          <p className="mb-8">{study.intro}</p>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
            {study.challengeTitle}
          </h3>
          <p className="mb-8">{study.challenge}</p>

          {/* Highlight Box */}
          <div className="bg-slate-50 dark:bg-slate-800 border-l-4 border-indigo-600 p-8 my-12 rounded-r-xl">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-3xl">bolt</span>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {study.advantageTitle}
                </h4>
                <p className="text-slate-600 dark:text-slate-400">{study.advantage}</p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
            {study.implementationTitle}
          </h3>
          <p className="mb-8">{study.implementation}</p>

          {/* Quote */}
          <blockquote className="my-12 pl-8 border-l-2 border-slate-300 dark:border-slate-600 italic text-2xl text-slate-500 dark:text-slate-400 font-light">
            {study.quote}
            <footer className="mt-4 not-italic text-sm font-bold text-slate-900 dark:text-white">
              {study.quoteAuthor}
            </footer>
          </blockquote>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
            {study.resultsTitle}
          </h3>
          <p className="mb-6">{study.resultsIntro}</p>
          <ul className="list-disc pl-6 mb-12 space-y-4 text-slate-700 dark:text-slate-300">
            {study.results.map((r, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: r.replace(/^([^:]+:)/, '<strong>$1</strong>') }} />
            ))}
          </ul>
        </article>

        {/* CTA Section */}
        <div className="w-full max-w-[840px] mt-20 pt-16 border-t border-slate-200 dark:border-slate-700">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Ready for similar results?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-[500px] mx-auto">
              Tell us about your project and we&apos;ll match you with the top 3 specialized providers in our
              network.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/marketplace"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 transition-all flex items-center justify-center gap-2"
              >
                Contact Similar Providers
                <span className="material-symbols-outlined">trending_flat</span>
              </Link>
              <Link
                href="/results"
                className="w-full sm:w-auto bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-slate-700 dark:text-slate-300 font-bold py-4 px-10 rounded-xl transition-all"
              >
                Back to Stories
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
