const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register a new user (Send OTP)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, phone, address, farmName, farmLocation } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Check if pending user exists, update or create
        let pendingUser = await PendingUser.findOne({ email });
        if (pendingUser) {
            pendingUser.name = name;
            pendingUser.password = password; // Will be re-hashed on save
            pendingUser.role = role;
            pendingUser.phone = phone;
            pendingUser.address = address;
            pendingUser.farmName = farmName;
            pendingUser.farmLocation = farmLocation;
            pendingUser.otpCode = otpCode;
            pendingUser.otpExpiresAt = otpExpiresAt;
            await pendingUser.save();
        } else {
            pendingUser = await PendingUser.create({
                name,
                email,
                password, // Will be hashed in model
                role,
                phone,
                address,
                farmName,
                farmLocation,
                otpCode,
                otpExpiresAt
            });
        }

        // Send Email
        const message = `Your registration OTP is ${otpCode}. It will expire in 10 minutes.`;
        try {
            await sendEmail({
                email: pendingUser.email,
                subject: 'Farmer2Home Connect - Email Verification OTP',
                message,
            });

            res.status(200).json({ message: 'OTP sent to your email.' });
        } catch (emailError) {
            console.error(emailError);
            // Optionally delete pending user or just fail
            await PendingUser.deleteOne({ email });
            res.status(500).json({ message: 'Email could not be sent' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP and Create User
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const pendingUser = await PendingUser.findOne({ email });

        if (!pendingUser) {
            return res.status(400).json({ message: 'Invalid or expired registration request' });
        }

        if (pendingUser.otpCode !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (pendingUser.otpExpiresAt < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Create User
        // Note: pendingUser.password is already hashed. User model hashes again if modified.
        // We need to pass the raw password if User model hashes it, OR bypass hashing.
        // The PendingUser model hashes on save.
        // The User model hashes on save.
        // If we pass the hashed password to User.create, User model will hash it AGAIN because 'password' is modified (newly created).
        // WE HAVE A PROBLEM.
        // Solution: We should NOT hash in PendingUser if we want to pass raw to User?
        // OR we set the password directly and avoid the pre-save hook?
        // Simplest: Don't hash in PendingUser, store raw? NO, security risk.
        // Better: PendingUser has hashed password. User.create expects raw usually if it hashes.
        // Actually, we can use `user = new User(...)` and `user.password = pendingUser.password`, then `user.save()`.
        // But `user.save()` triggers pre-save hook.
        // We can check if password is already hashed? No easy way.
        // ALTERNATIVE: Don't hash in PendingUser. It's temporary (10 mins) and risk is lower, but still bad.
        // BEST APPROACH: Store hashed in PendingUser. When creating User, we can't easily unhash.
        // So we must handle this.
        // Hack: Store the *hash* in User, but we need to disable the User pre-save hook for this specific save?
        // OR: Since we don't have the raw password anymore, we can't re-hash it properly if salt is different?
        // Actually, if we just copy the hash string, it's fine, AS LONG AS THE USER MODEL DOESN'T RE-HASH IT.
        // The User model checks `if (!this.isModified('password'))`. New creation IS modified.
        //
        // Correction: I should store the RAW password in PendingUser? No, that's plaintext storage.
        //
        // Let's look at `User.js`.
        // `userSchema.pre('save', ...)`
        //
        // If I use `User.create({ ... })`, it calls save.
        //
        // Strategy: I will remove hashing from `PendingUser` for now to simplify, as it's a short lived record.
        // WAIT, `PendingUser` schema I just created HAS hashing.
        //
        // OK, I will modify `PendingUser.js` to NOT hash.
        //
        // Refined Plan:
        // 1. Modify PendingUser to NOT hash password. (Plaintext in pending... risky but common for temp tables? No, never).
        //
        // 2. Modify `PendingUser` to store hashed.
        //    In `verifyEmail`:
        //    const user = new User({ ... });
        //    user.password = pendingUser.password;
        //    // We need to bypass the pre-save hook or trick it.
        //    // Or we just update the document directly using `User.collection.insertOne`?
        //    // `await User.create` triggers hooks.
        //
        //    Let's use `User.insertMany` or `User.collection.insertOne`?
        //    Or just `new User(...)` then `save({ validateBeforeSave: false })`? No, hooks still run.
        //
        //    Let's change `PendingUser` to NOT hash. It's the simplest way given constraints. It expires in 10 mins.
        //    "Store plain password in PendingUsers" is explicitly forbidden in "❌ What Must NOT Happen".
        //
        //    Okay, so I MUST store hashed.
        //    Then how to transfer to User?
        //    I cannot retrieve raw password.
        //    So `User` entry must be created with the HASHED password.
        //    And `User` model must NOT re-hash it.
        //
        //    I will add a flag to User model? `isPasswordHashed`.
        //    Or I can use `User.findOneAndUpdate` (upsert) which bypasses save hooks?
        //    `await User.create` is what I want.
        //
        //    Let's try:
        //    const user = new User({ ... });
        //    user.password = pendingUser.password;
        //    // We can manually set `user.$__original.password = ...`? No.
        //
        //    Let's just use `User.collection.insertOne(userData)`. Mongoose bypass.
        //    Then we don't get validation but we can ensure data is correct.

        const userData = {
            name: pendingUser.name,
            email: pendingUser.email,
            password: pendingUser.password, // Already hashed
            role: pendingUser.role,
            phone: pendingUser.phone,
            address: pendingUser.address,
            farmName: pendingUser.farmName,
            farmLocation: pendingUser.farmLocation,
            isVerified: true
        };

        // Use Mongoose model but bypass mongoose middleware for creation to avoid double hashing
        // check if we can use inserting directly
        // const newUser = new User(userData);
        // await newUser.save(); // triggers hash

        // Using collection directly
        await User.collection.insertOne({
            ...userData,
            createdAt: new Date(),
            __v: 0
        });

        // We need to get the user object to return token
        const user = await User.findOne({ email });

        await PendingUser.deleteOne({ email });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            message: 'Email verified and account created.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const pendingUser = await PendingUser.findOne({ email });

        if (!pendingUser) {
            return res.status(400).json({ message: 'No pending registration found for this email' });
        }

        // Generate new OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        pendingUser.otpCode = otpCode;
        pendingUser.otpExpiresAt = otpExpiresAt;
        await pendingUser.save(); // validation? Password already hashed. Pre-save hook?

        // PendingUser pre-save hook re-hashes password if modified?
        // "if (!this.isModified('password')) { next(); }"
        // We are NOT modifying password here. So it should be fine.

        const message = `Your new registration OTP is ${otpCode}. It will expire in 10 minutes.`;
        await sendEmail({
            email: pendingUser.email,
            subject: 'Farmer2Home Connect - Resend OTP',
            message,
        });

        res.status(200).json({ message: 'New OTP sent to your email.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (user.isVerified === false) {
                return res.status(401).json({ message: 'Please verify your email first.' });
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Forgot Password (Send OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.resetPasswordOtp = otpCode;
        user.resetPasswordExpires = otpExpiresAt;
        await user.save();



        const message = `Your password reset OTP is ${otpCode}. It will expire in 10 minutes.`;
        await sendEmail({
            email: user.email,
            subject: 'Farmer2Home Connect - Password Reset OTP',
            message,
        });

        res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Reset OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.resetPasswordOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        res.status(200).json({ message: 'OTP verified successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.resetPasswordOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Update password (pre-save hook will hash it)
        user.password = newPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    verifyEmail,
    resendOtp,
    loginUser,
    getMe,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
};
