const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Define email options
    const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME || 'LuxeStore'} <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    // Actually send the email
    await transporter.sendEmail(mailOptions);
};

// Wait, I should use sendMail instead of sendEmail for the method call
// And I'll make it more robust with a proper template support if needed later

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: `"LuxeStore" <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
};

module.exports = sendMail;
