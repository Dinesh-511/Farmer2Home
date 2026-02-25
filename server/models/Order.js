const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    cropId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crop',
        required: true,
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'delivered', 'cancelled'],
        default: 'pending',
    },
    otpCode: {
        type: String,
        required: true,
        select: false, // Don't return by default
    },
    otpVerified: {
        type: Boolean,
        default: false,
    },
    otpExpiresAt: {
        type: Date,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
