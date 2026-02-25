const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['farmer', 'customer', 'admin'],
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    profileImage: {
        type: String,
        required: false,
    },
    // Farmer Specific Fields
    farmName: {
        type: String,
        required: false,
    },
    farmLocation: {
        type: String,
        required: false,
    },
    farmDescription: {
        type: String,
        required: false,
    },
    resetPasswordOtp: {
        type: String,
        required: false,
    },
    resetPasswordExpires: {
        type: Date,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash password
// Pre-save hook to hash password
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
