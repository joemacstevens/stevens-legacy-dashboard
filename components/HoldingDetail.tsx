
import React from 'react';
import { ArrowLeft, TrendingUp, Calendar, DollarSign, Briefcase } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { PORTFOLIO_DATA, STOCK_DETAILS, generateMockChartData } from '../constants';
import { DashboardCard } from './DashboardCard';

interface HoldingDetailProps {
  ticker: string;
  onBack: () => void;
}

export const HoldingDetail: React.FC<HoldingDetailProps> = ({ ticker, onBack }) => {
  // Find data from portfolio if it exists
  const portfolioItem = PORTFOLIO_DATA.holdings.find(h => h.ticker === ticker);
  // Get static detail
  const details = STOCK_DETAILS[ticker] || { name: ticker, description: "Company overview not available." };
  // Mock chart data
  const chartData = generateMockChartData();

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-navy-800 border border-navy-700 text-white hover:bg-navy-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white leading-none">{ticker}</h1>
          <p className="text-sm text-neon-muted mt-1">{details.name}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <DashboardCard className="p-4 space-y-1">
           <div className="flex items-center gap-2 text-neon-muted text-xs font-medium uppercase">
             <Briefcase className="w-3.5 h-3.5" /> Shares
           </div>
           <div className="text-xl font-bold text-white">
             {portfolioItem ? portfolioItem.shares : '—'}
           </div>
        </DashboardCard>

        <DashboardCard className="p-4 space-y-1">
           <div className="flex items-center gap-2 text-neon-muted text-xs font-medium uppercase">
             <DollarSign className="w-3.5 h-3.5" /> Market Value
           </div>
           <div className="text-xl font-bold text-white">
             {portfolioItem ? formatCurrency(portfolioItem.marketValue) : '—'}
           </div>
        </DashboardCard>

        <DashboardCard className="p-4 space-y-1">
           <div className="flex items-center gap-2 text-neon-muted text-xs font-medium uppercase">
             <TrendingUp className="w-3.5 h-3.5" /> Gain
           </div>
           <div className={`text-xl font-bold ${portfolioItem && portfolioItem.gainPct >= 0 ? 'text-neon-emerald' : 'text-red-400'}`}>
             {portfolioItem ? (portfolioItem.gainPct > 0 ? '+' : '') + portfolioItem.gainPct + '%' : '—'}
           </div>
        </DashboardCard>

        <DashboardCard className="p-4 space-y-1">
           <div className="flex items-center gap-2 text-neon-muted text-xs font-medium uppercase">
             <Calendar className="w-3.5 h-3.5" /> First Buy
           </div>
           <div className="text-xl font-bold text-white truncate">
             {portfolioItem ? new Date(portfolioItem.firstBuy).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
           </div>
        </DashboardCard>
      </div>

      {/* Chart Section */}
      <div className="space-y-2">
        <h3 className="text-neon-muted text-sm font-semibold px-1 uppercase tracking-wider">Performance (6M)</h3>
        <DashboardCard className="h-64 p-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/5 to-transparent pointer-events-none" />
          <div className="h-full w-full pt-4 pr-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D28D9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6D28D9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                   formatter={(val: number) => [val.toFixed(2), 'Price']}
                   labelFormatter={() => ''}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      {/* Overview Section */}
      <div className="space-y-2">
         <h3 className="text-neon-muted text-sm font-semibold px-1 uppercase tracking-wider">Company Overview</h3>
         <DashboardCard>
            <p className="text-slate-300 text-sm leading-relaxed">
              {details.description}
            </p>
         </DashboardCard>
      </div>
    </div>
  );
};
