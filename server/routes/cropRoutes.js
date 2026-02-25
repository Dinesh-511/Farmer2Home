const express = require('express');
const router = express.Router();
const {
    createCrop,
    getCrops,
    getMyCrops,
    getCropById,
    updateCrop,
    deleteCrop,
} = require('../controllers/cropController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getCrops)
    .post(protect, authorize('farmer'), createCrop);

router.route('/my')
    .get(protect, authorize('farmer'), getMyCrops);

router.route('/:id')
    .get(getCropById)
    .put(protect, authorize('farmer'), updateCrop)
    .delete(protect, authorize('farmer', 'admin'), deleteCrop);

module.exports = router;
