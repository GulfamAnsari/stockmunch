<?php
$pageTitle = "Privacy Charter | StockMunch Data Security Policy";
$pageDescription = "Review StockMunch's commitment to user privacy and data protection. We outline how we collect, use, and secure your trading telemetry.";
require_once __DIR__ . '/includes/header.php';
?>

    <main class="page-content">
        <div class="container-sm">
            <h1 class="page-title">
                Privacy <span class="text-emerald">Charter</span>
            </h1>
            
            <div class="space-y-12">
                <section class="legal-section">
                    <h2>Introduction</h2>
                    <p>At StockMunch, we recognize that privacy is a fundamental right. This Charter outlines our commitment to protecting your personal data and maintaining the trust you place in us as your stock market alert partner.</p>
                </section>

                <section class="legal-section">
                    <h2>Information We Collect</h2>
                    <p>We collect your phone number and email address strictly for the delivery of stock alerts. When you use our professional terminal, we may collect technical data such as IP addresses and device information to ensure secure access and optimize performance.</p>
                </section>

                <section class="legal-section">
                    <h2>Data Usage</h2>
                    <p>Your usage patterns within the terminal are anonymized. This data is used exclusively to improve our AI sentiment delivery engine and enhance the speed of our notification dispatch. We do not sell your personal data to third-party marketing firms.</p>
                </section>

                <section class="legal-section">
                    <h2>Security Infrastructure</h2>
                    <p>All communication between your device and our servers is encrypted using industry-standard TLS 1.3 protocols. Our database architecture utilizes advanced hashing algorithms to protect your sensitive authentication data.</p>
                </section>

                <section class="legal-section">
                    <h2>Policy Updates</h2>
                    <p>We may update this charter from time to time to reflect changes in regulatory requirements or our service infrastructure. Significant changes will be communicated via our Telegram alert channel.</p>
                </section>
            </div>
            
            <a href="/php/" class="back-link">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
            </a>
        </div>
    </main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
