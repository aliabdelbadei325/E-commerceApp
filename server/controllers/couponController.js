/**
 * Coupon Controller
 */

const Coupon = require('../models/Coupon');

/**
 * @desc    Validate a coupon code
 * @route   POST /api/coupons/validate
 * @access  Private
 */
const validateCoupon = async (req, res, next) => {
    try {
        const { code, amount } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }

        if (!coupon.isValid(amount)) {
            return res.status(400).json({
                success: false,
                message: 'Coupon is expired or not applicable for this order amount'
            });
        }

        const discount = coupon.calculateDiscount(amount);

        res.json({
            success: true,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discountAmount: discount
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a coupon (Admin only)
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
const createCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            coupon
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all coupons (Admin only)
 * @route   GET /api/coupons
 * @access  Private/Admin
 */
const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find().sort('-createdAt');

        res.json({
            success: true,
            count: coupons.length,
            coupons
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single coupon (Admin only)
 * @route   GET /api/coupons/:id
 * @access  Private/Admin
 */
const getCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        res.json({
            success: true,
            coupon
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update coupon (Admin only)
 * @route   PUT /api/coupons/:id
 * @access  Private/Admin
 */
const updateCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        res.json({
            success: true,
            message: 'Coupon updated successfully',
            coupon
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete coupon (Admin only)
 * @route   DELETE /api/coupons/:id
 * @access  Private/Admin
 */
const deleteCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        res.json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    validateCoupon,
    createCoupon,
    getAllCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon
};
