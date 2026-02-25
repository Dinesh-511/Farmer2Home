
import { FarmerDashboard } from '../components/FarmerDashboard.js';

export const dashboardView = {
    template: `<div id="dashboard-root" class="min-h-screen soil-plants-bottom"></div>`,
    init: async () => {
        try {
            const user = window.authService.getCurrentUser();
            const rootContainer = document.getElementById('dashboard-root');

            if (!user) {
                window.location.hash = '#/login';
                return;
            }

            // Set global currentUserId for socket reconnection
            window.currentUserId = user._id;

            // Initialize WebSocket Listeners for Real-Time Updates
            if (!window.dashboardSocketInitialized) {
                window.socketService.joinUserRoom(user._id);

                const handleUpdate = (data) => {
                    if (window.refreshDashboard) {
                        window.refreshDashboard();
                    } else {
                        dashboardView.init();
                    }
                };

                window.socketService.on('cropUpdate', handleUpdate);
                window.socketService.on('newOrder', (data) => {
                    if (user.role === 'farmer') window.notifier.showToast(data.message || 'New order received!');
                    handleUpdate();
                });
                window.socketService.on('deliveryUpdate', handleUpdate);
                window.socketService.on('newReview', (data) => {
                    if (user.role === 'farmer') window.notifier.showToast(data.message || 'New review received!');
                    handleUpdate();
                });
                window.socketService.on('orderUpdate', handleUpdate);

                window.dashboardSocketInitialized = true;
            }

            if (user.role === 'farmer') {
                // Render React Dashboard
                if (!window.reactRoot || window.reactRootContainer !== rootContainer) {
                    window.reactRoot = ReactDOM.createRoot(rootContainer);
                    window.reactRootContainer = rootContainer;
                }
                window.reactRoot.render(React.createElement(FarmerDashboard, { user }));
            } else {
                // --- FULL LEGACY CUSTOMER DASHBOARD RESTORATION ---
                renderLegacyCustomerDashboard(rootContainer, user);
            }
        } catch (error) {
            console.error('Dashboard Init Error:', error);
            const rootContainer = document.getElementById('dashboard-root');
            if (rootContainer) {
                rootContainer.innerHTML = `<div class="container" style="padding: 2rem; text-align: center;">
                    <h3 style="color: #d32f2f;">Something went wrong</h3>
                    <p>${error.message}</p>
                    <button class="btn-primary" onclick="location.reload()">Reload Page</button>
                </div>`;
            }
        }
    }
};

async function renderLegacyCustomerDashboard(container, user) {
    // Determine target tab from current hash or default to marketplace
    const currentHash = window.location.hash;
    const initialTab = currentHash === '#/my-orders' ? 'my-orders' : 'marketplace';

    container.innerHTML = `
        <div class="container soil-plants-bottom" style="max-width: 1400px; padding: 2rem; position: relative; z-index: 1;">
            <div id="action-buttons" style="margin-bottom: 2rem;"></div>
            <div id="dashboard-content" class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem;">
                <p>Loading your fresh marketplace...</p>
            </div>
        </div>
    `;

    const content = document.getElementById('dashboard-content');
    const actions = document.getElementById('action-buttons');

    try {
        // Fetch Data in Parallel
        const [crops, orders, reviews] = await Promise.all([
            window.cropService.getAllCrops(),
            window.orderService.getMyOrders(),
            window.reviewService.getCustomerReviews().catch(err => [])
        ]);

        window.currentMarketplaceCrops = crops;
        let html = '';

        // Customer Tabs (Sticky & Full Width)
        html += `
            <div class="dashboard-tabs" style="grid-column: 1/-1;">
                <a href="#/dashboard" class="tab-link ${initialTab === 'marketplace' ? 'active' : ''}" data-tab="marketplace">Marketplace</a>
                <a href="#/my-orders" class="tab-link ${initialTab === 'my-orders' ? 'active' : ''}" data-tab="my-orders">My Orders</a>
            </div>
        `;

        // --- Marketplace Section ---
        html += `
            <div id="marketplace" class="dashboard-section animate-enter" style="grid-column: 1/-1; display: ${initialTab === 'marketplace' ? 'block' : 'none'};">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem;">
                    ${crops.length === 0 ? `
                        <div style="grid-column: 1/-1; text-align:center; padding:3rem; background:white; border-radius:16px; box-shadow: var(--shadow-premium);">
                            <h3>Marketplace Empty</h3>
                            <p>Check back later for fresh produce!</p>
                        </div>
                    ` : crops.map(crop => {
            let visual = '';
            const cat = crop.category.toLowerCase();
            if (cat === 'vegetable') {
                visual = `<div style="height:100px; background:linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); display:flex; align-items:center; justify-content:center; border-radius:12px; margin-bottom:1rem; font-size:3rem;">🥦</div>`;
            } else if (cat === 'fruit') {
                visual = `<div style="height:100px; background:linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); display:flex; align-items:center; justify-content:center; border-radius:12px; margin-bottom:1rem; font-size:3rem;">🍎</div>`;
            } else {
                visual = `<div style="height:100px; background:linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%); display:flex; align-items:center; justify-content:center; border-radius:12px; margin-bottom:1rem; font-size:3rem;">🌾</div>`;
            }

            return `
                            <div class="card premium-card">
                                ${visual}
                                <div style="display:flex; justify-content:space-between; align-items:start;">
                                    <div>
                                        <span class="tag tag-info">${crop.category}</span>
                                        <h3 style="margin: 0.5rem 0; font-family: var(--font-serif); font-size: 1.4rem;">${crop.cropName}</h3>
                                        <p style="font-size:0.9rem; margin:0;"><span onclick="window.showFarmerCrops('${crop.farmerId._id}', '${crop.farmerId.name}')" style="color:var(--primary-color); cursor:pointer; font-weight:600; text-decoration:underline;">by ${crop.farmerId.name}</span></p>
                                    </div>
                                    <div style="text-align:right;">
                                        <span style="display:block; font-size:0.75rem; color:var(--text-light); text-transform:uppercase;">Price</span>
                                        <span style="font-size:1.5rem; color:var(--primary-color); font-weight:800;">$${crop.price}</span>
                                    </div>
                                </div>

                                <div style="display:flex; align-items:center; gap:0.5rem; margin:1rem 0;">
                                    <span style="color:#ffc107; font-size:1.2rem;">${'★'.repeat(Math.round(crop.averageRating || 0))}${'☆'.repeat(5 - Math.round(crop.averageRating || 0))}</span>
                                    <span style="font-size:0.85rem; color:#888;">${crop.averageRating > 0 ? `(${crop.reviewCount})` : 'New'}</span>
                                </div>

                                <div style="margin-bottom:1.5rem; background:rgba(27, 48, 34, 0.03); padding:0.8rem; border-radius:12px;">
                                    <p style="font-size:0.9rem; margin:0; display:flex; justify-content:space-between; color:#444;">
                                        <span>Available: <strong>${crop.quantity}</strong></span>
                                        <span><strong>${window.getExpiryLabel ? window.getExpiryLabel(crop.expiryDate) : 'Fresh'}</strong></span>
                                    </p>
                                </div>
                                <button class="btn-primary" style="width:100%; border-radius:12px; padding: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;" onclick="window.addToCart('${crop._id}', this)">
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <path d="M9 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2zM20 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2z" />
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                    </svg>
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;

        // --- My Orders Section ---
        html += `
            <div id="my-orders" class="dashboard-section animate-enter" style="grid-column: 1/-1; display: ${initialTab === 'my-orders' ? 'block' : 'none'};">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem;">
                    ${orders.length === 0 ? `
                        <div style="grid-column: 1/-1; text-align:center; padding:3rem; background:white; border-radius:16px; box-shadow: var(--shadow-premium);">
                            <h3>No orders yet</h3>
                            <p>Head to the marketplace to make your first purchase.</p>
                        </div>
                    ` : orders.map(order => {
            let statusBadge = '';
            let actionArea = '';
            const existingReview = order.cropId ? reviews.find(r => r.cropId._id === order.cropId._id) : null;

            if (order.status === 'pending') {
                statusBadge = '<span class="tag tag-warning">Pending Delivery</span>';
                actionArea = `
                                <div style="margin-top:1.5rem; text-align:center; background:#f1f8e9; padding:1rem; border-radius:12px; border:2px dashed #a5d6a7;">
                                    <p style="font-size:0.85rem; color:#33691e; margin-bottom:0.5rem; font-weight:600;">Delivery Confirmation Code:</p>
                                    <strong style="font-size:1.8rem; letter-spacing:5px; color:#2e7d32; font-family: monospace;">${order.otpCode || '****'}</strong>
                                </div>
                            `;
            } else if (order.status === 'delivered') {
                statusBadge = '<span class="tag tag-success">Delivered</span>';
                if (existingReview) {
                    actionArea = `
                                    <div style="margin-top:1.5rem; padding:1rem; background:rgba(0,0,0,0.02); border-radius:12px; border: 1px solid rgba(0,0,0,0.05);">
                                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                                            <span style="font-size:0.85rem; color:#666; font-weight:600;">Your Experience:</span>
                                            <span style="color:#ffc107; font-size:1.1rem;">${'★'.repeat(existingReview.rating)}${'☆'.repeat(5 - existingReview.rating)}</span>
                                        </div>
                                        <p style="font-size:0.95rem; font-style:italic; color:#444; margin:0;">"${existingReview.comment}"</p>
                                    </div>
                                 `;
                } else {
                    actionArea = `<button class="btn-primary" style="width:100%; margin-top:1.5rem; border-radius:12px;" onclick="window.location.hash='#/review/${order.cropId ? order.cropId._id : ''}'">Leave a Review</button>`;
                }
            }

            return `
                            <div class="card premium-card animate-enter">
                                <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem; align-items:center;">
                                    <h3 style="font-size:1.1rem; margin:0; font-family: var(--font-serif);">Order #${order._id.slice(-6).toUpperCase()}</h3>
                                    ${statusBadge}
                                </div>
                                <div style="background:rgba(0,0,0,0.02); padding:1rem; border-radius:12px; margin-bottom:0;">
                                    <p style="margin-bottom:0.5rem; display:flex; justify-content:space-between;"><span>Item:</span> <strong>${order.cropId ? order.cropId.cropName : 'Removed'}</strong></p>
                                    <p style="margin-bottom:0.5rem; display:flex; justify-content:space-between;"><span>Quantity:</span> <strong>${order.quantity}</strong></p>
                                    <p style="margin:0.5rem 0 0 0; padding-top:0.5rem; border-top:1px solid rgba(0,0,0,0.05); display:flex; justify-content:space-between;">
                                        <span>Total Paid:</span> 
                                        <span style="color:var(--primary-color); font-weight:800; font-size:1.2rem;">$${order.totalPrice}</span>
                                    </p>
                                </div>
                                ${actionArea}
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;

        content.innerHTML = html;

        // --- Simplified Tab Switch (Router handles navigation) ---
        window.switchCustomerDashboardTab = (tabId) => {
            const sections = ['marketplace', 'my-orders'];
            const tabs = document.querySelectorAll('.tab-link');
            tabs.forEach(tab => {
                if (tab.getAttribute('data-tab') === tabId) tab.classList.add('active');
                else tab.classList.remove('active');
            });
            sections.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = (id === tabId) ? 'block' : 'none';
            });
        };

        // --- Helper Function ---
        window.getExpiryLabel = (date) => {
            const diff = new Date(date) - new Date();
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
            if (days < 0) return 'Expired';
            if (days === 0) return 'Expires Today';
            if (days < 30) return `Expires in ${days} days`;
            return `Expires in ${Math.floor(days / 30)} months`;
        };

    } catch (error) {
        content.innerHTML = `<p style="color:red">Error loading dashboard: ${error.message}</p>`;
    }
}

// Ensure global functions are available
window.deleteCrop = async (id) => {
    if (await window.notifier.confirm('Are you sure?')) {
        try {
            await window.cropService.deleteCrop(id);
            window.notifier.showToast('Crop deleted');
            if (window.refreshDashboard) window.refreshDashboard();
            else dashboardView.init();
        } catch (e) {
            window.notifier.showToast(e.message, 'error');
        }
    }
};

window.addToCart = (id, btn) => {
    const crop = window.currentMarketplaceCrops.find(c => c._id === id);
    if (crop && window.Cart) {
        window.Cart.addItem(crop);
        if (btn) {
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Added</span>`;
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M9 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2zM20 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2z" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <span>Add to Cart</span>`;
                btn.disabled = false;
            }, 1500);
        }
    }
};

window.openCartModal = () => {
    const cart = window.Cart;
    const items = cart.getItems();

    let modal = document.getElementById('cart-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cart-modal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    modal.innerHTML = `
        <div class="cart-modal-content glass animate-pop">
            <div class="modal-header">
                <h3>Your Premium Basket</h3>
                <button class="close-btn" onclick="document.getElementById('cart-modal').style.display='none'">&times;</button>
            </div>
            <div class="cart-items-list">
                ${items.length === 0 ? `
                    <div class="empty-cart">
                        <div class="empty-icon">🧺</div>
                        <p>Your basket is empty. Discover fresh produce in the marketplace.</p>
                    </div>
                ` : items.map(item => `
                    <div class="cart-item">
                        <div class="item-info">
                            <strong>${item.cropName}</strong>
                            <span>$${item.price} x ${item.quantity}</span>
                        </div>
                        <div class="item-actions" style="display: flex; align-items: center; gap: 0.5rem;">
                            <button onclick="window.Cart.updateItemQuantity('${item._id}', ${item.quantity - 1})" style="width:28px; height:28px; border-radius:50%; border:1px solid #ddd; background:white; cursor:pointer;">-</button>
                            <input type="number" 
                                   value="${item.quantity}" 
                                   min="1" 
                                   max="${item.stock}" 
                                   onchange="window.Cart.updateItemQuantity('${item._id}', parseInt(this.value) || 1)"
                                   class="qty-input"
                                   style="width: 50px; text-align: center; padding: 0.2rem; border: 1px solid #ccc; border-radius: 6px; font-weight: bold; background: white;"
                            >
                            <button onclick="window.Cart.updateItemQuantity('${item._id}', ${item.quantity + 1})" ${item.quantity >= item.stock ? 'disabled' : ''} style="width:28px; height:28px; border-radius:50%; border:1px solid #ddd; background:white; cursor:pointer;">+</button>
                            <button class="remove-btn" onclick="window.Cart.removeItem('${item._id}')" style="background:none; border:none; color:#ff5252; cursor:pointer; margin-left: 0.5rem; font-size: 1.2rem;">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            ${items.length > 0 ? `
                <div class="modal-footer">
                    <div class="cart-total">
                        <span>Total Amount</span>
                        <strong>$${total.toFixed(2)}</strong>
                    </div>
                    <button class="btn-primary checkout-btn" onclick="document.getElementById('cart-modal').style.display='none'; window.location.hash='#/order'">
                        <span>Proceed to Checkout</span>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    modal.style.display = 'flex';
};
