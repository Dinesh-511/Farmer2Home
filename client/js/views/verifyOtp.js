
import { orderService } from '../api/orders.js';

export const verifyOtpView = {
    template: `
        <div class="container" style="display: flex; justify-content: center; align-items: center; min-height: 80vh;">
            <div class="auth-container" style="max-width: 500px; width: 100%;">
                <div class="card">
                    <div class="auth-header">
                         <h2>Verify Delivery</h2>
                         <p>Enter the 4-digit OTP provided by the customer to confirm delivery.</p>
                    </div>
                    <form id="verify-otp-form">
                        <div class="form-group">
                            <label>Order ID</label>
                            <input type="text" id="orderId" readonly style="background: #f5f5f5; color: #757575;">
                        </div>
                        <div class="form-group">
                            <label>OTP Code</label>
                            <input type="text" id="otp" placeholder="e.g. 1234" required maxlength="4" pattern="[0-9]{4}" style="letter-spacing: 5px; font-size: 1.5rem; text-align: center;">
                        </div>

                        <div style="display: flex; gap: 1rem;">
                            <button type="submit" class="btn-primary" style="flex: 1;">Verify & Complete</button>
                            <a href="#/dashboard" class="btn-secondary" style="text-decoration:none; text-align:center;">Cancel</a>
                        </div>
                    </form>
                    <div id="msg" class="text-center mt-2"></div>
                </div>
            </div>
        </div>
    `,
    init: () => {
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const orderIdFromUrl = window.location.hash.split('/')[2]; // e.g. #/verify-otp/ORDER_ID

        // Handle route param or query param if needed, but router handles #/verify-otp/:id better
        // For simplicity let's assume route is /verify-otp/:id

        const orderIdInput = document.getElementById('orderId');
        if (orderIdFromUrl) {
            orderIdInput.value = orderIdFromUrl;
        }

        const form = document.getElementById('verify-otp-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const orderId = document.getElementById('orderId').value;
            const otp = document.getElementById('otp').value;
            const msg = document.getElementById('msg');

            try {
                await orderService.verifyOtp(orderId, otp);

                // ── Centered Success Popup ──────────────────────────
                if (window.notifier && window.notifier.alert) {
                    await window.notifier.alert('Delivery Verified!', 'The order has been marked as delivered successfully.', 'success');
                    window.location.hash = '#/dashboard';
                } else {
                    msg.innerHTML = '<p style="color:var(--success)">Delivery Verified Successfully!</p>';
                    setTimeout(() => {
                        window.location.hash = '#/dashboard';
                    }, 1500);
                }
            } catch (error) {
                msg.innerHTML = `
                    <p style="color:var(--danger)">${error.message}</p>
                    ${error.message.toLowerCase().includes('expired') || error.message.toLowerCase().includes('invalid') ?
                        `<button id="resend-otp-btn" class="btn-secondary" style="margin-top: 1rem; width: 100%; border-color: var(--primary-color); color: var(--primary-color);">Resend New OTP to Customer</button>` : ''}
                `;

                const resendBtn = document.getElementById('resend-otp-btn');
                if (resendBtn) {
                    resendBtn.onclick = async () => {
                        resendBtn.disabled = true;
                        resendBtn.textContent = 'Sending...';
                        try {
                            await orderService.resendOtp(orderId);
                            window.notifier.showToast('New OTP sent to customer email');
                            resendBtn.textContent = 'OTP Resent ✅';
                        } catch (err) {
                            window.notifier.showToast('Failed to resend: ' + err.message, 'error');
                            resendBtn.disabled = false;
                            resendBtn.textContent = 'Resend New OTP to Customer';
                        }
                    };
                }
            }
        });
    }
};
