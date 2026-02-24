import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MovingLogos from './MovingLogos';

interface HeroProps {
  onGetStarted: () => void;
  onWantToHire?: () => void;
  onWantToWork?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted, onWantToHire, onWantToWork }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use regular divs during SSR, motion components after mount
  const MotionDiv = mounted ? motion.div : 'div';
  const MotionH1 = mounted ? motion.h1 : 'h1';
  const MotionP = mounted ? motion.p : 'p';
  const MotionButton = mounted ? motion.button : 'button';

  return (
    <section className="relative pt-32 pb-24 px-4 overflow-hidden bg-transparent">
      {/* Animated Background Overlay for Hero */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <MotionDiv
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, rgba(139, 92, 246, 0.3) 50%, transparent 70%)',
          }}
          {...(mounted ? {
            animate: {
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2],
            },
            transition: {
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          } : {})}
        />
        <MotionDiv
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 70%)',
          }}
          {...(mounted ? {
            animate: {
              scale: [1, 1.4, 1],
              opacity: [0.15, 0.25, 0.15],
            },
            transition: {
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          } : {})}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <MotionDiv
          {...(mounted ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6 }
          } : {})}
          className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">The Marketplace for Growth</span>
        </MotionDiv>
        
        <MotionH1
          {...(mounted ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 0.1 }
          } : {})}
          className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6"
        >
          The B2B Gateway for <br />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            SME Services
          </span>
        </MotionH1>
        
        <MotionP
          {...(mounted ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 0.2 }
          } : {})}
          className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Connect with verified service providers or find your next big project in our secure SME marketplace. Scalable solutions for businesses of all sizes.
        </MotionP>

        <MotionDiv
          {...(mounted ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 0.3 }
          } : {})}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <MotionButton
            onClick={onWantToHire || onGetStarted}
            className="relative w-full sm:w-auto px-8 py-4 text-base text-white font-bold bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-xl shadow-indigo-500/30 overflow-hidden group"
            {...(mounted ? {
              whileHover: { scale: 1.05, y: -2 },
              whileTap: { scale: 0.95 }
            } : {})}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative z-10">I want to Hire</span>
          </MotionButton>
          <MotionButton
            onClick={onWantToWork || onGetStarted}
            className="relative w-full sm:w-auto px-8 py-4 text-base text-indigo-600 dark:text-indigo-400 font-bold border-2 border-indigo-200 dark:border-indigo-800 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all overflow-hidden group"
            {...(mounted ? {
              whileHover: { scale: 1.05, y: -2 },
              whileTap: { scale: 0.95 }
            } : {})}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">I want to Work</span>
          </MotionButton>
        </MotionDiv>

        {/* Moving Logos Section */}
        <MotionDiv
          {...(mounted ? {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.6, delay: 0.4 }
          } : {})}
          className="mt-16"
        >
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-widest mb-8">
            Trusted by leading companies
          </p>
          <MovingLogos />
        </MotionDiv>
      </div>
    </section>
  );
};

export default Hero;
