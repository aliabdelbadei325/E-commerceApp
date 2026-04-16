/**
 * Review Controller
 */

const Review = require('../models/Review');
const Product = require('../models/Product');

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Private
 */
const createReview = async (req, res, next) => {
    try {
        const { product, rating, comment } = req.body;

        // Check if product exists
        const exists = await Product.findById(product);
        if (!exists) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed this product
        const alreadyReviewed = await Review.findOne({
            product,
            user: req.user.id
        });

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        const review = await Review.create({
            product,
            user: req.user.id,
            userName: `${req.user.firstName} ${req.user.lastName}`,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            review
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get reviews for a product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
const getProductReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .sort('-createdAt')
            .populate('user', 'firstName lastName avatar');

        res.json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if review belongs to user or user is admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        await Review.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all reviews (Admin)
 * @route   GET /api/reviews/admin/all
 * @access  Private/Admin
 */
const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'firstName lastName email')
            .populate('product', 'name image')
            .sort('-createdAt');

        res.json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReview,
    getProductReviews,
    deleteReview,
    getAllReviews
};
