const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    // Check if credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not found in .env. Email not sent.');
        console.log(`Mock Email -> To: ${to}, Subject: ${subject}, Body: ${text}`);
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw error to prevent order creation failure, but log it
    }
};

module.exports = sendEmail;
