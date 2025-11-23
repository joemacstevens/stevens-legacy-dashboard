
import { AssignmentData, PortfolioData, WatchlistItem, StockDetail } from './types';

export const PORTFOLIO_DATA: PortfolioData = {
  totalValue: 23189.28,
  totalGainPct: 41.2,
  holdings: [
    { ticker: "NVDA", shares: 41, marketValue: 7334.08, gainPct: 88.9, firstBuy: "2024-01-17" },
    { ticker: "FBTC", shares: 39, marketValue: 2875.08, gainPct: 42.0, firstBuy: "2024-06-13" },
    { ticker: "JPM", shares: 9,  marketValue: 2682.18, gainPct: 14.8, firstBuy: "2024-04-15" },
    { ticker: "AAPL", shares: 8, marketValue: 2171.92, gainPct: 25.1, firstBuy: "2024-04-15" },
    { ticker: "AMD", shares: 10, marketValue: 2037.80, gainPct: 51.2, firstBuy: "2024-07-15" },
    { ticker: "VEEV", shares: 7, marketValue: 1708.42, gainPct: 6.9, firstBuy: "2025-04-29" },
    { ticker: "PLTR", shares: 8, marketValue: 1238.80, gainPct: 30.9, firstBuy: "2025-06-23" },
    { ticker: "SERV", shares: 92, marketValue: 796.72, gainPct: 49.5, firstBuy: "2024-09-09" },
    { ticker: "DIS", shares: 8, marketValue: 834.24, gainPct: 1.2, firstBuy: "2024-02-20" },
    { ticker: "NFLX", shares: 2, marketValue: 208.62, gainPct: 24.1, firstBuy: "2025-01-13" }
  ]
};

export const WATCHLIST_DATA: WatchlistItem[] = [
  { ticker: "UNP", note: "Railroads; stable performer" },
  { ticker: "EME", note: "Construction/engineering" },
  { ticker: "INTC", note: "Semiconductors; next assignment" }
];

export const ASSIGNMENTS_DATA: AssignmentData = {
  current: {
    ticker: "INTC",
    assignedTo: "Charles Lamont Allen",
    dueDate: "2025-11-23"
  },
  nextUp: ["Joe E Stevens", "Justin H Bell", "Melissa R"]
};

export const NEXT_UP_MEMBER = {
  name: "Justin H Bell"
};

export const RECENT_COMPLETIONS = [
  { ticker: "NVDA", member: "Joe E Stevens", date: "Jan 17" },
  { ticker: "DIS", member: "Melissa R", date: "Feb 20" },
  { ticker: "JPM", member: "Charles Lamont Allen", date: "Apr 15" }
];

export const NEWS_ITEMS = [
  { ticker: "NVDA", headline: "NVIDIA shares rally following GTC 2024 keynotes" },
  { ticker: "AAPL", headline: "Apple talks with Google to let Gemini power iPhone AI features" },
  { ticker: "JPM", headline: "JPMorgan Chase raises dividend by 10%" }
];

// Helper data for detail views
export const STOCK_DETAILS: Record<string, StockDetail> = {
  NVDA: { name: "NVIDIA Corporation", description: "NVIDIA Corporation is the global leader in AI computing. The company's GPUs are essential for deep learning and AI applications." },
  FBTC: { name: "Fidelity Bitcoin ETF", description: "Fidelity Wise Origin Bitcoin Fund. A spot Bitcoin ETF that seeks to track the performance of bitcoin." },
  JPM: { name: "JPMorgan Chase & Co.", description: "A leading global financial services firm with assets of $3.7 trillion and operations worldwide." },
  AAPL: { name: "Apple Inc.", description: "Designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories." },
  AMD: { name: "Advanced Micro Devices", description: "A global semiconductor company that develops computer processors and related technologies for business and consumer markets." },
  VEEV: { name: "Veeva Systems Inc.", description: "A leader in cloud-based software for the global life sciences industry." },
  PLTR: { name: "Palantir Technologies", description: "Builds software that empowers organizations to effectively integrate their data, decisions, and operations." },
  SERV: { name: "Serve Robotics", description: "Develops advanced AI-powered low-emissions delivery robots." },
  DIS: { name: "The Walt Disney Company", description: "A diversified worldwide entertainment company with operations in media, theme parks, and products." },
  NFLX: { name: "Netflix, Inc.", description: "A subscription streaming service and production company offering a library of films and television series." },
  UNP: { name: "Union Pacific Corporation", description: "Operates North America's premier railroad franchise, covering 23 states in the western two-thirds of the United States." },
  EME: { name: "EMCOR Group, Inc.", description: "A leader in mechanical and electrical construction, industrial and energy infrastructure, and building services." },
  INTC: { name: "Intel Corporation", description: "A multinational corporation and technology company, one of the world's largest semiconductor chip manufacturers." },
};

export const generateMockChartData = () => {
  const data = [];
  let value = 100;
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.45) * 5;
    value += change;
    data.push({ day: i, value: value });
  }
  return data;
};
