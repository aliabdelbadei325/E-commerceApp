import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import api, { API_URL } from '../../services/api';
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiHeart, FiUser, FiLogOut, FiGrid, FiPackage, FiSun, FiMoon } from 'react-icons/fi';
import './Header.css';

/**
 * Header Component
 * Navigation bar with logo, search, cart, and auth
 */
const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { cartItemsCount, toggleCart } = useCart();
    const { wishlist } = useWishlist();
    const { user, isAuthenticated, logout, getDashboardPath } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/products', label: 'Products' },
        { path: '/cart', label: 'Cart' }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length > 1) {
                try {
                    const response = await api.get(`/products?search=${searchQuery}&limit=5`);
                    if (response.data.success) {
                        setSuggestions(response.data.products);
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.error('Failed to fetch suggestions');
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="header-container container">
                {/* Logo */}
                <Link to="/" className="header-logo">
                    <span className="logo-icon">✦</span>
                    <span className="logo-text">Luxe<span className="text-gradient">Store</span></span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="header-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <Link
                            to={getDashboardPath()}
                            className={`nav-link ${location.pathname.includes('dashboard') || location.pathname.includes('admin') || location.pathname.includes('staff') ? 'active' : ''}`}
                        >
                            Dashboard
                        </Link>
                    )}
                </nav>

                {/* Search Bar */}
                <div className="header-search-container">
                    <form className="header-search" onSubmit={handleSearch}>
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                            className="search-input"
                        />
                    </form>

                    {showSuggestions && suggestions.length > 0 && (
                        <div className="search-suggestions glass-card">
                            {suggestions.map((product) => (
                                <Link
                                    key={product._id}
                                    to={`/products/${product._id}`}
                                    className="suggestion-item"
                                    onClick={() => {
                                        setShowSuggestions(false);
                                        setSearchQuery('');
                                    }}
                                >
                                    <img
                                        src={product.image.startsWith('/') ? `${API_URL.replace('/api', '')}${product.image}` : product.image}
                                        alt={product.name}
                                        className="suggestion-image"
                                    />
                                    <div className="suggestion-info">
                                        <div className="suggestion-name">{product.name}</div>
                                        <div className="suggestion-price">${product.price.toFixed(2)}</div>
                                    </div>
                                </Link>
                            ))}
                            <div className="suggestion-footer" onClick={handleSearch}>
                                View all results for "{searchQuery}"
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="header-actions">
                    {/* Theme Toggle */}
                    <button
                        className="btn-icon header-action-btn"
                        onClick={toggleTheme}
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? <FiSun /> : <FiMoon />}
                    </button>

                    <Link to="/wishlist" className="btn-icon header-action-btn" aria-label="Wishlist">
                        <FiHeart />
                        {wishlist.length > 0 && (
                            <span className="cart-badge">{wishlist.length}</span>
                        )}
                    </Link>

                    <button
                        className="btn-icon header-action-btn cart-btn"
                        aria-label="Cart"
                        onClick={() => toggleCart(true)}
                    >
                        <FiShoppingCart />
                        {cartItemsCount > 0 && (
                            <span className="cart-badge">{cartItemsCount}</span>
                        )}
                    </button>

                    {/* Auth Buttons */}
                    {isAuthenticated ? (
                        <div className="header-user-menu">
                            <Link to={getDashboardPath()} className="header-profile-link" title={`${user?.firstName} (${user?.role})`}>
                                <div className="header-avatar-mini">
                                    {user?.avatar && user.avatar.startsWith('/') ? (
                                        <img
                                            src={`${API_URL.replace('/api', '')}${user.avatar}`}
                                            alt="Avatar"
                                        />
                                    ) : (
                                        user?.avatar || '👤'
                                    )}
                                </div>
                            </Link>
                            <button
                                className="btn-icon header-action-btn"
                                onClick={handleLogout}
                                aria-label="Logout"
                                title="Sign Out"
                            >
                                <FiLogOut />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-icon header-action-btn" aria-label="Login">
                            <FiUser />
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="btn-icon header-action-btn menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
                <form className="mobile-search" onSubmit={handleSearch}>
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </form>
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}

                {/* Mobile Auth Links */}
                {isAuthenticated ? (
                    <>
                        <Link
                            to={getDashboardPath()}
                            className="mobile-nav-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <FiGrid style={{ marginRight: '8px' }} />
                            Dashboard ({user?.role})
                        </Link>
                        <Link
                            to="/orders"
                            className="mobile-nav-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <FiPackage style={{ marginRight: '8px' }} />
                            My Orders
                        </Link>
                        <Link
                            to="/wishlist"
                            className="mobile-nav-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <FiHeart style={{ marginRight: '8px' }} />
                            My Wishlist
                        </Link>
                        <button
                            className="mobile-nav-link"
                            onClick={handleLogout}
                            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}
                        >
                            <FiLogOut style={{ marginRight: '8px' }} />
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="mobile-nav-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <FiUser style={{ marginRight: '8px' }} />
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="mobile-nav-link"
                            onClick={() => setIsMenuOpen(false)}
                            style={{ color: 'var(--color-accent-primary)' }}
                        >
                            Create Account
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
