require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('Testing Email Sending...');
    console.log('User:', process.env.EMAIL_USER);
    // Don't log full pass, just length
    console.log('Pass Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'N/A');

    // Manual space stripping check
    const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';
    console.log('Stripped Pass Length:', pass.length);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: pass,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: '"Test" <noreply@farmer2home.com>',
            to: process.env.EMAIL_USER, // Send to self
            subject: 'Test Email',
            text: 'This is a test email.',
        });
        console.log('Email sent successfully:', info.messageId);
    } catch (error) {
        console.error('Email failed:', error);
    }
}

testEmail();
