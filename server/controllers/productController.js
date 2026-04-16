/**
 * Product Controller
 * Product CRUD operations
 */

const Product = require('../models/Product');

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 12,
            category,
            minPrice,
            maxPrice,
            inStock,
            search,
            sort = '-createdAt',
            featured
        } = req.query;

        // Build query
        const query = { isActive: true };

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        if (inStock === 'true') {
            query.inStock = true;
        }

        if (featured === 'true') {
            query.featured = true;
        }

        if (search) {
            query.$text = { $search: search };
        }

        // Execute query
        const products = await Product.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(query);

        res.set('Cache-Control', 'no-store');
        res.json({
            success: true,
            count: products.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            products
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('reviews');

        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Soft delete - just mark as inactive
        product.isActive = false;
        await product.save();

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res, next) => {
    try {
        const { limit = 8 } = req.query;
        const products = await Product.getFeatured(parseInt(limit));

        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get product categories
 * @route   GET /api/products/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
    try {
        const categories = await Product.distinct('category');



        res.set('Cache-Control', 'no-store');
        res.json({
            success: true,
            categories
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getCategories
};
