import router from './router.js';
import './api/api.js';
import './api/auth.js';
import './api/crops.js';
import './api/orders.js';
import './api/reviews.js';
import './api/analytics.js';
import './services/userService.js';
import './services/socketService.js';
import './utils/notifier.js';
import './cart.js';

// Initialize Router
window.addEventListener('load', router);
window.addEventListener('hashchange', router);

// Update Request Header for Auth
// We might need to ensure authService is available or imported if not global
// In ES modules, top-level variables aren't global by default.
// But api.js, auth.js, crops.js assigned to window, so they are global.

// DOMContentLoaded listener removed as navbar is now managed exclusively by router.updateNav
