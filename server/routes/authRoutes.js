const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, verifyEmail, resendOtp, forgotPassword, verifyResetOtp, resetPassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOtp);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
