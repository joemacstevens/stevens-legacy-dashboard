import React from 'react';
import { Calendar } from 'lucide-react';
import { NEXT_UP_MEMBER } from '../constants';
import { DashboardCard } from './DashboardCard';

export const NextUpCard: React.FC = () => {
  return (
    <DashboardCard glow="purple" className="flex flex-col justify-center h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Calendar className="w-5 h-5 text-neon-purple" />
        </div>
        <span className="text-neon-purple text-xs font-bold uppercase tracking-wider">Next Up</span>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white leading-tight">
          {NEXT_UP_MEMBER.name}
        </h3>
        <p className="text-neon-muted text-sm mt-1">Prepare presentation</p>
      </div>
    </DashboardCard>
  );
};