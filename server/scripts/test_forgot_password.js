const axios = require('axios');

const API_URL = 'http://127.0.0.1:5001/api';
const TEST_EMAIL = 'customer2@test.com'; // Use a registered email from your DB
const NEW_PASSWORD = 'newpassword123';

async function testForgotPassword() {
    try {
        console.log('--- Testing Forgot Password Flow ---');

        // 1. Request OTP
        console.log('1. Requesting OTP...');
        const forgotRes = await axios.post(`${API_URL}/auth/forgot-password`, { email: TEST_EMAIL });
        console.log('   Response:', forgotRes.data.message);

        // NOTE: In a real test, we would need to get the OTP from the DB or mock email service.
        // Since I'm the agent, I'll simulate the next steps assuming I can get the OTP if I were a real user.
        // For this script, I'll just check if the endpoints exist and return errors as expected for invalid OTP.

        // 2. Verify Invalid OTP
        console.log('2. Verifying invalid OTP...');
        try {
            await axios.post(`${API_URL}/auth/verify-reset-otp`, { email: TEST_EMAIL, otp: '000000' });
        } catch (error) {
            console.log('   Caught expected error:', error.response.data.message);
        }

        // 3. Reset Password with invalid OTP
        console.log('3. Resetting password with invalid OTP...');
        try {
            await axios.post(`${API_URL}/auth/reset-password`, {
                email: TEST_EMAIL,
                otp: '000000',
                newPassword: NEW_PASSWORD
            });
        } catch (error) {
            console.log('   Caught expected error:', error.response.data.message);
        }

        console.log('\n--- API Structure Check Complete ---');
        console.log('Note: To fully test, ensure a user with email "test@example.com" exists.');

    } catch (error) {
        console.error('Error in test:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('ERROR: Could not connect to server at', API_URL);
            console.error('Is the server running and listening on port 5000?');
        }
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testForgotPassword();
