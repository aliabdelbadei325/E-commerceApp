import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag, FiTag, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './CartPage.css';

/**
 * CartPage
 * Shopping cart with item management
 */
const CartPage = () => {
    const {
        items,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartTax,
        cartDiscount,
        cartTotal,
        applyCoupon,
        removeCoupon,
        appliedCoupon
    } = useCart();

    const [promoCode, setPromoCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    const handleQuantityChange = (id, currentQuantity, delta) => {
        const newQuantity = currentQuantity + delta;
        updateQuantity(id, newQuantity);
    };

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        if (!promoCode.trim()) return;

        setIsApplying(true);
        setCouponError('');
        setCouponSuccess('');

        const result = await applyCoupon(promoCode);

        if (result.success) {
            setCouponSuccess(result.message);
            setPromoCode('');
        } else {
            setCouponError(result.message);
        }

        setIsApplying(false);
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponSuccess('');
        setCouponError('');
    };

    if (items.length === 0) {
        return (
            <main className="cart-page">
                <div className="container">
                    <div className="cart-empty">
                        <div className="empty-icon">
                            <FiShoppingBag />
                        </div>
                        <h2 className="empty-title">Your cart is empty</h2>
                        <p className="empty-description">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Link to="/products" className="btn btn-primary">
                            <FiArrowLeft /> Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <div className="container">
                {/* Header */}
                <div className="cart-header">
                    <h1 className="cart-title">Shopping Cart</h1>
                    <span className="cart-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items-section">
                        <div className="cart-items">
                            {items.map((item) => (
                                <article key={item.id} className="cart-item glass-card">
                                    {/* Product Image */}
                                    <Link to={`/products/${item.id}`} className="cart-item-image">
                                        <img src={item.image} alt={item.name} />
                                    </Link>

                                    {/* Product Info */}
                                    <div className="cart-item-info">
                                        <Link to={`/products/${item.id}`} className="cart-item-name">
                                            {item.name}
                                        </Link>
                                        <span className="cart-item-category">{item.category}</span>
                                        <span className="cart-item-price">${item.price.toFixed(2)}</span>
                                    </div>

                                    {/* Quantity */}
                                    <div className="cart-item-quantity">
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                            disabled={item.quantity <= 1}
                                            aria-label="Decrease quantity"
                                        >
                                            <FiMinus />
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                            disabled={item.quantity >= 10}
                                            aria-label="Increase quantity"
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>

                                    {/* Total */}
                                    <div className="cart-item-total">
                                        <span className="total-label">Total:</span>
                                        <span className="total-value">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        className="cart-item-remove"
                                        onClick={() => removeFromCart(item.id)}
                                        aria-label="Remove item"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </article>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="cart-actions">
                            <Link to="/products" className="btn btn-secondary">
                                <FiArrowLeft /> Continue Shopping
                            </Link>
                            <button className="btn btn-secondary clear-cart-btn" onClick={clearCart}>
                                <FiTrash2 /> Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <aside className="cart-summary glass-card">
                        <h2 className="summary-title">Order Summary</h2>

                        <div className="summary-rows">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${cartSubtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free-shipping">Free</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax (10%)</span>
                                <span>${cartTax.toFixed(2)}</span>
                            </div>

                            {appliedCoupon && (
                                <div className="summary-row discount-row">
                                    <span className="discount-label">
                                        <FiTag /> Discount ({appliedCoupon.code})
                                    </span>
                                    <span className="discount-value">-${cartDiscount.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-total">
                            <span>Total</span>
                            <span className="total-price">${cartTotal.toFixed(2)}</span>
                        </div>

                        <Link to="/checkout" className="btn btn-primary checkout-btn">
                            Proceed to Checkout
                        </Link>

                        {/* Promo Code */}
                        <div className="promo-section">
                            <label className="promo-label">Have a promo code?</label>

                            {appliedCoupon ? (
                                <div className="applied-coupon glass-card">
                                    <div className="coupon-info">
                                        <FiTag className="icon" />
                                        <span className="code">{appliedCoupon.code}</span>
                                        <span className="details">
                                            {appliedCoupon.discountType === 'percentage'
                                                ? `${appliedCoupon.discountValue}% off`
                                                : `$${appliedCoupon.discountValue} off`}
                                        </span>
                                    </div>
                                    <button className="remove-coupon-btn" onClick={handleRemoveCoupon}>
                                        <FiX />
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleApplyCoupon} className="promo-input-group">
                                    <input
                                        type="text"
                                        placeholder="Enter code"
                                        className="form-input promo-input"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        disabled={isApplying}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-secondary promo-btn"
                                        disabled={isApplying || !promoCode}
                                    >
                                        {isApplying ? '...' : 'Apply'}
                                    </button>
                                </form>
                            )}

                            {couponError && <p className="coupon-message error">{couponError}</p>}
                            {couponSuccess && <p className="coupon-message success">{couponSuccess}</p>}
                        </div>

                        {/* Trust Badges */}
                        <div className="trust-badges">
                            <div className="trust-badge">
                                <span className="badge-icon">🔒</span>
                                <span className="badge-text">Secure Checkout</span>
                            </div>
                            <div className="trust-badge">
                                <span className="badge-icon">🚚</span>
                                <span className="badge-text">Free Shipping</span>
                            </div>
                            <div className="trust-badge">
                                <span className="badge-icon">↩️</span>
                                <span className="badge-text">Easy Returns</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default CartPage;
