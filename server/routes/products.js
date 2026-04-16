/**
 * Product Routes
 */

const express = require('express');
const router = express.Router();

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getCategories
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
