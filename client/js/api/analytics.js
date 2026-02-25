const analyticsService = {
    getFarmerAnalytics: async () => {
        try {
            return await window.api.get('/analytics');
        } catch (error) {
            console.error('Analytics Service Error:', error);
            throw error;
        }
    }
};

window.analyticsService = analyticsService;
