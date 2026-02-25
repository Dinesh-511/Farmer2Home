const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cropName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['vegetable', 'fruit', 'rice'],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    price: {
        type: Number,
        required: true,
        min: 0, // Fixed price, enforced by logic
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'sold_out', 'inactive'],
        default: 'active',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.models.Crop || mongoose.model('Crop', cropSchema);
