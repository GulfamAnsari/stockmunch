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

// FAQ Data
$FAQ_DATA = [
    [
        'question' => 'What is StockMunch?',
        'answer' => 'StockMunch is India\'s definitive real-time stock alert engine. We provide instant Telegram notifications for corporate filings, BSE regulatory updates, and AI-driven market analysis to help traders stay ahead of the market.'
    ],
    [
        'question' => 'How fast are the alerts?',
        'answer' => 'Our high-speed alerting engine is directly connected to exchange data feeds. We measure our latency in milliseconds, not minutes. If it breaks on the exchange, it breaks on your phone.'
    ],
    [
        'question' => 'Do you provide investment advice?',
        'answer' => 'No. StockMunch provides information and alerts based on public filings and exchange data. We are a technology-driven information aggregator. We are not a registered investment advisor (RIA) or a broker-dealer.'
    ],
    [
        'question' => 'What is the 30-day trial?',
        'answer' => 'All our plans come with a 30-day risk-free trial. You can experience the full power of our alerting engine and terminal access without any commitment. No credit card required to start.'
    ],
    [
        'question' => 'How do I receive alerts?',
        'answer' => 'Currently, we deliver alerts via Telegram. WhatsApp and mobile app integrations are coming soon. Simply connect your Telegram account after signing up, and you\'ll start receiving real-time market alerts.'
    ],
    [
        'question' => 'Can I cancel anytime?',
        'answer' => 'Absolutely. Subscriptions can be canceled at any time from your dashboard. However, partial month refunds are not provided as subscriptions are billed in advance.'
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
