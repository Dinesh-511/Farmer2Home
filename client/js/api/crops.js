const cropService = {
    getAllCrops: async () => {
        return await window.api.get('/crops');
    },
    getMyCrops: async () => {
        return await window.api.get('/crops/my');
    },
    createCrop: async (cropData) => {
        return await window.api.post('/crops', cropData);
    },
    updateCrop: async (id, cropData) => { // Added for completeness, though specific validation might be needed
        return await window.api.put(`/crops/${id}`, cropData);
    },
    deleteCrop: async (id) => {
        return await window.api.delete(`/crops/${id}`);
    }
};

window.cropService = cropService;
export { cropService };
