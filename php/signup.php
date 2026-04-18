<?php
$pageTitle = "Create Account | StockMunch Free Trial";
$pageDescription = "Sign up for StockMunch and get access to real-time stock market alerts, professional trading terminal, and AI-powered market analysis. Start your 30-day free trial today.";
require_once dirname(__DIR__) . '/includes/config.php';

// If already logged in, redirect to dashboard
if (isLoggedIn()) {
    header('Location: /dashboard/');
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
                <h1 id="signup-title">Create Account</h1>
                <p id="plan-display" class="text-sm text-slate-400 mt-2"></p>
            </div>

            <div id="form-error" class="form-error hidden">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span></span>
            </div>

            <!-- Step 1: Phone Input -->
            <form id="phone-form" class="space-y-8">
                <div id="plan-badge" class="plan-badge">
                    <span class="plan-name"></span>
                        <button type="button" class="change-plan-btn" onclick="window.location.href='/#pricing'; return false;">Change</button>                    </div>

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
                <button type="submit" id="phone-submit-btn" class="btn btn-primary btn-full">
                    Send OTP
                </button>

                <!-- Divider -->
                <div class="divider-container">
                    <span class="divider-text">Or</span>
                </div>

                <!-- Google Sign-In Button -->
                <button type="button" id="google-signup-btn" class="btn btn-google btn-full">
                    <svg class="google-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>

                <div class="text-center">
                    <p class="text-slate-400 text-sm">Already have an account? <a href="/login" class="text-emerald-600 hover:text-emerald-500 font-semibold">Sign In</a></p>
                </div>
            </form>

            <!-- Step 2: OTP Verification -->
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

                <div class="space-y-4">
                    <button type="submit" id="otp-submit-btn" class="btn btn-primary btn-full">
                        Verify OTP
                    </button>
                    <button type="button" id="change-phone-btn" class="change-number-btn">
                        Change Number
                    </button>
                </div>
            </form>

            <!-- Step 3: Profile Setup -->
            <form id="profile-form" class="space-y-8 hidden">
                <div class="form-group">
                    <label class="form-label">Full Name*</label>
                    <input 
                        type="text" 
                        name="name"
                        id="name-input"
                        placeholder="John Doe"
                        class="form-input"
                    />
                </div>

                <div class="form-group">
                    <label class="form-label">Email Address*</label>
                    <input 
                        type="email" 
                        name="email"
                        id="email-input"
                        placeholder="john@example.com"
                        class="form-input"
                    />
                </div>

                <div class="form-group">
                    <label class="form-label">Password* (min 6 chars)</label>
                    <input 
                        type="password" 
                        name="password"
                        id="password-input"
                        placeholder="••••••••"
                        class="form-input"
                    />
                </div>

                <button type="submit" id="profile-submit-btn" class="btn btn-primary btn-full">
                    Create Account
                </button>
            </form>

            <!-- Step 4: Success -->
            <div id="success-view" class="login-success hidden">
                <div class="login-success-icon">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3>Account Created!</h3>
                <p>Your 30-day free trial is activated. Enjoy full access!</p>
                <button id="go-to-dashboard-btn" class="btn btn-primary btn-full">Go to Dashboard</button>
            </div>
        </div>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const API_BASE_URL = '<?php echo API_BASE_URL; ?>';
        
        // Plan mapping
        const planNames = {
            'alerts-only': 'Alerts Only - FREE',
            'dashboard-only': 'Dashboard Only - FREE',
            'alerts-dashboard': 'Alerts + Dashboard - FREE'
        };

        // Map plan IDs like React component
        const getMappedPlanId = (pid) => {
            switch (pid) {
                case 'alerts-only': return 'ALERT';
                case 'dashboard-only': return 'DASHBOARD';
                case 'alerts-dashboard': return 'ALERT_DASH';
                default: return 'ALERT';
            }
        };
        
        // Get plan from URL parameter, default to 'alerts-dashboard'
        const urlParams = new URLSearchParams(window.location.search);
        const planId = urlParams.get('plan') || 'alerts-dashboard';
        const planName = planNames[planId] || 'Free Plan';
        const mappedPlanId = getMappedPlanId(planId);
        
        // Form elements
        const phoneForm = document.getElementById('phone-form');
        const otpForm = document.getElementById('otp-form');
        const profileForm = document.getElementById('profile-form');
        const successView = document.getElementById('success-view');
        
        // Title
        const signupTitle = document.getElementById('signup-title');
        const planDisplay = document.getElementById('plan-display');
        const planBadge = document.getElementById('plan-badge');
        const planBadgeName = planBadge.querySelector('.plan-name');
        
        // Display selected plan
        planDisplay.textContent = `Plan: ${planName}`;
        planBadgeName.textContent = planName;
        
        // Phone step
        const phoneInput = document.getElementById('phone-input');
        const phoneSubmitBtn = document.getElementById('phone-submit-btn');
        
        // OTP step
        const otpInputs = document.querySelectorAll('.otp-input');
        const otpSubmitBtn = document.getElementById('otp-submit-btn');
        const changePhoneBtn = document.getElementById('change-phone-btn');
        
        // Profile step
        const nameInput = document.getElementById('name-input');
        const emailInput = document.getElementById('email-input');
        const passwordInput = document.getElementById('password-input');
        const profileSubmitBtn = document.getElementById('profile-submit-btn');
        
        // Dashboard
        const goToDashboardBtn = document.getElementById('go-to-dashboard-btn');
        
        // Error
        const errorContainer = document.getElementById('form-error');

        let currentStep = 'PHONE';
        let userPhone = '';

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

        // Change phone
        changePhoneBtn.addEventListener('click', function() {
            currentStep = 'PHONE';
            hideError();
            clearOtpInputs();
            updateUI();
        });

        // Go to dashboard
        goToDashboardBtn.addEventListener('click', function() {
            window.location.href = '/dashboard/';
        });

        // Phone form submit
        phoneForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const phone = phoneInput.value;
            if (phone.length !== 10) {
                showError('Mobile number must be exactly 10 digits.');
                return;
            }

            setLoading(phoneSubmitBtn, true);
            hideError();

            try {
                const resp = await fetch(`${API_BASE_URL}/auth/send-otp-signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone })
                });
                const data = await resp.json();
                
                if (data.status === 'otp_sent' || data.status === 'success') {
                    userPhone = phone;
                    currentStep = 'OTP';
                    clearOtpInputs();
                    updateUI();
                    otpInputs[0].focus();
                } else {
                    if (data.error === 'user_exists' || data.error === 'already_exists') {
                        showError('This mobile number is already registered. <a href="/login" style="color: #4ade80;">Sign in instead</a>');
                    } else {
                        showError(data.message || data.error || 'Failed to send OTP.');
                    }
                }
            } catch (err) {
                showError('Network error. Please try again.');
            } finally {
                setLoading(phoneSubmitBtn, false);
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

            setLoading(otpSubmitBtn, true);
            hideError();

            try {
                const resp = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        phone: userPhone, 
                        otp,
                        purpose: 'signup'
                    })
                });
                const data = await resp.json();
                
                if (data.verified || data.status === 'success') {
                    if (data.token) setAuthCookie(data.token);
                    currentStep = 'PROFILE';
                    updateUI();
                    nameInput.focus();
                } else {
                    showError(data.message || 'Incorrect OTP entered.');
                }
            } catch (err) {
                showError('Verification failed.');
            } finally {
                setLoading(otpSubmitBtn, false);
            }
        });

        // Profile form submit
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!name || name.length < 2) {
                showError('Please enter your full name.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('Please provide a valid email address.');
                return;
            }

            if (password.length < 6) {
                showError('Password must be at least 6 characters.');
                return;
            }

            setLoading(profileSubmitBtn, true);
            hideError();

            try {
                const resp = await fetch(`${API_BASE_URL}/auth/set-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        phone: userPhone, 
                        password,
                        name,
                        email,
                        plan_id: mappedPlanId
                    })
                });
                const data = await resp.json();
                
                if (data.status === 'password_set' || data.status === 'success' || data.verified) {
                    if (data.token) setAuthCookie(data.token);
                    currentStep = 'SUCCESS';
                    updateUI();
                } else {
                    showError(data.message || data.error || 'Failed to create account.');
                }
            } catch (err) {
                showError('Network error. Please try again.');
            } finally {
                setLoading(profileSubmitBtn, false);
            }
        });

        function updateUI() {
            // Update title
            switch(currentStep) {
                case 'OTP':
                    signupTitle.textContent = 'Verify Phone';
                    break;
                case 'PROFILE':
                    signupTitle.textContent = 'Complete Profile';
                    break;
                case 'SUCCESS':
                    signupTitle.textContent = 'Welcome!';
                    break;
                default:
                    signupTitle.textContent = 'Create Account';
            }

            // Show correct form
            phoneForm.classList.toggle('hidden', currentStep !== 'PHONE');
            otpForm.classList.toggle('hidden', currentStep !== 'OTP');
            profileForm.classList.toggle('hidden', currentStep !== 'PROFILE');
            successView.classList.toggle('hidden', currentStep !== 'SUCCESS');
        }

        function showError(message) {
            const span = errorContainer.querySelector('span');
            span.innerHTML = message;
            errorContainer.classList.remove('hidden');
            errorContainer.classList.add('animate-shake');
            setTimeout(() => errorContainer.classList.remove('animate-shake'), 500);
        }

        function hideError() {
            errorContainer.classList.add('hidden');
        }

        function setLoading(button, isLoading) {
            button.disabled = isLoading;
            if (isLoading) {
                button.innerHTML = '<span class="loading-spinner"><span class="spinner"></span><span>Processing...</span></span>';
            } else {
                if (button === phoneSubmitBtn) {
                    button.textContent = 'Send OTP';
                } else if (button === otpSubmitBtn) {
                    button.textContent = 'Verify OTP';
                } else if (button === profileSubmitBtn) {
                    button.textContent = 'Create Account';
                }
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

    <!-- Google Sign-In SDK -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const GOOGLE_CLIENT_ID = '<?php echo GOOGLE_CLIENT_ID; ?>';
        const API_BASE_URL = '<?php echo API_BASE_URL; ?>';
        
        const googleSignupBtn = document.getElementById('google-signup-btn');
        
        if (googleSignupBtn) {
            googleSignupBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                
                // Initialize Google Sign-In
                google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleSignUp
                });
                
                // Trigger the OAuth flow
                google.accounts.id.renderButton(
                    document.createElement('div'),
                    { theme: 'outline', size: 'large' }
                );
                
                google.accounts.id.prompt();
            });
        }
        
        async function handleGoogleSignUp(response) {
            if (!response.credential) {
                console.error('No credential received from Google');
                return;
            }
            
            try {
                // Call unified Google sign-in endpoint
                const apiResponse = await fetch(`${API_BASE_URL}/auth/google-signin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        google_token: response.credential
                    })
                });
                
                const data = await apiResponse.json();
                
                if (apiResponse.ok && data.status === 'success') {
                    // Set auth token
                    document.cookie = `sm_token=${data.token}; max-age=2592000; path=/; SameSite=Lax`;
                    
                    if (data.is_new_user) {
                        // New user - redirect to complete profile or dashboard
                        setTimeout(() => {
                            window.location.href = '/dashboard/';
                        }, 500);
                    } else {
                        // Existing user - redirect to dashboard
                        setTimeout(() => {
                            window.location.href = '/dashboard/';
                        }, 500);
                    }
                } else {
                    alert(data.message || 'Sign-in failed. Please try again.');
                }
            } catch (error) {
                console.error('Google Sign-In Error:', error);
                alert('An error occurred during sign-in. Please try again.');
            }
        }
        
        // Make handleGoogleSignUp globally available
        window.handleGoogleSignUp = handleGoogleSignUp;
    });
    </script>
</body>
</html>
