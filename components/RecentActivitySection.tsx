import React from 'react';
import { CheckCircle } from 'lucide-react';
import { RECENT_COMPLETIONS } from '../constants';
import { DashboardCard } from './DashboardCard';

export const RecentActivitySection: React.FC = () => {
  return (
    <DashboardCard>
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-4 h-4 text-neon-emerald" />
        <h3 className="text-white font-semibold">Recent Completions</h3>
      </div>
      
      <div className="space-y-0">
        {RECENT_COMPLETIONS.map((item, index) => (
          <div 
            key={`${item.ticker}-${index}`} 
            className={`flex items-center justify-between py-3 ${
              index !== RECENT_COMPLETIONS.length - 1 ? 'border-b border-navy-700' : ''
            }`}
          >
            <div className="flex items-center gap-3">
                <div className="bg-navy-900 w-10 h-10 rounded-full flex items-center justify-center border border-navy-700 text-xs font-bold text-neon-emerald">
                    {item.ticker}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">{item.member}</span>
                    <span className="text-xs text-neon-muted">Analysis complete</span>
                </div>
            </div>
            <span className="text-xs text-neon-muted font-mono">{item.date}</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};