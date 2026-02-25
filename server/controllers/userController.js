const User = require('../models/User');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        let stats = {};

        if (user.role === 'farmer') {
            // 1. Get all crops by this farmer
            const crops = await Crop.find({ farmerId: user._id });
            const cropIds = crops.map(c => c._id);

            // 2. Count delivered orders for these crops
            const deliveredOrdersCount = await Order.countDocuments({
                cropId: { $in: cropIds },
                status: 'delivered'
            });

            // 3. Calculate Average Rating from Reviews
            // Reviews are linked to cropId.
            const reviews = await Review.find({ cropId: { $in: cropIds } });
            let avgRating = 0;
            if (reviews.length > 0) {
                const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
                avgRating = (totalRating / reviews.length).toFixed(1);
            }

            stats = {
                completedDeliveries: deliveredOrdersCount,
                averageRating: avgRating,
                totalReviews: reviews.length
            };

        } else if (user.role === 'customer') {
            // 1. Count my delivered orders
            const completedOrders = await Order.countDocuments({
                customerId: user._id,
                status: 'delivered'
            });

            // 2. Get last order date
            const lastOrder = await Order.findOne({ customerId: user._id }).sort({ orderDate: -1 });

            stats = {
                completedOrders,
                lastOrderDate: lastOrder ? lastOrder.orderDate : null
            };
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            profileImage: user.profileImage,
            farmName: user.farmName,
            farmLocation: user.farmLocation,
            farmDescription: user.farmDescription,
            createdAt: user.createdAt,
            stats // Return calculated stats
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    console.log('Update Profile Request:', req.body);
    console.log('User from Token:', req.user._id);

    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        user.profileImage = req.body.profileImage || user.profileImage;

        if (user.role === 'farmer') {
            user.farmName = req.body.farmName || user.farmName;
            user.farmLocation = req.body.farmLocation || user.farmLocation;
            user.farmDescription = req.body.farmDescription || user.farmDescription;
        }

        try {
            const updatedUser = await user.save();
            console.log('User Updated Successfully');
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                address: updatedUser.address,
                profileImage: updatedUser.profileImage,
                farmName: updatedUser.farmName,
                farmLocation: updatedUser.farmLocation,
                farmDescription: updatedUser.farmDescription,
                token: req.headers.authorization.split(' ')[1],
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Server Error: ' + error.message });
        }
    } else {
        console.log('User not found');
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(oldPassword))) {
        user.password = newPassword; // Will be hashed by pre-save hook
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(401).json({ message: 'Invalid old password' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    changePassword,
};
