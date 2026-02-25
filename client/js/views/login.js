import { authService } from '../api/auth.js';

export const loginView = {
    template: `
        <!-- Card Based Split Layout -->
        <div class="auth-split-wrapper">
             <!-- Form Side (Left) -->
            <div class="auth-form-side">
                <div class="auth-form-container">
                    <div style="margin-bottom:2rem; font-weight:700; color:#1b5e20; font-size:1.2rem;">
                        <i class="fas fa-leaf"></i> Farmer2Home
                    </div>
                    
                    <div class="auth-header" style="text-align:left;">
                        <h2>Welcome</h2>
                        <h1 style="color:#1b5e20; font-size:2.5rem; margin-bottom:0.5rem;">Log In</h1>
                    </div>
                    
                    <form id="login-form">
                        <div class="form-group">
                            <label>Your Email</label>
                            <input type="email" id="email" placeholder="name@example.com" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="password" placeholder="Enter password" required>
                        </div>
                        
                        <div class="auth-actions">
                             <a href="#/forgot-password" style="font-size:0.85rem; color:#2e7d32;">Forgot your password?</a>
                        </div>

                        <button type="submit" class="btn-primary" style="width:100%;">Log In</button>
                        
                        <p class="text-center mt-2" style="text-align:center; margin-top:1.5rem; font-size:0.9rem; color:#666;">
                            Don't have an account? <a href="#/register" style="color:#1b5e20; font-weight:600;">Sign up</a>
                        </p>
                    </form>
                     <div id="error-msg" class="text-center mt-2" style="color:#ff5252; text-align:left;"></div>
                </div>
            </div>

            <!-- Image Side (Right) -->
            <div class="auth-image-side login-side-bg">
                <div class="auth-overlay-content">
                    <h3>Get the best premium food</h3>
                    <p>You can get the best premium food with the best price only in HERE!</p>
                </div>
            </div>
        </div>
    `,
    init: () => {
        const form = document.getElementById('login-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('error-msg');

            try {
                await authService.login({ email, password });
                window.location.hash = '#/dashboard';
            } catch (error) {
                errorMsg.textContent = error.message;
            }
        });
    }
};
