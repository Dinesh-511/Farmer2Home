const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or use host/port
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS.replace(/\s+/g, ''), // Remove spaces from App Password
        },
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Farmer2Home Connect <noreply@farmer2home.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html // Optional if we want HTML emails later
    };

    // 3) Actually send the email
    console.log('DEBUG: EMAIL_USER is:', process.env.EMAIL_USER); // Debug log
    if (process.env.EMAIL_USER === 'your_email@gmail.com' || !process.env.EMAIL_USER) {
        console.log('--- MOCK EMAIL SEND ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log('-----------------------');
        return;
    }

    console.log(`DEBUG: Sending email to ${options.email} with subject: ${options.subject}`);
    try {
        await transporter.sendMail(mailOptions);
        console.log(`DEBUG: Email sent successfully to ${options.email}`);
    } catch (error) {
        console.error(`DEBUG: Error sending email to ${options.email}:`, error);
        throw error;
    }
};

module.exports = sendEmail;
