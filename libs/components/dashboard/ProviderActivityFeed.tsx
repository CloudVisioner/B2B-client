import React, { useState } from 'react';

interface ActivityItem {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  opacity?: number;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    icon: 'visibility',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    title: 'New Quote Viewed',
    description: "Your proposal for 'Green Energy Hub' was viewed by Sarah Miller.",
    time: '2 hours ago',
  },
  {
    id: '2',
    icon: 'check_circle',
    iconBg: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
    title: 'Payment Received',
    description: 'Invoice #INV-2024-001 for $4,200 has been paid successfully.',
    time: '5 hours ago',
  },
  {
    id: '3',
    icon: 'description',
    iconBg: 'bg-indigo-50 dark:bg-primary/10',
    iconColor: 'text-primary dark:text-primary',
    title: 'Proposal Viewed by Client',
    description: "SME Connect reviewed your contract terms for the 'Q4 Expansion' project.",
    time: 'Yesterday',
  },
  {
    id: '4',
    icon: 'person_add',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-500 dark:text-slate-400',
    title: 'New Team Member Joined',
    description: 'David Chen has been added to the Project Managers team.',
    time: 'Oct 24, 2023',
    opacity: 0.75,
  },
  {
    id: '5',
    icon: 'send',
    iconBg: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    title: 'Proposal Sent',
    description: 'Your proposal for ABC Corp Website has been submitted.',
    time: 'Oct 23, 2023',
    opacity: 0.75,
  },
  {
    id: '6',
    icon: 'chat',
    iconBg: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    title: 'New Message',
    description: 'You received a message from XYZ Inc regarding the mobile app project.',
    time: 'Oct 22, 2023',
    opacity: 0.75,
  },
];

const ITEMS_PER_PAGE = 3;

export const ProviderActivityFeed: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(MOCK_ACTIVITIES.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedActivities = MOCK_ACTIVITIES.slice(startIndex, endIndex);

  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h2>
        <button className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
          Clear History
        </button>
      </div>
      <div className="p-6 space-y-6">
        {displayedActivities.map((activity) => (
          <div key={activity.id} className={`flex items-start gap-4 ${activity.opacity ? 'opacity-75' : ''}`}>
            <div className={`w-8 h-8 rounded-full ${activity.iconBg} ${activity.iconColor} flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined text-lg">{activity.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{activity.title}</p>
                <span className="text-xs text-slate-400 dark:text-slate-500">{activity.time}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
            Previous
          </button>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            Next
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      )}
      {totalPages === 1 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 text-center">
          <a className="text-sm font-semibold text-primary hover:underline" href="#">
            View All Activity
          </a>
        </div>
      )}
    </div>
  );
};
