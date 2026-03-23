import React from 'react';
import { MOCK_PROGRESS } from '../../constants/dashboard';

export const ProgressSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-[var(--border)] card-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 text-base uppercase tracking-wide">Ongoing Work Progress</h3>
        <button className="text-sm font-semibold text-[var(--primary)] hover:underline">View Track All</button>
      </div>
      <div className="space-y-6">
        {MOCK_PROGRESS.map((item) => (
          <div key={item.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[15px] font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">Provider: {item.provider}</p>
              </div>
              <span className="text-sm font-bold text-slate-700">{item.percentage}% Complete</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  item.percentage > 80 ? 'bg-emerald-500' : 'bg-[var(--primary)]'
                }`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
