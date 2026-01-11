
export interface StockNews {
  id: string;
  symbol: string;
  companyName: string;
  title: string;
  content: string;
  timestamp: string;
  priceChange: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number;
  source: string;
  platform: string;
  logoColor?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  cta: string;
  popular?: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  planId: string;
  planName: string;
  hasDashboardAccess: boolean;
  joinedAt: string;
}

export enum PageView {
  HOME = 'HOME',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  REGULATORY = 'REGULATORY',
  ABOUT = 'ABOUT',
  CONTACT = 'CONTACT',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD'
}
