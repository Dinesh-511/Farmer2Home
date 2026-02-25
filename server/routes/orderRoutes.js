const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, verifyOrderOTP, getFarmerOrders, resendOrderOTP } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, authorize('customer'), createOrder);

router.route('/my')
    .get(protect, authorize('customer'), getMyOrders);

router.route('/farmer')
    .get(protect, authorize('farmer'), getFarmerOrders);

router.route('/verify-otp')
    .post(protect, authorize('farmer'), verifyOrderOTP);

router.route('/resend-otp')
    .post(protect, authorize('farmer'), resendOrderOTP);

module.exports = router;
