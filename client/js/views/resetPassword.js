import { authService } from '../api/auth.js';

export const resetPasswordView = {
    template: `
        <div class="auth-split-wrapper">
            <div class="auth-form-side">
                <div class="auth-form-container">
                    <div style="margin-bottom:2rem; font-weight:700; color:#1b5e20; font-size:1.2rem;">
                        <i class="fas fa-leaf"></i> Farmer2Home
                    </div>
                    
                    <div class="auth-header" style="text-align:left;">
                        <h2>Step Final</h2>
                        <h1 style="color:#1b5e20; font-size:2.5rem; margin-bottom:0.5rem;">New Password</h1>
                        <p style="color:#666; margin-bottom:1.5rem;">Set a strong password to protect your account.</p>
                    </div>
                    
                    <form id="reset-password-form">
                        <div class="form-group">
                            <label>New Password</label>
                            <input type="password" id="password" placeholder="Min 6 characters" minlength="6" required>
                        </div>
                        <div class="form-group">
                            <label>Confirm Password</label>
                            <input type="password" id="confirm-password" placeholder="Repeat password" minlength="6" required>
                        </div>
                        
                        <button type="submit" class="btn-primary" style="width:100%;">Reset Password</button>
                    </form>
                    <div id="error-msg" class="text-center mt-2" style="color:#ff5252; text-align:left;"></div>
                    <div id="success-msg" class="text-center mt-2" style="color:#2e7d32; text-align:left;"></div>
                </div>
            </div>

            <div class="auth-image-side login-side-bg">
                <div class="auth-overlay-content">
                    <h3>Safety First</h3>
                    <p>Changing your password regularly helps keep your account and data secure.</p>
                </div>
            </div>
        </div>
    `,
    init: () => {
        const email = localStorage.getItem('resetEmail');
        const otp = localStorage.getItem('resetOtp');

        if (!email || !otp) {
            window.location.hash = '#/forgot-password';
            return;
        }

        const form = document.getElementById('reset-password-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorMsg = document.getElementById('error-msg');
            const successMsg = document.getElementById('success-msg');
            const submitBtn = form.querySelector('button');

            if (password !== confirmPassword) {
                errorMsg.textContent = 'Passwords do not match';
                return;
            }

            errorMsg.textContent = '';
            successMsg.textContent = '';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Resetting...';

            try {
                await authService.resetPassword(email, otp, password);
                successMsg.textContent = 'Password reset successful! Redirecting to login...';

                // Clear reset data
                localStorage.removeItem('resetEmail');
                localStorage.removeItem('resetOtp');

                setTimeout(() => {
                    window.location.hash = '#/login';
                }, 2000);
            } catch (error) {
                errorMsg.textContent = error.message;
                submitBtn.disabled = false;
                submitBtn.textContent = 'Reset Password';
            }
        });
    }
};
