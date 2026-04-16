/**
 * Order Routes
 */

const express = require('express');
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrder,
    getAllOrders,
    updateOrderStatus,
    getOrderStats
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// User routes
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrder);

// Admin/Staff routes
router.get('/admin/all', authorize('admin', 'staff'), getAllOrders);
router.get('/admin/stats', authorize('admin'), getOrderStats);
router.put('/:id/status', authorize('admin', 'staff'), updateOrderStatus);

module.exports = router;
