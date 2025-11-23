
import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PORTFOLIO_DATA } from '../constants';
import { DashboardCard } from './DashboardCard';

interface PortfolioSectionProps {
  onTickerClick: (ticker: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onTickerClick }) => {
  const { totalValue, totalGainPct, holdings } = PORTFOLIO_DATA;

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  // Prepare data for Donut Chart (Top 5 + Others)
  const sortedHoldings = [...holdings].sort((a, b) => b.marketValue - a.marketValue);
  const top5 = sortedHoldings.slice(0, 5);
  const others = sortedHoldings.slice(5);
  const othersValue = others.reduce((sum, h) => sum + h.marketValue, 0);

  const chartData = [
    ...top5.map(h => ({ name: h.ticker, value: h.marketValue })),
    { name: 'Other', value: othersValue }
  ];

  const COLORS = ['#00FF9D', '#22C55E', '#3B82F6', '#6D28D9', '#8B5CF6', '#334155'];

  return (
    <div className="space-y-4">
      {/* Value & Chart Card */}
      <DashboardCard className="relative overflow-hidden">
        <div className="flex flex-col items-center text-center mb-6 relative z-10">
          <span className="text-neon-muted text-xs font-semibold uppercase tracking-widest mb-2">Total Portfolio Value</span>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-2">
            {formatCurrency(totalValue)}
          </h2>
          <div className="inline-flex items-center gap-1.5 bg-neon-emerald/10 px-3 py-1 rounded-full border border-neon-emerald/20">
            <TrendingUp className="w-3.5 h-3.5 text-neon-emerald" />
            <span className="text-neon-emerald font-bold text-sm">+{totalGainPct}%</span>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="h-48 w-full relative z-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#F8FAFC' }}
                formatter={(value: number) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      {/* Holdings List */}
      <div className="space-y-2">
        <h3 className="text-neon-muted text-sm font-semibold px-1 uppercase tracking-wider">Holdings</h3>
        <div className="bg-navy-800 rounded-2xl border border-navy-700 overflow-hidden">
          {holdings.map((h, i) => (
            <div 
              key={h.ticker}
              onClick={() => onTickerClick(h.ticker)}
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors ${i !== holdings.length - 1 ? 'border-b border-navy-700' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-navy-900 flex items-center justify-center border border-navy-700 font-bold text-white text-sm shadow-inner">
                  {h.ticker}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{formatCurrency(h.marketValue)}</div>
                  <div className="text-neon-muted text-xs">{h.shares} shares</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`flex flex-col items-end ${h.gainPct >= 0 ? 'text-neon-emerald' : 'text-red-400'}`}>
                  <span className="font-bold text-sm flex items-center gap-0.5">
                     {h.gainPct >= 0 ? '+' : ''}{h.gainPct}%
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-navy-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
