const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html) => {
    console.log("Email Service Attempt:", {
        user: process.env.EMAIL_USER ? "DETECTED" : "MISSING",
        pass: process.env.EMAIL_PASS ? "DETECTED" : "MISSING"
    });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variables");
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use STARTTLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            // Do not fail on invalid certs
            rejectUnauthorized: false
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendEmail };
