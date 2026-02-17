import React from 'react';
import { MOCK_ACTIVITY } from '../../constants/dashboard';

export const ActivityFeed: React.FC = () => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'QUOTE': return 'request_quote';
      case 'MILESTONE': return 'verified';
      case 'MESSAGE': return 'chat_bubble';
      default: return 'circle';
    }
  };

  const getIconColor = (type: string) => {
    switch(type) {
      case 'QUOTE': return 'text-[var(--primary)]';
      case 'MILESTONE': return 'text-emerald-600';
      case 'MESSAGE': return 'text-amber-600';
      default: return 'text-slate-400';
    }
  };

  const getIconBg = (type: string) => {
    switch(type) {
      case 'QUOTE': return 'bg-indigo-50 border-indigo-100';
      case 'MILESTONE': return 'bg-emerald-50 border-emerald-100';
      case 'MESSAGE': return 'bg-amber-50 border-amber-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[var(--border)] card-shadow flex flex-col h-full">
      <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Activity Feed</h3>
        <span className="material-symbols-outlined text-slate-400 text-xl">history</span>
      </div>
      <div className="p-6 space-y-8">
        {MOCK_ACTIVITY.map((item, index) => (
          <div key={item.id} className={`flex gap-4 ${index < MOCK_ACTIVITY.length - 1 ? 'relative' : ''}`}>
            {index < MOCK_ACTIVITY.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-[-20px] w-px bg-slate-100"></div>
            )}
            <div className={`w-8 h-8 rounded-full ${getIconBg(item.type)} flex items-center justify-center shrink-0 z-10`}>
              <span className={`material-symbols-outlined ${getIconColor(item.type)} text-sm`}>
                {getIcon(item.type)}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-900 font-semibold mb-0.5">{item.title}</p>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                {item.description.split(' ').map((word, i) => {
                  const cleanWord = word.replace(/[.,]/g, '');
                  if (cleanWord === 'Cloud' || cleanWord === 'Migration' || cleanWord === 'Network' || cleanWord === 'Mapping' || cleanWord === 'Sarah' || cleanWord === 'Jenkins') {
                    return <span key={i} className="text-slate-800 font-medium">{word} </span>;
                  }
                  return <span key={i}>{word} </span>;
                })}
              </p>
              <p className="text-xs text-slate-400 mt-1.5 font-medium">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto p-4 border-t border-slate-50 text-center">
        <button className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-[var(--primary)] transition-colors">
          See all history
        </button>
      </div>
    </div>
  );
};
