const express = require('express');
const router = express.Router();
const {
    validateCoupon,
    createCoupon,
    getAllCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon
} = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');

router.post('/validate', protect, validateCoupon);

// Admin routes
router.use(protect, authorize('admin'));
router.get('/', getAllCoupons);
router.post('/', createCoupon);
router.get('/:id', getCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;
