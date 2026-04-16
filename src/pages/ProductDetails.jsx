import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiStar, FiCheck, FiTruck, FiShield, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';
import ProductCard from '../components/ProductCard/ProductCard';
import Skeleton from '../components/Skeleton/Skeleton';
import './ProductDetails.css';

/**
 * ProductDetails Page
 * Single product view with details and add to cart
 */
const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [activeTab, setActiveTab] = useState('description');
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/products/${id}`);
                if (response.data.success) {
                    setProduct(response.data.product);
                    document.title = `${response.data.product.name} | LuxeStore`;

                    // Fetch related products after we have the category
                    const relatedRes = await api.get(`/products?category=${response.data.product.category}&limit=5`);
                    if (relatedRes.data.success) {
                        setRelatedProducts(relatedRes.data.products.filter(p => (p._id || p.id) !== id).slice(0, 4));
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    // ...

    const isWishlisted = isInWishlist(product?._id || product?.id);

    if (loading) {
        return (
            <main className="product-details-page">
                <div className="container" style={{ paddingTop: '100px' }}>
                    <div className="product-details">
                        <div className="product-image-section">
                            <Skeleton height="500px" className="glass-card" />
                        </div>
                        <div className="product-info-section">
                            <Skeleton width="150px" height="20px" style={{ marginBottom: '10px' }} />
                            <Skeleton type="title" width="80%" height="40px" />
                            <Skeleton width="120px" height="30px" style={{ marginBottom: '20px' }} />
                            <Skeleton type="text" height="100px" style={{ marginBottom: '20px' }} />
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <Skeleton type="button" width="150px" />
                                <Skeleton type="button" width="150px" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="product-details-page">
                <div className="container">
                    <div className="product-not-found">
                        <h2>Product Not Found</h2>
                        <p>The product you're looking for doesn't exist.</p>
                        <Link to="/products" className="btn btn-primary">
                            <FiArrowLeft /> Back to Products
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        if (!product.inStock) return;

        setIsAdding(true);
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }

        setTimeout(() => {
            setIsAdding(false);
        }, 1500);
    };

    const handleWishlist = () => {
        const prodId = product._id || product.id;
        if (isWishlisted) {
            removeFromWishlist(prodId);
        } else {
            addToWishlist(prodId);
        }
    };

    const handleBuyNow = () => {
        handleAddToCart();
        setTimeout(() => {
            navigate('/cart');
        }, 500);
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const features = [
        { icon: <FiTruck />, title: 'Free Shipping', description: 'On orders over $50' },
        { icon: <FiShield />, title: 'Warranty', description: '1 year warranty' },
        { icon: <FiRefreshCw />, title: 'Easy Returns', description: '30-day return policy' }
    ];

    return (
        <main className="product-details-page">
            <div className="container animate-in">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to="/products">Products</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{product.name}</span>
                </nav>

                {/* Product Section */}
                <section className="product-details">
                    {/* Product Image */}
                    <div className="product-image-section">
                        <div className="product-main-image glass-card">
                            <img src={product.image && product.image.startsWith('/') ? `${API_URL.replace('/api', '')}${product.image}` : product.image} alt={product.name} />

                            {/* Badges */}
                            {product.badge && (
                                <span className="product-badge">{product.badge}</span>
                            )}
                            {discount > 0 && (
                                <span className="discount-badge">-{discount}%</span>
                            )}

                            {/* Wishlist */}
                            <button
                                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                                onClick={handleWishlist}
                                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                                <FiHeart />
                            </button>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info-section">
                        {/* Rating */}
                        <div className="product-rating">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar
                                        key={i}
                                        className={i < Math.floor(product.rating) ? 'filled' : ''}
                                    />
                                ))}
                            </div>
                            <span className="rating-value">{product.rating}</span>
                            <span className="review-count">({product.reviews?.length || 0} reviews)</span>
                        </div>

                        {/* Title */}
                        <h1 className="product-title">{product.name}</h1>

                        {/* Price */}
                        <div className="product-price">
                            <span className="current-price">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                            )}
                            {discount > 0 && (
                                <span className="save-badge">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="product-description">{product.description}</p>

                        {/* Stock Status */}
                        <div className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                            {product.inStock ? (
                                <>
                                    <FiCheck /> In Stock
                                </>
                            ) : (
                                'Out of Stock'
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="quantity-section">
                            <label className="quantity-label">Quantity:</label>
                            <div className="quantity-selector">
                                <button
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    <FiMinus />
                                </button>
                                <span className="quantity-value">{quantity}</span>
                                <button
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= 10}
                                >
                                    <FiPlus />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="product-actions">
                            <button
                                className={`btn btn-primary add-to-cart-btn ${isAdding ? 'adding' : ''}`}
                                onClick={handleAddToCart}
                                disabled={!product.inStock || isAdding}
                            >
                                <FiShoppingCart />
                                {isAdding ? 'Added to Cart!' : 'Add to Cart'}
                            </button>
                            <button
                                className="btn btn-secondary buy-now-btn"
                                onClick={handleBuyNow}
                                disabled={!product.inStock}
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Features */}
                        <div className="product-features">
                            {features.map((feature, index) => (
                                <div key={index} className="feature-item">
                                    <span className="feature-icon">{feature.icon}</span>
                                    <div className="feature-content">
                                        <span className="feature-title">{feature.title}</span>
                                        <span className="feature-description">{feature.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Product Tabs */}
                <section className="product-tabs-section">
                    <div className="tabs-header">
                        <button
                            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('specifications')}
                        >
                            Specifications
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews ({product.reviews?.length || 0})
                        </button>
                    </div>

                    <div className="tabs-content glass-card">
                        {activeTab === 'description' && (
                            <div className="tab-panel">
                                <h3>Product Description</h3>
                                <p>{product.description}</p>
                                <p>
                                    Experience the perfect blend of style and functionality with this premium product.
                                    Designed with attention to detail and crafted from high-quality materials,
                                    it's built to last and perform exceptionally.
                                </p>
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="tab-panel">
                                <h3>Specifications</h3>
                                <table className="specs-table">
                                    <tbody>
                                        <tr><td>Category</td><td>{product.category}</td></tr>
                                        <tr><td>Rating</td><td>{product.rating} / 5</td></tr>
                                        <tr><td>Reviews</td><td>{product.reviews?.length || 0}</td></tr>
                                        <tr><td>Availability</td><td>{product.inStock ? 'In Stock' : 'Out of Stock'}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="tab-panel">
                                <h3>Customer Reviews</h3>
                                <div className="reviews-summary">
                                    <div className="average-rating">
                                        <span className="big-rating">{Number(product.rating || 0).toFixed(1)}</span>
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar key={i} className={i < Math.round(product.rating || 0) ? 'filled' : ''} />
                                            ))}
                                        </div>
                                        <span className="total-reviews">Based on {product.reviews?.length || 0} reviews</span>
                                    </div>

                                    {/* Add Review Form */}
                                    <div className="add-review-section">
                                        <h4>Write a Review</h4>
                                        <form className="review-form" onSubmit={async (e) => {
                                            e.preventDefault();
                                            const rating = e.target.rating.value;
                                            const comment = e.target.comment.value;

                                            try {
                                                const res = await api.post('/reviews', {
                                                    product: product._id || product.id,
                                                    rating: Number(rating),
                                                    comment
                                                });
                                                if (res.data.success) {
                                                    alert('Review submitted successfully!');
                                                    window.location.reload(); // Simple refresh to show new review
                                                }
                                            } catch (err) {
                                                alert(err.response?.data?.message || 'Error submitting review');
                                            }
                                        }}>
                                            <div className="form-group">
                                                <label>Rating</label>
                                                <select name="rating" className="form-input" required>
                                                    <option value="5">5 - Excellent</option>
                                                    <option value="4">4 - Very Good</option>
                                                    <option value="3">3 - Good</option>
                                                    <option value="2">2 - Fair</option>
                                                    <option value="1">1 - Poor</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Comment</label>
                                                <textarea
                                                    name="comment"
                                                    className="form-input"
                                                    rows="4"
                                                    placeholder="Share your experience..."
                                                    required
                                                ></textarea>
                                            </div>
                                            <button type="submit" className="btn btn-primary">Submit Review</button>
                                        </form>
                                    </div>
                                </div>

                                <div className="reviews-list">
                                    {product.reviews?.length > 0 ? (
                                        product.reviews.map((review, index) => (
                                            <div key={index} className="review-item glass-card animate-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                                <div className="review-header">
                                                    <div className="review-user-info">
                                                        <div className="review-avatar">
                                                            {review.user?.avatar && review.user.avatar.startsWith('/') ? (
                                                                <img
                                                                    src={`${API_URL.replace('/api', '')}${review.user.avatar}`}
                                                                    alt="Avatar"
                                                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                                                />
                                                            ) : (
                                                                review.user?.avatar || (review.userName?.charAt(0) || review.user?.firstName?.charAt(0) || '👤')
                                                            )}
                                                        </div>
                                                        <div className="review-meta">
                                                            <h5 className="review-author">{review.userName || `${review.user?.firstName} ${review.user?.lastName}`}</h5>
                                                            <div className="review-sub-meta">
                                                                <div className="stars small">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <FiStar key={i} className={i < review.rating ? 'filled' : ''} />
                                                                    ))}
                                                                </div>
                                                                <span className="review-date">
                                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="review-body">
                                                    <p className="review-comment">{review.comment}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-reviews-state">
                                            <p className="no-reviews">No reviews yet. Be the first to provide feedback for this product!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Related Products */}
                {
                    relatedProducts.length > 0 && (
                        <section className="related-products-section">
                            <h2 className="section-title">Related Products</h2>
                            <div className="related-products-grid">
                                {relatedProducts.map(p => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </section>
                    )
                }
            </div >
        </main >
    );
};

export default ProductDetails;
