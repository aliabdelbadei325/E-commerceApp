import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { API_URL } from '../../services/api';
import './ProductCard.css';

/**
 * ProductCard Component
 * Displays product information with hover effects
 */
const ProductCard = ({ product }) => {
    const [isAdding, setIsAdding] = useState(false);
    const { addToCart } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

    const {
        id,
        _id,
        name,
        price,
        originalPrice,
        image,
        rating,
        reviews,
        badge,
        inStock
    } = product;

    const productId = id || _id;
    const isWishlisted = isInWishlist(productId);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!inStock) return;

        setIsAdding(true);
        addToCart(product);

        setTimeout(() => {
            setIsAdding(false);
        }, 1000);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            removeFromWishlist(productId);
        } else {
            addToWishlist(productId);
        }
    };

    const discount = originalPrice
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    return (
        <article className="product-card glass-card">
            {/* Image Section */}
            <div className="product-card-image-wrapper">
                <Link to={`/products/${productId}`} className="product-image-link">
                    <img
                        src={image && image.startsWith('/') ? `${API_URL.replace('/api', '')}${image}` : image}
                        alt={name}
                        className="product-card-image"
                        loading="lazy"
                    />
                </Link>

                {/* Overlay Actions */}
                <div className="product-card-overlay">
                    <button
                        className={`product-action-btn wishlist-btn ${isWishlisted ? 'active' : ''}`}
                        onClick={handleWishlist}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <FiHeart />
                    </button>

                    <Link
                        to={`/products/${productId}`}
                        className="product-action-btn view-btn"
                        aria-label="View product"
                    >
                        <FiEye />
                    </Link>
                </div>

                {/* Badges */}
                <div className="product-card-badges">
                    {badge && (
                        <span className={`product-badge badge-${badge.toLowerCase().replace(' ', '-')}`}>
                            {badge}
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="product-badge badge-discount">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Out of Stock Overlay */}
                {!inStock && (
                    <div className="product-card-out-of-stock">
                        <span>Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="product-card-content">
                <Link to={`/products/${productId}`} className="product-info-link">
                    {/* Category & Brand Placeholder */}
                    <span className="product-card-category">{product.category || 'Premium Collection'}</span>

                    {/* Name */}
                    <h3 className="product-card-name">{name}</h3>

                    {/* Rating */}
                    <div className="product-card-rating">
                        <div className="stars">
                            <FiStar className="star-icon" />
                            <span className="rating-value">{rating || '5.0'}</span>
                        </div>
                        <span className="rating-count">({reviews || 0} reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="product-card-price">
                        <span className="current-price">${(price || 0).toFixed(2)}</span>
                        {originalPrice && (
                            <span className="original-price">${(originalPrice || 0).toFixed(2)}</span>
                        )}
                    </div>
                </Link>

                {/* Add to Cart Button */}
                <button
                    className={`product-card-cart-btn ${isAdding ? 'adding' : ''} ${!inStock ? 'disabled' : ''}`}
                    onClick={handleAddToCart}
                    disabled={!inStock}
                >
                    <FiShoppingCart />
                    <span>{isAdding ? 'Added!' : inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
            </div>
        </article>
    );
};

export default ProductCard;
