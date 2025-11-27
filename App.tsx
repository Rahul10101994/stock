import React, { useState, useEffect, useCallback } from 'react';
import { getStockRecommendations, getStockDetails } from './services/geminiService';
import { AnalysisResult, RiskLevel, Sector, Stock, StockDetails } from './types';
import StockCard from './components/StockCard';
import StockDetailModal from './components/StockDetailModal';
import Filters from './components/Filters';
import { Sparkles, AlertTriangle, ExternalLink, RefreshCw, Info } from 'lucide-react';

function App() {
  const [sector, setSector] = useState<Sector>(Sector.ALL);
  const [risk, setRisk] = useState<RiskLevel>(RiskLevel.MEDIUM);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Detail Modal State
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [stockDetails, setStockDetails] = useState<StockDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getStockRecommendations(sector, risk);
      setData(result);
    } catch (err) {
      setError("Failed to fetch stock data. The AI service might be busy or the API key limit reached.");
    } finally {
      setLoading(false);
    }
  }, [sector, risk]);

  // Initial load
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleRefresh = () => {
    fetchData();
  };

  const handleStockClick = async (stock: Stock) => {
    setSelectedStock(stock);
    setLoadingDetails(true);
    setStockDetails(null); // Clear previous details
    try {
      const details = await getStockDetails(stock.symbol);
      setStockDetails(details);
    } catch (e) {
      console.error("Failed to load details", e);
      // We might show an error in the modal or keep the loading state as failed visually
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetailModal = () => {
    setSelectedStock(null);
    setStockDetails(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20 selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="relative overflow-hidden bg-slate-900 border-b border-slate-800 pt-8 pb-16">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-tr from-orange-500 to-green-500 p-2.5 rounded-xl shadow-lg shadow-orange-500/20">
                  <Sparkles className="text-white" size={24} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Market<span className="text-orange-400">Pulse</span> India
                </h1>
              </div>
              <p className="text-slate-400 max-w-xl text-lg">
                Real-time, AI-driven short term stock picks for the Indian Market (NSE/BSE).
              </p>
            </div>
            
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40 active:scale-95"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              {loading ? "Analyzing Market..." : "Refresh Analysis"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        <Filters 
          currentSector={sector} 
          currentRisk={risk} 
          onSectorChange={setSector} 
          onRiskChange={setRisk}
          isLoading={loading}
        />

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertTriangle className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-800/50 rounded-xl border border-slate-700/50"></div>
            ))}
          </div>
        ) : (
          <>
             {/* Disclaimer Banner */}
             <div className="flex items-start gap-3 bg-yellow-900/10 border border-yellow-800/30 p-4 rounded-xl mb-6">
              <Info className="text-yellow-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-yellow-200/70">
                <strong>Disclaimer:</strong> This application uses Artificial Intelligence to generate financial information for the Indian market. 
                This is <em>not</em> professional financial advice. Market data may be delayed. 
                Always conduct your own due diligence before investing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.stocks.map((stock, index) => (
                <StockCard 
                  key={`${stock.symbol}-${index}`} 
                  stock={stock} 
                  onClick={handleStockClick}
                />
              ))}
            </div>

            {/* Sources Section */}
            {data?.sources && data.sources.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-800">
                <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                  <ExternalLink size={18} />
                  Sources & Grounding
                </h3>
                <div className="flex flex-wrap gap-3">
                  {data.sources.map((source, idx) => (
                    <a 
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 px-3 py-1.5 rounded-full border border-slate-700 transition-colors truncate max-w-xs"
                    >
                      {source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!loading && (!data || data.stocks.length === 0) && !error && (
          <div className="text-center py-20 text-slate-500">
            <p className="text-xl">No stocks found. Try adjusting filters or refreshing.</p>
          </div>
        )}
      </main>

      {/* Detailed Analysis Modal */}
      {selectedStock && (
        <StockDetailModal 
          stock={selectedStock} 
          details={stockDetails} 
          isOpen={!!selectedStock} 
          onClose={closeDetailModal}
          isLoading={loadingDetails}
        />
      )}

      <footer className="mt-20 py-8 text-center text-slate-600 text-sm border-t border-slate-800 bg-slate-900">
        <p>&copy; {new Date().getFullYear()} MarketPulse India. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
}

export default App;
