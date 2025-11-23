
import React, { useState } from 'react';
import { PortfolioSection } from './components/PortfolioSection';
import { AssignmentCard } from './components/AssignmentCard';
import { WatchlistSection } from './components/WatchlistSection';
import { HoldingDetail } from './components/HoldingDetail';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'detail'>('dashboard');
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  const handleTickerClick = (ticker: string) => {
    setSelectedTicker(ticker);
    setCurrentView('detail');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentView('dashboard');
    setSelectedTicker(null);
  };

  return (
    <div className="min-h-screen bg-navy-900 text-neon-text p-4 pb-12 font-sans selection:bg-neon-emerald selection:text-navy-900">
      
      <main className="max-w-md mx-auto">
        {currentView === 'dashboard' ? (
          <>
            {/* Header */}
            <header className="mb-6 pt-2 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  Stevens Legacy
                </h1>
                <p className="text-xs text-neon-muted tracking-widest uppercase font-medium mt-1">Investment Club</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center">
                <span className="font-bold text-neon-emerald text-xs">SL</span>
              </div>
            </header>

            <div className="space-y-8 animate-in fade-in duration-500">
              <PortfolioSection onTickerClick={handleTickerClick} />
              <AssignmentCard onTickerClick={handleTickerClick} />
              <WatchlistSection onTickerClick={handleTickerClick} />
            </div>
            
            <footer className="mt-12 text-center text-navy-700 text-xs pb-4">
               <p>Data provided by Stevens Legacy Prototype</p>
            </footer>
          </>
        ) : (
          <HoldingDetail 
            ticker={selectedTicker || ''} 
            onBack={handleBack} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
