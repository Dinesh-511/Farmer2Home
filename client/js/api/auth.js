const authService = {
    register: async (userData) => {
        const data = await window.api.post('/auth/register', userData);
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
        }
        return data;
    },
    login: async (credentials) => {
        const data = await window.api.post('/auth/login', credentials);
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
        }
        return data;
    },
    verifyEmail: async (email, otp) => {
        const data = await window.api.post('/auth/verify-email', { email, otp });
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
        }
        return data;
    },
    resendOtp: async (email) => {
        return await window.api.post('/auth/resend-otp', { email });
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.hash = '#/login';
        window.location.reload();
    },
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
    forgotPassword: async (email) => {
        return await window.api.post('/auth/forgot-password', { email });
    },
    verifyResetOtp: async (email, otp) => {
        return await window.api.post('/auth/verify-reset-otp', { email, otp });
    },
    resetPassword: async (email, otp, newPassword) => {
        return await window.api.post('/auth/reset-password', { email, otp, newPassword });
    }
};

window.authService = authService;
export { authService };
