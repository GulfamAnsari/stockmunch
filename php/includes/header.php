<?php
require_once __DIR__ . '/config.php';
$currentPage = getCurrentPage();
$isLoggedIn = isLoggedIn();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? $pageTitle . ' | ' . SITE_NAME : SITE_NAME . ' | Real-Time Stock Market Alerts & NSE News Terminal'; ?></title>
    <meta name="description" content="<?php echo isset($pageDescription) ? $pageDescription : 'India\'s fastest stock market news alerts engine. Receive instant Telegram notifications for corporate filings, BSE regulatory updates, and AI-driven market analysis.'; ?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/php-assets/css/style.css">
    <link rel="icon" type="image/svg+xml" href="/php-assets/images/favicon.svg">
</head>
<body class="bg-dark text-slate-300 selection-emerald">
    <!-- Navigation -->
    <nav id="navbar" class="navbar">
        <div class="nav-container">
            <a href="/" class="logo-link">
                <svg class="logo" viewBox="0 0 330 120" xmlns="http://www.w3.org/2000/svg" fill="none">
                    <polyline points="9,85 30,60 45,89 55,40 75,60 75,85" fill="none" stroke="#AF0002" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="90" y1="85" x2="90" y2="30" stroke="#1FA84F" stroke-width="10" stroke-linecap="round"/>
                    <polygon points="95,15 75,30 105,32" fill="#1FA84F"/>
                    <text x="100" y="82" font-size="52" font-weight="500" letter-spacing="0.2" fill="white" font-family="'Inter', Arial, sans-serif">stockमंच</text>
                </svg>
            </a>

            <!-- Desktop Nav -->
            <div class="nav-links desktop-only">
                <a href="/#features" class="nav-link">Features</a>
                <a href="/#pricing" class="nav-link">Pricing</a>
                <a href="/about/" class="nav-link <?php echo $currentPage === 'about' ? 'active' : ''; ?>">Our Mission</a>
                <a href="/contact/" class="nav-link <?php echo $currentPage === 'contact' ? 'active' : ''; ?>">Contact</a>
                <a href="/#faq" class="nav-link">FAQ</a>
            </div>

            <div class="nav-actions">
                <?php if ($isLoggedIn): ?>
                    <a href="/dashboard" class="btn btn-primary desktop-only">
                        My Account
                        <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                    </a>
                <?php else: ?>
                    <a href="/login/" class="btn btn-primary desktop-only">
                        Login
                        <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                    </a>
                <?php endif; ?>

                <!-- Mobile Menu Toggle -->
                <button id="mobile-menu-toggle" class="mobile-menu-toggle mobile-only" aria-label="Toggle Menu">
                    <svg class="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                    <svg class="close-icon hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="mobile-menu hidden">
            <div class="mobile-menu-content">
                <a href="/#features" class="mobile-nav-link">Features</a>
                <a href="/#pricing" class="mobile-nav-link">Pricing</a>
                <a href="/about/" class="mobile-nav-link">Our Mission</a>
                <a href="/contact/" class="mobile-nav-link">Contact</a>
                <?php if ($isLoggedIn): ?>
                    <a href="/dashboard" class="btn btn-primary btn-full">Enter Terminal</a>
                <?php else: ?>
                    <a href="/login/" class="btn btn-primary btn-full">Sign In to Terminal</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>
