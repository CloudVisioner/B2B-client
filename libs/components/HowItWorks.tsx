
import React from 'react';
import { FileText, MessageSquare, ShieldCheck, Search, Send, Landmark } from 'lucide-react';

const StepCard = ({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) => (
  <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 flex flex-col items-start hover:shadow-md transition-all">
    <div className={`p-4 rounded-xl ${color} mb-6`}>
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
    <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-transparent transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">How it Works</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">Streamlining B2B collaborations for buyers and providers.</p>
        </div>

        {/* For Buyers */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-grow bg-indigo-100 dark:bg-indigo-800"></div>
            <span className="text-base font-bold tracking-[0.2em] text-indigo-500 dark:text-indigo-400 uppercase">For Buyers</span>
            <div className="h-px flex-grow bg-indigo-100 dark:bg-indigo-800"></div>
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
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-grow bg-indigo-100 dark:bg-indigo-800"></div>
            <span className="text-base font-bold tracking-[0.2em] text-indigo-500 dark:text-indigo-400 uppercase">For Providers</span>
            <div className="h-px flex-grow bg-indigo-100 dark:bg-indigo-800"></div>
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
