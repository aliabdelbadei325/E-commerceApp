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

// Admin/Staff routes (defined before :id parameter route to avoid route hijacking)
router.get('/admin/all', authorize('admin', 'staff'), getAllOrders);
router.get('/admin/stats', authorize('admin'), getOrderStats);

// User routes
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrder);

// Status updates
router.put('/:id/status', authorize('admin', 'staff'), updateOrderStatus);

module.exports = router;
