
import React from 'react';

interface HeroProps {
  onGetStarted: () => void;
  onWantToHire?: () => void;
  onWantToWork?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted, onWantToHire, onWantToWork }) => {
  return (
    <section className="pt-24 pb-16 px-4 bg-white dark:bg-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">The Marketplace for Growth</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6">
          The B2B Gateway for <br />
          <span className="gradient-text">SME Services</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Connect with verified service providers or find your next big project in our secure SME marketplace. Scalable solutions for businesses of all sizes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button 
            onClick={onWantToHire || onGetStarted}
            className="w-full sm:w-auto px-8 py-4 text-base text-white font-bold bg-primary-gradient rounded-full shadow-xl shadow-indigo-100 hover:-translate-y-0.5 transition-all"
          >
            I want to Hire
          </button>
          <button 
            onClick={onWantToWork || onGetStarted}
            className="w-full sm:w-auto px-8 py-4 text-base text-indigo-600 dark:text-indigo-400 font-bold border-2 border-indigo-100 dark:border-indigo-800 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
          >
            I want to Work
          </button>
        </div>

        <div className="mt-12">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-widest mb-6">Trusted by leading companies</p>
          <div className="flex justify-center items-center gap-6 md:gap-10 lg:gap-12 flex-wrap">
            {/* Microsoft - Original Colors */}
            <div className="flex items-center justify-center h-12 w-28">
              <svg className="h-10 w-auto" viewBox="0 0 1083 1083" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="540" height="540" fill="#F25022"/>
                <rect x="543" y="0" width="540" height="540" fill="#7FBA00"/>
                <rect x="0" y="543" width="540" height="540" fill="#00A4EF"/>
                <rect x="543" y="543" width="540" height="540" fill="#FFB900"/>
              </svg>
            </div>
            
            {/* Google - Original Colors */}
            <div className="flex items-center justify-center h-12 w-28">
              <svg className="h-10 w-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            
            {/* Apple - Original Colors */}
            <div className="flex items-center justify-center h-12 w-28">
              <svg className="h-10 w-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.57 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.16c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" className="fill-black dark:fill-white"/>
              </svg>
            </div>
            
            {/* Amazon AWS - Original Colors */}
            <div className="flex items-center justify-center h-12 w-28">
              <svg className="h-10 w-auto" viewBox="0 0 120 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60 12L30 30v12l30 18 30-18V30L60 12z" fill="#FF9900"/>
                <path d="M30 30l30 18 30-18v12l-30 18-30-18V30z" className="fill-[#232F3E] dark:fill-slate-300"/>
                <path d="M60 12L30 30l30 18 30-18L60 12z" fill="#FF9900" opacity="0.8"/>
              </svg>
            </div>
            
            {/* Meta (Facebook) - Original Colors */}
            <div className="flex items-center justify-center h-12 w-28">
              <svg className="h-10 w-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
