import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield } from 'react-icons/fi';
import './Hero.css';

/**
 * Hero Component
 * Full-width promotional banner with animated content
 */
const Hero = () => {
    const features = [
        { icon: <FiShoppingBag />, text: 'Premium Quality' },
        { icon: <FiTruck />, text: 'Free Shipping' },
        { icon: <FiShield />, text: 'Secure Payment' }
    ];

    return (
        <section className="hero">
            {/* Animated Background Elements */}
            <div className="hero-bg-elements">
                <div className="bg-circle bg-circle-1"></div>
                <div className="bg-circle bg-circle-2"></div>
                <div className="bg-circle bg-circle-3"></div>
            </div>

            <div className="hero-container container">
                <div className="hero-content">
                    {/* Badge */}
                    <div className="hero-badge animate-fadeInDown">
                        ✨ New Collection 2026
                    </div>

                    {/* Heading */}
                    <h1 className="hero-title animate-fadeInUp">
                        Discover
                        <span className="hero-title-accent"> Premium</span>
                        <br />
                        Products
                    </h1>

                    {/* Description */}
                    <p className="hero-description animate-fadeInUp stagger-2">
                        Explore our curated collection of premium products designed for the modern lifestyle.
                        Quality meets elegance in every piece.
                    </p>

                    {/* CTA Buttons */}
                    <div className="hero-actions animate-fadeInUp stagger-3">
                        <Link to="/products" className="btn btn-primary hero-btn">
                            Shop Now
                            <FiArrowRight />
                        </Link>
                        <Link to="/products?category=new" className="btn btn-secondary hero-btn">
                            View Collection
                        </Link>
                    </div>

                    {/* Features */}
                    <div className="hero-features animate-fadeInUp stagger-4">
                        {features.map((feature, index) => (
                            <div key={index} className="hero-feature">
                                <span className="hero-feature-icon">{feature.icon}</span>
                                <span className="hero-feature-text">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hero Image/Visual */}
                <div className="hero-visual animate-fadeIn">
                    <div className="hero-image-wrapper">
                        <img
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600"
                            alt="Premium Products Collection"
                            className="hero-image"
                        />
                        <div className="hero-image-overlay"></div>
                    </div>

                    {/* Floating Cards */}
                    <div className="floating-card floating-card-1 animate-float">
                        <div className="floating-card-icon">🎧</div>
                        <div className="floating-card-content">
                            <span className="floating-card-label">Best Seller</span>
                            <span className="floating-card-value">$299</span>
                        </div>
                    </div>

                    <div className="floating-card floating-card-2 animate-float" style={{ animationDelay: '0.5s' }}>
                        <div className="floating-card-icon">⭐</div>
                        <div className="floating-card-content">
                            <span className="floating-card-label">Rating</span>
                            <span className="floating-card-value">4.9/5</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="hero-stats">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-value">10K+</span>
                            <span className="stat-label">Happy Customers</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-value">500+</span>
                            <span className="stat-label">Premium Products</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-value">99%</span>
                            <span className="stat-label">Satisfaction Rate</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
