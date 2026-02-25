const Cart = {
    key: 'farmer2home_cart',

    getItems: () => {
        const items = localStorage.getItem(Cart.key);
        return items ? JSON.parse(items) : [];
    },

    addItem: (crop) => {
        let items = Cart.getItems();
        const existingItemIndex = items.findIndex(i => i._id === crop._id);

        if (existingItemIndex > -1) {
            // Item exists, increment quantity
            items[existingItemIndex].quantity = (items[existingItemIndex].quantity || 1) + 1;
        } else {
            // New item, create a cart entry
            // Store original stock as 'stock' and cart quantity as 'quantity'
            const cartItem = {
                ...crop,
                stock: crop.quantity, // Preserve original available amount
                quantity: 1
            };
            items.push(cartItem);
        }

        localStorage.setItem(Cart.key, JSON.stringify(items));
        Cart.updateUI();
        // Optional: toast notification
    },

    updateItemQuantity: (id, quantity) => {
        let items = Cart.getItems();
        const itemIndex = items.findIndex(i => i._id === id);

        if (itemIndex > -1) {
            if (quantity <= 0) {
                // Remove if quantity is 0 or less
                items.splice(itemIndex, 1);
            } else {
                items[itemIndex].quantity = quantity;
            }
            localStorage.setItem(Cart.key, JSON.stringify(items));
            Cart.updateUI();
        }
    },

    removeItem: (cropId) => {
        let items = Cart.getItems();
        items = items.filter(i => i._id !== cropId);
        localStorage.setItem(Cart.key, JSON.stringify(items));
        Cart.updateUI();
    },

    clear: () => {
        localStorage.removeItem(Cart.key);
        Cart.updateUI();
    },

    updateUI: () => {
        const items = Cart.getItems();
        const badge = document.getElementById('cart-count');
        if (badge) {
            // User requested to show number of unique products, not total quantity
            const totalCount = items.length;
            badge.innerText = totalCount;
            badge.style.display = totalCount > 0 ? 'flex' : 'none';

            // Add animation class
            badge.classList.remove('badge-pop');
            void badge.offsetWidth; // Trigger reflow
            if (totalCount > 0) badge.classList.add('badge-pop');
        }

        // Refresh modal if open
        if (document.getElementById('cart-modal') && document.getElementById('cart-modal').style.display === 'flex') {
            if (window.openCartModal) window.openCartModal();
        }
    }
};

window.Cart = Cart;
export default Cart;
