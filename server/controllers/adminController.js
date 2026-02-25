const User = require('../models/User');
const Crop = require('../models/Crop');
const Review = require('../models/Review');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all crops (including expired/sold out)
// @route   GET /api/admin/crops
// @access  Private (Admin)
const getAllCropsAdmin = async (req, res) => {
    try {
        const crops = await Crop.find({})
            .populate('farmerId', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(crops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete review
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin)
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await review.deleteOne();

        res.status(200).json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getAllCropsAdmin,
    deleteReview,
};
