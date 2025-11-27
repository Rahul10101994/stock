import React from 'react';
import { Stock } from '../types';
import { TrendingUp, TrendingDown, Activity, IndianRupee, ArrowRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface StockCardProps {
  stock: Stock;
  onClick: (stock: Stock) => void;
}

// Helper to generate fake sparkline data based on change percent
const generateSparkline = (changePercent: number) => {
  const data = [];
  let current = 100;
  for (let i = 0; i < 20; i++) {
    const volatility = Math.random() * 5;
    const trend = changePercent > 0 ? 0.5 : -0.5;
    current = current + trend + (Math.random() > 0.5 ? volatility : -volatility);
    data.push({ value: current });
  }
  // Ensure the last point reflects the overall direction roughly
  data[19] = { value: changePercent > 0 ? 110 : 90 };
  return data;
};

const StockCard: React.FC<StockCardProps> = ({ stock, onClick }) => {
  const isPositive = stock.changePercent >= 0;
  const sparklineData = React.useMemo(() => generateSparkline(stock.changePercent), [stock.changePercent]);

  return (
    <div 
      onClick={() => onClick(stock)}
      className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 group cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="text-blue-500" size={20} />
      </div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">{stock.symbol}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              stock.riskLevel === 'High' ? 'bg-red-900/50 text-red-200 border border-red-800' :
              stock.riskLevel === 'Medium' ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-800' :
              'bg-green-900/50 text-green-200 border border-green-800'
            }`}>
              {stock.riskLevel} Risk
            </span>
          </div>
          <p className="text-slate-400 text-sm font-medium mt-0.5">{stock.name}</p>
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          <span className="font-bold">{stock.change}</span>
        </div>
      </div>

      <div className="flex items-end gap-2 mb-4">
        <span className="text-3xl font-bold text-white">{stock.price}</span>
        <span className="text-slate-500 text-sm mb-1.5">current</span>
      </div>

      <div className="h-16 w-full mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData}>
            <defs>
              <linearGradient id={`colorGradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#4ade80' : '#f87171'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isPositive ? '#4ade80' : '#f87171'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? '#4ade80' : '#f87171'} 
              fillOpacity={1} 
              fill={`url(#colorGradient-${stock.symbol})`} 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 group-hover:bg-slate-900/80 transition-colors">
        <div className="flex items-center gap-2 mb-1 text-blue-400 text-xs uppercase font-bold tracking-wider">
          <Activity size={12} />
          <span>AI Insight</span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">
          {stock.reason}
        </p>
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-500">
        <span className="bg-slate-700/30 px-2 py-1 rounded text-slate-400">{stock.sector}</span>
        <span className="flex items-center gap-1 group-hover:text-blue-400 transition-colors">
            Click for Analysis
        </span>
      </div>
    </div>
  );
};

export default StockCard;
