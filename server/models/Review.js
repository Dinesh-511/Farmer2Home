const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    cropId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crop',
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        maxLength: 500,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Review', reviewSchema);
