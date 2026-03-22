import React from 'react';

/**
 * Neutral page backdrop — solid / very subtle gray, no purple blobs or radial glows.
 */
const AnimatedBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-white dark:bg-slate-950">
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50/90 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900"
        aria-hidden
      />
      <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148, 163, 184, 0.35) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.35) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedBackground;
