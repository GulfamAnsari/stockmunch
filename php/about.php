<?php
$pageTitle = "About StockMunch | Our Mission to Democratize Market Data";
$pageDescription = "Learn about StockMunch's mission to provide retail traders with institutional-grade news speed. Discover how we built India's fastest stock alert engine.";
require_once dirname(__DIR__) . '/includes/header.php';
?>

    <main class="page-content">
        <div class="container-sm">
            <span class="page-badge">Our Mission</span>
            <h1 class="page-title">
                Institutional Edge for <br>
                <span class="text-emerald italic">Every Trader</span>
            </h1>
            
            <div class="space-y-16">
                <section class="page-section">
                    <h2>The StockMunch Story</h2>
                    <p>
                        StockMunch was born from a simple realization: in the stock market, information is only as valuable as the speed at which it is received. For too long, millisecond-level data advantage was reserved for institutional desks and high-frequency firms.
                        <br><br>
                        We built StockMunch to democratize market intelligence. By combining direct exchange data feeds with advanced AI sentiment analysis, we provide retail traders with a professional-grade alerting engine that levels the playing field.
                    </p>
                </section>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="info-card">
                        <div class="info-card-icon">⚡</div>
                        <h3>Millisecond Dispatch</h3>
                        <p>We measure our latency in milliseconds, not minutes. If it breaks on the exchange, it breaks on your phone.</p>
                    </div>
                    <div class="info-card">
                        <div class="info-card-icon">🧠</div>
                        <h3>AI-Powered Context</h3>
                        <p>Raw data is noise. Our Gemini-driven engine provides the 'why' behind the 'what' in every alert.</p>
                    </div>
                    <div class="info-card">
                        <div class="info-card-icon">🛡️</div>
                        <h3>Secure & Stable</h3>
                        <p>Built on high-availability infrastructure to ensure you never miss a corporate filing or market update.</p>
                    </div>
                </div>

                <section class="text-center pt-12">
                    <h2 class="section-title mb-8">Ready to experience the future of news?</h2>
                    <a href="/#pricing" class="btn btn-primary btn-lg">
                        Start Your 30-Day Trial
                        <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </a>
                </section>
            </div>
            
            <a href="/" class="back-link">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
            </a>
        </div>
    </main>

<?php require_once dirname(__DIR__) . '/includes/footer.php'; ?>
