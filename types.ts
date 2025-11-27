export interface Stock {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: number; // Numeric for sorting/color
  reason: string;
  sector: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  stocks: Stock[];
  sources: GroundingSource[];
}

export interface StockDetails {
  technicalAnalysis: string;
  fundamentalAnalysis: string;
  targetPrice: string;
  stopLoss: string;
  upsidePotential: string; // e.g. "15%"
  confidenceScore: number; // 0-100
  supportLevels: string[];
  resistanceLevels: string[];
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  AGGRESSIVE = 'Aggressive'
}

export enum Sector {
  ALL = 'All Sectors',
  TECH = 'Technology',
  FINANCE = 'Finance',
  HEALTHCARE = 'Healthcare',
  ENERGY = 'Energy',
  CONSUMER = 'Consumer Goods'
}
