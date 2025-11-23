
import React from 'react';
import { Clock, Calendar, User } from 'lucide-react';
import { ASSIGNMENTS_DATA } from '../constants';
import { DashboardCard } from './DashboardCard';

interface AssignmentCardProps {
  onTickerClick: (ticker: string) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ onTickerClick }) => {
  const { current, nextUp } = ASSIGNMENTS_DATA;

  return (
    <div className="space-y-4">
      <h3 className="text-neon-muted text-sm font-semibold px-1 uppercase tracking-wider">Stock Study Rotation</h3>
      
      <DashboardCard className="border-t-4 border-t-neon-purple p-0 overflow-hidden">
        {/* Current Assignment Header */}
        <div className="bg-navy-800 p-5 border-b border-navy-700">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neon-purple" />
              <span className="text-neon-purple text-xs font-bold uppercase tracking-wider">Current</span>
            </div>
            <span className="text-neon-text text-xs bg-navy-900 px-2 py-1 rounded border border-navy-700">
              Due: {new Date(current.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          
          <div className="flex justify-between items-end">
             <div>
                <div className="text-neon-muted text-xs mb-1">Assigned to</div>
                <div className="text-white font-medium">{current.assignedTo}</div>
             </div>
             <button 
               onClick={() => onTickerClick(current.ticker)}
               className="bg-neon-purple/10 hover:bg-neon-purple/20 text-neon-purple border border-neon-purple/50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
             >
               {current.ticker}
             </button>
          </div>
        </div>

        {/* Next Up List */}
        <div className="bg-navy-900/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-3.5 h-3.5 text-neon-muted" />
            <span className="text-neon-muted text-xs font-semibold uppercase">On Deck</span>
          </div>
          <div className="space-y-2">
            {nextUp.map((name, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded bg-navy-800 border border-navy-700">
                <div className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-[10px] text-white font-bold">
                    {index + 1}
                </div>
                <span className="text-sm text-slate-300">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};
