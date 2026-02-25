const Crop = require('../models/Crop');
const User = require('../models/User');
const Review = require('../models/Review');
const calculateExpiryDate = require('../utils/expiryLogic');

// @desc    Create a new crop listing
// @route   POST /api/crops
// @access  Private (Farmer)
const createCrop = async (req, res) => {
    const { cropName, category, quantity, price, description } = req.body;

    if (!cropName || !category || !quantity || !price) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    const expiryDate = calculateExpiryDate(category.toLowerCase());

    try {
        const crop = await Crop.create({
            farmerId: req.user.id,
            cropName,
            category: category.toLowerCase(),
            quantity,
            price,
            description,
            expiryDate,
        });

        if (req.io) {
            req.io.emit('cropUpdate', { type: 'new_crop', crop });
        }

        res.status(201).json(crop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all active crops (with average ratings)
// @route   GET /api/crops
// @access  Public
const getCrops = async (req, res) => {
    try {
        // Fetch active, non-expired crops
        const crops = await Crop.find({
            status: 'active',
            isDeleted: false,
            expiryDate: { $gt: new Date() }
        }).populate('farmerId', 'name email').lean(); // Use .lean() for plain JS objects

        // Aggregate reviews to get avg rating & count per crop
        const reviewStats = await Review.aggregate([
            {
                $group: {
                    _id: '$cropId',
                    averageRating: { $avg: '$rating' },
                    reviewCount: { $sum: 1 }
                }
            }
        ]);

        // Create a map of cropId -> stats for quick lookup
        const statsMap = {};
        reviewStats.forEach(stat => {
            statsMap[stat._id.toString()] = {
                averageRating: Math.round(stat.averageRating * 10) / 10, // round to 1 decimal
                reviewCount: stat.reviewCount
            };
        });

        // Attach stats to each crop
        const cropsWithRatings = crops.map(crop => ({
            ...crop,
            averageRating: statsMap[crop._id.toString()]?.averageRating || 0,
            reviewCount: statsMap[crop._id.toString()]?.reviewCount || 0,
        }));

        res.status(200).json(cropsWithRatings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in farmer's crops
// @route   GET /api/crops/my
// @access  Private (Farmer)
const getMyCrops = async (req, res) => {
    try {
        const crops = await Crop.find({
            farmerId: req.user.id,
            isDeleted: false // Hide soft-deleted crops
        });
        res.status(200).json(crops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get crop by ID
// @route   GET /api/crops/:id
// @access  Public
const getCropById = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id).populate('farmerId', 'name email');

        if (crop) {
            res.status(200).json(crop);
        } else {
            res.status(404).json({ message: 'Crop not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update crop
// @route   PUT /api/crops/:id
// @access  Private (Farmer)
const updateCrop = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);

        if (!crop) {
            res.status(404).json({ message: 'Crop not found' });
            return;
        }

        // Check user
        if (crop.farmerId.toString() !== req.user.id) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        // Update fields (prevent changing expiry manually ideally, but re-calculating if category changes?)
        // For simplicity, allow updating basic fields.

        const updatedCrop = await Crop.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (req.io) {
            req.io.emit('cropUpdate', { type: 'update_crop', crop: updatedCrop });
        }

        res.status(200).json(updatedCrop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private (Farmer/Admin)
const deleteCrop = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);

        if (!crop) {
            res.status(404).json({ message: 'Crop not found' });
            return;
        }

        // Check user (Farmer owns it OR Admin)
        if (crop.farmerId.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        // Soft Delete
        crop.isDeleted = true;
        crop.status = 'inactive';
        await crop.save();

        if (req.io) {
            req.io.emit('cropUpdate', { type: 'delete_crop', cropId: req.params.id });
        }

        res.status(200).json({ id: req.params.id, message: 'Crop soft deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCrop,
    getCrops,
    getMyCrops,
    getCropById,
    updateCrop,
    deleteCrop,
};
