const express = require('express');
const router = express.Router();
const { createReview, getReviews, getFarmerReviews, getCustomerReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, authorize('customer'), createReview);

router.route('/customer')
    .get(protect, authorize('customer'), getCustomerReviews);

router.route('/farmer')
    .get(protect, authorize('farmer'), getFarmerReviews);

router.route('/:cropId')
    .get(getReviews);

module.exports = router;
