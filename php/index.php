<?php
$pageTitle = "Real-Time Stock Market Alerts & NSE News Terminal";
$pageDescription = "India's fastest stock market news alerts engine. Get instant Telegram notifications for NSE/BSE corporate filings, regulatory updates, and AI-driven market analysis. Free 30-day trial available.";
$pageKeywords = "stock market alerts India, NSE news alerts, BSE updates, real-time stock alerts, Telegram stock notifications, stock market terminal, corporate filings alerts, market news India, stock watchlist app, trading alerts";
$canonicalUrl = "https://stockmunch.com";
require_once __DIR__ . '/includes/header.php';
?>

    <!-- Hero Section -->
    <div class="hero">
        <div class="hero-bg">
            <div class="hero-grid">
                <div class="hero-grid-inner"></div>
            </div>
            <div class="hero-glow-1"></div>
            <div class="hero-glow-2"></div>
        </div>

        <div class="hero-content">
            <div class="hero-badge">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                India's definitive real-time stock alert engine
            </div>
            
            <h1 class="hero-title">
                Stop checking news. <br>
                <span class="highlight">Start getting alerts.</span>
            </h1>
            
            <p class="hero-desc">
                Get real-time stock market news alerts on Dashboard & Telegram
            </p>
            
            <div class="hero-buttons">
                <a href="#pricing" class="btn btn-primary btn-lg">
                    Sign Up Free
                    <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </a>
                
                <a href="#alerts" class="btn btn-secondary btn-lg">
                    Sample Market Alerts
                </a>

                <a href="#dashboard" class="btn btn-outline btn-lg">
                    View Terminal Preview
                </a>
            </div>

            <div class="hero-stats">
                <div class="hero-stat">
                    <div class="hero-stat-value">99.9%</div>
                    <div class="hero-stat-label">Uptime</div>
                </div>
                <div class="hero-stat">
                    <div class="hero-stat-value">30 Days</div>
                    <div class="hero-stat-label">Trial Period</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <section id="features" class="section section-dark">
        <div class="container">
            <div class="text-center mb-16">
                <h2 class="section-title">
                    Everything You Need to <span class="text-emerald">Stay Ahead</span>
                </h2>
                <p class="section-subtitle">Professional grade tools designed for individual traders who demand speed.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <?php
                $features = [
                    [
                        'title' => 'Instant Alerts',
                        'desc' => 'Receive real-time news alerts delivered via Telegram. Our high-speed dispatch engine ensures news hits your device the second it breaks.',
                        'icon' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />'
                    ],
                    [
                        'title' => 'BSE Corporate Feed',
                        'desc' => 'Direct integration with the BSE regulatory filing system. Get official corporate announcements and results the moment they reach the exchange.',
                        'icon' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />'
                    ],
                    [
                        'title' => 'Personal Watchlist',
                        'desc' => 'Track specific symbols and get prioritized news for your portfolio. Our \'Watchlist\' engine ensures you never miss a corporate action.',
                        'icon' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />'
                    ],
                    [
                        'title' => 'Institutional Terminal',
                        'desc' => 'A high-fidelity dashboard aggregating live news from leading financial media houses, featuring AI-driven sentiment analysis and millisecond dispatch.',
                        'icon' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />'
                    ],
                    [
                        'title' => 'Sentiment Analysis',
                        'desc' => 'AI-driven sentiment engine that processes every news item to identify bullish or bearish potential in seconds.',
                        'icon' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />'
                    ],
                    [
                        'title' => '24/7 Monitoring',
                        'desc' => 'Our automated systems monitor corporate announcements and exchange filings around the clock, even when markets are closed.',
                        'icon' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />'
                    ]
                ];
                
                foreach ($features as $feature): ?>
                <div class="feature-card">
                    <div class="feature-icon">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <?php echo $feature['icon']; ?>
                        </svg>
                    </div>
                    <h3 class="feature-title"><?php echo $feature['title']; ?></h3>
                    <p class="feature-desc"><?php echo $feature['desc']; ?></p>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Alert Showcase Section -->
    <section id="alerts" class="section section-dark alerts-section">
        <div class="container">
            <div class="alerts-content-grid">
                <!-- Text Side -->
                <div class="alerts-text">
                    <span class="badge badge-sky mb-8">Real-Time Push Engine</span>
                    <h2>
                        Receive News <br><span class="text-emerald italic">The Moment</span> It Breaks
                    </h2>
                    <p>
                        Our high-speed alerting engine is directly connected to exchange data feeds. We don't just curate news; we transmit it in real-time.
                        <br><br>
                        <strong class="text-slate-300 italic">Whenever a critical update is received by our system, it is instantly pushed to your device.</strong> Stay ahead of the crowd with the fastest dispatch in the Indian market.
                    </p>
                    
                    <div class="space-y-4 mb-10">
                        <div class="protocol-card">
                            <div class="protocol-icon emerald">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <div class="protocol-title">Telegram Protocol</div>
                                <div class="protocol-status active">Active & Operational</div>
                            </div>
                        </div>
                        
                        <div class="protocol-card" style="opacity: 0.8;">
                            <div class="protocol-icon muted">
                                <svg fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.551 4.189 1.598 6.048L0 24l6.105-1.602a11.834 11.834 0 005.937 1.598h.005c6.637 0 12.032-5.398 12.035-12.032.003-3.213-1.248-6.234-3.522-8.508z"/>
                                </svg>
                            </div>
                            <div>
                                <div class="protocol-title muted">WhatsApp Protocol</div>
                                <div class="protocol-status coming">
                                    <span class="dot"></span>
                                    Coming Soon
                                </div>
                            </div>
                        </div>

                        <div class="protocol-card" style="opacity: 0.8;">
                            <div class="protocol-icon muted">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <div class="protocol-title muted">Android & iOS Apps</div>
                                <div class="protocol-status coming">
                                    <span class="dot"></span>
                                    Coming Soon
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Phone Mockups -->
                <div class="phone-mockups">
                    <!-- Phone 1: Notification Stack -->
                    <div class="phone-frame phone-frame-1">
                        <div class="phone-notch"></div>
                        <div class="phone-screen notification-list">
                            <div class="notification-header">Notifications</div>
                            <?php
                            $notifications = [
                                ['title' => 'RailTel Reshuffles Roles', 'time' => '33m ago'],
                                ['title' => 'Teamo Productions Q3 Results', 'time' => '33m ago'],
                                ['title' => 'Integra Essentia Q3 Net ₹1.26 Cr', 'time' => '2h ago'],
                                ['title' => 'Gretex Q3 PBT at ₹264L', 'time' => '2h ago'],
                                ['title' => 'DMart CEO Step Down', 'time' => '2h ago'],
                                ['title' => 'PFC to Issue ₹5,000 Cr NCDs', 'time' => '2h ago'],
                            ];
                            foreach ($notifications as $notif): ?>
                            <div class="notification-item">
                                <div class="notification-avatar">SM</div>
                                <div class="notification-content">
                                    <div class="notification-meta">
                                        <span class="notification-label">Stock Alerts</span>
                                        <span class="notification-time"><?php echo $notif['time']; ?></span>
                                    </div>
                                    <p class="notification-title">News: 🖼️ <?php echo $notif['title']; ?></p>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <!-- Phone 2: Telegram View -->
                    <div class="phone-frame phone-frame-2">
                        <div class="phone-notch"></div>
                        <div class="phone-screen">
                            <div class="telegram-header">
                                <div class="telegram-avatar">S</div>
                                <div>
                                    <p class="telegram-channel-name">StockManch(Stock...</p>
                                    <p class="telegram-channel-members">5 members</p>
                                </div>
                            </div>
                            <div class="telegram-body">
                                <div class="telegram-message">
                                    <div class="telegram-message-image">
                                        RailTel News<br>Image
                                    </div>
                                    <div class="telegram-message-content">
                                        <h3 class="telegram-message-title">RailTel Reshuffles Top Management Roles</h3>
                                        <p class="telegram-message-text">
                                            RailTel announces senior management changes under SEBI Regulation 30.
                                            <br><br>
                                            Dr. Sharad Sharma, Sh. Deepak Garg, and Sh. Ramphool Chandel re-designated as EDs in different roles.
                                        </p>
                                        <div class="telegram-message-meta">
                                            <p>Source: <span class="source">BSE</span></p>
                                            <p>Sentiment: <span class="sentiment">neutral</span></p>
                                            <p>Confidence level: <span class="confidence">72.36%</span></p>
                                            <p class="timestamp">Published at: 10/1/2026, 10:25:50 pm</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="telegram-input">
                                <button class="telegram-input-btn">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                </button>
                                <div class="telegram-input-field">Message</div>
                                <button class="telegram-input-btn">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="section section-dark">
        <div class="container text-center">
            <span class="badge badge-emerald mb-6">Limited Time: 30-Day Risk-Free Trial</span>
            <h2 class="section-title mb-6">
                Choose Your <span class="text-emerald">Plan</span>
            </h2>
            <p class="section-subtitle mb-20">Get professional alerts and dashboard access. Instant Telegram delivery for serious traders.</p>
            
            <div class="pricing-grid">
                <?php foreach ($PRICING_PLANS as $plan): ?>
                <div class="pricing-card <?php echo isset($plan['popular']) && $plan['popular'] ? 'popular' : ''; ?>">
                    <?php if (isset($plan['popular']) && $plan['popular']): ?>
                    <div class="pricing-badge">Best Value</div>
                    <?php endif; ?>
                    <div class="pricing-trial-badge">30-Day Trial</div>
                    
                    <h3 class="pricing-name"><?php echo $plan['name']; ?></h3>

                    <div class="pricing-price">
                        <span class="pricing-currency">₹</span>
                        <span class="pricing-amount"><?php echo $plan['price']; ?></span>
                        <span class="pricing-period">/mo</span>
                    </div>

                    <ul class="pricing-features">
                        <?php foreach ($plan['features'] as $feature): ?>
                        <li>
                            <svg class="<?php echo strpos($feature, 'Trial') !== false ? 'check-sky' : 'check-emerald'; ?>" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                            <span><?php echo $feature; ?></span>
                        </li>
                        <?php endforeach; ?>
                    </ul>

                    <a href="/login/?plan=<?php echo $plan['id']; ?>" class="btn <?php echo isset($plan['popular']) && $plan['popular'] ? 'btn-primary' : 'btn-dark'; ?>">
                        <?php echo $plan['cta']; ?>
                    </a>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="section section-darker">
        <div class="container-sm">
            <div class="text-center mb-16">
                <h2 class="section-title">
                    Common <span class="text-emerald">Queries</span>
                </h2>
            </div>
            <div class="faq-container">
                <?php foreach ($FAQ_DATA as $faq): ?>
                <div class="faq-item">
                    <button class="faq-question">
                        <span><?php echo $faq['question']; ?></span>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div class="faq-answer">
                        <p><?php echo $faq['answer']; ?></p>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Terminal Preview Section -->
    <section id="dashboard" class="section section-dark terminal-preview">
        <div class="container-lg">
            <div class="text-center mb-12">
                <h2 class="section-title">
                    Experience the <span class="text-emerald italic">Terminal</span>
                </h2>
                <p class="section-subtitle mb-8">Institutional-grade data aggregation at your fingertips. High-fidelity real-time preview.</p>
            </div>
            
            <div class="terminal-wrapper">
                <div class="terminal-glow"></div>
                <div class="terminal-frame">
                    <!-- Browser Window Header -->
                    <div class="terminal-header">
                        <div class="terminal-dots">
                            <div class="terminal-dot red"></div>
                            <div class="terminal-dot yellow"></div>
                            <div class="terminal-dot green"></div>
                        </div>
                        <div class="terminal-divider"></div>
                        <div class="terminal-url">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>https://stockmunch.com/terminal/v5-preview</span>
                        </div>
                    </div>

                    <!-- Terminal Body -->
                    <div class="terminal-body">
                        <!-- Mock Navbar -->
                        <div class="terminal-nav">
                            <div class="terminal-tabs">
                                <div class="terminal-tab active">All Feeds</div>
                                <div class="terminal-tab">BSE Feeds</div>
                                <div class="terminal-tab">Watchlist</div>
                            </div>
                            <div class="terminal-search">
                                <div class="placeholder-dot"></div>
                                <div class="placeholder-text"></div>
                            </div>
                        </div>

                        <!-- Mock Ticker -->
                        <div class="terminal-ticker">
                            <?php for ($i = 0; $i < 6; $i++): ?>
                            <div class="ticker-item">
                                <span class="ticker-symbol">RELIANCE</span>
                                <span class="ticker-change">+1.24%</span>
                            </div>
                            <?php endfor; ?>
                        </div>

                        <!-- Mock News Grid -->
                        <div class="terminal-grid">
                            <?php foreach (array_slice($MOCK_NEWS, 0, 8) as $news): ?>
                            <div class="news-card">
                                <div class="news-card-header">
                                    <div class="news-card-company">
                                        <div class="news-card-logo"><?php echo substr($news['symbol'], 0, 2); ?></div>
                                        <div>
                                            <h3 class="news-card-name"><?php echo $news['companyName']; ?></h3>
                                            <p class="news-card-time"><?php echo $news['timestamp']; ?></p>
                                        </div>
                                    </div>
                                    <div class="news-card-change <?php echo $news['priceChange'] >= 0 ? 'positive' : 'negative'; ?>">
                                        <?php echo ($news['priceChange'] >= 0 ? '+' : '') . $news['priceChange']; ?>%
                                    </div>
                                </div>
                                <h4 class="news-card-title"><?php echo $news['title']; ?></h4>
                                <p class="news-card-content"><?php echo $news['content']; ?></p>
                                <div class="news-card-footer">
                                    <div class="news-card-sentiment <?php echo $news['sentiment']; ?>">
                                        AI: <?php echo $news['sentiment']; ?>
                                    </div>
                                    <span class="news-card-source"><?php echo $news['source']; ?></span>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        </div>

                        <!-- Mock Footer -->
                        <div class="terminal-footer">
                            <div class="terminal-status">
                                <span>Node: Ready</span>
                                <span>Stream: Synced</span>
                            </div>
                            <span class="terminal-version">StockMunch v5.0.1 Stable Preview</span>
                        </div>
                    </div>

                    <!-- Interactive Badge Overlay -->
                    <div class="terminal-overlay">
                        <div class="terminal-overlay-badge">
                            <span>Live Terminal Preview</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Structured Data for SEO -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            <?php 
            $faqItems = [];
            foreach ($FAQ_DATA as $faq) {
                $faqItems[] = '{
                    "@type": "Question",
                    "name": "' . addslashes($faq['question']) . '",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "' . addslashes($faq['answer']) . '"
                    }
                }';
            }
            echo implode(',', $faqItems);
            ?>
        ]
    }
    </script>

    <!-- Breadcrumb Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://stockmunch.com"
            }
        ]
    }
    </script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
