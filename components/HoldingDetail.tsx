import React, { useEffect, useMemo, useState } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Briefcase,
  LineChart as LineChartIcon,
  Target,
  Newspaper,
  Activity,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { PORTFOLIO_DATA, STOCK_DETAILS, generateMockChartData } from '../constants';
import { DashboardCard } from './DashboardCard';

const FMP_BASE = 'https://financialmodelingprep.com/api/v3';

type PricePoint = { date: string; value: number };
type KeyMetrics = {
  pe: number | null;
  ps: number | null;
  evToEbitda: number | null;
  marketCap: number | null;
  fcfPerShare: number | null;
};
type IncomeQuarter = { date: string; revenue: number | null; netIncome: number | null };
type AnalystOutlook = {
  buy: number | null;
  hold: number | null;
  sell: number | null;
  strongBuy: number | null;
  strongSell: number | null;
  priceTargetLow: number | null;
  priceTargetAvg: number | null;
  priceTargetHigh: number | null;
  epsNextQuarter: number | null;
};
type InsiderTrade = { filer: string; position: string; transactionType: string; date: string };
type NewsItem = { headline: string; url: string; publishedDate: string; site: string };

const fmpFetch = async <T,>(path: string, apiKey: string, signal: AbortSignal): Promise<T> => {
  const separator = path.includes('?') ? '&' : '?';
  const response = await fetch(`${FMP_BASE}${path}${separator}apikey=${apiKey}`, { signal });
  if (!response.ok) {
    throw new Error(`FMP responded with ${response.status}`);
  }
  return response.json();
};

const getPriceHistory = async (ticker: string, apiKey: string, signal: AbortSignal): Promise<PricePoint[]> => {
  const data = await fmpFetch<{ historical?: Array<{ date: string; close: number }> }>(
    `/historical-price-full/${encodeURIComponent(ticker)}?serietype=line&timeseries=180`,
    apiKey,
    signal
  );
  return (data?.historical ?? [])
    .filter(point => typeof point.close === 'number' || typeof point.close === 'string')
    .slice(0, 180)
    .map(point => {
      const value = Number(point.close);
      return { date: point.date, value: Number.isFinite(value) ? value : 0 };
    })
    .reverse();
};

const getKeyMetrics = async (ticker: string, apiKey: string, signal: AbortSignal): Promise<KeyMetrics | null> => {
  const data = await fmpFetch<Array<Record<string, any>>>(
    `/key-metrics/${encodeURIComponent(ticker)}?limit=1`,
    apiKey,
    signal
  );
  const latest = data?.[0];
  if (!latest) return null;
  return {
    pe: Number.isFinite(Number(latest.peRatioTTM ?? latest.peRatio)) ? Number(latest.peRatioTTM ?? latest.peRatio) : null,
    ps: Number.isFinite(Number(latest.priceToSalesRatioTTM)) ? Number(latest.priceToSalesRatioTTM) : null,
    evToEbitda: Number.isFinite(Number(latest.enterpriseValueOverEBITDATTM ?? latest.enterpriseValueOverEBITDA))
      ? Number(latest.enterpriseValueOverEBITDATTM ?? latest.enterpriseValueOverEBITDA)
      : null,
    marketCap: Number.isFinite(Number(latest.marketCap)) ? Number(latest.marketCap) : null,
    fcfPerShare: Number.isFinite(Number(latest.freeCashFlowPerShareTTM ?? latest.freeCashFlowPerShare))
      ? Number(latest.freeCashFlowPerShareTTM ?? latest.freeCashFlowPerShare)
      : null,
  };
};

const getIncomeStatement = async (ticker: string, apiKey: string, signal: AbortSignal): Promise<IncomeQuarter[]> => {
  const data = await fmpFetch<Array<Record<string, any>>>(
    `/income-statement/${encodeURIComponent(ticker)}?period=quarter&limit=6`,
    apiKey,
    signal
  );
  return (data ?? [])
    .map(item => ({
      date: item.date,
      revenue: Number.isFinite(Number(item.revenue)) ? Number(item.revenue) : null,
      netIncome: Number.isFinite(Number(item.netIncome)) ? Number(item.netIncome) : null,
    }))
    .reverse();
};

const getAnalystRatings = async (ticker: string, apiKey: string, signal: AbortSignal): Promise<AnalystOutlook | null> => {
  const [ratings, targets] = await Promise.all([
    fmpFetch<Array<Record<string, any>>>(
      `/analyst-stock-recommendations/${encodeURIComponent(ticker)}?limit=1`,
      apiKey,
      signal
    ),
    fmpFetch<Array<Record<string, any>>>(
      `/price-target-consensus/${encodeURIComponent(ticker)}?limit=1`,
      apiKey,
      signal
    ).catch(() => [] as Array<Record<string, any>>),
  ]);

  const latestRating = ratings?.[0] ?? null;
  const target = targets?.[0] ?? null;

  if (!latestRating && !target) return null;

  return {
    buy: Number.isFinite(Number(latestRating?.analystRatingBuy ?? latestRating?.buy))
      ? Number(latestRating?.analystRatingBuy ?? latestRating?.buy)
      : null,
    hold: Number.isFinite(Number(latestRating?.analystRatingHold ?? latestRating?.hold))
      ? Number(latestRating?.analystRatingHold ?? latestRating?.hold)
      : null,
    sell: Number.isFinite(Number(latestRating?.analystRatingSell ?? latestRating?.sell))
      ? Number(latestRating?.analystRatingSell ?? latestRating?.sell)
      : null,
    strongBuy: Number.isFinite(Number(latestRating?.analystRatingStrongBuy ?? latestRating?.strongBuy))
      ? Number(latestRating?.analystRatingStrongBuy ?? latestRating?.strongBuy)
      : null,
    strongSell: Number.isFinite(Number(latestRating?.analystRatingStrongSell ?? latestRating?.strongSell))
      ? Number(latestRating?.analystRatingStrongSell ?? latestRating?.strongSell)
      : null,
    priceTargetLow: Number.isFinite(Number(target?.targetLow ?? target?.priceTargetLow ?? target?.targetLowEstimate))
      ? Number(target?.targetLow ?? target?.priceTargetLow ?? target?.targetLowEstimate)
      : null,
    priceTargetAvg: Number.isFinite(Number(target?.targetMean ?? target?.priceTargetAverage ?? target?.targetMedian))
      ? Number(target?.targetMean ?? target?.priceTargetAverage ?? target?.targetMedian)
      : null,
    priceTargetHigh: Number.isFinite(Number(target?.targetHigh ?? target?.priceTargetHigh ?? target?.targetHighEstimate))
      ? Number(target?.targetHigh ?? target?.priceTargetHigh ?? target?.targetHighEstimate)
      : null,
    epsNextQuarter: null, // filled separately by getAnalystEstimates
  };
};

const getAnalystEstimates = async (ticker: string, apiKey: string, signal: AbortSignal): Promise<number | null> => {
  const estimates = await fmpFetch<Array<Record<string, any>>>(
    `/analyst-estimates/${encodeURIComponent(ticker)}?period=quarter&limit=2`,
    apiKey,
    signal
  );
  const next = estimates?.[0];
  const value = next?.estimatedEPS ?? next?.eps;
  return Number.isFinite(Number(value)) ? Number(value) : null;
};

const getInsiderTrades = async (ticker: string, apiKey: string, signal: AbortSignal): Promise<InsiderTrade[]> => {
  const data = await fmpFetch<Array<Record<string, any>>>(
    `/insider-trading?symbol=${encodeURIComponent(ticker)}&limit=3`,
    apiKey,
    signal
  );
  return (data ?? []).slice(0, 3).map(item => ({
    filer: item.reportedTitle || item.filerName || 'Unknown filer',
    position: item.position || item.directIndirect || '—',
    transactionType: item.transactionType || item.type || '—',
    date: item.transactionDate || item.filingDate || item.date || '',
  }));
};

const getNews = async (ticker: string, apiKey: string, signal: AbortSignal): Promise<NewsItem[]> => {
  const data = await fmpFetch<Array<Record<string, any>>>(
    `/stock_news?tickers=${encodeURIComponent(ticker)}&limit=3`,
    apiKey,
    signal
  );
  return (data ?? []).slice(0, 3).map(item => ({
    headline: item.title || item.headline || 'News headline',
    url: item.url,
    publishedDate: item.publishedDate || item.date || '',
    site: item.site || item.source || '',
  }));
};

const formatCurrency = (value: number | null | undefined) =>
  value === null || value === undefined
    ? '—'
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const formatCompactCurrency = (value: number | null | undefined) =>
  value === null || value === undefined
    ? '—'
    : new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

const formatMarketCap = (value: number | null | undefined) => {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  const abs = Math.abs(value);
  const suffixes = [
    { limit: 1e12, label: 'T' },
    { limit: 1e9, label: 'B' },
    { limit: 1e6, label: 'M' },
  ];
  for (const { limit, label } of suffixes) {
    if (abs >= limit) {
      const num = value / limit;
      const formatted = num % 1 === 0 ? num.toFixed(0) : num.toFixed(1);
      return `${formatted}${label}`;
    }
  }
  return value.toString();
};

const formatNumber = (value: number | null | undefined, decimals = 1) =>
  value === null || value === undefined ? '—' : Number(value).toFixed(decimals);

const formatDate = (value: string | null | undefined) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const buildLinePath = (data: PricePoint[]) => {
  if (!data.length) return '';
  const height = 40;
  const width = 100;
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return data
    .map((point, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * width;
      const y = height - ((point.value - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
};

interface HoldingDetailProps {
  ticker: string;
  onBack: () => void;
}

export const HoldingDetail: React.FC<HoldingDetailProps> = ({ ticker, onBack }) => {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>(
    generateMockChartData().map(point => ({ date: String(point.day ?? ''), value: point.value }))
  );
  const [chartSource, setChartSource] = useState<'live' | 'mock'>('mock');
  const [keyMetrics, setKeyMetrics] = useState<KeyMetrics | null>(null);
  const [incomeQuarters, setIncomeQuarters] = useState<IncomeQuarter[]>([]);
  const [analyst, setAnalyst] = useState<AnalystOutlook | null>(null);
  const [insiderTrades, setInsiderTradesState] = useState<InsiderTrade[]>([]);
  const [newsItems, setNewsItemsState] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const portfolioItem = PORTFOLIO_DATA.holdings.find(h => h.ticker === ticker);
  const details = STOCK_DETAILS[ticker] || { name: ticker, description: "Company overview not available." };

  useEffect(() => {
    if (!ticker) return;
    const controller = new AbortController();
    const apiKey = import.meta.env.VITE_FMP_API_KEY;
    const mockData = generateMockChartData().map(point => ({ date: String(point.day ?? ''), value: point.value }));
    const handleMock = (message?: string) => {
      setError(message ?? null);
      setPriceHistory(mockData);
      setChartSource('mock');
      setIsLoading(false);
    };

    if (!apiKey) {
      handleMock('Add VITE_FMP_API_KEY to load live data.');
      return () => controller.abort();
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [
          priceRes,
          metricsRes,
          incomeRes,
          ratingsRes,
          estimatesRes,
          tradesRes,
          newsRes,
        ] = await Promise.allSettled([
          getPriceHistory(ticker, apiKey, controller.signal),
          getKeyMetrics(ticker, apiKey, controller.signal),
          getIncomeStatement(ticker, apiKey, controller.signal),
          getAnalystRatings(ticker, apiKey, controller.signal),
          getAnalystEstimates(ticker, apiKey, controller.signal),
          getInsiderTrades(ticker, apiKey, controller.signal),
          getNews(ticker, apiKey, controller.signal),
        ]);

        if (priceRes.status === 'fulfilled' && priceRes.value.length) {
          setPriceHistory(priceRes.value);
          setChartSource('live');
        } else {
          setPriceHistory(mockData);
          setChartSource('mock');
        }

        if (metricsRes.status === 'fulfilled') setKeyMetrics(metricsRes.value);
        if (incomeRes.status === 'fulfilled') setIncomeQuarters(incomeRes.value);

        if (ratingsRes.status === 'fulfilled') {
          const outlook = ratingsRes.value;
          if (outlook) {
            setAnalyst(prev => ({
              ...(outlook || {}),
              epsNextQuarter: prev?.epsNextQuarter ?? outlook?.epsNextQuarter ?? null,
            }));
          }
        }

        if (estimatesRes.status === 'fulfilled') {
          setAnalyst(prev => ({
            ...(prev || {
              buy: null,
              hold: null,
              sell: null,
              strongBuy: null,
              strongSell: null,
              priceTargetLow: null,
              priceTargetAvg: null,
              priceTargetHigh: null,
              epsNextQuarter: null,
            }),
            epsNextQuarter: estimatesRes.value,
          }));
        }

        if (tradesRes.status === 'fulfilled') setInsiderTradesState(tradesRes.value);
        if (newsRes.status === 'fulfilled') setNewsItemsState(newsRes.value);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error(err);
        handleMock('Live data unavailable; showing mock performance.');
        return;
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => controller.abort();
  }, [ticker]);

  const latestPrice = priceHistory.length ? priceHistory[priceHistory.length - 1].value : null;
  const firstPrice = priceHistory.length ? priceHistory[0].value : null;
  const priceChange = latestPrice !== null && firstPrice !== null ? latestPrice - firstPrice : null;
  const priceChangePct = priceChange !== null && firstPrice ? (priceChange / firstPrice) * 100 : null;

  const linePath = useMemo(() => buildLinePath(priceHistory), [priceHistory]);

  const quarterLabel = (date: string) => {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return date;
    const q = Math.floor(d.getMonth() / 3) + 1;
    return `Q${q} '${String(d.getFullYear()).slice(-2)}`;
  };

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

      {/* Live Price & Club Position */}
      <DashboardCard className="p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-neon-muted text-xs font-semibold uppercase tracking-wider">
              <LineChartIcon className="w-4 h-4" />
              Live Price (6M)
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-white">{latestPrice ? formatCurrency(latestPrice) : '—'}</span>
              {priceChangePct !== null && (
                <span className={`text-sm font-semibold px-2 py-1 rounded-full border ${priceChangePct >= 0 ? 'text-neon-emerald border-neon-emerald/50 bg-neon-emerald/10' : 'text-red-400 border-red-400/50 bg-red-400/10'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange?.toFixed(2)} ({priceChangePct.toFixed(2)}%)
                </span>
              )}
            </div>
            <div className="text-[11px] text-neon-muted">
              {isLoading ? 'Loading...' : chartSource === 'live' ? 'Live data from FMP' : 'Mock data'}
            </div>
          </div>
          <div className="w-32 h-16 sm:w-40 sm:h-20">
            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="priceLineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              {linePath && (
                <>
                  <path d={`${linePath} V40 H0 Z`} fill="url(#priceLineGradient)" />
                  <path d={linePath} fill="none" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" />
                </>
              )}
            </svg>
          </div>
        </div>

        <div className="border-t border-navy-700 pt-4">
          <div className="flex items-center gap-2 text-neon-muted text-xs font-semibold uppercase tracking-wider mb-3">
            <Briefcase className="w-4 h-4" />
            Club Position Overview
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-neon-muted text-xs">Shares</div>
              <div className="text-lg font-bold text-white">{portfolioItem ? portfolioItem.shares : '—'}</div>
            </div>
            <div>
              <div className="text-neon-muted text-xs">Market Value</div>
              <div className="text-lg font-bold text-white">
                {portfolioItem ? formatCurrency(portfolioItem.marketValue) : '—'}
              </div>
            </div>
            <div>
              <div className="text-neon-muted text-xs">Gain %</div>
              <div className={`text-lg font-bold ${portfolioItem && portfolioItem.gainPct >= 0 ? 'text-neon-emerald' : 'text-red-400'}`}>
                {portfolioItem ? `${portfolioItem.gainPct > 0 ? '+' : ''}${portfolioItem.gainPct}%` : '—'}
              </div>
            </div>
            <div>
              <div className="text-neon-muted text-xs">First Buy</div>
              <div className="text-lg font-bold text-white truncate">
                {portfolioItem ? new Date(portfolioItem.firstBuy).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Valuation Snapshot */}
      <DashboardCard className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neon-muted text-xs font-semibold uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            Valuation Snapshot
          </div>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-neon-muted" />}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-neon-muted text-xs">P/E</div>
            <div className="text-lg font-bold text-white">{formatNumber(keyMetrics?.pe)}</div>
          </div>
          <div>
            <div className="text-neon-muted text-xs">Price/Sales</div>
            <div className="text-lg font-bold text-white">{formatNumber(keyMetrics?.ps)}</div>
          </div>
          <div>
            <div className="text-neon-muted text-xs">EV/EBITDA</div>
            <div className="text-lg font-bold text-white">{formatNumber(keyMetrics?.evToEbitda)}</div>
          </div>
          <div>
            <div className="text-neon-muted text-xs">Market Cap</div>
            <div className="text-lg font-bold text-white">{formatMarketCap(keyMetrics?.marketCap)}</div>
          </div>
          <div>
            <div className="text-neon-muted text-xs">FCF / Share</div>
            <div className="text-lg font-bold text-white">{formatCurrency(keyMetrics?.fcfPerShare ?? null)}</div>
          </div>
        </div>
      </DashboardCard>

      {/* Financial Trends */}
      <DashboardCard className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neon-muted text-xs font-semibold uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            Financial Trends (Last 6 Quarters)
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <div className="text-neon-muted text-xs mb-2">Revenue</div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeQuarters} margin={{ top: 4, right: 0, left: -20, bottom: 4 }}>
                  <XAxis dataKey="date" tickFormatter={quarterLabel} stroke="#94A3B8" fontSize={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    formatter={(val: number) => formatCompactCurrency(val)}
                    labelFormatter={(label: string) => quarterLabel(label)}
                  />
                  <Bar dataKey="revenue" fill="#00FF9D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <div className="text-neon-muted text-xs mb-2">Net Income</div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeQuarters} margin={{ top: 4, right: 0, left: -20, bottom: 4 }}>
                  <XAxis dataKey="date" tickFormatter={quarterLabel} stroke="#94A3B8" fontSize={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    formatter={(val: number) => formatCompactCurrency(val)}
                    labelFormatter={(label: string) => quarterLabel(label)}
                  />
                  <Bar dataKey="netIncome" fill="#6D28D9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Performance Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-neon-muted text-sm font-semibold uppercase tracking-wider">6-Month Performance</h3>
          <span className="text-[11px] text-neon-muted">
            {isLoading ? 'Loading...' : chartSource === 'live' ? 'Live (FMP)' : 'Mock data'}
          </span>
        </div>
        <DashboardCard className="h-64 p-5 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/5 to-transparent pointer-events-none" />
          <div className="h-full w-full flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-neon-muted mb-2">
              <span>{priceHistory[0]?.date ? formatDate(priceHistory[0].date) : 'Start'}</span>
              <span>{priceHistory[priceHistory.length - 1]?.date ? formatDate(priceHistory[priceHistory.length - 1].date) : 'Today'}</span>
            </div>
            <div className="flex-1">
              <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {linePath && (
                  <>
                    <path d={`${linePath} V40 H0 Z`} fill="url(#performanceGradient)" />
                    <path d={linePath} fill="none" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </div>
          </div>
        </DashboardCard>
        {error && <p className="text-xs text-red-400 px-1">{error}</p>}
      </div>

      {/* Analyst Outlook */}
      <DashboardCard className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neon-muted text-xs font-semibold uppercase tracking-wider">
            <Target className="w-4 h-4" />
            Analyst Outlook
          </div>
          {analyst?.priceTargetAvg && (
            <span className="text-sm text-white font-semibold">
              PT Avg: {formatCurrency(analyst.priceTargetAvg)}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-lg bg-navy-900 border border-navy-700">
            <div className="text-neon-muted text-xs">Buy</div>
            <div className="text-xl font-bold text-white">{analyst?.buy ?? '—'}</div>
          </div>
          <div className="p-3 rounded-lg bg-navy-900 border border-navy-700">
            <div className="text-neon-muted text-xs">Hold</div>
            <div className="text-xl font-bold text-white">{analyst?.hold ?? '—'}</div>
          </div>
          <div className="p-3 rounded-lg bg-navy-900 border border-navy-700">
            <div className="text-neon-muted text-xs">Sell</div>
            <div className="text-xl font-bold text-white">{analyst?.sell ?? '—'}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-lg bg-navy-900 border border-navy-700">
            <div className="text-neon-muted text-xs">PT Low</div>
            <div className="text-lg font-bold text-white">{formatCurrency(analyst?.priceTargetLow ?? null)}</div>
          </div>
          <div className="p-3 rounded-lg bg-navy-900 border border-navy-700">
            <div className="text-neon-muted text-xs">PT Avg</div>
            <div className="text-lg font-bold text-white">{formatCurrency(analyst?.priceTargetAvg ?? null)}</div>
          </div>
          <div className="p-3 rounded-lg bg-navy-900 border border-navy-700">
            <div className="text-neon-muted text-xs">PT High</div>
            <div className="text-lg font-bold text-white">{formatCurrency(analyst?.priceTargetHigh ?? null)}</div>
          </div>
        </div>
        <div className="flex items-center justify-between px-1">
          <span className="text-neon-muted text-xs">EPS est. next quarter</span>
          <span className="text-white font-semibold">{formatNumber(analyst?.epsNextQuarter, 2)}</span>
        </div>
      </DashboardCard>

      {/* Insider Activity */}
      <DashboardCard className="space-y-4">
        <div className="flex items-center gap-2 text-neon-muted text-xs font-semibold uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          Insider Activity
        </div>
        <div className="space-y-3">
          {insiderTrades.length ? insiderTrades.map((trade, index) => (
            <div key={`${trade.filer}-${trade.date}-${index}`} className="p-3 rounded-lg bg-navy-900 border border-navy-700">
              <div className="flex items-center justify-between">
                <div className="text-white font-semibold text-sm">{trade.filer}</div>
                <span className="text-[11px] text-neon-muted">{formatDate(trade.date)}</span>
              </div>
              <div className="text-neon-muted text-xs">{trade.position}</div>
              <div className="text-sm font-bold mt-1 text-neon-emerald">{trade.transactionType}</div>
            </div>
          )) : (
            <div className="text-sm text-neon-muted">No recent insider trades available.</div>
          )}
        </div>
      </DashboardCard>

      {/* News Section */}
      <DashboardCard className="space-y-4">
        <div className="flex items-center gap-2 text-neon-muted text-xs font-semibold uppercase tracking-wider">
          <Newspaper className="w-4 h-4" />
          News
        </div>
        <div className="space-y-3">
          {newsItems.length ? newsItems.map((item, index) => (
            <a 
              key={`${item.url}-${index}`} 
              href={item.url || '#'} 
              target="_blank" 
              rel="noreferrer" 
              className="block p-3 rounded-lg bg-navy-900 border border-transparent hover:border-neon-emerald/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] text-neon-muted">{item.site || 'Source'}</span>
                <span className="text-[11px] text-neon-muted">{formatDate(item.publishedDate)}</span>
              </div>
              <p className="text-sm text-white leading-snug">{item.headline}</p>
            </a>
          )) : (
            <div className="text-sm text-neon-muted">No news available.</div>
          )}
        </div>
      </DashboardCard>

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
