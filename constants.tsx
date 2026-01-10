
import React from 'react';
import { StockNews, PricingPlan } from './types';

export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`${className} bg-[#1fa84f] rounded-lg flex items-center justify-center font-bold text-slate-900`}>
    S
  </div>
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
      'Real-time stock alerts',
      'Telegram notification',
      'Breaking news updates',
      'Email support'
    ],
    cta: 'Get Started'
  },
  {
    id: 'dashboard-only',
    name: 'Dashboard Only',
    price: 150,
    features: [
      'Full dashboard access',
      'Real time stock news updates',
      'Historical data search',
      'Email support',
      'Advance filtering of news'
    ],
    cta: 'Get Started'
  },
  {
    id: 'alerts-dashboard',
    name: 'Alerts + Dashboard',
    price: 250,
    features: [
      'Real-time stock alerts',
      'Telegram notification',
      'Breaking news updates',
      'Full dashboard access',
      'Real time stock news updates',
      'Historical data search',
      'Email support',
      'Advance filtering of news'
    ],
    cta: 'Get Started',
    popular: true
  }
];

export const FAQ_DATA = [
  {
    question: "How quickly do I receive alerts?",
    answer: "Our system is designed for near-instant delivery. Most alerts are processed and delivered within 50ms of the news break."
  },
  {
    question: "Can I customize which stocks I get alerts for?",
    answer: "Yes, our dashboard allows you to create custom watchlists and set specific criteria for alerts on any stock in our covered indices."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, and net banking via our secure payment gateway."
  },
  {
    question: "Is there a free trial available?",
    answer: "We offer a 7-day limited access trial for new users to explore the dashboard and experience the alert speed."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely. You can cancel your subscription from your account settings at any time without any hidden fees."
  },
  {
    question: "How do I access the dashboard?",
    answer: "Once you subscribe, you can log in directly on StockManch.com to access your personalized market insights."
  }
];
