/**
 * User Routes
 * User management endpoints (Admin only)
 */

const express = require('express');
const router = express.Router();

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserStats,
    updateProfile,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

// Public User Routes (Authenticated Users)
router.use(protect);

router.put('/profile', updateProfile);
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

// Admin Only Routes
router.get('/stats', authorize('admin'), getUserStats);
router.post('/', authorize('admin'), createUser);
router.get('/', authorize('admin'), getUsers);
router.get('/:id', authorize('admin'), getUser);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
