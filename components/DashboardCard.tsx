
import React from 'react';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ 
  children, 
  className = '', 
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-navy-800 rounded-2xl border border-navy-700 p-5 shadow-lg shadow-black/20 ${onClick ? 'cursor-pointer hover:border-navy-700/80 active:scale-[0.98] transition-all' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
