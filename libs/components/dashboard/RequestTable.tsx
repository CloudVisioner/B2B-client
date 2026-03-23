import React from 'react';
import { MOCK_REQUESTS } from '../../constants/dashboard';

interface RequestTableProps {
  activeTab: string;
}

export const RequestTable: React.FC<RequestTableProps> = ({ activeTab }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="table-header">Job Title</th>
            <th className="table-header">Budget</th>
            <th className="table-header">Deadline</th>
            <th className="table-header">Status</th>
            <th className="table-header text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {MOCK_REQUESTS.map((req) => (
            <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="table-cell">
                <div className="font-semibold text-slate-900 text-[15px]">{req.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{req.id} • {req.subTitle}</div>
              </td>
              <td className="table-cell font-bold text-slate-900 text-[15px]">{req.budget}</td>
              <td className="table-cell font-medium text-slate-600 text-[15px]">{req.deadline}</td>
              <td className="table-cell">
                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                  req.status === 'OPEN' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {req.status}
                </span>
              </td>
              <td className="table-cell text-right">
                <button className="text-[var(--primary)] font-semibold text-sm hover:underline">Manage</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
