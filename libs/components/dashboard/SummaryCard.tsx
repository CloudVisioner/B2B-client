import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  badge?: string;
  color?: 'blue' | 'indigo';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, badge, color }) => {
  const isIndigo = color === 'indigo';
  
  return (
    <div className={`${isIndigo ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white border-[var(--border)]'} p-6 rounded-lg border card-shadow`}>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <div className="flex items-baseline gap-3">
        <span className={`text-4xl font-bold ${isIndigo ? 'text-indigo-700' : 'text-slate-900'}`}>{value}</span>
        {badge && (
          <span className="text-sm font-semibold text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded">+3 new</span>
        )}
      </div>
    </div>
  );
};
