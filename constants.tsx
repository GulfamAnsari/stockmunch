
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
    logoColor: 'bg-indigo-600',
    // Fix: Added missing rawPublishedAt property
    rawPublishedAt: '2026-01-10T17:36:00Z'
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
    logoColor: 'bg-blue-500',
    // Fix: Added missing rawPublishedAt property
    rawPublishedAt: '2026-01-10T17:25:00Z'
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
    logoColor: 'bg-[#1fa84f]',
    // Fix: Added missing rawPublishedAt property
    rawPublishedAt: '2026-01-10T17:20:00Z'
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
    logoColor: 'bg-sky-700',
    // Fix: Added missing rawPublishedAt property
    rawPublishedAt: '2026-01-10T17:20:00Z'
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
    logoColor: 'bg-teal-600',
    // Fix: Added missing rawPublishedAt property
    rawPublishedAt: '2026-01-10T17:20:00Z'
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
    logoColor: 'bg-orange-600',
    // Fix: Added missing rawPublishedAt property
    rawPublishedAt: '2026-01-10T17:15:00Z'
  },
  {
    id: '7',
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries',
    title: 'Reliance Retail to accelerate expansion',
    content: 'Reliance Industries reported a strong performance in its retail segment. The company plans to add 2,500 new stores over the next 18 months to dominate the grocery and electronics market.',
    timestamp: '10 Jan 2026 04:30PM',
    priceChange: 1.25,
    sentiment: 'bullish',
    sentimentScore: 89,
    source: 'BSE',
    platform: 'Groww',
    logoColor: 'bg-blue-900',
    // Fix: Added missing rawPublishedAt property
    rawPublishedAt: '2026-01-10T16:30:00Z'
  },
  {
    id: '8',
    symbol: 'TCS',
    companyName: 'Tata Consultancy Services',
    title: 'TCS wins $1B multi-year cloud contract',
    content: 'Tata Consultancy Services has secured a massive $1 billion contract from a European banking major for end-to-end cloud transformation and core banking modernization.',
    timestamp: '10 Jan 2026 04:15PM',
    priceChange: 0.85,
    sentiment: 'bullish',
    sentimentScore: 94,
    source: 'BSE',
    platform: 'Groww',
    logoColor: 'bg-blue-600',
    // Fix: Added missing rawPublishedAt property
    rawPublishedAt: '2026-01-10T16:15:00Z'
  },
  {
    id: '9',
    symbol: 'HDFCBANK',
    companyName: 'HDFC Bank',
    title: 'HDFC Bank Q3 profits beat estimates',
    content: 'HDFC Bank posted an 18% growth in standalone net profit for the third quarter, driven by strong loan growth and improved net interest margins across segments.',
    timestamp: '10 Jan 2026 03:50PM',
    priceChange: 2.10,
    sentiment: 'bullish',
    sentimentScore: 91,
    source: 'NSE',
    platform: 'Groww',
    logoColor: 'bg-blue-800',
    // Fix: Added missing rawPublishedAt property
    rawPublishedAt: '2026-01-10T15:50:00Z'
  },
  {
    id: '10',
    symbol: 'INFY',
    companyName: 'Infosys',
    title: 'Infosys signs ESG collaboration with Microsoft',
    content: 'Infosys and Microsoft have announced a joint solution to help enterprises track and reduce their carbon footprint using cloud-native AI and sustainability data analytics.',
    timestamp: '10 Jan 2026 03:20PM',
    priceChange: -0.45,
    sentiment: 'neutral',
    sentimentScore: 78,
    source: 'BSE',
    platform: 'Groww',
    logoColor: 'bg-blue-400',
    // Fix: Added missing rawPublishedAt property
    rawPublishedAt: '2026-01-10T15:20:00Z'
  },
  {
    id: '11',
    symbol: 'SBIN',
    companyName: 'State Bank of India',
    title: 'SBI raises ₹5,000 Cr via infrastructure bonds',
    content: 'The State Bank of India successfully raised ₹5,000 crore through its third infrastructure bond issuance, which was oversubscribed by 3.5 times at a coupon rate of 7.54%.',
    timestamp: '10 Jan 2026 02:45PM',
    priceChange: 1.15,
    sentiment: 'bullish',
    sentimentScore: 88,
    source: 'BSE',
    platform: 'Groww',
    logoColor: 'bg-blue-700',
    // Fix: Added missing rawPublishedAt property
    rawPublishedAt: '2026-01-10T14:45:00Z'
  },
  {
    id: '12',
    symbol: 'BHARTIARTL',
    companyName: 'Bharti Airtel',
    title: 'Airtel hits 10M 5G subscriber milestone',
    content: 'Bharti Airtel announced that it has crossed 10 million unique 5G customers on its network within months of launch. The company plans to cover all urban areas by March 2026.',
    timestamp: '10 Jan 2026 02:10PM',
    priceChange: 0.65,
    sentiment: 'bullish',
    sentimentScore: 85,
    source: 'BSE',
    platform: 'Groww',
    logoColor: 'bg-red-600',
    // Fix: Added missing rawPublishedAt property
    rawPublishedAt: '2026-01-10T14:10:00Z'
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
