const express = require('express');
const router = express.Router();
const { getAllUsers, getAllCropsAdmin, deleteReview } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes are protected and for admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/crops', getAllCropsAdmin);
router.delete('/reviews/:id', deleteReview);

module.exports = router;
