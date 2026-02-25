import { authService } from '../api/auth.js';

export const registerView = {
    template: `
        <!-- Card Based Split Layout -->
        <div class="auth-split-wrapper" style="max-height: 90vh;">
             <!-- Form Side (Left) -->
            <div class="auth-form-side" style="padding: 2rem; overflow-y: auto;">
                <div class="auth-form-container">
                    <div style="margin-bottom:1rem; font-weight:700; color:#1b5e20; font-size:1.2rem;">
                        <i class="fas fa-leaf"></i> Farmer2Home
                    </div>
                    
                    <div class="auth-header" style="text-align:left;">
                        <h2 style="font-size:1.5rem; margin-bottom:0;">Welcome</h2>
                        <h1 style="color:#1b5e20; font-size:2rem; margin-bottom:0.5rem;">Sign Up</h1>
                    </div>
                    
                    <form id="register-form">
                        <div class="form-group" style="margin-bottom: 0.75rem;">
                             <label style="margin-bottom: 0.25rem;">Full Name</label>
                            <input type="text" id="name" placeholder="John Doe" required style="padding: 0.6rem 1rem; margin-bottom:0;">
                        </div>
                        <div class="form-group" style="margin-bottom: 0.75rem;">
                             <label style="margin-bottom: 0.25rem;">Email Address</label>
                            <input type="email" id="email" placeholder="name@example.com" required style="padding: 0.6rem 1rem; margin-bottom:0;">
                        </div>
                        <div class="form-group" style="margin-bottom: 0.75rem;">
                             <label style="margin-bottom: 0.25rem;">Password</label>
                            <input type="password" id="password" placeholder="Create password" required style="padding: 0.6rem 1rem; margin-bottom:0;">
                        </div>
                        
                         <div class="form-group" style="margin-bottom: 1rem;">
                             <label style="margin-bottom: 0.25rem;">I want to...</label>
                             <select id="role" required style="padding: 0.6rem 1rem; margin-bottom:0;">
                                <option value="" disabled selected>Select Role</option>
                                <option value="customer">Buy Fresh Produce</option>
                                <option value="farmer">Sell My Crops</option>
                            </select>
                        </div>

                        <button type="submit" class="btn-primary" style="width:100%; padding: 0.75rem;">Create Account</button>
                        
                        <p class="text-center mt-2" style="text-align:center; margin-top:1rem; font-size:0.9rem; color:#666;">
                            Already have an account? <a href="#/login" style="color:#1b5e20; font-weight:600;">Log In</a>
                        </p>
                    </form>
                     <div id="error-msg" class="text-center mt-2" style="color:#ff5252; text-align:left;"></div>
                </div>
            </div>

            <!-- Image Side (Right) -->
            <div class="auth-image-side register-side-bg">
                <div class="auth-overlay-content">
                    <h3>Join our Community</h3>
                    <p>Connect directly with local farmers and get the best quality produce!</p>
                </div>
            </div>
        </div>
    `,
    init: () => {
        const form = document.getElementById('register-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            const errorMsg = document.getElementById('error-msg');

            try {
                await authService.register({ name, email, password, role });
                window.location.hash = `#/verify-email?email=${email}`;
            } catch (error) {
                errorMsg.textContent = error.message;
            }
        });
    }
};
