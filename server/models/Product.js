/**
 * Product Model
 * E-commerce product schema
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Watches', 'Bags', 'Accessories', 'Jewelry', 'Clothing', 'Shoes', 'Electronics'],
        index: true
    },
    image: {
        type: String,
        default: '/images/placeholder.jpg'
    },
    images: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot exceed 5']
    },
    reviewCount: {
        type: Number,
        default: 0,
        min: 0
    },
    inStock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        default: 100,
        min: 0
    },
    badges: [{
        type: String,
        enum: ['new', 'best-seller', 'sale', 'limited', 'popular']
    }],
    featured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ===========================================
// INDEXES
// ===========================================

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ inStock: 1 });

// ===========================================
// VIRTUAL FIELDS
// ===========================================

productSchema.virtual('discount').get(function () {
    if (this.originalPrice && this.originalPrice > this.price) {
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
});

productSchema.virtual('isOnSale').get(function () {
    return this.originalPrice && this.originalPrice > this.price;
});

// Link to reviews
productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false
});

// ===========================================
// STATIC METHODS
// ===========================================

/**
 * Get featured products
 */
productSchema.statics.getFeatured = function (limit = 8) {
    return this.find({ featured: true, isActive: true, inStock: true })
        .limit(limit)
        .sort('-createdAt');
};

/**
 * Get products by category
 */
productSchema.statics.getByCategory = function (category, limit = 20) {
    return this.find({ category, isActive: true })
        .limit(limit)
        .sort('-rating');
};

/**
 * Search products
 */
productSchema.statics.search = function (query, limit = 20) {
    return this.find(
        {
            $text: { $search: query },
            isActive: true
        },
        {
            score: { $meta: 'textScore' }
        }
    )
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit);
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
