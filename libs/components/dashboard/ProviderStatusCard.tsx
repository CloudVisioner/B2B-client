import React from 'react';

interface ProviderStatusCardProps {
  title: string;
  message: string;
  progress: number;
  progressLabel?: string;
}

export const ProviderStatusCard: React.FC<ProviderStatusCardProps> = ({
  title,
  message,
  progress,
  progressLabel,
}) => {
  return (
    <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-xl p-6 relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-slate-300 text-xs mb-4">{message}</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold">{progressLabel || `${progress}%`}</span>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10">
        <span className="material-symbols-outlined text-[100px]">verified</span>
      </div>
    </div>
  );
};
