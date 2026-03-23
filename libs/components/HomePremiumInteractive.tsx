import dynamic from 'next/dynamic';
import React from 'react';

const Galaxy = dynamic(() => import('./Galaxy'), { ssr: false, loading: () => null });

/**
 * Partner network — full-bleed WebGL Galaxy (no purple CSS blobs).
 * Neutral veil for text contrast only.
 */
const HomePremiumInteractive: React.FC = () => {
  return (
    <section className="relative isolate min-h-[640px] w-full overflow-hidden py-24 md:min-h-[700px] md:py-32">
      {/* Base tint so transparent starfield reads on white page */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-slate-50 dark:bg-slate-950" aria-hidden />

      <div className="absolute inset-0 z-[1] min-h-[600px] w-full">
        <Galaxy
          className="!absolute inset-0 h-full min-h-[600px] w-full"
          mouseRepulsion
          mouseInteraction
          density={1}
          glowIntensity={0.3}
          saturation={0}
          hueShift={140}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.5}
          speed={1}
          transparent
        />
      </div>

      {/* Neutral readability layer — no purple / indigo gradients */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-white/75 via-white/55 to-white/80 dark:from-slate-950/45 dark:via-slate-950/35 dark:to-slate-950/50"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
            Network
          </p>
          <h2 className="mb-5 font-sans text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-[2.5rem]">
            Your partner network, in perspective
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-300 md:text-lg">
            SME Connect brings providers, buyers, and projects into one cohesive space
          </p>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <div className="rounded-[2rem] border border-slate-200/90 bg-white/95 p-8 shadow-[0_4px_24px_rgba(15,23,42,0.06),0_2px_8px_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)] md:rounded-[2.5rem] md:p-12 lg:p-14">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {['Verified partners', 'Real-time match', 'Secure workflows'].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 md:px-5 md:py-2.5 md:text-[15px]"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-100 pt-10 dark:border-slate-800 md:mt-12 md:gap-4 md:pt-12">
              {[
                { v: '120+', l: 'Categories' },
                { v: '48h', l: 'Avg. match' },
                { v: '99%', l: 'Satisfaction' },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="font-sans text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
                    {s.v}
                  </div>
                  <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 md:text-xs">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:mt-12 md:text-base">
              Verified workflows and real-time alignment — built for teams who need clarity at scale.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePremiumInteractive;
