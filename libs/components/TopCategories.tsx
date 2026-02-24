import React from 'react';
import Image from 'next/image';
import { Code, Briefcase, Megaphone, Palette, ArrowRight } from 'lucide-react';
import { CategoryId } from '../types/index';

interface TopCategoriesProps {
  onBrowse: (id: CategoryId) => void;
}

const categories: { 
  id: CategoryId, 
  icon: any, 
  name: string, 
  description: string, 
  count: string, 
  gradient: string,
  iconBg: string,
  image: string
}[] = [
  { 
    id: 'it-software',
    icon: Code, 
    name: "IT & Software", 
    description: "Cybersecurity, cloud infrastructure, network architecture, and managed help desk.",
    count: "1,200+",
    gradient: "from-indigo-500/20 via-indigo-400/10 to-transparent",
    iconBg: "bg-indigo-500/20 backdrop-blur-sm",
    image: "/images/tech.webp"
  },
  { 
    id: 'business',
    icon: Briefcase, 
    name: "Business Services", 
    description: "Finance, accounting, legal compliance, and corporate strategy advisory.",
    count: "950+",
    gradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
    iconBg: "bg-emerald-500/20 backdrop-blur-sm",
    image: "/images/business.webp"
  },
  { 
    id: 'marketing-sales',
    icon: Megaphone, 
    name: "Marketing & Sales", 
    description: "SEO, Social Media Management, Copywriting, and Lead Generation experts.",
    count: "870+",
    gradient: "from-orange-500/20 via-orange-400/10 to-transparent",
    iconBg: "bg-orange-500/20 backdrop-blur-sm",
    image: "/images/markeingg.webp"
  },
  { 
    id: 'design-creative',
    icon: Palette, 
    name: "Design & Creative", 
    description: "Branding, Logo Design, Video Editing, and premium UI/UX Design services.",
    count: "1,500+",
    gradient: "from-pink-500/20 via-pink-400/10 to-transparent",
    iconBg: "bg-pink-500/20 backdrop-blur-sm",
    image: "/images/design.webp"
  },
];

const TopCategories: React.FC<TopCategoriesProps> = ({ onBrowse }) => {
  return (
    <section className="py-24 bg-transparent transition-colors">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight" style={{ letterSpacing: '-0.01em', fontFamily: 'Inter, sans-serif' }}>
            Top Categories
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
            Discover expertise across multiple domains
          </p>
        </div>

        {/* 2x2 Grid Layout - Full Screen Apple-Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => onBrowse(cat.id)}
              className="group relative rounded-[40px] overflow-hidden cursor-pointer transition-all duration-500 ease-out border border-white/20 dark:border-white/10 hover:border-white/30 dark:hover:border-white/20 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:scale-[1.02] h-[80vh] md:h-[85vh] min-h-[600px]"
            >
              {/* Background Image - 100% Clear at Top, No Overlays */}
              <div className="absolute inset-0 -z-0">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={cat.id === 'it-software'}
                  quality={100}
                />
              </div>

              {/* Pale Overlay ONLY at Bottom Portion (Bottom 40%) for Text Readability */}
              {/* Top 60% stays 100% clear, bottom 40% gets strong pale overlay */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{ 
                  background: 'linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 0.7) 25%, rgba(255, 255, 255, 0.4) 40%, rgba(255, 255, 255, 0.1) 55%, transparent 60%)'
                }}
              />
              <div 
                className="absolute inset-0 pointer-events-none dark:opacity-100 opacity-0"
                style={{ 
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.85) 10%, rgba(0, 0, 0, 0.7) 25%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0.2) 55%, transparent 60%)'
                }}
              />

              {/* Border Only - No Blur, No Glass Effect */}
              <div className="absolute inset-0 rounded-[40px] border border-white/20 pointer-events-none" />

              {/* Content - Text Positioned at Very Bottom */}
              <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12 font-sans">
                <div className="w-full">
                  {/* Icon - Small, positioned with text */}
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/90 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-500 border border-slate-200/50 dark:border-white/30 inline-flex`}>
                    <cat.icon className="w-7 h-7 md:w-8 md:h-8 text-slate-900 dark:text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight" style={{ letterSpacing: '-0.01em', fontFamily: 'Inter, sans-serif', textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)' }}>
                    {cat.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-lg md:text-xl text-slate-800 dark:text-slate-100 leading-relaxed mb-6 font-normal" style={{ fontFamily: 'Inter, sans-serif', textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)' }}>
                    {cat.description}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-300/60 dark:border-white/30">
                    <span className="text-base md:text-lg font-semibold text-slate-800 dark:text-white" style={{ fontFamily: 'Inter, sans-serif', textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)' }}>
                      {cat.count} providers
                    </span>
                    <div className={`w-11 h-11 rounded-full bg-slate-900/20 dark:bg-white/30 backdrop-blur-sm group-hover:bg-slate-900/30 dark:group-hover:bg-white/40 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 border border-slate-400/40 dark:border-white/40 ${
                      cat.id === 'it-software' ? 'group-hover:shadow-indigo-500/50' :
                      cat.id === 'business' ? 'group-hover:shadow-emerald-500/50' :
                      cat.id === 'marketing-sales' ? 'group-hover:shadow-orange-500/50' :
                      'group-hover:shadow-pink-500/50'
                    }`}>
                      <ArrowRight className="w-5 h-5 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow Effect on Hover */}
              <div className={`absolute inset-0 rounded-[40px] bg-gradient-to-br ${
                cat.id === 'it-software' ? 'from-indigo-500/0 via-indigo-500/0 to-indigo-500/20' :
                cat.id === 'business' ? 'from-emerald-500/0 via-emerald-500/0 to-emerald-500/20' :
                cat.id === 'marketing-sales' ? 'from-orange-500/0 via-orange-500/0 to-orange-500/20' :
                'from-pink-500/0 via-pink-500/0 to-pink-500/20'
              } opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
