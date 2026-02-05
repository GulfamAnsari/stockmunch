<?php
$pageTitle = "Contact StockMunch | Support and Inquiries Hub";
$pageDescription = "Need help with your StockMunch subscription or terminal access? Contact our support node for assistance with real-time stock alerts and data feeds.";
require_once dirname(__DIR__) . '/includes/header.php';
?>

    <main class="page-content">
        <div class="container" style="max-width: 1152px;">
            <div class="contact-grid">
                
                <!-- Info Side -->
                <div class="space-y-12">
                    <div>
                        <span class="page-badge">Support Hub</span>
                        <h1 class="page-title">
                            Reach Out to <br>
                            <span class="text-emerald">The Team</span>
                        </h1>
                        <p class="text-slate-400" style="font-size: 1.125rem; font-weight: 500; max-width: 28rem;">
                            Have questions about our data feeds or subscription? Our technical node is ready to assist.
                        </p>
                    </div>

                    <div class="space-y-6">
                        <div class="contact-item">
                            <div class="contact-icon emerald">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="contact-label">Email Dispatch</h3>
                                <p class="contact-value">support@stockmunch.com</p>
                            </div>
                        </div>

                        <div class="contact-item">
                            <div class="contact-icon sky">
                                <svg fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.25.38-.51 1.05-.78 4.12-1.79 6.87-2.97 8.24-3.54 3.92-1.63 4.73-1.91 5.26-1.92.12 0 .38.03.55.17.14.12.18.28.2.44.02.16.02.32 0 .44z" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="contact-label">Telegram Community</h3>
                                <p class="contact-value">@stockmunch_support</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Form Side -->
                <div class="contact-form-wrapper">
                    <div id="form-success" class="form-success hidden">
                        <div>
                            <div class="form-success-icon">✓</div>
                            <h3>Inquiry Logged</h3>
                            <p>Our node will respond within 24 standard terminal hours.</p>
                            <button id="reset-form" class="btn btn-outline">
                                Reset Form
                            </button>
                        </div>
                    </div>

                    <form id="contact-form" class="space-y-8">
                        <div id="form-error" class="form-error hidden">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span></span>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Full Name*</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    required
                                    placeholder="Trader Name"
                                    class="form-input"
                                />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email Protocol*</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    placeholder="name@terminal.com"
                                    class="form-input"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Subject*</label>
                            <input 
                                type="text" 
                                name="subject"
                                required
                                placeholder="Inquiry Topic"
                                class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Detailed Message*</label>
                            <textarea 
                                name="message"
                                required
                                rows="4"
                                placeholder="Provide details about your query..."
                                class="form-textarea"
                            ></textarea>
                        </div>

                        <button type="submit" class="btn btn-primary btn-full">
                            Dispatch Inquiry
                        </button>
                    </form>
                </div>
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
