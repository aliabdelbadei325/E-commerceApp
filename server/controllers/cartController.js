/**
 * Cart Controller
 * Manages user shopping cart persistence and sync
 */

const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private
 */
exports.getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        res.status(200).json({
            success: true,
            items: cart.items
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Sync local cart with server
 * @route   POST /api/cart/sync
 * @access  Private
 */
exports.syncCart = async (req, res, next) => {
    try {
        const { items } = req.body;

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items });
        } else {
            // Simple overwrite for now, or could merge based on business logic
            cart.items = items;
            await cart.save();
        }

        res.status(200).json({
            success: true,
            items: cart.items
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Private
 */
exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                name: product.name,
                price: product.price,
                image: product.image
            });
        }

        await cart.save();

        res.status(200).json({
            success: true,
            items: cart.items
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/:productId
 * @access  Private
 */
exports.updateQuantity = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();

        res.status(200).json({
            success: true,
            items: cart.items
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:productId
 * @access  Private
 */
exports.removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        res.status(200).json({
            success: true,
            items: cart.items
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private
 */
exports.clearCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.status(200).json({
            success: true,
            items: []
        });
    } catch (error) {
        next(error);
    }
};
