/**
 * Review Routes
 */

const express = require('express');
const router = express.Router();
const {
    createReview,
    getProductReviews,
    deleteReview,
    getAllReviews
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllReviews);

module.exports = router;
