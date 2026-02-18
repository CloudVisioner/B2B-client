import React from 'react';
import { Code, Briefcase, Megaphone, Palette, ChevronRight } from 'lucide-react';
import { CategoryId } from '../types/index';

interface TopCategoriesProps {
  onBrowse: (id: CategoryId) => void;
}

const categories: { id: CategoryId, icon: any, name: string, description: string, count: string, color: string }[] = [
  { 
    id: 'it-software',
    icon: Code, 
    name: "IT & Software", 
    description: "Cybersecurity, cloud infrastructure, network architecture, and managed help desk.",
    count: "1,200+",
    color: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
  },
  { 
    id: 'business',
    icon: Briefcase, 
    name: "Business Services", 
    description: "Finance, accounting, legal compliance, and corporate strategy advisory.",
    count: "950+",
    color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
  },
  { 
    id: 'marketing-sales',
    icon: Megaphone, 
    name: "Marketing & Sales", 
    description: "SEO, Social Media Management, Copywriting, and Lead Generation experts.",
    count: "870+",
    color: "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
  },
  { 
    id: 'design-creative',
    icon: Palette, 
    name: "Design & Creative", 
    description: "Branding, Logo Design, Video Editing, and premium UI/UX Design services.",
    count: "1,500+",
    color: "bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
  },
];

const TopCategories: React.FC<TopCategoriesProps> = ({ onBrowse }) => {
  return (
    <section className="py-24 bg-white dark:bg-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Top Categories</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">Discover expertise across multiple domains</p>
          </div>
          <button 
            onClick={() => onBrowse('it-software')}
            className="hidden md:flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold text-base hover:underline"
          >
            View all categories <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => onBrowse(cat.id)}
              className="group p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-800 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-900/20 transition-all cursor-pointer bg-white dark:bg-slate-800 flex flex-col h-full"
            >
              <div className={`w-14 h-14 rounded-xl ${cat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-7 h-7" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{cat.name}</h4>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-grow">
                {cat.description}
              </p>
              <div className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                {cat.count} providers
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;