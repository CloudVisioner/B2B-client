import React from 'react';
import Link from 'next/link';

interface ProviderStatsCardProps {
  icon: string;
  iconBg?: string;
  iconColor?: string;
  title: string;
  value: string | number;
  linkText?: string;
  linkHref?: string;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}

export const ProviderStatsCard: React.FC<ProviderStatsCardProps> = ({
  icon,
  iconBg = 'bg-slate-100 dark:bg-slate-800',
  iconColor = 'text-slate-600 dark:text-slate-300',
  title,
  value,
  linkText,
  linkHref,
  badge,
  badgeColor,
  highlight = false,
}) => {
  const cardClasses = highlight
    ? 'bg-primary/5 dark:bg-primary/10 border border-primary/20 ring-1 ring-primary/10'
    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800';

  const titleClasses = highlight
    ? 'text-primary/70 dark:text-primary/80'
    : 'text-slate-500 dark:text-slate-400';

  const valueClasses = highlight
    ? 'text-primary dark:text-primary'
    : 'text-slate-900 dark:text-white';

  return (
    <div className={`${cardClasses} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`material-symbols-outlined p-2 ${iconBg} ${iconColor} rounded-lg`}>
          {icon}
        </span>
        {linkText && linkHref ? (
          <Link href={linkHref} className="text-xs font-semibold text-primary hover:underline">
            {linkText}
          </Link>
        ) : badge ? (
          <span className={`flex items-center text-xs font-bold ${badgeColor || 'text-green-600 dark:text-green-400'} ${badgeColor?.includes('bg-') ? '' : 'bg-green-50 dark:bg-green-900/20'} px-2 py-1 rounded`}>
            {badge.includes('trending') && (
              <span className="material-symbols-outlined text-xs mr-1">trending_up</span>
            )}
            {badge}
          </span>
        ) : null}
      </div>
      <h4 className={`${titleClasses} text-sm font-medium`}>{title}</h4>
      <p className={`${valueClasses} text-3xl font-bold mt-1`}>{value}</p>
    </div>
  );
};
