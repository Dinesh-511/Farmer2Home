export const orderView = {
    template: `
        <div class="container" style="display: flex; justify-content: center; align-items: center; min-height: 85vh; padding: 2rem;">
            <div class="checkout-layout-wrapper" style="display: flex; gap: 4rem; align-items: stretch; max-width: 1200px; width: 100%;">
                
                <!-- Left: Order Confirmation Card -->
                <div class="auth-container" style="max-width: 550px; width: 100%; margin: 0;">
                    <div class="card glass animate-pop" style="border-radius: 32px; padding: 3rem; height: 100%; display: flex; flex-direction: column;">
                        <div class="auth-header" style="text-align: left; margin-bottom: 2rem;">
                            <h2 class="font-serif" style="font-size: 2.2rem; color: var(--primary-color); margin-bottom: 0.5rem;">Confirm Your Harvest</h2>
                            <p style="color: var(--text-light); font-size: 1rem;">Review your selection before finalizing your direct-from-farm purchase.</p>
                        </div>
                        
                        <div id="order-items-container" style="margin-bottom: 2rem; flex-grow: 1;">
                            <div id="crop-details" class="loading-state" style="text-align: center; padding: 2rem; color: var(--text-light);">
                                <div class="spinner" style="margin-bottom: 1rem;">⌛</div>
                                Gathering details...
                            </div>
                        </div>

                        <form id="order-form" class="hidden" style="border-top: 1px solid rgba(0,0,0,0.06); padding-top: 2rem;">
                            <div id="quantity-control-area">
                                <!-- Only shown for single items -->
                            </div>
                            
                            <div class="total-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 1.5rem 2rem; background: var(--primary-color); color: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(27, 48, 34, 0.15);">
                                <span style="font-weight: 500; font-size: 1.2rem;">Total Amount</span>
                                <span style="font-size: 2rem; font-weight: 800; letter-spacing: -0.5px;">$<span id="total-price">0</span></span>
                            </div>

                            <div style="display: flex; flex-direction: column; gap: 1rem;">
                                <button type="submit" class="btn-primary" style="width: 100%; padding: 1.2rem; border-radius: 16px; font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.8rem; box-shadow: 0 4px 15px rgba(27, 48, 34, 0.2);">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                    Confirm Purchase
                                </button>
                                <a href="#/dashboard" class="btn-secondary" style="display: block; text-align: center; text-decoration:none; padding: 1rem; color: var(--text-light); border: 2px solid #eee; border-radius: 16px; font-weight: 600; transition: all 0.3s;">Cancel and Return</a>
                            </div>
                        </form>
                        <div id="msg" class="text-center mt-2"></div>
                    </div>
                </div>

                <!-- Right: Side Visual (Hidden on mobile via CSS) -->
                <div class="checkout-visual-container" style="flex: 1; min-width: 400px; border-radius: 32px; overflow: hidden; position: relative; background: white; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-premium);">
                    <img id="checkout-side-img" src="img/checkout_fresh_produce.png" alt="Bountiful Harvest" style="max-height: 90%; max-width: 90%; object-fit: contain; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.1));">
                    <div style="absolute: inset-0; background: linear-gradient(to top, rgba(255, 255, 255, 0.95), transparent); position: absolute; bottom: 0; left: 0; right: 0; padding: 3rem; color: var(--primary-color);">
                        <h3 class="font-serif" style="font-size: 2rem; margin-bottom: 0.5rem; letter-spacing: -0.5px;">Your Bountiful Harvest</h3>
                        <p style="opacity: 0.8; font-size: 1rem; line-height: 1.6; font-weight: 500;">Review your fresh selection of farm-direct produce and grains. Each item is hand-picked and verified for premium quality.</p>
                    </div>
                </div>

            </div>
        </div>

        <style>
            @media (max-width: 992px) {
                .checkout-layout-wrapper {
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem !important;
                }
                .checkout-visual-container {
                    display: none;
                }
                .auth-container {
                    max-width: 100% !important;
                }
            }
        </style>
    `,
    init: async () => {
        const hash = window.location.hash;
        const parts = hash.split('/');
        const cropId = parts[2];
        const isCartMode = !cropId;

        const container = document.getElementById('crop-details');
        const form = document.getElementById('order-form');
        const totalPriceSpan = document.getElementById('total-price');
        const qtyArea = document.getElementById('quantity-control-area');
        const msg = document.getElementById('msg');

        let checkoutItems = [];

        try {
            if (isCartMode) {
                // Multi-item Cart Mode
                if (!window.Cart) throw new Error("Cart service not available");
                checkoutItems = window.Cart.getItems();

                if (checkoutItems.length === 0) {
                    window.location.hash = '#/dashboard';
                    return;
                }

                container.innerHTML = `
                    <div class="checkout-list" style="display: flex; flex-direction: column; gap: 1rem;">
                        ${checkoutItems.map(item => `
                            <div class="checkout-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f9fdf9; border: 1px solid #edf5ed; border-radius: 12px;">
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <div style="font-size: 1.5rem;">${item.category === 'Fruit' ? '🍎' : item.category === 'Vegetable' ? '🥦' : '🌾'}</div>
                                    <div style="text-align: left;">
                                        <h4 style="margin: 0; font-size: 1rem;">${item.cropName}</h4>
                                        <span style="font-size: 0.85rem; color: #666;">$${item.price.toFixed(2)} x ${item.quantity}</span>
                                    </div>
                                </div>
                                <div style="font-weight: 700; color: var(--primary-color);">
                                    $${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;

                const total = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                totalPriceSpan.textContent = total.toFixed(2);
                qtyArea.innerHTML = ''; // No individual qty control here
            } else {
                // Single Item Mode
                const crop = await window.api.get(`/crops/${cropId}`);
                checkoutItems = [{ ...crop, quantity: 1 }];

                container.innerHTML = `
                    <div class="checkout-item-single" style="text-align: center; padding: 1rem; background: #f9fdf9; border-radius: 16px; border: 1px solid #edf5ed;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">${crop.category === 'Fruit' ? '🍎' : crop.category === 'Vegetable' ? '🥦' : '🌾'}</div>
                        <h3 style="margin-bottom: 0.5rem; font-family: var(--font-serif); font-size: 1.5rem;">${crop.cropName}</h3>
                        <div style="display: flex; justify-content: center; gap: 2rem; font-size: 0.95rem; color: var(--text-light); margin-bottom: 1rem;">
                            <span>Farmer: <strong>${crop.farmerId.name}</strong></span>
                            <span>Fresh Stock: <strong>${crop.quantity}</strong></span>
                        </div>
                         <div style="font-size: 1.1rem; color: var(--primary-color); font-weight: 600;">
                            $${crop.price.toFixed(2)} per unit
                        </div>
                    </div>
                `;

                qtyArea.innerHTML = `
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--primary-color);">Purchase Quantity</label>
                        <input type="number" id="quantity" required min="1" max="${crop.quantity}" value="1" 
                               style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 2.5px solid #edf5ed; font-size: 1.2rem; font-weight: 700; text-align: center; color: var(--primary-color); outline: none; transition: border-color 0.3s;"
                               onfocus="this.style.borderColor='var(--accent-color)'" onblur="this.style.borderColor='#edf5ed'">
                    </div>
                `;

                const quantityInput = document.getElementById('quantity');
                totalPriceSpan.textContent = (crop.price * quantityInput.value).toFixed(2);

                quantityInput.addEventListener('input', () => {
                    if (parseInt(quantityInput.value) > crop.quantity) {
                        quantityInput.value = crop.quantity;
                    }
                    totalPriceSpan.textContent = (crop.price * quantityInput.value).toFixed(2);
                    checkoutItems[0].quantity = parseInt(quantityInput.value);
                });
            }

            form.classList.remove('hidden');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                const originalBtnHtml = btn.innerHTML;

                try {
                    btn.disabled = true;
                    btn.innerHTML = '<span class="spinner">⌛</span> Processing...';

                    // In-sequence processing to handle multiple orders
                    // (Real production might use a single bulk API, but we follow existing API design)
                    for (const item of checkoutItems) {
                        await window.orderService.createOrder({
                            cropId: item._id,
                            quantity: item.quantity
                        });
                    }

                    if (isCartMode) {
                        window.Cart.clear();
                    }

                    msg.innerHTML = `
                        <div class="animate-pop" style="background: #e8f5e9; color: #2e7d32; padding: 2.5rem; border-radius: 24px; margin-top: 1.5rem; border: 1px solid #c8e6c9; text-align: center;">
                            <div style="width: 80px; height: 80px; background: #2e7d32; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; box-shadow: 0 10px 20px rgba(46,125,50,0.2);">
                                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="white" stroke-width="3">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h4 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-family: var(--font-serif);">🎉 Fresh Harvest Secured!</h4>
                            <p style="margin: 0; font-size: 1rem; opacity: 0.8;">Your direct-from-farm connection is established. Redirecting to your dashboard...</p>
                        </div>
                    `;

                    setTimeout(() => {
                        window.location.hash = '#/my-orders';
                    }, 2000);

                } catch (error) {
                    btn.disabled = false;
                    btn.innerHTML = originalBtnHtml;
                    msg.innerHTML = `<p style="color:var(--danger); padding: 1rem; background: #ffebee; border-radius: 8px; margin-top: 1rem;">${error.message}</p>`;
                }
            });

        } catch (error) {
            container.innerHTML = `<p style="color:var(--danger); padding: 2rem; text-align: center;">Error: ${error.message}</p>`;
        }
    }
};
