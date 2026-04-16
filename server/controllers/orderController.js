/**
 * Order Controller
 * Order management
 */

const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { sendOrderConfirmation, sendLowStockAlert } = require('../utils/emailService');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res, next) => {
    try {
        const { items, shippingAddress, paymentMethod, couponCode } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No order items'
            });
        }

        // Calculate totals and verify products
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product || !product.isActive) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`
                });
            }

            if (!product.inStock || product.stockQuantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} is out of stock`
                });
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image
            });

            subtotal += product.price * item.quantity;
        }

        // Apply Coupon
        let discountAmount = 0;
        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
            if (coupon && coupon.isValid(subtotal)) {
                discountAmount = coupon.calculateDiscount(subtotal);
                coupon.usedCount += 1;
                await coupon.save();
            }
        }

        const discountedSubtotal = subtotal - discountAmount;
        const shippingCost = subtotal > 100 ? 0 : 10;
        const tax = discountedSubtotal * 0.1;
        const total = discountedSubtotal + shippingCost + tax;

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            shippingAddress,
            paymentMethod: paymentMethod || 'card',
            subtotal,
            coupon: coupon ? coupon.code : null,
            discountAmount,
            shippingCost,
            tax,
            total,
            status: 'confirmed'
        });

        // Update stock and check for low stock alerts
        for (const item of orderItems) {
            const updatedProduct = await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: { stockQuantity: -item.quantity }
                },
                { new: true }
            );

            // Update inStock status
            if (updatedProduct.stockQuantity <= 0) {
                updatedProduct.inStock = false;
                await updatedProduct.save();
            }

            // Low stock alert (e.g. less than 10)
            if (updatedProduct.stockQuantity < 10) {
                try {
                    await sendLowStockAlert(updatedProduct);
                } catch (emailError) {
                    console.error('Low stock alert email failed:', emailError);
                }
            }
        }

        // Send confirmation email
        try {
            await sendOrderConfirmation(order, req.user);
        } catch (emailError) {
            console.error('Order confirmation email failed:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders
 * @access  Private
 */
const getMyOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const orders = await Order.find({ user: req.user.id })
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Order.countDocuments({ user: req.user.id });

        res.json({
            success: true,
            count: orders.length,
            total,
            pages: Math.ceil(total / limit),
            orders
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single order
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Only owner, admin, or staff can view
        if (
            order.user._id.toString() !== req.user.id &&
            !['admin', 'staff'].includes(req.user.role)
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all orders (Admin/Staff)
 * @route   GET /api/orders/all
 * @access  Private/Admin/Staff
 */
const getAllOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status } = req.query;

        const query = {};
        if (status) query.status = status;

        const orders = await Order.find(query)
            .populate('user', 'firstName lastName email')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            count: orders.length,
            total,
            pages: Math.ceil(total / limit),
            orders
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin/Staff
 */
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status, trackingNumber, cancelReason } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update status
        order.status = status;

        if (trackingNumber) {
            order.trackingNumber = trackingNumber;
        }

        if (status === 'delivered') {
            order.deliveredAt = new Date();
        }

        if (status === 'cancelled') {
            order.cancelledAt = new Date();
            order.cancelReason = cancelReason;

            // Restore stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stockQuantity: item.quantity },
                    inStock: true
                });
            }
        }

        await order.save();

        res.json({
            success: true,
            message: 'Order status updated',
            order
        });
    } catch (error) {
        next(error);
    }
};



/**
 * @desc    Get order stats
 * @route   GET /api/orders/stats
 * @access  Private/Admin
 */
const getOrderStats = async (req, res, next) => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$total' }
                }
            }
        ]);

        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        // Monthly Stats (Last 6 months)
        const date = new Date();
        date.setMonth(date.getMonth() - 6);

        const monthlyStats = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: date },
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    sales: { $sum: '$total' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Map months to names
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = monthlyStats.map(item => ({
            month: monthNames[item._id.month - 1],
            sales: item.sales,
            orders: item.orders
        }));

        res.json({
            success: true,
            stats: {
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                byStatus: stats.reduce((acc, item) => {
                    acc[item._id] = { count: item.count, revenue: item.totalRevenue };
                    return acc;
                }, {}),
                monthlyData
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrder,
    getAllOrders,
    updateOrderStatus,
    getOrderStats
};
