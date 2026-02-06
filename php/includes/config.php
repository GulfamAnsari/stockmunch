<?php
/**
 * StockMunch Configuration
 */

define('SITE_NAME', 'StockMunch');
define('SITE_URL', 'https://stockmunch.com');
define('API_BASE_URL', 'https://stockmunch.com/api');

// Pricing Plans
$PRICING_PLANS = [
    [
        'id' => 'alerts-only',
        'name' => 'Alerts Only',
        'price' => 150,
        'features' => [
            '30-Day Free Trial',
            'Real-time Telegram Alerts',
            'Personal Watchlist up to 50',
            'Instant Market Dispatch Alert',
            'Email Support'
        ],
        'cta' => 'Start Free Trial'
    ],
    [
        'id' => 'dashboard-only',
        'name' => 'Dashboard Only',
        'price' => 150,
        'features' => [
            '30-Day Free Trial',
            'Full Terminal Access',
            'Personal Watchlist up to 50',
            'Instant Market Dispatch Alert',
            'Historical Data',
            'Email Support'
        ],
        'cta' => 'Start Free Trial'
    ],
    [
        'id' => 'alerts-dashboard',
        'name' => 'Alerts + Dashboard',
        'price' => 250,
        'popular' => true,
        'features' => [
            '30-Day Free Trial',
            'Real-time Telegram Alerts',
            'Full Terminal Access',
            'Unlimited Watchlist',
            'Instant Market Dispatch Alert',
            'Historical Data',
            'Priority Email Support'
        ],
        'cta' => 'Start Free Trial'
    ]
];

// FAQ Data (matching React app)
$FAQ_DATA = [
    [
        'question' => 'How quickly do I receive alerts?',
        'answer' => 'Our system is designed for near-instant delivery. Most alerts are processed and delivered via Telegram within milliseconds of the news break.'
    ],
    [
        'question' => 'What is the Personal Watchlist?',
        'answer' => 'The Personal Watchlist is a dedicated feature that allows you to save or pin specific news dispatches that you find important for future reference or deep study. It acts as your private repository of market intelligence and is completely independent of the real-time Telegram alert system.'
    ],
    [
        'question' => 'Is there a free trial available?',
        'answer' => 'Absolutely! We offer a 30-day full access trial for all new users so you can experience the speed and power of StockMunch risk-free.'
    ],
    [
        'question' => 'Can I cancel my subscription anytime?',
        'answer' => "Yes. You can cancel your subscription from your account settings at any time. If you are in the trial period, you won't be charged."
    ],
    [
        'question' => 'Is StockMunch a SEBI registered investment advisor?',
        'answer' => 'StockMunch is a technology-driven information aggregator and AI analysis platform. We do not provide personalized investment advice or buy/sell recommendations. We are not a SEBI registered advisor.'
    ],
    [
        'question' => 'What data sources does StockMunch use?',
        'answer' => 'We fetch news and market updates directly from leading financial news media houses and verified journalistic sources to ensure you get comprehensive coverage of the market landscape.'
    ],
    [
        'question' => 'Can I access the dashboard on my mobile phone?',
        'answer' => 'Yes, our terminal is fully responsive and optimized for mobile browsers. You can monitor your watchlist and read news dispatches on the go.'
    ],
    [
        'question' => 'How does the AI Sentiment Analysis work?',
        'answer' => 'Our engine uses advanced Large Language Models to process news context in real-time. It evaluates the linguistic tone and potential impact on stock price to label news as Bullish, Bearish, or Neutral.'
    ],
    [
        'question' => 'What happens after my 30-day free trial ends?',
        'answer' => 'Once your trial expires, you will need to choose a paid plan to continue receiving alerts and accessing the professional terminal. No charges are made during the trial.'
    ],
    [
        'question' => 'Can I link multiple Telegram accounts to one subscription?',
        'answer' => 'Currently, each subscription is linked to a single verified Telegram account to ensure secure and dedicated alert delivery.'
    ]
];

// Mock News Data
$MOCK_NEWS = [
    [
        'id' => '1',
        'symbol' => 'COASTAL',
        'companyName' => 'Coastal Corporation',
        'title' => 'Coastal Corporation credit ratings reaffirmed',
        'content' => "Coastal Corporation Ltd's credit ratings by CARE Ratings were reaffirmed at 'CARE BB (Stable)' for long-term and 'CARE A4' for short-term bank facilities.",
        'timestamp' => '10 Jan 2026 05:36PM',
        'priceChange' => -4.38,
        'sentiment' => 'bullish',
        'source' => 'BSE'
    ],
    [
        'id' => '2',
        'symbol' => 'RANEMADRAS',
        'companyName' => 'Rane Madras',
        'title' => 'Rane (Madras) Ltd received a Show Cause Notice',
        'content' => 'Rane (Madras) Ltd received a Show Cause Notice for Rs.7.61 Cr expense disallowance.',
        'timestamp' => '10 Jan 2026 05:25PM',
        'priceChange' => -2.23,
        'sentiment' => 'bearish',
        'source' => 'ScoutQuest'
    ],
    [
        'id' => '3',
        'symbol' => 'DMART',
        'companyName' => 'Avenue Supermarts',
        'title' => 'Avenue Supermarts Q3FY26 Results',
        'content' => 'Avenue Supermarts Ltd reported Q3FY26 standalone revenue of ₹17,642.9 Cr.',
        'timestamp' => '10 Jan 2026 05:20PM',
        'priceChange' => 0.30,
        'sentiment' => 'neutral',
        'source' => 'BSE'
    ],
    [
        'id' => '4',
        'symbol' => 'RALLIS',
        'companyName' => 'Rallis India',
        'title' => 'Rallis India Ltd. to hold analyst/investor meet',
        'content' => 'Rallis India Ltd. will hold an analyst/investor meet on Jan 21, 2026 at 11:00 AM IST.',
        'timestamp' => '10 Jan 2026 05:20PM',
        'priceChange' => -2.05,
        'sentiment' => 'neutral',
        'source' => 'BSE'
    ],
    [
        'id' => '5',
        'symbol' => 'MAPRO',
        'companyName' => 'Mapro Industries',
        'title' => 'Mapro Industries board meeting scheduled',
        'content' => "Mapro Industries Ltd's board meeting is scheduled for January 16, 2026.",
        'timestamp' => '10 Jan 2026 05:20PM',
        'priceChange' => 0,
        'sentiment' => 'neutral',
        'source' => 'BSE'
    ],
    [
        'id' => '6',
        'symbol' => 'NVTI',
        'companyName' => 'Nanavati Vntrs',
        'title' => 'Nanavati Ventures announces resignation',
        'content' => 'Nanavati Ventures Ltd announced the cessation of Mr. Nikunj Kalubhai Maniya as Company Secretary.',
        'timestamp' => '10 Jan 2026 05:15PM',
        'priceChange' => 0,
        'sentiment' => 'neutral',
        'source' => 'BSE'
    ],
    [
        'id' => '7',
        'symbol' => 'RELIANCE',
        'companyName' => 'Reliance Industries',
        'title' => 'Reliance Industries Q3 Results Announcement',
        'content' => 'Reliance Industries Ltd to announce Q3FY26 results on January 18, 2026.',
        'timestamp' => '10 Jan 2026 05:10PM',
        'priceChange' => 1.24,
        'sentiment' => 'bullish',
        'source' => 'BSE'
    ],
    [
        'id' => '8',
        'symbol' => 'TCS',
        'companyName' => 'Tata Consultancy Services',
        'title' => 'TCS wins major digital transformation deal',
        'content' => 'TCS announces multi-year digital transformation engagement with leading European bank.',
        'timestamp' => '10 Jan 2026 05:05PM',
        'priceChange' => 0.85,
        'sentiment' => 'bullish',
        'source' => 'BSE'
    ]
];

// Helper function to check if user is logged in
function isLoggedIn() {
    return isset($_COOKIE['sm_token']) && !empty($_COOKIE['sm_token']);
}

// Get current page for active nav highlighting
function getCurrentPage() {
    $uri = $_SERVER['REQUEST_URI'];
    $path = parse_url($uri, PHP_URL_PATH);
    return basename($path, '.php');
}
?>
