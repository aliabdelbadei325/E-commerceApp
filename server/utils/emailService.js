/**
 * Email Service
 * Transactional emails using Nodemailer
 */

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create a transporter
    // For development, use Mailtrap or similar. In production, use SendGrid/SES.
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
        port: process.env.EMAIL_PORT || 2525,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: `LuxeStore <${process.env.EMAIL_FROM || 'noreply@luxestore.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

/**
 * Send order confirmation email
 */
const sendOrderConfirmation = async (order, user) => {
    const itemsList = order.items.map(item =>
        `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`
    ).join('');

    const message = `
        <h1>Order Confirmation</h1>
        <p>Hello ${user.firstName},</p>
        <p>Thank you for your order! Your order <strong>${order.orderNumber}</strong> has been received and is being processed.</p>
        <h3>Order Summary:</h3>
        <ul>${itemsList}</ul>
        <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
        <p>We'll notify you when your order ships.</p>
    `;

    await sendEmail({
        email: user.email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: message
    });
};

/**
 * Send low stock alert to admin
 */
const sendLowStockAlert = async (product) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@luxestore.com';

    await sendEmail({
        email: adminEmail,
        subject: `⚠️ Low Stock Alert: ${product.name}`,
        html: `
            <h3>Low Stock Alert</h3>
            <p>The following product is running low on stock:</p>
            <p><strong>Product:</strong> ${product.name}</p>
            <p><strong>Remaining Stock:</strong> ${product.stockQuantity}</p>
            <p>Please restock soon.</p>
        `
    });
};

module.exports = {
    sendEmail,
    sendOrderConfirmation,
    sendLowStockAlert
};
