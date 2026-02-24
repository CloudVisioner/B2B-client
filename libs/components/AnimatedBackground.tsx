import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base gradient wash (helps the mesh read even on light sections) */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/70 via-white/30 to-pink-50/60 dark:from-slate-950/40 dark:via-slate-950/10 dark:to-indigo-950/30" />

      {/* Mesh Gradient Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-[-10%] -left-1/4 w-[1000px] h-[1000px] rounded-full blur-3xl opacity-45"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.65) 0%, rgba(139, 92, 246, 0.35) 50%, transparent 72%)',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-[20%] -right-1/4 w-[900px] h-[900px] rounded-full blur-3xl opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(168, 85, 247, 0.35) 50%, transparent 72%)',
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-[-10%] left-[20%] w-[950px] h-[950px] rounded-full blur-3xl opacity-35"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.55) 0%, rgba(99, 102, 241, 0.3) 50%, transparent 72%)',
          }}
          animate={{
            x: [0, 120, 0],
            y: [0, -60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedBackground;
