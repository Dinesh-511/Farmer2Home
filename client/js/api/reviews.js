const reviewService = {
    createReview: async (reviewData) => {
        return await window.api.post('/reviews', reviewData);
    },
    getReviewsByCrop: async (cropId) => {
        return await window.api.get(`/reviews/${cropId}`);
    },
    getFarmerReviews: async () => {
        return await window.api.get('/reviews/farmer');
    },
    getCustomerReviews: async () => {
        return await window.api.get('/reviews/customer');
    }
};

window.reviewService = reviewService;
export { reviewService };
