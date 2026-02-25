const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const Review = require('../models/Review');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const clearData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        await Order.deleteMany({});
        console.log('Orders Cleared.');

        await Crop.deleteMany({});
        console.log('Crops Cleared.');

        await Review.deleteMany({});
        console.log('Reviews Cleared.');

        await User.deleteMany({});
        console.log('Users Cleared.');

        console.log('Data cleanup complete.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

clearData();
