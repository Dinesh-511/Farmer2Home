const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

const path = require('path');
// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedUsers = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const users = [
            // Farmers
            {
                name: 'Farmer One',
                email: 'farmer1@test.com',
                password: 'password123',
                role: 'farmer',
                farmName: 'Green Acres',
                phone: '1234567890',
                isVerified: true
            },
            {
                name: 'Farmer Two',
                email: 'farmer2@test.com',
                password: 'password123',
                role: 'farmer',
                farmName: 'Sunny Fields',
                phone: '1234567891',
                isVerified: true
            },
            {
                name: 'Farmer Three',
                email: 'farmer3@test.com',
                password: 'password123',
                role: 'farmer',
                farmName: 'Valley Harvest',
                phone: '1234567892',
                isVerified: true
            },
            {
                name: 'Farmer Four',
                email: 'farmer4@test.com',
                password: 'password123',
                role: 'farmer',
                farmName: 'Highland Greens',
                phone: '1234567893',
                isVerified: true
            },
            {
                name: 'Farmer Five',
                email: 'farmer5@test.com',
                password: 'password123',
                role: 'farmer',
                farmName: 'River Side Farm',
                phone: '1234567894',
                isVerified: true
            },
            // Customers
            {
                name: 'Customer One',
                email: 'customer1@test.com',
                password: 'password123',
                role: 'customer',
                phone: '9876543210',
                isVerified: true
            },
            {
                name: 'Customer Two',
                email: 'customer2@test.com',
                password: 'password123',
                role: 'customer',
                phone: '9876543211',
                isVerified: true
            },
            {
                name: 'Customer Three',
                email: 'customer3@test.com',
                password: 'password123',
                role: 'customer',
                phone: '9876543212',
                isVerified: true
            },
            {
                name: 'Customer Four',
                email: 'customer4@test.com',
                password: 'password123',
                role: 'customer',
                phone: '9876543213',
                isVerified: true
            },
            {
                name: 'Customer Five',
                email: 'customer5@test.com',
                password: 'password123',
                role: 'customer',
                phone: '9876543214',
                isVerified: true
            }
        ];

        console.log('Seeding users...');

        for (const user of users) {
            // Check if user exists
            const userExists = await User.findOne({ email: user.email });
            if (userExists) {
                console.log(`User ${user.email} already exists. Skipping.`);
                continue;
            }

            // Create user (pre-save hook will hash password)
            await User.create(user);
            console.log(`Created user: ${user.email}`);
        }

        console.log('Seeding complete!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedUsers();
