<?php
$pageTitle = "Terms of Usage | StockMunch Platform Agreement";
$pageDescription = "Read the StockMunch Terms of Usage. Understand our service nature, subscription billing, and user responsibilities while accessing our stock alert engine.";
require_once dirname(__DIR__) . '/includes/header.php';
?>

    <main class="page-content">
        <div class="container-sm">
            <h1 class="page-title">
                Terms of <span class="text-emerald">Usage</span>
            </h1>
            
            <div class="space-y-12">
                <section class="legal-section">
                    <h2>Agreement to Terms</h2>
                    <p>By accessing StockMunch.com and using our alert services, you agree to be bound by these terms. If you do not agree, please discontinue use of the platform immediately.</p>
                </section>

                <section class="legal-section">
                    <h2>Nature of Service</h2>
                    <p>StockMunch provides information and alerts based on public filings and exchange data. We are a technology-driven information aggregator. We are not a registered investment advisor (RIA) or a broker-dealer.</p>
                </section>

                <section class="legal-section">
                    <h2>No Financial Advice</h2>
                    <p>Information provided on the dashboard or via Telegram alerts does not constitute financial, investment, or legal advice. All data is for informational purposes only. Always consult with a certified professional before making trading decisions.</p>
                </section>

                <section class="legal-section">
                    <h2>Accuracy and Latency</h2>
                    <p>While we strive for millisecond precision and institutional-grade accuracy, technical latencies, exchange errors, or upstream data provider failures are beyond our control. StockMunch is not liable for losses resulting from data delays.</p>
                </section>

                <section class="legal-section">
                    <h2>Subscription and Billing</h2>
                    <p>Subscriptions are billed in advance. Alerts-only and Dashboard-only plans are priced at ₹150/mo, while the Bundle is ₹250/mo. Subscriptions can be canceled at any time, but partial month refunds are not provided.</p>
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
