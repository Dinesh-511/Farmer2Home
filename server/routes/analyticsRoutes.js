const express = require('express');
const router = express.Router();
const { getFarmerAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', protect, authorize('farmer'), getFarmerAnalytics);

module.exports = router;
