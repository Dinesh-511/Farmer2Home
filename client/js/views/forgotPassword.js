import { authService } from '../api/auth.js';

export const forgotPasswordView = {
    template: `
        <div class="auth-split-wrapper">
            <div class="auth-form-side">
                <div class="auth-form-container">
                    <div style="margin-bottom:2rem; font-weight:700; color:#1b5e20; font-size:1.2rem;">
                        <i class="fas fa-leaf"></i> Farmer2Home
                    </div>
                    
                    <div class="auth-header" style="text-align:left;">
                        <h2>Recover Access</h2>
                        <h1 style="color:#1b5e20; font-size:2.5rem; margin-bottom:0.5rem;">Forgot Password</h1>
                        <p style="color:#666; margin-bottom:1.5rem;">Enter your email and we'll send you an OTP to reset your password.</p>
                    </div>
                    
                    <form id="forgot-password-form">
                        <div class="form-group">
                            <label>Your Email</label>
                            <input type="email" id="email" placeholder="name@example.com" required>
                        </div>
                        
                        <button type="submit" class="btn-primary" style="width:100%;">Send OTP</button>
                        
                        <p class="text-center mt-2" style="text-align:center; margin-top:1.5rem; font-size:0.9rem; color:#666;">
                            Remembered your password? <a href="#/login" style="color:#1b5e20; font-weight:600;">Back to Login</a>
                        </p>
                    </form>
                    <div id="error-msg" class="text-center mt-2" style="color:#ff5252; text-align:left;"></div>
                    <div id="success-msg" class="text-center mt-2" style="color:#2e7d32; text-align:left;"></div>
                </div>
            </div>

            <div class="auth-image-side login-side-bg">
                <div class="auth-overlay-content">
                    <h3>Secure Your Account</h3>
                    <p>We'll help you get back to the freshest marketplace in no time.</p>
                </div>
            </div>
        </div>
    `,
    init: () => {
        const form = document.getElementById('forgot-password-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const errorMsg = document.getElementById('error-msg');
            const successMsg = document.getElementById('success-msg');
            const submitBtn = form.querySelector('button');

            errorMsg.textContent = '';
            successMsg.textContent = '';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                await authService.forgotPassword(email);
                successMsg.textContent = 'OTP sent to your email. Redirecting...';
                // Store email for next steps
                localStorage.setItem('resetEmail', email);
                setTimeout(() => {
                    window.location.hash = '#/verify-reset-otp';
                }, 2000);
            } catch (error) {
                errorMsg.textContent = error.message;
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send OTP';
            }
        });
    }
};
