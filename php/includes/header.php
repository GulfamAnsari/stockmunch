<?php
require_once __DIR__ . '/config.php';
$currentPage = getCurrentPage();
$isLoggedIn = isLoggedIn();

// SEO defaults
$siteUrl = SITE_URL;
$siteName = SITE_NAME;
$defaultTitle = 'Real-Time Stock Market Alerts & NSE News Terminal';
$defaultDescription = 'India\'s fastest stock market news alerts engine. Get instant Telegram notifications for corporate filings, BSE/NSE regulatory updates, and AI-driven market analysis. Start your free 30-day trial.';
$defaultKeywords = 'stock market alerts, NSE news, BSE updates, stock alerts India, real-time market news, Telegram stock alerts, stock market terminal, corporate filings alerts, market news India, stock watchlist';
$defaultImage = $siteUrl . '/php-assets/images/og-image.jpg';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title><?php echo isset($pageTitle) ? htmlspecialchars($pageTitle) . ' | ' . $siteName : $siteName . ' | ' . $defaultTitle; ?></title>
    <meta name="title" content="<?php echo isset($pageTitle) ? htmlspecialchars($pageTitle) . ' | ' . $siteName : $siteName . ' | ' . $defaultTitle; ?>">
    <meta name="description" content="<?php echo isset($pageDescription) ? htmlspecialchars($pageDescription) : $defaultDescription; ?>">
    <meta name="keywords" content="<?php echo isset($pageKeywords) ? htmlspecialchars($pageKeywords) : $defaultKeywords; ?>">
    <meta name="author" content="StockMunch">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="googlebot" content="index, follow">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="<?php echo isset($canonicalUrl) ? $canonicalUrl : $siteUrl . ($_SERVER['REQUEST_URI'] === '/' ? '' : rtrim($_SERVER['REQUEST_URI'], '/')); ?>">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo isset($canonicalUrl) ? $canonicalUrl : $siteUrl . $_SERVER['REQUEST_URI']; ?>">
    <meta property="og:title" content="<?php echo isset($pageTitle) ? htmlspecialchars($pageTitle) . ' | ' . $siteName : $siteName . ' | ' . $defaultTitle; ?>">
    <meta property="og:description" content="<?php echo isset($pageDescription) ? htmlspecialchars($pageDescription) : $defaultDescription; ?>">
    <meta property="og:image" content="<?php echo isset($ogImage) ? $ogImage : $defaultImage; ?>">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="<?php echo $siteName; ?>">
    <meta property="og:locale" content="en_IN">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="<?php echo isset($canonicalUrl) ? $canonicalUrl : $siteUrl . $_SERVER['REQUEST_URI']; ?>">
    <meta name="twitter:title" content="<?php echo isset($pageTitle) ? htmlspecialchars($pageTitle) . ' | ' . $siteName : $siteName . ' | ' . $defaultTitle; ?>">
    <meta name="twitter:description" content="<?php echo isset($pageDescription) ? htmlspecialchars($pageDescription) : $defaultDescription; ?>">
    <meta name="twitter:image" content="<?php echo isset($ogImage) ? $ogImage : $defaultImage; ?>">
    
    <!-- Additional SEO Tags -->
    <meta name="theme-color" content="#0b0f1a">
    <meta name="msapplication-TileColor" content="#0b0f1a">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="format-detection" content="telephone=no">
    
    <!-- Geo Tags for India -->
    <meta name="geo.region" content="IN">
    <meta name="geo.placename" content="India">
    <meta name="language" content="English">
    
    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://stockmunch.com">
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="/php-assets/css/style.css">
    
    <!-- Favicons -->
    <link rel="icon" type="image/svg+xml" href="/php-assets/images/favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="/php-assets/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/php-assets/images/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/php-assets/images/apple-touch-icon.png">
    
    <!-- Structured Data - Organization -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "StockMunch",
        "url": "https://stockmunch.com",
        "logo": "https://stockmunch.com/php-assets/images/logo.png",
        "description": "India's fastest stock market news alerts engine providing real-time Telegram notifications for corporate filings and market updates.",
        "foundingDate": "2024",
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "support@stockmunch.com",
            "contactType": "customer support",
            "availableLanguage": ["English", "Hindi"]
        },
        "sameAs": [
            "https://www.instagram.com/stock_munch"
        ],
        "areaServed": {
            "@type": "Country",
            "name": "India"
        }
    }
    </script>
    
    <?php if ($currentPage === 'home' || $currentPage === ''): ?>
    <!-- Structured Data - WebSite with SearchAction -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "StockMunch",
        "url": "https://stockmunch.com",
        "description": "Real-time stock market alerts and NSE/BSE news terminal for Indian traders",
        "publisher": {
            "@type": "Organization",
            "name": "StockMunch"
        }
    }
    </script>
    
    <!-- Structured Data - SoftwareApplication -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "StockMunch Terminal",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "AggregateOffer",
            "lowPrice": "150",
            "highPrice": "250",
            "priceCurrency": "INR",
            "offerCount": "3"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150"
        }
    }
    </script>
    <script src="/php-assets/js/main.js" defer></script>
    <?php endif; ?>
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
                    <a href="/dashboard/" class="btn btn-primary desktop-only">
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
                    <a href="/dashboard/" class="btn btn-primary btn-full">Enter Terminal</a>
                <?php else: ?>
                    <a href="/login/" class="btn btn-primary btn-full">Sign In to Terminal</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>
