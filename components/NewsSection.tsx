import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { NEWS_ITEMS } from '../constants';
import { DashboardCard } from './DashboardCard';

export const NewsSection: React.FC = () => {
  return (
    <DashboardCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-neon-purple" />
            <h3 className="text-white font-semibold">Market News</h3>
        </div>
        <span className="text-xs text-neon-purple cursor-pointer hover:text-white transition-colors">View All</span>
      </div>

      <div className="space-y-3">
        {NEWS_ITEMS.map((news, index) => (
          <div 
            key={index} 
            className="group p-3 rounded-lg bg-navy-900/50 border border-transparent hover:border-navy-700 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold bg-navy-700 text-neon-muted px-1.5 py-0.5 rounded">
                            {news.ticker}
                        </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-snug group-hover:text-neon-emerald transition-colors">
                        {news.headline}
                    </p>
                </div>
                <ExternalLink className="w-3 h-3 text-navy-700 group-hover:text-neon-muted mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};