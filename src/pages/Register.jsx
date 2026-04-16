import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateRegisterForm } from '../utils/validation';
import { validatePasswordStrength, sanitizeInput } from '../utils/security';
import {
    FiUser, FiMail, FiLock, FiEye, FiEyeOff,
    FiAlertCircle, FiCheck, FiX
} from 'react-icons/fi';
import './Register.css';

/**
 * Register Page Component
 * Secure registration with validation and password strength indicator
 */
const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [passwordStrength, setPasswordStrength] = useState({
        strength: '',
        score: 0,
        requirements: {}
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        // Sanitize text inputs (not password)
        const sanitizedValue = (name === 'password' || name === 'confirmPassword' || type === 'checkbox')
            ? newValue
            : sanitizeInput(value);

        setFormData(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));

        // Update password strength
        if (name === 'password') {
            setPasswordStrength(validatePasswordStrength(value));
        }

        // Clear field error
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        if (alert.message) {
            setAlert({ type: '', message: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const validation = validateRegisterForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        // Check terms agreement
        if (!formData.agreeTerms) {
            setErrors(prev => ({
                ...prev,
                agreeTerms: 'You must agree to the terms and conditions'
            }));
            return;
        }

        setIsLoading(true);
        setAlert({ type: '', message: '' });

        try {
            const result = await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });

            if (result.success) {
                setAlert({
                    type: 'success',
                    message: 'Account created successfully! Redirecting...'
                });
                navigate('/dashboard'); // Direct to dashboard since we auto-login on register
            } else {
                setAlert({ type: 'error', message: result.error });
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: 'An unexpected error occurred. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const requirements = [
        { key: 'minLength', label: 'At least 8 characters' },
        { key: 'hasUppercase', label: 'One uppercase letter' },
        { key: 'hasLowercase', label: 'One lowercase letter' },
        { key: 'hasNumber', label: 'One number' },
        { key: 'hasSpecial', label: 'One special character' }
    ];

    return (
        <div className="register-page">
            <div className="register-bg">
                <div className="register-bg-circle register-bg-circle-1"></div>
                <div className="register-bg-circle register-bg-circle-2"></div>
            </div>

            <div className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <Link to="/" className="register-logo">
                            <span className="register-logo-icon">✦</span>
                            <span>LuxeStore</span>
                        </Link>
                        <h1 className="register-title">Create Account</h1>
                        <p className="register-subtitle">Join us and start shopping</p>
                    </div>

                    <form className="register-form" onSubmit={handleSubmit} noValidate>
                        {alert.message && (
                            <div className={`register-alert ${alert.type}`}>
                                <FiAlertCircle />
                                <span>{alert.message}</span>
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="firstName">First Name</label>
                                <div className="input-wrapper">
                                    <FiUser className="input-icon" />
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="John"
                                        className={errors.firstName ? 'error' : ''}
                                        autoComplete="given-name"
                                    />
                                </div>
                                {errors.firstName && (
                                    <span className="field-error">
                                        <FiAlertCircle />
                                        {errors.firstName}
                                    </span>
                                )}
                            </div>

                            <div className="form-field">
                                <label htmlFor="lastName">Last Name</label>
                                <div className="input-wrapper">
                                    <FiUser className="input-icon" />
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        className={errors.lastName ? 'error' : ''}
                                        autoComplete="family-name"
                                    />
                                </div>
                                {errors.lastName && (
                                    <span className="field-error">
                                        <FiAlertCircle />
                                        {errors.lastName}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <FiMail className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className={errors.email ? 'error' : ''}
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && (
                                <span className="field-error">
                                    <FiAlertCircle />
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={errors.password ? 'error' : ''}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="field-error">
                                    <FiAlertCircle />
                                    {errors.password}
                                </span>
                            )}

                            {formData.password && (
                                <div className="password-strength">
                                    <div className="strength-bar">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div
                                                key={i}
                                                className={`strength-segment ${passwordStrength.score >= i
                                                    ? `active ${passwordStrength.strength}`
                                                    : ''
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className={`strength-label ${passwordStrength.strength}`}>
                                        Password strength: {passwordStrength.strength || 'none'}
                                    </span>

                                    <div className="password-requirements">
                                        {requirements.map(req => (
                                            <div
                                                key={req.key}
                                                className={`requirement ${passwordStrength.requirements[req.key] ? 'met' : ''
                                                    }`}
                                            >
                                                {passwordStrength.requirements[req.key]
                                                    ? <FiCheck />
                                                    : <FiX />
                                                }
                                                <span>{req.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={errors.confirmPassword ? 'error' : ''}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="field-error">
                                    <FiAlertCircle />
                                    {errors.confirmPassword}
                                </span>
                            )}
                        </div>

                        <label className="terms-checkbox">
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                            />
                            <span>
                                I agree to the{' '}
                                <Link to="/terms">Terms of Service</Link>
                                {' '}and{' '}
                                <Link to="/privacy">Privacy Policy</Link>
                            </span>
                        </label>
                        {errors.agreeTerms && (
                            <span className="field-error">
                                <FiAlertCircle />
                                {errors.agreeTerms}
                            </span>
                        )}

                        <button
                            type="submit"
                            className="register-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="register-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
