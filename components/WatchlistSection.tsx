
import React from 'react';
import { Eye, ArrowUpRight } from 'lucide-react';
import { WATCHLIST_DATA } from '../constants';
import { DashboardCard } from './DashboardCard';

interface WatchlistSectionProps {
  onTickerClick: (ticker: string) => void;
}

export const WatchlistSection: React.FC<WatchlistSectionProps> = ({ onTickerClick }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1 mb-1">
        <Eye className="w-4 h-4 text-neon-muted" />
        <h3 className="text-neon-muted text-sm font-semibold uppercase tracking-wider">Watchlist</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {WATCHLIST_DATA.map((item) => (
          <DashboardCard 
            key={item.ticker} 
            onClick={() => onTickerClick(item.ticker)}
            className="p-4 flex items-center justify-between group"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white text-lg">{item.ticker}</span>
                <ArrowUpRight className="w-3 h-3 text-neon-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-neon-muted">{item.note}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-navy-900 border border-navy-700 flex items-center justify-center group-hover:border-neon-emerald transition-colors">
               <Eye className="w-4 h-4 text-neon-emerald" />
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
};
