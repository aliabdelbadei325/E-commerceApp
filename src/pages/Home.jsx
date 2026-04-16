import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Hero from '../components/Hero/Hero';
import ProductGrid from '../components/ProductGrid/ProductGrid';
import api from '../services/api';
import { featuredCategories } from '../data/products';
import './Home.css';

/**
 * Home Page
 * Landing page with hero, featured products, and categories
 */
const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [featuredRes, productsRes, categoriesRes] = await Promise.all([
                    api.get('/products/featured'),
                    api.get('/products?limit=12'),
                    api.get('/products/categories')
                ]);

                if (featuredRes.data.success) {
                    setFeaturedProducts(featuredRes.data.products);
                }

                if (productsRes.data.success) {
                    setBestSellers(productsRes.data.products.slice(4, 8));
                    if (featuredProducts.length === 0) {
                        setFeaturedProducts(productsRes.data.products.slice(0, 8));
                    }
                }

                if (categoriesRes.data.success) {
                    // Transform string categories to objects for UI
                    const cats = categoriesRes.data.categories.slice(0, 4).map(cat => ({
                        id: cat,
                        name: cat,
                        description: 'Explore our collection',
                        image: '/images/placeholder.jpg', // You might want real images later
                        productCount: '10+'
                    }));
                    setCategories(cats);
                }
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
        document.title = 'LuxeStore | Premium E-commerce';
    }, []);

    return (
        <main className="home-page">
            {/* Hero Section */}
            <Hero />

            {/* Featured Categories */}
            <section className="home-section categories-section">
                <div className="container animate-in">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Shop by Category</h2>
                            <p className="section-subtitle">Explore our curated collections</p>
                        </div>
                        <Link to="/products" className="section-link">
                            View All <FiArrowRight />
                        </Link>
                    </div>

                    <div className="categories-grid">
                        {categories.map((category, index) => (
                            <Link
                                key={category.id}
                                to={`/products?category=${category.id}`}
                                className="category-card glass-card animate-fadeInUp"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="category-image-wrapper">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="category-image"
                                    />
                                    <div className="category-overlay"></div>
                                </div>
                                <div className="category-content">
                                    <h3 className="category-name">{category.name}</h3>
                                    <p className="category-description">{category.description}</p>
                                    <span className="category-count">{category.productCount} products</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="home-section products-section">
                <div className="container animate-in">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Featured Products</h2>
                            <p className="section-subtitle">Handpicked for you</p>
                        </div>
                        <Link to="/products" className="section-link">
                            View All <FiArrowRight />
                        </Link>
                    </div>

                    <ProductGrid products={featuredProducts} />
                </div>
            </section>

            {/* Promotional Banner */}
            <section className="home-section promo-section">
                <div className="container animate-in">
                    <div className="promo-banner glass-card">
                        <div className="promo-content">
                            <span className="promo-badge">Limited Time Offer</span>
                            <h2 className="promo-title">
                                Get <span className="text-gradient">25% Off</span><br />
                                Your First Order
                            </h2>
                            <p className="promo-description">
                                Sign up today and enjoy exclusive discounts on premium products.
                            </p>
                            <Link to="/products" className="btn btn-primary promo-btn">
                                Shop Now <FiArrowRight />
                            </Link>
                        </div>
                        <div className="promo-visual">
                            <div className="promo-circle"></div>
                            <img
                                src="https://images.unsplash.com/photo-1491553895911-0055uj6f?w=400"
                                alt="Promotional"
                                className="promo-image"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Best Sellers */}
            {bestSellers.length > 0 && (
                <section className="home-section products-section">
                    <div className="container animate-in">
                        <div className="section-header">
                            <div>
                                <h2 className="section-title">Best Sellers</h2>
                                <p className="section-subtitle">Most loved by our customers</p>
                            </div>
                            <Link to="/products" className="section-link">
                                View All <FiArrowRight />
                            </Link>
                        </div>

                        <ProductGrid products={bestSellers} />
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="home-section features-section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-item glass-card animate-fadeInUp">
                            <div className="feature-icon">🚚</div>
                            <h3 className="feature-title">Free Shipping</h3>
                            <p className="feature-description">On orders over $50</p>
                        </div>
                        <div className="feature-item glass-card animate-fadeInUp stagger-2">
                            <div className="feature-icon">🔒</div>
                            <h3 className="feature-title">Secure Payment</h3>
                            <p className="feature-description">100% secure checkout</p>
                        </div>
                        <div className="feature-item glass-card animate-fadeInUp stagger-3">
                            <div className="feature-icon">↩️</div>
                            <h3 className="feature-title">Easy Returns</h3>
                            <p className="feature-description">30-day return policy</p>
                        </div>
                        <div className="feature-item glass-card animate-fadeInUp stagger-4">
                            <div className="feature-icon">💬</div>
                            <h3 className="feature-title">24/7 Support</h3>
                            <p className="feature-description">Always here to help</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
