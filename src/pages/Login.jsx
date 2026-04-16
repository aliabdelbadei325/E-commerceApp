import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm } from '../utils/validation';
import { sanitizeInput } from '../utils/security';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import './Login.css';

/**
 * Login Page Component
 * Secure login with validation and rate limiting
 */
const Login = () => {
    const navigate = useNavigate();
    const { login, getDashboardPath } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Sanitize input on change
        const sanitizedValue = name === 'password' ? value : sanitizeInput(value);

        setFormData(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));

        // Clear field error on change
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear alert on change
        if (alert.message) {
            setAlert({ type: '', message: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const validation = validateLoginForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsLoading(true);
        setAlert({ type: '', message: '' });

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                setAlert({ type: 'success', message: 'Login successful! Redirecting...' });

                // Use immediate user data for redirection to avoid waiting for state update
                const userRole = result.user?.role;
                let dashboardPath = '/dashboard';
                if (userRole === 'admin') dashboardPath = '/admin';
                else if (userRole === 'staff') dashboardPath = '/staff';

                navigate(dashboardPath);
            } else {
                setAlert({
                    type: 'error',
                    message: result.error
                });
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

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="login-bg-circle login-bg-circle-1"></div>
                <div className="login-bg-circle login-bg-circle-2"></div>
            </div>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <Link to="/" className="login-logo">
                            <span className="login-logo-icon">✦</span>
                            <span>LuxeStore</span>
                        </Link>
                        <h1 className="login-title">Welcome Back</h1>
                        <p className="login-subtitle">Sign in to your account</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit} noValidate>
                        {alert.message && (
                            <div className={`login-alert ${alert.type}`}>
                                <FiAlertCircle />
                                <span>{alert.message}</span>
                            </div>
                        )}

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
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                        </div>

                        <div className="login-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="forgot-password">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register">Create one</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
