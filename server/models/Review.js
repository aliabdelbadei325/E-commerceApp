/**
 * Review Model
 * Schema for product reviews and ratings
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'Please provide a comment'],
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    userName: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Prevent user from submitting more than one review per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to get avg rating and update product
reviewSchema.statics.getAverageRating = async function (productId) {
    const stats = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        if (stats.length > 0) {
            await mongoose.model('Product').findByIdAndUpdate(productId, {
                rating: Math.round(stats[0].avgRating * 10) / 10,
                reviewCount: stats[0].nRating
            });
        } else {
            await mongoose.model('Product').findByIdAndUpdate(productId, {
                rating: 0,
                reviewCount: 0
            });
        }
    } catch (err) {
        console.error('Error updating product rating:', err);
    }
};

// Call getAverageRating after save
reviewSchema.post('save', async function () {
    await this.constructor.getAverageRating(this.product);
});

// Call getAverageRating before remove (using findOneAndDelete)
reviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await doc.constructor.getAverageRating(doc.product);
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
