/**
 * Order Model
 * E-commerce order schema with status tracking
 */

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    image: String
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'Egypt' },
    phone: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    orderNumber: {
        type: String,
        unique: true
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
        type: String,
        enum: ['card', 'cash', 'paypal', 'apple'],
        default: 'card'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    coupon: {
        type: String,
        trim: true,
        uppercase: true
    },
    discountAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    shippingCost: {
        type: Number,
        default: 0,
        min: 0
    },
    tax: {
        type: Number,
        default: 0,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
        index: true
    },
    notes: String,
    trackingNumber: String,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ===========================================
// INDEXES
// ===========================================

orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ createdAt: -1 });

// ===========================================
// MIDDLEWARE - Generate Order Number
// ===========================================

orderSchema.pre('save', async function (next) {
    if (this.isNew && !this.orderNumber) {
        const year = new Date().getFullYear();
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `ORD-${year}-${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

// ===========================================
// VIRTUAL FIELDS
// ===========================================

orderSchema.virtual('itemCount').get(function () {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// ===========================================
// METHODS
// ===========================================

/**
 * Update order status
 */
orderSchema.methods.updateStatus = function (newStatus, reason = null) {
    this.status = newStatus;

    if (newStatus === 'delivered') {
        this.deliveredAt = new Date();
    }

    if (newStatus === 'cancelled') {
        this.cancelledAt = new Date();
        this.cancelReason = reason;
    }

    return this.save();
};

// ===========================================
// STATIC METHODS
// ===========================================

/**
 * Get user's orders
 */
orderSchema.statics.getUserOrders = function (userId, limit = 10) {
    return this.find({ user: userId })
        .sort('-createdAt')
        .limit(limit)
        .populate('user', 'firstName lastName email');
};

/**
 * Get orders by status (for staff/admin)
 */
orderSchema.statics.getByStatus = function (status, limit = 50) {
    return this.find({ status })
        .sort('-createdAt')
        .limit(limit)
        .populate('user', 'firstName lastName email');
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
