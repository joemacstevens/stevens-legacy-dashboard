
export interface Holding {
  ticker: string;
  shares: number;
  marketValue: number;
  gainPct: number;
  firstBuy: string;
}

export interface PortfolioData {
  totalValue: number;
  totalGainPct: number;
  holdings: Holding[];
}

export interface WatchlistItem {
  ticker: string;
  note: string;
}

export interface AssignmentData {
  current: {
    ticker: string;
    assignedTo: string;
    dueDate: string;
  };
  nextUp: string[];
}

export interface StockDetail {
  name: string;
  description: string;
}
