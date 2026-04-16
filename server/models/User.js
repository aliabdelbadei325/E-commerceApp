/**
 * User Model
 * Secure user schema with bcrypt password hashing
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Never return password by default
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'staff'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: '👤'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    passwordChangedAt: {
        type: Date
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    addresses: [{
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        address: { type: String, trim: true },
        city: { type: String, trim: true },
        postalCode: { type: String, trim: true },
        country: { type: String, trim: true },
        phone: { type: String, trim: true },
        isDefault: { type: Boolean, default: false }
    }],
    wishlist: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ===========================================
// INDEXES
// ===========================================

userSchema.index({ role: 1 });

// ===========================================
// VIRTUAL FIELDS
// ===========================================

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// ===========================================
// MIDDLEWARE - Password Hashing
// ===========================================

userSchema.pre('save', async function (next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    // Hash password with strength of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    // Update passwordChangedAt
    if (!this.isNew) {
        this.passwordChangedAt = Date.now() - 1000;
    }

    next();
});

// ===========================================
// METHODS
// ===========================================

/**
 * Compare entered password with hashed password
 * @param {string} enteredPassword - Plain text password
 * @returns {boolean} - Match result
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate JWT token
 * @returns {string} - Signed JWT token
 */
userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || '7d',
            issuer: 'luxestore-api'
        }
    );
};

/**
 * Check if password was changed after token was issued
 * @param {number} tokenTimestamp - JWT iat timestamp
 * @returns {boolean}
 */
userSchema.methods.passwordChangedAfter = function (tokenTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return tokenTimestamp < changedTimestamp;
    }
    return false;
};

// ===========================================
// STATIC METHODS
// ===========================================

/**
 * Find user by email (includes password for auth)
 * @param {string} email
 * @returns {User}
 */
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: email.toLowerCase() }).select('+password');
};

const User = mongoose.model('User', userSchema);

module.exports = User;
