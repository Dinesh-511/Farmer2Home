import { authService } from '../api/auth.js';

export const verifyEmailView = {
    template: `
        <div class="container" style="display: flex; justify-content: center; align-items: center; min-height: 80vh;">
            <div class="auth-container" style="max-width: 500px; width: 100%;">
                <div class="card">
                    <div class="auth-header">
                         <h2>Verify Your Email</h2>
                         <p>We've sent a 6-digit OTP to your email. Enter it below to activate your account.</p>
                    </div>
                    <form id="verify-email-form">
                        <div class="form-group">
                            <label>Email Address</label>
                            <input type="email" id="email" readonly style="background: #f5f5f5; color: #757575;">
                        </div>
                        <div class="form-group">
                            <label>OTP Code</label>
                            <input type="text" id="otp" placeholder="123456" required maxlength="6" pattern="[0-9]{6}" style="letter-spacing: 5px; font-size: 1.5rem; text-align: center;">
                        </div>

                        <button type="submit" class="btn-primary" style="width: 100%;">Verify Email</button>
                        
                        <div style="margin-top: 1rem; text-align: center;">
                            <button type="button" id="resend-btn" class="btn-secondary" style="background: transparent; border: none; color: var(--primary-color); cursor: pointer;">Resend OTP</button>
                        </div>
                    </form>
                    <div id="msg" class="text-center mt-2"></div>
                </div>
            </div>
        </div>
    `,
    init: () => {
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const emailFromUrl = urlParams.get('email');

        const emailInput = document.getElementById('email');
        if (emailFromUrl) {
            emailInput.value = emailFromUrl;
        }

        const form = document.getElementById('verify-email-form');
        const msg = document.getElementById('msg');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value;
            const otp = document.getElementById('otp').value;

            msg.innerHTML = '<p>Verifying...</p>';

            try {
                const response = await authService.verifyEmail(email, otp);
                msg.innerHTML = `<p style="color:var(--success)">${response.message}</p>`;

                // Store token if returned (auto-login)
                if (response.token) {
                    localStorage.setItem('user', JSON.stringify(response));
                }

                setTimeout(() => {
                    window.location.hash = '#/dashboard';
                    window.location.reload(); // To update nav
                }, 1500);
            } catch (error) {
                msg.innerHTML = `<p style="color:var(--danger)">${error.message}</p>`;
            }
        });

        const resendBtn = document.getElementById('resend-btn');
        resendBtn.addEventListener('click', async () => {
            const email = emailInput.value;
            if (!email) {
                msg.innerHTML = `<p style="color:var(--danger)">Email is missing.</p>`;
                return;
            }

            resendBtn.disabled = true;
            resendBtn.textContent = 'Sending...';

            try {
                await authService.resendOtp(email);
                msg.innerHTML = `<p style="color:var(--success)">New OTP sent to your email.</p>`;
            } catch (error) {
                msg.innerHTML = `<p style="color:var(--danger)">${error.message}</p>`;
            } finally {
                resendBtn.disabled = false;
                resendBtn.textContent = 'Resend OTP';
            }
        });
    }
};
