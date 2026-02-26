import router from './router.js?v=2.0';
import './api/api.js?v=2.0';
import './api/auth.js?v=2.0';
import './api/crops.js?v=2.0';
import './api/orders.js?v=2.0';
import './api/reviews.js?v=2.0';
import './api/analytics.js?v=2.0';
import './services/userService.js?v=2.0';
import './services/socketService.js?v=2.0';
import './utils/notifier.js?v=2.0';
import './cart.js?v=2.0';

// Initialize Router
window.addEventListener('load', router);
window.addEventListener('hashchange', router);

// Update Request Header for Auth
// We might need to ensure authService is available or imported if not global
// In ES modules, top-level variables aren't global by default.
// But api.js, auth.js, crops.js assigned to window, so they are global.

// DOMContentLoaded listener removed as navbar is now managed exclusively by router.updateNav
