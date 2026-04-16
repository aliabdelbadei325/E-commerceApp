const User = require('../models/User');
const Product = require('../models/Product');

/**
 * @desc    Get user wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
exports.getWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');

        res.status(200).json({
            success: true,
            wishlist: user.wishlist
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist/:productId
 * @access  Private
 */
exports.addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $addToSet: { wishlist: productId } },
            { new: true }
        ).populate('wishlist');

        res.status(200).json({
            success: true,
            message: 'Product added to wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
exports.removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { wishlist: productId } },
            { new: true }
        ).populate('wishlist');

        res.status(200).json({
            success: true,
            message: 'Product removed from wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        next(error);
    }
};
