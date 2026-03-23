import React from 'react';

export const BurnRateCard: React.FC = () => {
  const percentage = 82;
  
  return (
    <div className="bg-[var(--primary)] rounded-lg p-6 text-white card-shadow">
      <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-4">Current Burn Rate</h4>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold">$24,500</p>
          <p className="text-xs text-indigo-200 mt-1">Budget utilized this month</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-emerald-300">82%</p>
          <p className="text-xs text-indigo-200">Of threshold</p>
        </div>
      </div>
      <div className="mt-4 w-full bg-indigo-800/50 h-2 rounded-full overflow-hidden">
        <div className="bg-white h-full rounded-full w-[82%]"></div>
      </div>
    </div>
  );
};
