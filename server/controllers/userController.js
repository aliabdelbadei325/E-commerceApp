/**
 * User Controller
 * User management for admin/staff
 */

const User = require('../models/User');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, role, search } = req.query;

        // Build query
        const query = {};

        if (role && ['user', 'admin', 'staff'].includes(role)) {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            count: users.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            users
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, role, isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (role) user.role = role;
        if (typeof isActive === 'boolean') user.isActive = isActive;

        await user.save();

        res.json({
            success: true,
            message: 'User updated successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting self
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        await user.deleteOne();

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create user (Admin)
 * @route   POST /api/users
 * @access  Private/Admin
 */
const createUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role: role || 'user',
            emailVerified: true // Admin created users are verified
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user stats
 * @route   GET /api/users/stats
 * @access  Private/Admin
 */
const getUserStats = async (req, res, next) => {
    try {
        const stats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });

        res.json({
            success: true,
            stats: {
                total: totalUsers,
                active: activeUsers,
                byRole: stats.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {})
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
    try {
        const { firstName, lastName, email, avatar } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email.toLowerCase();
        if (avatar) user.avatar = avatar;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user addresses
 * @route   GET /api/users/addresses
 * @access  Private
 */
const getAddresses = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            addresses: user.addresses || []
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Add new address
 * @route   POST /api/users/addresses
 * @access  Private
 */
const addAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        // If this is the first address, make it default
        const isDefault = user.addresses.length === 0 ? true : req.body.isDefault;

        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push({ ...req.body, isDefault });
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            addresses: user.addresses
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update address
 * @route   PUT /api/users/addresses/:id
 * @access  Private
 */
const updateAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const address = user.addresses.id(req.params.id);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        if (req.body.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        Object.assign(address, req.body);
        await user.save();

        res.json({
            success: true,
            message: 'Address updated successfully',
            addresses: user.addresses
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete address
 * @route   DELETE /api/users/addresses/:id
 * @access  Private
 */
const deleteAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const address = user.addresses.id(req.params.id);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        const wasDefault = address.isDefault;
        user.addresses.pull(req.params.id);

        // If we deleted the default address, make another one default if possible
        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Address deleted successfully',
            addresses: user.addresses
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
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
};
