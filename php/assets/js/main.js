/**
 * StockMunch JavaScript - Main functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initMobileMenu();
    initFAQ();
    initSmoothScroll();
    initContactForm();
    initLoginForm();
});

/**
 * Navbar scroll effect
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function handleScroll() {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const menuIcon = toggle?.querySelector('.menu-icon');
    const closeIcon = toggle?.querySelector('.close-icon');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function() {
        const isOpen = menu.classList.contains('open');
        
        if (isOpen) {
            menu.classList.remove('open');
            menu.classList.add('hidden');
            menuIcon?.classList.remove('hidden');
            closeIcon?.classList.add('hidden');
            document.body.style.overflow = '';
        } else {
            menu.classList.remove('hidden');
            menu.classList.add('open');
            menuIcon?.classList.add('hidden');
            closeIcon?.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    });

    // Close menu when clicking links
    const mobileLinks = menu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            menu.classList.remove('open');
            menu.classList.add('hidden');
            menuIcon?.classList.remove('hidden');
            closeIcon?.classList.add('hidden');
            document.body.style.overflow = '';
        });
    });
}

/**
 * FAQ accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question?.addEventListener('click', function() {
            const isOpen = item.classList.contains('open');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                }
            });

            // Toggle current item
            if (isOpen) {
                item.classList.remove('open');
            } else {
                item.classList.add('open');
            }
        });
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Contact form handling
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const errorContainer = document.getElementById('form-error');
    const successContainer = document.getElementById('form-success');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name')?.toString().trim() || '';
        const email = formData.get('email')?.toString().trim() || '';
        const subject = formData.get('subject')?.toString().trim() || '';
        const message = formData.get('message')?.toString().trim() || '';

        // Clear previous errors
        hideError();
        clearFieldErrors();

        // Validation
        let hasError = false;

        if (name.length < 2) {
            showError('Please enter a valid full name.');
            setFieldError('name');
            hasError = true;
        } else if (!isValidEmail(email)) {
            showError('Please provide a valid email protocol.');
            setFieldError('email');
            hasError = true;
        } else if (subject.length < 3) {
            showError('Subject must be detailed (min 3 chars).');
            setFieldError('subject');
            hasError = true;
        } else if (message.length < 10) {
            showError('Message body too short (min 10 chars).');
            setFieldError('message');
            hasError = true;
        }

        if (hasError) return;

        // Submit form
        setLoading(true);

        try {
            const response = await fetch('https://stockmunch.com/api/send-inquery', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                showSuccess();
            } else {
                throw new Error(result.message || 'Transmission node failure.');
            }
        } catch (error) {
            showError(error.message || 'Network transmission failure. Retry later.');
        } finally {
            setLoading(false);
        }
    });

    function showError(message) {
        if (errorContainer) {
            errorContainer.querySelector('span').textContent = message;
            errorContainer.classList.remove('hidden');
            errorContainer.classList.add('animate-shake');
            setTimeout(() => errorContainer.classList.remove('animate-shake'), 500);
        }
    }

    function hideError() {
        if (errorContainer) {
            errorContainer.classList.add('hidden');
        }
    }

    function setFieldError(fieldName) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add('error');
        }
    }

    function clearFieldErrors() {
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }

    function showSuccess() {
        if (successContainer) {
            successContainer.classList.remove('hidden');
        }
    }

    function setLoading(isLoading) {
        if (submitBtn) {
            submitBtn.disabled = isLoading;
            submitBtn.innerHTML = isLoading 
                ? '<span class="loading-spinner"><span class="spinner"></span><span>Transmitting...</span></span>'
                : 'Dispatch Inquiry';
        }
    }

    // Reset form button
    const resetBtn = document.getElementById('reset-form');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            form.reset();
            successContainer?.classList.add('hidden');
            hideError();
            clearFieldErrors();
        });
    }
}

/**
 * Login form handling
 */
function initLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    const otpForm = document.getElementById('otp-form');
    const passwordInput = document.getElementById('password-group');
    const otpInputs = document.querySelectorAll('.otp-input');
    const tabs = document.querySelectorAll('.login-tab');
    
    let currentMethod = 'OTP';
    let currentStep = 'INPUT';

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const method = this.dataset.method;
            if (method) {
                currentMethod = method;
                currentStep = 'INPUT';
                updateLoginUI();
            }
        });
    });

    // OTP input handling
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            if (value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    function updateLoginUI() {
        // Update tabs
        tabs.forEach(tab => {
            if (tab.dataset.method === currentMethod) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Show/hide password field
        if (passwordInput) {
            if (currentMethod === 'PASSWORD') {
                passwordInput.classList.remove('hidden');
            } else {
                passwordInput.classList.add('hidden');
            }
        }
    }

    updateLoginUI();
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Set auth cookie
 */
function setAuthCookie(token) {
    document.cookie = `sm_token=${token}; max-age=2592000; path=/; SameSite=Lax`;
}

/**
 * Get auth token
 */
function getAuthToken() {
    const match = document.cookie.match(/sm_token=([^;]+)/);
    return match ? match[1] : null;
}

/**
 * Pricing card hover effects
 */
function initPricingCards() {
    const cards = document.querySelectorAll('.pricing-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            cards.forEach(c => c.classList.remove('popular'));
            this.classList.add('popular');
        });
    });
}

// Initialize pricing cards if they exist
document.addEventListener('DOMContentLoaded', initPricingCards);
