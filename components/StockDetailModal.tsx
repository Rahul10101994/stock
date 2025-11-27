import React from 'react';
import { Stock, StockDetails } from '../types';
import { X, TrendingUp, TrendingDown, Target, ShieldAlert, BarChart3, PieChart, IndianRupee } from 'lucide-react';

interface StockDetailModalProps {
  stock: Stock;
  details: StockDetails | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, details, isOpen, onClose, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur z-10 border-b border-slate-800 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-white">{stock.symbol}</h2>
              <span className={`text-sm px-2 py-0.5 rounded-full font-medium ${
                stock.changePercent >= 0 ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
              }`}>
                {stock.change}
              </span>
            </div>
            <p className="text-slate-400 font-medium">{stock.name}</p>
            <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold text-white">{stock.price}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isLoading ? (
             <div className="space-y-8 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="h-24 bg-slate-800 rounded-xl"></div>
                    <div className="h-24 bg-slate-800 rounded-xl"></div>
                    <div className="h-24 bg-slate-800 rounded-xl"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-64 bg-slate-800 rounded-xl"></div>
                    <div className="h-64 bg-slate-800 rounded-xl"></div>
                </div>
             </div>
          ) : details ? (
            <div className="space-y-8">
              
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Target Price */}
                <div className="bg-green-900/10 border border-green-800/30 p-5 rounded-xl flex flex-col items-center text-center">
                    <div className="p-3 bg-green-500/20 rounded-full mb-3 text-green-400">
                        <Target size={24} />
                    </div>
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Target Price</span>
                    <span className="text-2xl font-bold text-white mt-1">{details.targetPrice}</span>
                    <span className="text-green-400 text-sm font-medium mt-1">Potential: {details.upsidePotential}</span>
                </div>

                {/* Stop Loss */}
                <div className="bg-red-900/10 border border-red-800/30 p-5 rounded-xl flex flex-col items-center text-center">
                    <div className="p-3 bg-red-500/20 rounded-full mb-3 text-red-400">
                        <ShieldAlert size={24} />
                    </div>
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Stop Loss</span>
                    <span className="text-2xl font-bold text-white mt-1">{details.stopLoss}</span>
                    <span className="text-slate-500 text-sm font-medium mt-1">Manage Risk</span>
                </div>

                {/* Confidence */}
                <div className="bg-blue-900/10 border border-blue-800/30 p-5 rounded-xl flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="p-3 bg-blue-500/20 rounded-full mb-3 text-blue-400">
                            <BarChart3 size={24} />
                        </div>
                        <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Probability</span>
                        <span className="text-3xl font-bold text-white mt-1">{details.confidenceScore}%</span>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                            <div 
                                className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${details.confidenceScore}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
              </div>

              {/* Analysis Text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Technical */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                        <TrendingUp className="text-purple-400" size={20} />
                        <h3 className="text-lg font-bold text-white">Technical Analysis</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-sm">
                        {details.technicalAnalysis}
                    </p>
                    
                    <div className="mt-4">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Key Levels</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-green-400 block mb-1">Support</span>
                                <ul className="text-sm text-slate-300 space-y-1">
                                    {details.supportLevels.map((lvl, i) => <li key={i} className="border-l-2 border-green-500/30 pl-2">{lvl}</li>)}
                                </ul>
                            </div>
                            <div>
                                <span className="text-xs text-red-400 block mb-1">Resistance</span>
                                <ul className="text-sm text-slate-300 space-y-1">
                                    {details.resistanceLevels.map((lvl, i) => <li key={i} className="border-l-2 border-red-500/30 pl-2">{lvl}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fundamental */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                        <PieChart className="text-orange-400" size={20} />
                        <h3 className="text-lg font-bold text-white">Fundamental Analysis</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-sm">
                        {details.fundamentalAnalysis}
                    </p>
                    <div className="bg-slate-800/50 p-4 rounded-lg mt-4 border border-slate-700/50">
                        <div className="flex items-start gap-2">
                             <div className="bg-blue-500/20 p-1.5 rounded text-blue-400 mt-0.5">
                                 <IndianRupee size={14} />
                             </div>
                             <div>
                                 <h4 className="text-sm font-semibold text-white">Short Term Strategy</h4>
                                 <p className="text-xs text-slate-400 mt-1">
                                     Suggested entry around CMP ({stock.price}) with a strict stop loss at {details.stopLoss}. 
                                     Target horizon is 1-3 months.
                                 </p>
                             </div>
                        </div>
                    </div>
                </div>

              </div>

            </div>
          ) : (
             <div className="text-center py-20 text-slate-500">
                 Failed to load details. Please try again.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockDetailModal;
