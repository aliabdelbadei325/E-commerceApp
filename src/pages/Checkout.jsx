import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheck, FiCreditCard, FiLock, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FormInput from '../components/FormInput/FormInput';
import {
    validateName,
    validateEmail,
    validatePhone,
    validateAddress,
    validatePostalCode,
    validateRequired
} from '../utils/validation';
import './Checkout.css';

/**
 * Checkout Page
 * Multi-step checkout with form validation
 */
const Checkout = () => {
    const navigate = useNavigate();
    const { items, cartSubtotal, cartTax, cartTotal, clearCart } = useCart();
    const { user } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [submitError, setSubmitError] = useState('');

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'United States',
        paymentMethod: 'card'
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const steps = [
        { number: 1, title: 'Shipping' },
        { number: 2, title: 'Payment' },
        { number: 3, title: 'Review' }
    ];

    // Redirect if cart is empty
    if (items.length === 0 && !orderComplete) {
        return (
            <main className="checkout-page">
                <div className="container">
                    <div className="checkout-empty">
                        <h2>Your cart is empty</h2>
                        <p>Add some products before checking out.</p>
                        <Link to="/products" className="btn btn-primary">
                            <FiArrowLeft /> Shop Now
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, formData[name]);
    };

    const validateField = (name, value) => {
        let result;

        switch (name) {
            case 'firstName':
                result = validateName(value, 'First name');
                break;
            case 'lastName':
                result = validateName(value, 'Last name');
                break;
            case 'email':
                result = validateEmail(value);
                break;
            case 'phone':
                result = validatePhone(value);
                break;
            case 'address':
                result = validateAddress(value);
                break;
            case 'city':
                result = validateRequired(value, 'City');
                break;
            case 'postalCode':
                result = validatePostalCode(value);
                break;
            default:
                result = { isValid: true, message: '' };
        }

        if (!result.isValid) {
            setErrors(prev => ({ ...prev, [name]: result.message }));
        }

        return result.isValid;
    };

    const validateStep = (step) => {
        let isValid = true;
        const fieldsToValidate = step === 1
            ? ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode']
            : [];

        fieldsToValidate.forEach(field => {
            if (!validateField(field, formData[field])) {
                isValid = false;
            }
            setTouched(prev => ({ ...prev, [field]: true }));
        });

        return isValid;
    };

    const handleNextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        if (!couponCode) return;

        setCouponLoading(true);
        setCouponError('');

        try {
            const response = await api.post('/coupons/validate', {
                code: couponCode,
                amount: cartSubtotal
            });

            if (response.data.success) {
                setAppliedCoupon(response.data.coupon);
                setCouponCode('');
            }
        } catch (error) {
            setCouponError(error.response?.data?.message || 'Invalid coupon code');
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    const finalTax = (cartSubtotal - discountAmount) * 0.1;
    const finalTotal = cartSubtotal - discountAmount + (cartSubtotal > 100 ? 0 : 10) + finalTax;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(1)) {
            setCurrentStep(1);
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const orderData = {
                items: items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    image: item.image,
                    price: item.price,
                    product: item.id || item._id
                })),
                shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country,
                    phone: formData.phone
                },
                paymentMethod: formData.paymentMethod,
                couponCode: appliedCoupon?.code,
                subtotal: cartSubtotal,
                tax: finalTax,
                shippingCost: cartSubtotal > 100 ? 0 : 10,
                total: finalTotal
            };

            const response = await api.post('/orders', orderData);

            if (response.data.success) {
                setOrderId(response.data.order.orderNumber);
                clearCart();
                setOrderComplete(true);
            } else {
                setSubmitError(response.data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Order submission failed:', error);
            setSubmitError(
                error.response?.data?.message ||
                'An unexpected error occurred. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Order Complete View
    if (orderComplete) {
        return (
            <main className="checkout-page">
                <div className="container">
                    <div className="order-complete">
                        <div className="success-icon animate-pulse">
                            <FiCheck />
                        </div>
                        <h2 className="success-title">Order Placed Successfully!</h2>
                        <p className="success-message">
                            Thank you for your order. A confirmation email has been sent to {formData.email}.
                        </p>
                        <div className="order-number">
                            Order #: <strong>{orderId || `ORD-${Date.now().toString().slice(-8)}`}</strong>
                        </div>
                        <Link to="/products" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <div className="container">
                {/* Header */}
                <div className="checkout-header">
                    <Link to="/cart" className="back-link">
                        <FiArrowLeft /> Back to Cart
                    </Link>
                    <h1 className="checkout-title">Checkout</h1>
                </div>

                {/* Progress Steps */}
                <div className="checkout-steps">
                    {steps.map((step, index) => (
                        <div
                            key={step.number}
                            className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                        >
                            <div className="step-number">
                                {currentStep > step.number ? <FiCheck /> : step.number}
                            </div>
                            <span className="step-title">{step.title}</span>
                            {index < steps.length - 1 && <div className="step-connector"></div>}
                        </div>
                    ))}
                </div>

                <form className="checkout-layout" onSubmit={handleSubmit}>
                    {/* Form Section */}
                    <div className="checkout-form-section">
                        {submitError && (
                            <div style={{
                                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                                color: 'var(--error-color)',
                                padding: '1rem',
                                borderRadius: 'var(--border-radius-md)',
                                marginBottom: '1.5rem',
                                border: '1px solid var(--error-color)'
                            }}>
                                {submitError}
                            </div>
                        )}

                        {/* Step 1: Shipping */}
                        {currentStep === 1 && (
                            <div className="form-step animate-fadeIn">
                                <h2 className="step-heading">Shipping Information</h2>

                                <div className="form-row">
                                    <FormInput
                                        name="firstName"
                                        label="First Name"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        error={touched.firstName && errors.firstName}
                                        success={touched.firstName && !errors.firstName && formData.firstName}
                                        required
                                    />
                                    <FormInput
                                        name="lastName"
                                        label="Last Name"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        error={touched.lastName && errors.lastName}
                                        success={touched.lastName && !errors.lastName && formData.lastName}
                                        required
                                    />
                                </div>

                                <FormInput
                                    type="email"
                                    name="email"
                                    label="Email Address"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={touched.email && errors.email}
                                    success={touched.email && !errors.email && formData.email}
                                    required
                                />

                                <FormInput
                                    type="tel"
                                    name="phone"
                                    label="Phone Number"
                                    placeholder="+1 (555) 123-4567"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={touched.phone && errors.phone}
                                    success={touched.phone && !errors.phone && formData.phone}
                                    required
                                />

                                <FormInput
                                    name="address"
                                    label="Street Address"
                                    placeholder="123 Main Street, Apt 4B"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={touched.address && errors.address}
                                    success={touched.address && !errors.address && formData.address}
                                    required
                                />

                                <div className="form-row">
                                    <FormInput
                                        name="city"
                                        label="City"
                                        placeholder="New York"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        error={touched.city && errors.city}
                                        success={touched.city && !errors.city && formData.city}
                                        required
                                    />
                                    <FormInput
                                        name="postalCode"
                                        label="Postal Code"
                                        placeholder="10001"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        error={touched.postalCode && errors.postalCode}
                                        success={touched.postalCode && !errors.postalCode && formData.postalCode}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    >
                                        <option value="United States">United States</option>
                                        <option value="Canada">Canada</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Germany">Germany</option>
                                        <option value="France">France</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {currentStep === 2 && (
                            <div className="form-step animate-fadeIn">
                                <h2 className="step-heading">Payment Method</h2>

                                <div className="payment-methods">
                                    <label className={`payment-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={formData.paymentMethod === 'card'}
                                            onChange={handleInputChange}
                                        />
                                        <div className="payment-option-content">
                                            <FiCreditCard className="payment-icon" />
                                            <div className="payment-info">
                                                <span className="payment-title">Credit / Debit Card</span>
                                                <span className="payment-description">Visa, Mastercard, Amex</span>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`payment-option ${formData.paymentMethod === 'paypal' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="paypal"
                                            checked={formData.paymentMethod === 'paypal'}
                                            onChange={handleInputChange}
                                        />
                                        <div className="payment-option-content">
                                            <span className="payment-icon-text">PayPal</span>
                                            <div className="payment-info">
                                                <span className="payment-title">PayPal</span>
                                                <span className="payment-description">Pay with your PayPal account</span>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`payment-option ${formData.paymentMethod === 'apple' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="apple"
                                            checked={formData.paymentMethod === 'apple'}
                                            onChange={handleInputChange}
                                        />
                                        <div className="payment-option-content">
                                            <span className="payment-icon-text">🍎 Pay</span>
                                            <div className="payment-info">
                                                <span className="payment-title">Apple Pay</span>
                                                <span className="payment-description">Fast and secure</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                <div className="secure-notice">
                                    <FiLock />
                                    <span>Your payment information is secure and encrypted</span>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {currentStep === 3 && (
                            <div className="form-step animate-fadeIn">
                                <h2 className="step-heading">Review Your Order</h2>

                                {/* Shipping Details */}
                                <div className="review-section">
                                    <div className="review-header">
                                        <h3>Shipping Address</h3>
                                        <button type="button" className="edit-btn" onClick={() => setCurrentStep(1)}>
                                            Edit
                                        </button>
                                    </div>
                                    <div className="review-content">
                                        <p>{formData.firstName} {formData.lastName}</p>
                                        <p>{formData.address}</p>
                                        <p>{formData.city}, {formData.postalCode}</p>
                                        <p>{formData.country}</p>
                                        <p className="contact-info">{formData.email} • {formData.phone}</p>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="review-section">
                                    <div className="review-header">
                                        <h3>Payment Method</h3>
                                        <button type="button" className="edit-btn" onClick={() => setCurrentStep(2)}>
                                            Edit
                                        </button>
                                    </div>
                                    <div className="review-content">
                                        <p className="payment-display">
                                            {formData.paymentMethod === 'card' && '💳 Credit / Debit Card'}
                                            {formData.paymentMethod === 'paypal' && '💰 PayPal'}
                                            {formData.paymentMethod === 'apple' && '🍎 Apple Pay'}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="review-section">
                                    <h3>Order Items ({items.length})</h3>
                                    <div className="review-items">
                                        {items.map(item => (
                                            <div key={item.id} className="review-item">
                                                <img src={item.image} alt={item.name} />
                                                <div className="item-details">
                                                    <span className="item-name">{item.name}</span>
                                                    <span className="item-qty">Qty: {item.quantity}</span>
                                                </div>
                                                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="form-navigation">
                            {currentStep > 1 && (
                                <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
                                    <FiArrowLeft /> Back
                                </button>
                            )}

                            {currentStep < 3 ? (
                                <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className={`btn btn-primary place-order-btn ${isSubmitting ? 'loading' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Processing...' : `Place Order - $${finalTotal.toFixed(2)}`}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <aside className="checkout-summary glass-card">
                        <h2 className="summary-title">Order Summary</h2>

                        {/* Items Preview */}
                        <div className="summary-items">
                            {items.slice(0, 3).map(item => (
                                <div key={item.id} className="summary-item">
                                    <div className="item-image-wrapper">
                                        <img src={item.image} alt={item.name} />
                                        <span className="item-qty-badge">{item.quantity}</span>
                                    </div>
                                    <div className="item-info">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-price">${item.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                            {items.length > 3 && (
                                <p className="more-items">+ {items.length - 3} more items</p>
                            )}
                        </div>

                        <div className="summary-divider"></div>

                        {/* Coupon Section */}
                        <div className="coupon-section">
                            {appliedCoupon ? (
                                <div className="applied-coupon">
                                    <div className="coupon-info">
                                        <FiCheck className="check-icon" />
                                        <span>Coupon <strong>{appliedCoupon.code}</strong> applied!</span>
                                    </div>
                                    <button type="button" className="remove-btn" onClick={removeCoupon}>
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="coupon-form">
                                    <input
                                        type="text"
                                        placeholder="Discount Code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="coupon-input"
                                    />
                                    <button
                                        type="button"
                                        className="apply-btn"
                                        onClick={handleApplyCoupon}
                                        disabled={couponLoading || !couponCode}
                                    >
                                        {couponLoading ? '...' : 'Apply'}
                                    </button>
                                    {couponError && <p className="coupon-error">{couponError}</p>}
                                </div>
                            )}
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-rows">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${cartSubtotal.toFixed(2)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="summary-row discount">
                                    <span>Discount ({appliedCoupon.code})</span>
                                    <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free-shipping">{cartSubtotal > 100 ? 'Free' : '$10.00'}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax (10%)</span>
                                <span>${finalTax.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-total">
                            <span>Total</span>
                            <span className="total-price">${finalTotal.toFixed(2)}</span>
                        </div>
                    </aside>
                </form>
            </div>
        </main>
    );
};

export default Checkout;
