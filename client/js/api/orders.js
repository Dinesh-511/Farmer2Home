const orderService = {
    createOrder: async (orderData) => {
        return await window.api.post('/orders', orderData);
    },
    getMyOrders: async () => {
        return await window.api.get('/orders/my');
    },
    getFarmerOrders: async () => {
        return await window.api.get('/orders/farmer');
    },
    verifyOtp: async (orderId, otp) => {
        return await window.api.post('/orders/verify-otp', { orderId, otp });
    },
    resendOtp: async (orderId) => {
        return await window.api.post('/orders/resend-otp', { orderId });
    }
};

window.orderService = orderService;
export { orderService };
