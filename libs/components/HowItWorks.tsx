
import React from 'react';
import { FileText, MessageSquare, ShieldCheck, Search, Send, Landmark } from 'lucide-react';

const stepCardHover =
  'group relative flex flex-col items-start overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-8 shadow-[0_2px_8px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:border-slate-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1),0_8px_24px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900 dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)] dark:hover:border-white/40 dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.45),0_12px_32px_rgba(0,0,0,0.35)]';

const StepCard = ({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}) => (
  <div className={stepCardHover}>
    <div
      className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 dark:from-white/[0.1] dark:via-transparent"
      aria-hidden
    />
    <div className="relative z-10 flex w-full flex-col items-start">
      <div className={`mb-6 rounded-xl p-4 ${color}`}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-lg leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="bg-white py-24 transition-colors dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">How it Works</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">Streamlining B2B collaborations for buyers and providers.</p>
        </div>

        {/* For Buyers */}
        <div className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-grow bg-slate-200 dark:bg-slate-700" />
            <span className="text-base font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">For Buyers</span>
            <div className="h-px flex-grow bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard 
              icon={FileText} 
              title="Post a Request" 
              description="Describe your project requirements, timeline, and budget in minutes."
              color="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
            />
            <StepCard 
              icon={MessageSquare} 
              title="Compare Quotes" 
              description="Receive competitive bids from verified providers and review their portfolios."
              color="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
            />
            <StepCard 
              icon={ShieldCheck} 
              title="Secure Hire" 
              description="Finalize contracts through our secure platform with milestone protection."
              color="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
            />
          </div>
        </div>

        {/* For Providers */}
        <div>
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-grow bg-slate-200 dark:bg-slate-700" />
            <span className="text-base font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">For Providers</span>
            <div className="h-px flex-grow bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard 
              icon={Search} 
              title="Search Projects" 
              description="Filter through high-quality leads that match your team's expertise."
              color="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
            />
            <StepCard 
              icon={Send} 
              title="Submit Quote" 
              description="Present your value proposition and win projects with tailored proposals."
              color="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
            />
            <StepCard 
              icon={Landmark} 
              title="Start Earning" 
              description="Get paid on time with our automated billing and payment escort service."
              color="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
