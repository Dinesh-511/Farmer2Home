import { authService } from '../api/auth.js';

export const verifyResetOtpView = {
    template: `
        <div class="auth-split-wrapper">
            <div class="auth-form-side">
                <div class="auth-form-container">
                    <div style="margin-bottom:2rem; font-weight:700; color:#1b5e20; font-size:1.2rem;">
                        <i class="fas fa-leaf"></i> Farmer2Home
                    </div>
                    
                    <div class="auth-header" style="text-align:left;">
                        <h2>Verify Code</h2>
                        <h1 style="color:#1b5e20; font-size:2.5rem; margin-bottom:0.5rem;">Enter OTP</h1>
                        <p style="color:#666; margin-bottom:1.5rem;">Please enter the 6-digit code sent to your email.</p>
                    </div>
                    
                    <form id="verify-otp-form">
                        <div class="form-group">
                            <label>6-Digit OTP</label>
                            <input type="text" id="otp" placeholder="123456" maxlength="6" pattern="\\d{6}" required style="letter-spacing: 0.5rem; text-align: center; font-size: 1.5rem;">
                        </div>
                        
                        <button type="submit" class="btn-primary" style="width:100%;">Verify OTP</button>
                        
                        <p class="text-center mt-2" style="text-align:center; margin-top:1.5rem; font-size:0.9rem; color:#666;">
                            Didn't receive the code? <a href="#/forgot-password" style="color:#1b5e20; font-weight:600;">Resend OTP</a>
                        </p>
                    </form>
                    <div id="error-msg" class="text-center mt-2" style="color:#ff5252; text-align:left;"></div>
                    <div id="success-msg" class="text-center mt-2" style="color:#2e7d32; text-align:left;"></div>
                </div>
            </div>

            <div class="auth-image-side login-side-bg">
                <div class="auth-overlay-content">
                    <h3>One last step</h3>
                    <p>Enter the verification code to proceed with resetting your password.</p>
                </div>
            </div>
        </div>
    `,
    init: () => {
        const email = localStorage.getItem('resetEmail');
        if (!email) {
            window.location.hash = '#/forgot-password';
            return;
        }

        const form = document.getElementById('verify-otp-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const otp = document.getElementById('otp').value;
            const errorMsg = document.getElementById('error-msg');
            const successMsg = document.getElementById('success-msg');
            const submitBtn = form.querySelector('button');

            errorMsg.textContent = '';
            successMsg.textContent = '';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Verifying...';

            try {
                await authService.verifyResetOtp(email, otp);
                successMsg.textContent = 'OTP verified! Redirecting...';
                // Store OTP for next step
                localStorage.setItem('resetOtp', otp);
                setTimeout(() => {
                    window.location.hash = '#/reset-password';
                }, 2000);
            } catch (error) {
                errorMsg.textContent = error.message;
                submitBtn.disabled = false;
                submitBtn.textContent = 'Verify OTP';
            }
        });
    }
};
