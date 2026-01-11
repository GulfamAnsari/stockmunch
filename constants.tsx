
import React from 'react';
import { StockNews, PricingPlan } from './types';

export const Logo = ({ className = "h-10", textColor = "white" }: { className?: string, textColor?: string }) => (
  <svg
    className={className}
    viewBox="0 0 330 120"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    {/* Red zig-zag graph */}
    <polyline
      points="9,85 30,60 45,89 55,40 75,60 75,85"
      fill="none"
      stroke="#AF0002"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Green arrow shaft */}
    <line
      x1="90"
      y1="85"
      x2="90"
      y2="30"
      stroke="#1FA84F"
      strokeWidth="10"
      strokeLinecap="round"
    />

    {/* Green arrow head */}
    <polygon
      points="95,15 75,30 105,32"
      fill="#1FA84F"
    />

    {/* Brand name */}
    <text
      x="100"
      y="82"
      fontSize="52"
      fontWeight="500"
      letterSpacing="0.2"
      fill={textColor}
      fontFamily="'Inter', 'Noto Sans Devanagari', Arial, sans-serif"
    >
      stockमंच
    </text>
  </svg>
);

export const MOCK_NEWS: StockNews[] = [
  {
    id: '1',
    symbol: 'COASTAL',
    companyName: 'Coastal Corporation',
    title: 'Coastal Corporation credit ratings reaffirmed',
    content: "Coastal Corporation Ltd's credit ratings by CARE Ratings were reaffirmed at 'CARE BB (Stable)' for long-term and 'CARE A4' for short-term bank facilities. Revenue rose 45% YoY in FY25, driven by a 48% production volume increase. Profitability improved in H1FY26 despite earlier challenges.",
    timestamp: '10 Jan 2026 05:36PM',
    priceChange: -4.38,
    sentiment: 'bullish',
    sentimentScore: 93,
    source: 'BSE',
    platform: 'Groww',
    logoColor: 'bg-indigo-600'
  },
  {
    id: '2',
    symbol: 'RANEMADRAS',
    companyName: 'Rane Madras',
    title: 'Rane (Madras) Ltd received a Show Cause Notice',
    content: 'Rane (Madras) Ltd received a Show Cause Notice for Rs.7.61 Cr expense disallowance. The issue involves trademark fees, gratuity gains, with Rs.2.66 Cr impact plus penalties.',
    timestamp: '10 Jan 2026 05:25PM',
    priceChange: -2.23,
    sentiment: 'bearish',
    sentimentScore: 50,
    source: 'ScoutQuest',
    platform: 'Groww',
    logoColor: 'bg-blue-500'
  },
  {
    id: '3',
    symbol: 'DMART',
    companyName: 'Avenue Supermarts',
    title: 'Avenue Supermarts Q3FY26 Results',
    content: 'Avenue Supermarts Ltd reported Q3FY26 standalone revenue of ₹17,642.9 Cr and consolidated revenue of ₹18,117.8 Cr, showcasing strong performance. Board approved Mr. Anshul Asawa\'s appointment as CEO from Feb 2026.',
    timestamp: '10 Jan 2026 05:20PM',
    priceChange: 0.30,
    sentiment: 'neutral',
    sentimentScore: 85,
    source: 'BSE',
    platform: 'Groww',
    logoColor: 'bg-[#1fa84f]'
  },
  {
    id: '4',
    symbol: 'RALLIS',
    companyName: 'Rallis India',
    title: 'Rallis India Ltd. to hold analyst/investor meet',
    content: 'Rallis India Ltd. will hold an analyst/investor meet on Jan 21, 2026 at 11:00 AM IST to discuss Q3 and 9M FY26 results. The call includes management\'s remarks and a Q&A session.',
    timestamp: '10 Jan 2026 05:20PM',
    priceChange: -2.05,
    sentiment: 'neutral',
    sentimentScore: 82,
    source: 'BSE',
    platform: 'Groww',
    logoColor: 'bg-sky-700'
  },
  {
    id: '5',
    symbol: 'MAPRO',
    companyName: 'Mapro Industries',
    title: 'Mapro Industries board meeting scheduled',
    content: "Mapro Industries Ltd's board meeting is scheduled for January 16, 2026. The meeting will consider and approve Q3 FY2025 unaudited standalone financial results under SEBI LODR regulations.",
    timestamp: '10 Jan 2026 05:20PM',
    priceChange: 0,
    sentiment: 'neutral',
    sentimentScore: 92,
    source: 'BSE',
    platform: 'Groww',
    logoColor: 'bg-teal-600'
  },
  {
    id: '6',
    symbol: 'NVTI',
    companyName: 'Nanavati Vntrs',
    title: 'Nanavati Ventures announces resignation',
    content: 'Nanavati Ventures Ltd announced the cessation of Mr. Nikunj Kalubhai Maniya as Company Secretary. The resignation is effective from January 10, 2026, as acknowledged by the Board of Directors.',
    timestamp: '10 Jan 2026 05:15PM',
    priceChange: 0,
    sentiment: 'neutral',
    sentimentScore: 58,
    source: 'BSE',
    platform: 'Groww',
    logoColor: 'bg-orange-600'
  }
];
export const MOCK_CHART_DATA = [
  { time: '09:15', price: 2450 },
  { time: '10:00', price: 2465 },
  { time: '11:00', price: 2460 },
  { time: '12:00', price: 2480 },
  { time: '13:00', price: 2475 },
  { time: '14:00', price: 2495 },
  { time: '15:00', price: 2510 },
  { time: '15:30', price: 2505 },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'alerts-only',
    name: 'Alerts Only',
    price: 150,
    features: [
      '30-Day Free Trial',
      'Real-time Telegram alerts',
      'Custom Alert Keywords',
      'Instant Market Dispatch',
      'Email support'
    ],
    cta: 'Start Free Trial'
  },
  {
    id: 'dashboard-only',
    name: 'Dashboard Only',
    price: 150,
    features: [
      '30-Day Free Trial',
      'Full Terminal access',
      'Personal Watchlist',
      'Historical archive (2 years)',
      'Advanced News Filtering',
      'Institutional Charting'
    ],
    cta: 'Start Free Trial'
  },
  {
    id: 'alerts-dashboard',
    name: 'Alerts + Dashboard',
    price: 250,
    features: [
      '30-Day Free Trial',
      'Real-time Telegram alerts',
      'Full Terminal access',
      'Personal Watchlist Pro',
      'Sentiment Analysis AI',
      'Priority Alert Dispatch',
      'Unlimited Watchlist Slots'
    ],
    cta: 'Start Free Trial',
    popular: true
  }
];

export const FAQ_DATA = [
  {
    question: "How quickly do I receive alerts?",
    answer: "Our system is designed for near-instant delivery. Most alerts are processed and delivered via Telegram within milliseconds of the news break."
  },
  {
    question: "What is the Personal Watchlist?",
    answer: "The Watchlist allows you to pin specific stocks to your terminal. You'll receive prioritized alerts and a dedicated news feed for only those companies."
  },
  {
    question: "Is there a free trial available?",
    answer: "Absolutely! We offer a 30-day full access trial for all new users so you can experience the speed and power of StockManch risk-free."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes. You can cancel your subscription from your account settings at any time. If you are in the trial period, you won't be charged."
  }
];
