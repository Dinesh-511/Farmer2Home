export const myOrdersView = {
    template: `
        <div class="container">
            <div class="dashboard-header">
                <h2>My Orders History</h2>
                <a href="#/dashboard" class="btn-primary" style="text-decoration:none;">Browse Marketplace</a>
            </div>
            <div id="orders-list" class="grid">
                <p>Loading...</p>
            </div>
        </div>
    `,
    init: async () => {
        try {
            // Fetch Orders and Reviews in parallel
            const [orders, reviews] = await Promise.all([
                window.orderService.getMyOrders(),
                window.reviewService.getCustomerReviews().catch(err => []) // Handle error gracefully
            ]);

            const list = document.getElementById('orders-list');

            if (orders.length === 0) {
                list.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:3rem; background:white; border-radius:8px;"><h3>No orders yet</h3><p>Head to the marketplace to make your first purchase.</p></div>';
            } else {
                list.innerHTML = orders.map(order => {
                    let statusBadge = '';
                    let actionArea = '';

                    // Check if this crop has already been reviewed by the user
                    // Note: Schema enforces one review per crop per user, so checking by cropId is sufficient
                    const existingReview = order.cropId ? reviews.find(r => r.cropId._id === order.cropId._id) : null;

                    if (order.status === 'pending') {
                        statusBadge = '<span style="background:#fff3e0; color:#ef6c00; padding:0.25rem 0.5rem; border-radius:4px; font-size:0.75rem;">Pending Delivery</span>';
                        actionArea = `
                            <div style="margin-top:1rem; text-align:center; background:#f1f8e9; padding:0.75rem; border-radius:4px; border:1px dashed #a5d6a7;">
                                <p style="font-size:0.85rem; color:#33691e; margin-bottom:0.25rem;">Share with farmer to confirm delivery:</p>
                                <strong style="font-size:1.5rem; letter-spacing:3px; color:#2e7d32;">${order.otpCode || '....'}</strong>
                            </div>
                        `;
                    } else if (order.status === 'delivered') {
                        statusBadge = '<span style="background:#e8f5e9; color:#2e7d32; padding:0.25rem 0.5rem; border-radius:4px; font-size:0.75rem;">Delivered & Verified</span>';

                        if (existingReview) {
                            actionArea = `
                                <div style="margin-top:1rem; padding:0.75rem; background:#f9f9f9; border-radius:8px; border:1px solid #eee;">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
                                        <span style="font-size:0.85rem; color:#555;">Your Review:</span>
                                        <span style="color:#ffc107; font-weight:bold;">${'★'.repeat(existingReview.rating)}${'☆'.repeat(5 - existingReview.rating)}</span>
                                    </div>
                                    <p style="font-size:0.9rem; font-style:italic; color:#666; margin:0;">"${existingReview.comment}"</p>
                                </div>
                             `;
                        } else {
                            actionArea = `<button class="btn-primary" style="width:100%; margin-top:1rem;" onclick="window.location.hash='#/review/${order.cropId ? order.cropId._id : ''}'">Leave a Review</button>`;
                        }

                    } else {
                        statusBadge = '<span style="background:#ffebee; color:#c62828; padding:0.25rem 0.5rem; border-radius:4px; font-size:0.75rem;">Cancelled</span>';
                    }

                    return `
                    <div class="card animate-enter">
                        <div style="display:flex; justify-content:space-between; margin-bottom:1rem; align-items:center;">
                            <h3 style="font-size:1.1rem; margin:0;">Order #${order._id.slice(-6)}</h3>
                            ${statusBadge}
                        </div>
                        
                        <div style="background:var(--bg-light); padding:0.75rem; border-radius:4px; margin-bottom:1rem;">
                            <p><strong>Item:</strong> ${order.cropId ? order.cropId.cropName : 'Unknown (Deleted)'}</p>
                            <p><strong>Quantity:</strong> ${order.quantity}</p>
                            <p><strong>Farmer:</strong> ${order.cropId && order.cropId.farmerId ? order.cropId.farmerId.name : 'Unknown'}</p>
                            <p style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px dashed #ccc; display:flex; justify-content:space-between;">
                                <span>Total Paid:</span>
                                <span style="color:var(--primary-color); font-weight:bold;">$${order.totalPrice}</span>
                            </p>
                        </div>
                        
                        ${actionArea}
                    </div>
                `}).join('');
            }
        } catch (error) {
            document.getElementById('orders-list').innerHTML = `<p style="color:var(--danger)">${error.message}</p>`;
        }
    }
};
