import React from 'react';
import { RiskLevel, Sector } from '../types';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface FiltersProps {
  currentSector: Sector;
  currentRisk: RiskLevel;
  onSectorChange: (s: Sector) => void;
  onRiskChange: (r: RiskLevel) => void;
  isLoading: boolean;
}

const Filters: React.FC<FiltersProps> = ({ 
  currentSector, 
  currentRisk, 
  onSectorChange, 
  onRiskChange,
  isLoading 
}) => {
  return (
    <div className="bg-slate-800/80 backdrop-blur-md sticky top-4 z-20 border border-slate-700 p-4 rounded-2xl shadow-xl mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        
        <div className="flex items-center gap-3 text-slate-200">
           <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
             <SlidersHorizontal size={20} className="text-white" />
           </div>
           <span className="font-semibold text-lg hidden sm:block">Market Filters</span>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto justify-center md:justify-end">
          <div className="relative group">
            <label className="absolute -top-2.5 left-2 bg-slate-800 px-1 text-xs text-blue-400 font-medium">Sector</label>
            <select
              disabled={isLoading}
              value={currentSector}
              onChange={(e) => onSectorChange(e.target.value as Sector)}
              className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-2.5 disabled:opacity-50 transition-colors hover:border-slate-500 cursor-pointer appearance-none"
            >
              {Object.values(Sector).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="absolute -top-2.5 left-2 bg-slate-800 px-1 text-xs text-blue-400 font-medium">Risk Tolerance</label>
            <select
              disabled={isLoading}
              value={currentRisk}
              onChange={(e) => onRiskChange(e.target.value as RiskLevel)}
              className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-2.5 disabled:opacity-50 transition-colors hover:border-slate-500 cursor-pointer appearance-none"
            >
              {Object.values(RiskLevel).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
