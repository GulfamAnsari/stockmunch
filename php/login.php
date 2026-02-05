<?php
$pageTitle = "Terminal Login | Secure Access to StockMunch";
$pageDescription = "Sign in to your StockMunch terminal to monitor real-time stock market news, manage your watchlist, and configure Telegram alerts.";
require_once __DIR__ . '/includes/config.php';

// If already logged in, redirect to dashboard
if (isLoggedIn()) {
    header('Location: /dashboard');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle . ' | ' . SITE_NAME; ?></title>
    <meta name="description" content="<?php echo $pageDescription; ?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/php-assets/css/style.css">
    <link rel="icon" type="image/svg+xml" href="/php-assets/images/favicon.svg">
</head>
<body class="bg-dark text-slate-300 selection-emerald">
    <div class="login-page">
        <a href="/" class="login-logo">
            <svg class="logo" viewBox="0 0 330 120" xmlns="http://www.w3.org/2000/svg" fill="none">
                <polyline points="9,85 30,60 45,89 55,40 75,60 75,85" fill="none" stroke="#AF0002" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="90" y1="85" x2="90" y2="30" stroke="#1FA84F" stroke-width="10" stroke-linecap="round"/>
                <polygon points="95,15 75,30 105,32" fill="#1FA84F"/>
                <text x="100" y="82" font-size="52" font-weight="500" letter-spacing="0.2" fill="white" font-family="'Inter', Arial, sans-serif">stockमंच</text>
            </svg>
        </a>
        
        <div class="login-card">
            <div class="login-header">
                <h1 id="login-title">Sign In</h1>
                <p>Access your StockMunch terminal.</p>
            </div>

            <div id="form-error" class="form-error hidden">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span></span>
                <div id="signup-prompt" class="signup-prompt hidden">
                    <a href="/php/#pricing" class="btn btn-primary">Sign Up</a>
                </div>
            </div>

            <!-- Method Tabs -->
            <div id="login-tabs" class="login-tabs">
                <button class="login-tab active" data-method="OTP">OTP Login</button>
                <button class="login-tab" data-method="PASSWORD">Password</button>
            </div>

            <!-- Input Step -->
            <form id="login-form" class="space-y-8">
                <div class="form-group">
                    <label class="form-label">Mobile Number*</label>
                    <div class="phone-input-wrapper">
                        <span class="phone-prefix">+91</span>
                        <input 
                            type="tel" 
                            name="phone"
                            id="phone-input"
                            required
                            maxlength="10"
                            placeholder="98765 43210"
                            class="form-input phone-input"
                        />
                    </div>
                </div>

                <div id="password-group" class="form-group hidden">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 0.25rem; margin-bottom: 0.75rem;">
                        <label class="form-label" style="margin: 0;">Password*</label>
                        <button type="button" id="forgot-btn" class="forgot-link">Forgot?</button>
                    </div>
                    <input 
                        type="password" 
                        name="password"
                        id="password-input"
                        placeholder="••••••••"
                        class="form-input"
                    />
                </div>

                <button type="submit" id="submit-btn" class="btn btn-primary btn-full">
                    Send OTP
                </button>
            </form>

            <!-- OTP Verification Step (Initially Hidden) -->
            <form id="otp-form" class="space-y-8 hidden">
                <div class="form-group">
                    <label class="form-label text-center block">Enter OTP</label>
                    <p class="otp-note">
                        We will call you to provide the OTP.<br>Please pick up the call for OTP.
                    </p>
                    <div class="otp-inputs">
                        <input type="text" maxlength="1" class="otp-input" placeholder="•" />
                        <input type="text" maxlength="1" class="otp-input" placeholder="•" />
                        <input type="text" maxlength="1" class="otp-input" placeholder="•" />
                        <input type="text" maxlength="1" class="otp-input" placeholder="•" />
                        <input type="text" maxlength="1" class="otp-input" placeholder="•" />
                        <input type="text" maxlength="1" class="otp-input" placeholder="•" />
                    </div>
                </div>

                <div id="new-password-group" class="form-group hidden">
                    <label class="form-label">Set New Password* (min 6 chars)</label>
                    <input 
                        type="password" 
                        name="new_password"
                        id="new-password-input"
                        placeholder="••••••••"
                        class="form-input"
                    />
                </div>

                <div class="space-y-4">
                    <button type="submit" id="verify-btn" class="btn btn-primary btn-full">
                        Verify OTP
                    </button>
                    <button type="button" id="change-number-btn" class="change-number-btn">
                        Change Number
                    </button>
                </div>
            </form>

            <!-- Success Step (Initially Hidden) -->
            <div id="success-view" class="login-success hidden">
                <div class="login-success-icon">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3>Updated</h3>
                <p>Credentials synced. Please sign in now.</p>
                <button id="back-to-login-btn" class="btn btn-primary btn-full">Sign In</button>
            </div>
        </div>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const API_BASE_URL = '<?php echo API_BASE_URL; ?>';
        
        // Elements
        const loginForm = document.getElementById('login-form');
        const otpForm = document.getElementById('otp-form');
        const successView = document.getElementById('success-view');
        const loginTabs = document.getElementById('login-tabs');
        const tabs = document.querySelectorAll('.login-tab');
        const loginTitle = document.getElementById('login-title');
        const passwordGroup = document.getElementById('password-group');
        const newPasswordGroup = document.getElementById('new-password-group');
        const phoneInput = document.getElementById('phone-input');
        const passwordInput = document.getElementById('password-input');
        const newPasswordInput = document.getElementById('new-password-input');
        const submitBtn = document.getElementById('submit-btn');
        const verifyBtn = document.getElementById('verify-btn');
        const forgotBtn = document.getElementById('forgot-btn');
        const changeNumberBtn = document.getElementById('change-number-btn');
        const backToLoginBtn = document.getElementById('back-to-login-btn');
        const errorContainer = document.getElementById('form-error');
        const signupPrompt = document.getElementById('signup-prompt');
        const otpInputs = document.querySelectorAll('.otp-input');

        let currentMethod = 'OTP';
        let currentStep = 'INPUT';

        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                currentMethod = this.dataset.method;
                currentStep = 'INPUT';
                hideError();
                updateUI();
            });
        });

        // Phone input formatting
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
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

        // Forgot password
        forgotBtn.addEventListener('click', function() {
            currentMethod = 'RESET';
            currentStep = 'INPUT';
            hideError();
            updateUI();
        });

        // Change number
        changeNumberBtn.addEventListener('click', function() {
            currentStep = 'INPUT';
            hideError();
            clearOtpInputs();
            updateUI();
        });

        // Back to login after reset
        backToLoginBtn.addEventListener('click', function() {
            currentMethod = 'PASSWORD';
            currentStep = 'INPUT';
            hideError();
            updateUI();
        });

        // Login form submit
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const phone = phoneInput.value;
            if (phone.length !== 10) {
                showError('Mobile number must be exactly 10 digits.');
                return;
            }

            setLoading(submitBtn, true);
            hideError();

            try {
                if (currentMethod === 'OTP') {
                    const resp = await fetch(`${API_BASE_URL}/auth/send-otp-login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone })
                    });
                    const data = await resp.json();
                    
                    if (data.status === 'otp_sent' || data.status === 'success') {
                        currentStep = 'VERIFY';
                        clearOtpInputs();
                        updateUI();
                    } else {
                        if (data.error === 'not_registered') {
                            showError('This mobile number is not registered.', true);
                        } else {
                            showError(data.message || data.error || 'Failed to send OTP.');
                        }
                    }
                } else if (currentMethod === 'PASSWORD') {
                    const password = passwordInput.value;
                    const resp = await fetch(`${API_BASE_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone, password })
                    });
                    const data = await resp.json();
                    
                    if (data.token) {
                        setAuthCookie(data.token);
                        window.location.href = '/dashboard';
                    } else {
                        showError(data.message || data.error || 'Incorrect login details.');
                    }
                } else if (currentMethod === 'RESET') {
                    const resp = await fetch(`${API_BASE_URL}/auth/send-otp-reset`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone })
                    });
                    const data = await resp.json();
                    
                    if (data.status === 'otp_sent' || data.status === 'success') {
                        currentStep = 'VERIFY';
                        clearOtpInputs();
                        updateUI();
                    } else {
                        showError(data.message || data.error || 'Reset request failed.');
                    }
                }
            } catch (err) {
                showError('Network error. Please try again.');
            } finally {
                setLoading(submitBtn, false);
            }
        });

        // OTP form submit
        otpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const otp = getOtpValue();
            if (otp.length < 6) {
                showError('Please enter the full 6-digit OTP.');
                return;
            }

            if (currentMethod === 'RESET' && newPasswordInput.value.length < 6) {
                showError('New password must be at least 6 characters.');
                return;
            }

            setLoading(verifyBtn, true);
            hideError();

            try {
                if (currentMethod === 'RESET') {
                    const resp = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            phone: phoneInput.value, 
                            otp, 
                            password: newPasswordInput.value 
                        })
                    });
                    const data = await resp.json();
                    
                    if (data.status === 'password_reset' || data.status === 'success') {
                        if (data.token) setAuthCookie(data.token);
                        currentStep = 'SUCCESS';
                        updateUI();
                    } else {
                        showError(data.message || data.error || 'Failed to update password.');
                    }
                } else {
                    const resp = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            phone: phoneInput.value, 
                            otp, 
                            purpose: 'login' 
                        })
                    });
                    const data = await resp.json();
                    
                    if (data.verified) {
                        if (data.token) setAuthCookie(data.token);
                        window.location.href = '/dashboard';
                    } else {
                        showError(data.message || 'Incorrect OTP entered.');
                    }
                }
            } catch (err) {
                showError('Verification failed.');
            } finally {
                setLoading(verifyBtn, false);
            }
        });

        function updateUI() {
            // Update tabs
            tabs.forEach(tab => {
                if (tab.dataset.method === currentMethod || 
                    (currentMethod === 'RESET' && tab.dataset.method === 'PASSWORD')) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            // Update title
            if (currentStep === 'SUCCESS') {
                loginTitle.textContent = 'Reset Done';
            } else if (currentMethod === 'RESET') {
                loginTitle.textContent = 'Reset Password';
            } else {
                loginTitle.textContent = 'Sign In';
            }

            // Show/hide tabs
            if (currentMethod === 'RESET' || currentStep === 'SUCCESS') {
                loginTabs.classList.add('hidden');
            } else {
                loginTabs.classList.remove('hidden');
            }

            // Show/hide password field
            if (currentMethod === 'PASSWORD' && currentStep === 'INPUT') {
                passwordGroup.classList.remove('hidden');
            } else {
                passwordGroup.classList.add('hidden');
            }

            // Show/hide new password field
            if (currentMethod === 'RESET' && currentStep === 'VERIFY') {
                newPasswordGroup.classList.remove('hidden');
            } else {
                newPasswordGroup.classList.add('hidden');
            }

            // Update submit button text
            if (currentMethod === 'PASSWORD') {
                submitBtn.textContent = 'Sign In';
            } else {
                submitBtn.textContent = 'Send OTP';
            }

            // Show correct form/view
            if (currentStep === 'INPUT') {
                loginForm.classList.remove('hidden');
                otpForm.classList.add('hidden');
                successView.classList.add('hidden');
            } else if (currentStep === 'VERIFY') {
                loginForm.classList.add('hidden');
                otpForm.classList.remove('hidden');
                successView.classList.add('hidden');
                otpInputs[0].focus();
            } else if (currentStep === 'SUCCESS') {
                loginForm.classList.add('hidden');
                otpForm.classList.add('hidden');
                successView.classList.remove('hidden');
            }
        }

        function showError(message, showSignup = false) {
            const span = errorContainer.querySelector('span');
            span.textContent = message;
            errorContainer.classList.remove('hidden');
            errorContainer.classList.add('animate-shake');
            setTimeout(() => errorContainer.classList.remove('animate-shake'), 500);
            
            if (showSignup) {
                signupPrompt.classList.remove('hidden');
            } else {
                signupPrompt.classList.add('hidden');
            }
        }

        function hideError() {
            errorContainer.classList.add('hidden');
            signupPrompt.classList.add('hidden');
        }

        function setLoading(button, isLoading) {
            button.disabled = isLoading;
            if (isLoading) {
                button.innerHTML = '<span class="loading-spinner"><span class="spinner"></span><span>Processing...</span></span>';
            } else {
                button.textContent = button === submitBtn 
                    ? (currentMethod === 'PASSWORD' ? 'Sign In' : 'Send OTP')
                    : 'Verify OTP';
            }
        }

        function getOtpValue() {
            return Array.from(otpInputs).map(input => input.value).join('');
        }

        function clearOtpInputs() {
            otpInputs.forEach(input => input.value = '');
        }

        function setAuthCookie(token) {
            document.cookie = `sm_token=${token}; max-age=2592000; path=/; SameSite=Lax`;
        }

        // Initialize
        updateUI();
    });
    </script>
</body>
</html>
