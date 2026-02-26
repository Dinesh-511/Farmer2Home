const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';
const TEST_USER = {
    name: 'Test Verify User',
    email: 'testverify@example.com',
    password: 'password123',
    role: 'customer'
};

async function testAuthFlow() {
    try {
        console.log('1. Registering User...');
        try {
            await axios.post(`${API_URL}/register`, TEST_USER);
            console.log('   Registration successful (OTP sent).');
        } catch (error) {
            if (error.response && error.response.data.message === 'User already exists') {
                console.log('   User already exists. Proceeding (assuming cleaned up DB or previous run).');
            } else {
                console.error('   Registration Failed:', error.response ? error.response.data : error.message);
                return;
            }
        }

        // Wait a bit for server log to appear in my other check (I can't access server log here easily programmatically unless I read file?)
        // Actually, since I can't read the server console from THIS script easily (it's in another process),
        // I will rely on querying the DB for the OTP.

        console.log('2. Fetching OTP from DB...');
        // We can't use mongoose here easily without connecting.
        // Let's use `mongo` shell or just assuming I can see it via tool?
        // Wait, I am the agent. I can use `run_command` to query mongo?
        // Or I can just write a separate script that connects to DB and returns OTP.
        // But `axios` script is running in `run_command`.
        // I will add Mongoose connection to THIS script to fetch OTP.

    } catch (e) {
        console.error('Test failed:', e.message);
    }
}
// check db
const mongoose = require('mongoose');
const PendingUser = require('../models/PendingUser');
const User = require('../models/User'); // To check final user

async function run() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://Dinesh:Atlas123@cluster0.30q2bsu.mongodb.net/?appName=Cluster0');

    // Clean up first
    await PendingUser.deleteOne({ email: TEST_USER.email });
    await User.deleteOne({ email: TEST_USER.email });

    console.log('1. Registering...');
    try {
        await axios.post(`${API_URL}/register`, TEST_USER);
        console.log('   Registered.');
    } catch (e) {
        console.error('   Register failed:', e.response?.data || e.message);
        process.exit(1);
    }

    console.log('2. fetching OTP...');
    const pending = await PendingUser.findOne({ email: TEST_USER.email });
    if (!pending) {
        console.error('   No pending user found!');
        process.exit(1);
    }
    const otp = pending.otpCode;
    console.log(`   OTP Found: ${otp}`);

    console.log('3. Verifying Email...');
    try {
        const res = await axios.post(`${API_URL}/verify-email`, { email: TEST_USER.email, otp });
        console.log('   Verification successful:', res.data.message);
        if (!res.data.token) console.error('   No token returned!');
    } catch (e) {
        console.error('   Verification failed:', e.response?.data || e.message);
        process.exit(1);
    }

    console.log('4. Checking User created...');
    const user = await User.findOne({ email: TEST_USER.email });
    if (user && user.isVerified) {
        console.log('   User created and verified.');
    } else {
        console.error('   User not found or not verified.');
    }

    console.log('5. Attempting Login...');
    try {
        const res = await axios.post(`${API_URL}/login`, { email: TEST_USER.email, password: TEST_USER.password });
        console.log('   Login successful.');
    } catch (e) {
        console.error('   Login failed:', e.response?.data || e.message);
    }

    console.log('DONE');
    process.exit(0);
}

run();
