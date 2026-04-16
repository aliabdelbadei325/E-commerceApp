/**
 * Coupon Model
 */

const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        required: [true, 'Discount value is required'],
        min: 0
    },
    minOrderAmount: {
        type: Number,
        default: 0
    },
    expiryDate: {
        type: Date,
        required: [true, 'Expiry date is required']
    },
    maxUses: {
        type: Number,
        default: null // null means unlimited
    },
    usedCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function (orderAmount) {
    const now = new Date();

    if (!this.isActive) return false;
    if (this.expiryDate < now) return false;
    if (this.maxUses !== null && this.usedCount >= this.maxUses) return false;
    if (orderAmount < this.minOrderAmount) return false;

    return true;
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function (orderAmount) {
    if (this.discountType === 'percentage') {
        return (orderAmount * this.discountValue) / 100;
    } else {
        return Math.min(this.discountValue, orderAmount);
    }
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
