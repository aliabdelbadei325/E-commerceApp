/**
 * Cart Model
 * User-specific shopping cart persistence
 */

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1'],
        default: 1
    },
    name: String,
    price: Number,
    image: String
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema]
}, {
    timestamps: true
});

// Calculate total items and total price virtuals if needed
cartSchema.virtual('totalItems').get(function () {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

cartSchema.virtual('totalPrice').get(function () {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

module.exports = mongoose.model('Cart', cartSchema);
