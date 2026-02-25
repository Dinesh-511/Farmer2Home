import { loginView } from './views/login.js';
import { registerView } from './views/register.js';
import { dashboardView } from './views/dashboard.js';
import { addCropView } from './views/addCrop.js';
import { orderView } from './views/order.js';

import { reviewView } from './views/review.js';
import { verifyOtpView } from './views/verifyOtp.js';
import { verifyEmailView } from './views/verifyEmail.js';
import { profileView } from './views/profile.js';
import { forgotPasswordView } from './views/forgotPassword.js';
import { verifyResetOtpView } from './views/verifyResetOtp.js';
import { resetPasswordView } from './views/resetPassword.js';

const routes = {
    '/': {
        view: () => {
            const user = window.authService.getCurrentUser();
            return `
            <div class="bg-blobs">
                <div class="bg-blob blob-1"></div>
                <div class="bg-blob blob-2"></div>
                <div class="bg-blob blob-3"></div>
            </div>

            <div class="hero">
                <div class="hero-content reveal reveal-up">
                    <div class="hero-text text-center">
                        <h1 class="blur-reveal">Direct from the Roots, Delivered to Your Table</h1>
                        <p>Farmer2Home Connect bridges the gap between local farms and your kitchen. Discover peak seasonal produce, delivered with transparency and care.</p>
                        <div class="hero-btns" style="display: flex; gap: 1rem; justify-content: center;">
                            ${user ? `
                                <a href="#/dashboard" class="btn-primary magnetic-item"><span>Go to Dashboard</span></a>
                                <a href="#/profile" class="btn-secondary magnetic-item" style="border-color: white; color: white;"><span>View My Profile</span></a>
                            ` : `
                                <a href="#/dashboard" class="btn-primary magnetic-item"><span>Shop Marketplace</span></a>
                                <a href="#/register" class="btn-secondary magnetic-item" style="border-color: white; color: white;"><span>Join as Farmer</span></a>
                            `}
                        </div>
                    </div>
                </div>
            </div> <!-- End Hero -->

            <div class="container">
                <!-- Split Action Cards (Overlapping Hero) -->
                <!-- Process Section (Marketplace Logic) -->
                <div class="process-section reveal reveal-up" style="margin-top: -50px; position: relative; z-index: 10;">
                    <div class="process-steps">
                        <!-- Buying Card -->
                        <div class="step-card reveal reveal-left">
                            <div class="step-marker">01</div>
                            <h3 style="color: var(--primary-dark);">I want to Buy</h3>
                            <p style="margin-bottom: 1rem;">Consistent quality. Quick delivery.</p>
                            <ul>
                                <li>Browse Fresh Produce</li>
                                <li>Smart Quality Checks</li>
                                <li>Secure Direct Payment</li>
                                <li>Doorstep Delivery</li>
                            </ul>
                            <a href="#/dashboard" class="btn-primary" style="margin-top: 1rem; width: 100%;"><span>Browse Marketplace</span></a>
                             <!-- Decor -->
                            <div class="decor-icon" style="position: absolute; bottom: -20px; right: -20px; font-size: 8rem; opacity: 0.1;">🛒</div>
                        </div>

                        <!-- Selling Card -->
                        <div class="step-card reveal reveal-right">
                            <div class="step-marker">02</div>
                            <h3 style="color: var(--primary-color);">I want to Sell</h3>
                            <p style="margin-bottom: 1rem;">Better prices. Direct market access.</p>
                            <ul>
                                <li>List Crops Easily</li>
                                <li>Set Fixed Prices</li>
                                <li>Manage Inventory</li>
                                <li>Direct Bank Transfer</li>
                            </ul>
                            <a href="#/dashboard" class="btn-secondary" style="margin-top: 1rem; width: 100%;"><span>Start Selling</span></a>
                            <!-- Decor -->
                            <div class="decor-icon" style="position: absolute; bottom: -20px; right: -20px; font-size: 8rem; opacity: 0.05;">🚜</div>
                            <!-- Thematic Decors -->
                            <div class="thematic-decor decor-top-left" style="position: absolute; top: -30px; left: -30px; font-size: 4rem; opacity: 0.15; filter: blur(1px);">🥕</div>
                            <div class="thematic-decor decor-bottom-right" style="position: absolute; bottom: 20px; right: 20px; font-size: 3rem; opacity: 0.1; filter: blur(2px);">🥦</div>
                        </div>
                    </div>
                </div>

                <section class="mission-section reveal reveal-up" style="border-radius: 60% 41% 45% 55% / 37% 35% 65% 63%; overflow: hidden; padding: 10rem 4rem;">
                    <h2 class="font-serif blur-reveal">The Future of Food is Fast, Fresh & Sustainable</h2>
                    <p>We leverage technology to streamline the supply chain, reducing waste and ensuring that farmers get the best price while you get the freshest produce.</p>
                </section>

                <section class="why-choose-us reveal reveal-up">
                    <div class="section-header">
                        <h2>Why Choose Us</h2>
                        <p>Experience the future of agriculture with Farmer2Home Connect</p>
                        <!-- Section Decors -->
                        <div class="thematic-decor decor-1" style="position: absolute; top: 0; left: -100px; font-size: 6rem; opacity: 0.08;">🥬</div>
                        <div class="thematic-decor decor-2" style="position: absolute; bottom: 0; right: -100px; font-size: 5rem; opacity: 0.08;">🍎</div>
                    </div>
                    <div class="reasons-grid">
                        <div class="reason-card">
                            <div class="reason-icon">✅</div>
                            <h3>Fresh & Direct</h3>
                            <p>From farms to your doorstep, skipping any storage delays.</p>
                        </div>
                        <div class="reason-card">
                            <div class="reason-icon">✅</div>
                            <h3>Fair Pricing</h3>
                            <p>Direct farmer-to-buyer connection ensures better rates for all.</p>
                        </div>
                        <div class="reason-card">
                            <div class="reason-icon">✅</div>
                            <h3>Transparent System</h3>
                            <p>Know exactly who grew your food and confirm deliveries with secure OTP codes.</p>
                        </div>
                        <div class="reason-card">
                            <div class="reason-icon">✅</div>
                            <h3>Quality First</h3>
                            <p>Rigorous quality checks ensure only the best produce reaches your doorstep.</p>
                        </div>
                        <div class="reason-card">
                            <div class="reason-icon">✅</div>
                            <h3>Support Local Farmers</h3>
                            <p>Empower rural communities by buying locally and sustainably.</p>
                        </div>
                        <div class="reason-card">
                            <div class="reason-icon">✅</div>
                            <h3>Easy-to-Use Platform</h3>
                            <p>User-friendly interface designed for both farmers and buyers.</p>
                        </div>
                    </div>
                    <!-- Floating Rice/Grain Decor -->
                    <div class="thematic-decor decor-grain" style="position: absolute; bottom: -50px; left: 50%; transform: translateX(-50%); font-size: 4rem; opacity: 0.1; filter: sepia(1);">🌾</div>
                </section>

                <!-- Statistics Section Vertical Cards -->
                <section class="stats-cards-section reveal reveal-up">
                    <div class="stats-cards-container">
                        <div class="stat-item-card">
                            <div class="stat-number">100+</div>
                            <div class="stat-label">Farmers Registered</div>
                        </div>
                        <div class="stat-item-card">
                            <div class="stat-number">500+</div>
                            <div class="stat-label">Orders Delivered</div>
                        </div>
                        <div class="stat-item-card">
                            <div class="stat-number">1000+</div>
                            <div class="stat-label">Happy Customers</div>
                        </div>
                        <div class="stat-item-card">
                            <div class="stat-number">20+</div>
                            <div class="stat-label">Crop Categories</div>
                        </div>
                    </div>
                </section>

                <!-- Testimonials Section -->
                <section class="testimonials-section reveal reveal-up">
                    <div class="section-header">
                        <h2>What People Say</h2>
                        <p>Join thousands of satisfied users in the smart farming revolution</p>
                    </div>
                    <div class="testimonials-grid">
                        <div class="testimonial-card farmer-testimonial">
                            <div class="quote-icon">“</div>
                            <p class="testimonial-text">I earn better profits without middlemen. The platform is transparent and payments are reliable.</p>
                            <div class="testimonial-author">
                                <div class="author-info">
                                    <strong>Rajesh Kumar</strong>
                                    <span>Verified Farmer</span>
                                </div>
                            </div>
                        </div>
                        <div class="testimonial-card">
                            <div class="quote-icon">“</div>
                            <p class="testimonial-text">Fresh vegetables at fair price! I love knowing exactly which farm my food is coming from.</p>
                            <div class="testimonial-author">
                                <div class="author-info">
                                    <strong>Anita Desai</strong>
                                    <span>Direct Consumer</span>
                                </div>
                            </div>
                        </div>
                        <div class="testimonial-card">
                            <div class="quote-icon">“</div>
                            <p class="testimonial-text">Direct from farm quality is unbeatable. The OTP verification gives me peace of mind about my delivery.</p>
                            <div class="testimonial-author">
                                <div class="author-info">
                                    <strong>Vikram Singh</strong>
                                    <span>Regular Buyer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <footer class="modern-footer reveal reveal-up">
                    <div class="footer-content">
                        <div class="footer-brand">
                            <h3 class="footer-logo">Farmer2Home</h3>
                            <p>Bridging the gap between local farms and your kitchen with transparency and care. Ensuring fair prices for farmers and fresh produce for consumers.</p>
                            <div class="footer-social">
                                <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                                <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
                                <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                            </div>
                        </div>
                        <div class="footer-links">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="#/">Home</a></li>
                                <li><a href="#/login">Marketplace</a></li>
                                <li><a href="#/register">Join as Farmer</a></li>
                            </ul>
                        </div>
                        <div class="footer-links">
                            <h4>Legal</h4>
                            <ul>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                                <li><a href="#">Cookie Policy</a></li>
                            </ul>
                        </div>
                        <div class="footer-contact">
                            <h4>Contact Us</h4>
                            <p>Email: support@farmer2home.com</p>
                            <p>Phone: +1 234 567 8900</p>
                            <p>Address: 123 Agri-Tech Valley, CA.</p>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>&copy; 2026 Farmer2Home Connect. All rights reserved.</p>
                    </div>
                </footer>
            </div> <!-- End Container -->
            `;
        },
        init: () => {
            const reveals = document.querySelectorAll('.reveal');
            const observerOptions = {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, observerOptions);

            reveals.forEach(reveal => observer.observe(reveal));

            // Magnetic Buttons Logic
            const magnets = document.querySelectorAll('.magnetic-item');
            magnets.forEach((magnet) => {
                const text = magnet.querySelector('span');

                magnet.addEventListener('mousemove', (e) => {
                    const bounding = magnet.getBoundingClientRect();
                    const x = (e.clientX - bounding.left) - bounding.width / 2;
                    const y = (e.clientY - bounding.top) - bounding.height / 2;

                    // Ensure hovered button stays on top
                    magnet.style.zIndex = '100';

                    // Button shell movement (Magnetic)
                    magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;

                    // Suspended text movement (Magnetic Text)
                    if (text) {
                        text.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                    }
                });

                magnet.addEventListener('mouseleave', () => {
                    magnet.style.transform = 'translate(0, 0)';
                    magnet.style.zIndex = '1';
                    if (text) text.style.transform = 'translate(0, 0)';
                });
            });

            // 3D Perspective Tilt for specialized Cards
            const tiltCards = document.querySelectorAll('.step-card, .testimonial-card');
            tiltCards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const bounding = card.getBoundingClientRect();
                    const x = e.clientX - bounding.left;
                    const y = e.clientY - bounding.top;
                    const xc = bounding.width / 2;
                    const yc = bounding.height / 2;
                    const dx = x - xc;
                    const dy = y - yc;

                    // Calculate rotation (max 15 degrees)
                    const rotX = (dy / yc) * -15;
                    const rotY = (dx / xc) * 15;

                    card.style.transform = `translateY(-10px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
                });
            });

            // Headings Blur Reveal Intersection
            const headers = document.querySelectorAll('.section-header h2, .mission-section h2');
            headers.forEach(h => h.classList.add('blur-reveal'));

            // Cursor Glow Logic
            let glow = document.querySelector('.cursor-glow');
            if (!glow) {
                glow = document.createElement('div');
                glow.className = 'cursor-glow';
                document.body.appendChild(glow);
            }

            const moveGlow = (e) => {
                glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
                glow.classList.add('active');
            };

            document.addEventListener('mousemove', moveGlow);
        },
        allowAnonymous: true
    },
    '/login': {
        view: () => loginView.template,
        init: loginView.init,
        allowAnonymous: true
    },
    '/register': {
        view: () => registerView.template,
        init: registerView.init,
        allowAnonymous: true
    },
    '/dashboard': {
        view: () => dashboardView.template,
        init: dashboardView.init,
        allowAnonymous: false
    },
    '/add-crop': {
        view: () => addCropView.template,
        init: addCropView.init,
        allowAnonymous: false
    },
    '/order': { // suffix /:id handled by logic
        view: () => orderView.template,
        init: orderView.init,
        allowAnonymous: false
    },
    '/my-orders': {
        view: () => dashboardView.template,
        init: dashboardView.init,
        allowAnonymous: false
    },
    '/profile': {
        view: () => profileView.template,
        init: profileView.init,
        allowAnonymous: false
    },
    '/review': { // suffix /:id handled by logic
        view: () => reviewView.template,
        init: reviewView.init,
        allowAnonymous: false
    },
    '/verify-otp': { // suffix /:id handled by logic
        view: () => verifyOtpView.template,
        init: verifyOtpView.init,
        allowAnonymous: false
    },
    '/verify-email': {
        view: () => verifyEmailView.template,
        init: verifyEmailView.init,
        allowAnonymous: true
    },
    '/forgot-password': {
        view: () => forgotPasswordView.template,
        init: forgotPasswordView.init,
        allowAnonymous: true
    },
    '/verify-reset-otp': {
        view: () => verifyResetOtpView.template,
        init: verifyResetOtpView.init,
        allowAnonymous: true
    },
    '/reset-password': {
        view: () => resetPasswordView.template,
        init: resetPasswordView.init,
        allowAnonymous: true
    }
};

const router = async () => {
    const app = document.getElementById('app');
    let hash = window.location.hash || '#/';
    let path = hash.slice(1);



    // Logout utility: if URL has ?logout=true or #/logout
    if (path.includes('logout=true') || path === '/logout') {
        window.authService.logout();
        window.location.hash = '#/';
        return;
    }

    // Simple param handling: remove sections after / for route matching
    let routePath = path.split('?')[0];

    // Simple param handling: remove sections after / for route matching (if not using query params)
    if (routePath.includes('/') && routePath.split('/').length > 2) {
        routePath = '/' + routePath.split('/')[1];
    }

    let route = routes[routePath];

    if (!route) {
        route = routes['/'];
    }

    let user = window.authService.getCurrentUser();

    // Verify token validity with backend (Real-time approach)
    if (user && window.userService && !window.authVerified) {
        try {
            const freshUser = await window.userService.getProfile();
            user = freshUser;
            localStorage.setItem('user', JSON.stringify(freshUser));
            window.authVerified = true;
        } catch (err) {
            console.warn('Session invalid or expired. Logging out.');
            window.authService.logout();
            return;
        }
    }

    if (!route.allowAnonymous && !user) {
        window.location.hash = '#/login';
        return;
    }

    app.innerHTML = typeof route.view === 'function' ? route.view() : route.view;

    if (route.init) {
        route.init();
    }

    updateNav(user, routePath);
    updateNavbarStyle(routePath);
};

function updateNavbarStyle(path) {
    const navbar = document.querySelector('.navbar');
    if (path === '/' || path === '') {
        navbar.classList.remove('solid-nav');
    } else {
        navbar.classList.add('solid-nav');
    }

    document.body.classList.remove('auth-page-body', 'login-page-body', 'register-page-body');

    const authRoutes = ['/login', '/register', '/forgot-password', '/verify-reset-otp', '/reset-password'];

    if (path === '/login' || path === '/forgot-password' || path === '/verify-reset-otp' || path === '/reset-password') {
        document.body.classList.add('login-page-body');
        navbar.style.display = 'none';
    } else if (path === '/register') {
        document.body.classList.add('register-page-body');
        navbar.style.display = 'none';
    } else {
        navbar.style.display = 'flex';
        if (path !== '/' && path !== '') {
            navbar.classList.add('solid-nav');
        }
    }
}

function updateNav(user, path) {
    const navLinks = document.getElementById('nav-links');
    const userInfo = document.getElementById('user-info');
    const isLandingPage = (path === '/' || path === '');

    if (user && !isLandingPage) {
        if (navLinks) {
            navLinks.style.display = 'none';
        }

        if (userInfo) {
            userInfo.style.display = 'flex';
            const displayName = user.name || 'User';
            const displayRole = user.role || 'Member';

            userInfo.innerHTML = `
                ${user.role === 'customer' ? `
                    <button class="nav-cart-btn" onclick="window.openCartModal()" title="View Cart">
                        <span class="cart-icon-wrapper">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M9 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2zM20 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2z" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <span id="cart-count" class="cart-badge" style="display: none;">0</span>
                        </span>
                    </button>
                ` : ''}
                <a href="#/profile" class="profile-widget" title="My Profile" style="text-decoration: none;">
                    <div class="profile-avatar">
                        ${user.profileImage ? `<img src="${user.profileImage}" alt="Profile">` : `
                        <svg viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>`}
                    </div>
                    <div class="profile-details">
                        <span class="profile-name">${displayName}</span>
                        <span class="profile-role">${displayRole}</span>
                    </div>
                </a>
                <button id="logout-btn" class="nav-logout-btn">
                    Logout
                </button>
            `;

            const logoutBtn = userInfo.querySelector('#logout-btn');
            if (logoutBtn) {
                logoutBtn.onclick = () => window.authService.logout();
            }
        }
    } else {
        if (userInfo) {
            userInfo.style.display = 'none';
        }
        if (navLinks) {
            navLinks.style.display = 'flex';
            navLinks.innerHTML = `
                <li><a href="#/login" class="nav-link nav-btn-login">Login</a></li>
                <li><a href="#/register" class="nav-link nav-btn-register">Register</a></li>
            `;
        }
    }

    // Always update cart UI to sync badge
    if (window.Cart) {
        window.Cart.updateUI();
    }
}

export default router;
