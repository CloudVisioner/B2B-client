import React from 'react';
import Link from 'next/link';
import { Linkedin, Twitter } from 'lucide-react';

/** Matches `CATEGORIES` in Marketplace — keep ids in sync for `/marketplace?category=` deep links. */
const MARKETPLACE_FOOTER_CATEGORIES = [
  { id: 'it-software', name: 'IT & Software' },
  { id: 'business', name: 'Business Services' },
  { id: 'marketing-sales', name: 'Marketing & Sales' },
  { id: 'design-creative', name: 'Design & Creative' },
] as const;

const noopLinkClass =
  'group w-full text-left text-base font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white';

const Footer: React.FC = () => {
  const handleInertClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <footer
      className="border-t border-black/5 bg-transparent pb-10 pt-20 transition-colors dark:border-white/10"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="mb-5 flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight">
                <span className="text-indigo-600 dark:text-indigo-400">SME</span>
                <span className="text-slate-900 dark:text-white">Connect</span>
              </span>
            </div>
            <p className="mb-8 max-w-sm text-base font-medium leading-relaxed text-slate-500 dark:text-slate-400">
              The premium gateway for enterprises to access world-class expertise and specialized services—curated,
              verified, and ready when you are.
            </p>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Follow
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="LinkedIn (coming soon)"
                onClick={handleInertClick}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-all hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400"
              >
                <Linkedin className="h-5 w-5" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                aria-label="X (Twitter) (coming soon)"
                onClick={handleInertClick}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-all hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400"
              >
                <Twitter className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Marketplace — same categories as app marketplace */}
          <div className="lg:col-span-2">
            <h4 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
              Marketplace
            </h4>
            <ul className="space-y-3.5">
              {MARKETPLACE_FOOTER_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={{ pathname: '/marketplace', query: { category: cat.id } }}
                    className="text-base font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-3">
            <h4 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
              Company
            </h4>
            <ul className="mb-8 space-y-3.5">
              <li>
                <Link
                  href="/results"
                  className="text-base font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-base font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/customer-support"
                  className="text-base font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Support
                </Link>
              </li>
            </ul>
            <h4 className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <button type="button" onClick={handleInertClick} className={noopLinkClass}>
                  Trust &amp; compliance
                </button>
              </li>
              <li>
                <button type="button" onClick={handleInertClick} className={noopLinkClass}>
                  Partner program
                </button>
              </li>
              <li>
                <button type="button" onClick={handleInertClick} className={noopLinkClass}>
                  Platform status
                </button>
              </li>
            </ul>
          </div>

          {/* Legal — static, premium placeholders */}
          <div className="lg:col-span-3">
            <h4 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <button type="button" onClick={handleInertClick} className={noopLinkClass}>
                  Privacy policy
                </button>
              </li>
              <li>
                <button type="button" onClick={handleInertClick} className={noopLinkClass}>
                  Terms of service
                </button>
              </li>
              <li>
                <button type="button" onClick={handleInertClick} className={noopLinkClass}>
                  Cookie preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-8 dark:border-slate-800 md:flex-row">
          <p className="text-center text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 md:text-left">
            © {new Date().getFullYear()} SME Connect. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:justify-end">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              Systems operational
            </div>
            <span className="hidden h-4 w-px bg-slate-200 dark:bg-slate-700 sm:inline" aria-hidden />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Enterprise-grade security
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
