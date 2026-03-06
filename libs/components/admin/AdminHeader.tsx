import React from 'react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 flex-shrink-0">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg">
          <span className="material-symbols-outlined text-indigo-600 text-lg">admin_panel_settings</span>
          <span className="text-sm font-semibold text-indigo-600">Admin Mode</span>
        </div>
      </div>
    </header>
  );
};
