const userService = {
    getProfile: async () => {
        return await window.api.get('/users/profile');
    },

    updateProfile: async (userData) => {
        return await window.api.put('/users/profile', userData);
    },

    changePassword: async (passwords) => {
        return await window.api.put('/users/change-password', passwords);
    }
};

window.userService = userService;
export default userService;
