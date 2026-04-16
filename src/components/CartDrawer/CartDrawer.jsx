import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiTrash2, FiShoppingBag, FiArrowRight, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './CartDrawer.css';

const CartDrawer = () => {
    const {
        isCartOpen,
        toggleCart,
        items,
        removeFromCart,
        updateQuantity,
        cartSubtotal
    } = useCart();
    const drawerRef = useRef(null);
    const navigate = useNavigate();

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') toggleCart(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [toggleCart]);

    const handleCheckout = () => {
        toggleCart(false);
        navigate('/checkout');
    };

    if (!isCartOpen) return null;

    return (
        <div className="cart-drawer-overlay" onClick={() => toggleCart(false)}>
            <div
                className="cart-drawer animate-slide-in-right"
                onClick={(e) => e.stopPropagation()}
                ref={drawerRef}
            >
                <div className="drawer-header">
                    <h2>Shopping Cart ({items.length})</h2>
                    <button className="close-btn" onClick={() => toggleCart(false)}>
                        <FiX />
                    </button>
                </div>

                <div className="drawer-content">
                    {items.length === 0 ? (
                        <div className="empty-cart-state">
                            <FiShoppingBag size={48} />
                            <p>Your cart is empty</p>
                            <button className="btn btn-secondary" onClick={() => toggleCart(false)}>
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="drawer-items">
                            {items.map(item => (
                                <div key={item.id || item._id} className="drawer-item">
                                    <div className="item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <div className="item-header">
                                            <h4>{item.name}</h4>
                                            <button
                                                className="remove-btn"
                                                onClick={() => removeFromCart(item.id || item._id)}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                        <p className="item-price">${item.price?.toFixed(2)}</p>
                                        <div className="item-actions">
                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <FiMinus size={12} />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}
                                                    disabled={item.quantity >= 10}
                                                >
                                                    <FiPlus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="drawer-footer">
                        <div className="subtotal-row">
                            <span>Subtotal</span>
                            <span className="price">${cartSubtotal.toFixed(2)}</span>
                        </div>
                        <p className="shipping-note">Shipping & taxes calculated at checkout</p>

                        <div className="drawer-actions">
                            <Link to="/cart" className="btn btn-secondary" onClick={() => toggleCart(false)}>
                                View Cart
                            </Link>
                            <button className="btn btn-primary" onClick={handleCheckout}>
                                Checkout <FiArrowRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
