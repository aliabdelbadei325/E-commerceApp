/**
 * Auth Controller
 * Handle user registration and login
 */

const User = require('../models/User');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { firstName, lastName, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password,
            role: 'user' // Always register as user
        });

        // Generate token
        const token = user.generateToken();

        // Send Welcome Email
        try {
            const welcomeHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <span style="font-size: 24px; font-weight: bold; color: #8b5cf6;">Luxe<span style="color: #333;">Store</span></span>
                    </div>
                    <h2 style="color: #333; text-align: center;">Welcome to LuxeStore, ${firstName}!</h2>
                    <p style="color: #666; line-height: 1.6;">
                        Thank you for joining our exclusive community of luxury shoppers. We're thrilled to have you with us!
                    </p>
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #333;">Getting Started:</h3>
                        <ul style="color: #666; padding-left: 20px;">
                            <li>Explore our premium collections.</li>
                            <li>Save items to your wishlist.</li>
                            <li>Enjoy a seamless shopping experience.</li>
                        </ul>
                    </div>
                    <p style="color: #666;">
                        If you have any questions, feel free to reply to this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        &copy; 2026 LuxeStore Inc. All rights reserved.
                    </p>
                </div>
            `;

            await sendEmail({
                email: user.email,
                subject: 'Welcome to LuxeStore - Your Premium Fashion Destination',
                html: welcomeHtml
            });
        } catch (error) {
            console.error('Welcome email failed to send:', error);
            // Don't throw error to not interrupt sign up flow
        }

        // Response (without password)
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
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
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user with password
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        // Generate token
        const token = user.generateToken();

        res.json({
            success: true,
            message: 'Login successful',
            token,
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
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/password
 * @access  Private
 */
const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Generate new token
        const token = user.generateToken();

        res.json({
            success: true,
            message: 'Password updated successfully',
            token
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout (client-side - just return success)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};

module.exports = {
    register,
    login,
    getMe,
    updatePassword,
    logout
};
