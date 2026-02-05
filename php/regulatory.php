<?php
$pageTitle = "Regulatory Policy | StockMunch Compliance & Disclosure";
$pageDescription = "StockMunch's regulatory policy and compliance framework. Learn how we adhere to SEBI guidelines while providing stock news aggregation and AI analysis.";
require_once __DIR__ . '/includes/header.php';
?>

    <main class="page-content">
        <div class="container-sm">
            <h1 class="page-title">
                Regulatory <span class="text-emerald">Policy</span>
            </h1>
            
            <div class="space-y-12">
                <section class="legal-section">
                    <h2>Compliance Framework</h2>
                    <p>Compliance is our priority. StockMunch operates within the regulatory framework governing information technology and financial data dissemination in India.</p>
                </section>

                <section class="legal-section">
                    <h2>SEBI Guidelines</h2>
                    <p>StockMunch operates strictly as a news aggregation and analysis tool. We adhere to SEBI (Investment Advisers) Regulations by ensuring we only provide factual data and AI-driven sentiment analysis without specific buy/sell recommendations.</p>
                </section>

                <section class="legal-section">
                    <h2>Data Integrity</h2>
                    <p>Our data is sourced via authorized APIs from Indian stock exchanges (NSE/BSE) and corporate filing repositories. We maintain rigorous audit trails for every piece of information processed by our AI engine.</p>
                </section>

                <section class="legal-section">
                    <h2>Disclosure Policy</h2>
                    <p>To prevent conflicts of interest, our internal algorithms and management staff are prohibited from taking trading positions in stocks mentioned in alerts during the "Lock-In" period immediately following a news event.</p>
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
