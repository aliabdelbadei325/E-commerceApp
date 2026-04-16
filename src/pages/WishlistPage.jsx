import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import './Products.css'; // Reusing products grid styles

const WishlistPage = () => {
    const { wishlist, removeFromWishlist, loading } = useWishlist();
    const { addToCart } = useCart();

    if (loading) return <div className="loading-screen">Loading wishlist...</div>;

    return (
        <main className="wishlist-page" style={{ padding: '120px 0' }}>
            <div className="container">
                <div className="products-header">
                    <h1 className="products-title">My <span>Wishlist</span></h1>
                    <p className="products-count">{wishlist.length} items saved</p>
                </div>

                {wishlist.length === 0 ? (
                    <div className="empty-state" style={{ textAlign: 'center', padding: '50px 0' }}>
                        <FiHeart size={50} style={{ color: 'var(--text-muted)', marginBottom: '20px' }} />
                        <h2>Your wishlist is empty</h2>
                        <p>Start adding products you love!</p>
                        <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="products-grid">
                        {wishlist.map((product) => (
                            <div key={product._id} className="product-card glass-card animate-in">
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                    <button
                                        className="btn-icon remove-wishlist-btn"
                                        onClick={() => removeFromWishlist(product._id)}
                                        title="Remove from wishlist"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p className="product-category">{product.category}</p>
                                    <div className="product-footer">
                                        <span className="product-price">${product.price}</span>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => addToCart(product)}
                                        >
                                            <FiShoppingCart /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default WishlistPage;
