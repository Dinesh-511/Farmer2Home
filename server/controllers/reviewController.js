const Review = require('../models/Review');
const Order = require('../models/Order');
const Crop = require('../models/Crop');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private (Customer)
const createReview = async (req, res) => {
    const { cropId, rating, comment } = req.body;

    if (!cropId || !rating || !comment) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        // 1. Check if user ordered this crop
        // 1. Check if user ordered this crop AND it is delivered/verified
        const orders = await Order.find({
            customerId: req.user.id,
            cropId: cropId,
            status: 'delivered',
            otpVerified: true
        });

        if (orders.length === 0) {
            return res.status(400).json({ message: 'You can only review crops that have been delivered and verified' });
        }

        // 2. Check if user already reviewed this crop
        const existingReview = await Review.findOne({
            customerId: req.user.id,
            cropId: cropId
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this crop' });
        }

        // Create review
        const review = await Review.create({
            cropId,
            customerId: req.user.id,
            rating,
            comment,
        });

        // Emit real-time notification to farmer
        if (req.io) {
            const crop = await Crop.findById(cropId);
            if (crop) {
                req.io.to(crop.farmerId.toString()).emit('newReview', {
                    type: 'new_review',
                    review: {
                        ...review.toObject(),
                        customerId: { name: req.user.name },
                        cropId: { cropName: crop.cropName }
                    },
                    message: `New review received for ${crop.cropName}!`
                });
            }
        }

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a crop
// @route   GET /api/reviews/:cropId
// @access  Public
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ cropId: req.params.cropId })
            .populate('customerId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for logged in farmer's crops
// @route   GET /api/reviews/farmer
// @access  Private (Farmer)
const getFarmerReviews = async (req, res) => {
    try {
        // 1. Find all crops by this farmer
        const crops = await Crop.find({ farmerId: req.user.id });
        const cropIds = crops.map(crop => crop._id);

        // 2. Find reviews for these crops
        const reviews = await Review.find({ cropId: { $in: cropIds } })
            .populate('customerId', 'name')
            .populate('cropId', 'cropName')
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews by logged in customer
// @route   GET /api/reviews/customer
// @access  Private (Customer)
const getCustomerReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ customerId: req.user.id })
            .populate('cropId', 'cropName');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    getReviews,
    getFarmerReviews,
    getCustomerReviews,
};
