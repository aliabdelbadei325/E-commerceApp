import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi';
import './Footer.css';

/**
 * Footer Component
 * Site footer with links and newsletter
 */
const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        shop: [
            { label: 'All Products', path: '/products' },
            { label: 'Electronics', path: '/products?category=electronics' },
            { label: 'Accessories', path: '/products?category=accessories' },
            { label: 'New Arrivals', path: '/products?category=new' }
        ],
        support: [
            { label: 'Contact Us', path: '/contact' },
            { label: 'FAQs', path: '/faq' },
            { label: 'Shipping Info', path: '/shipping' },
            { label: 'Returns', path: '/returns' }
        ],
        company: [
            { label: 'About Us', path: '/about' },
            { label: 'Careers', path: '/careers' },
            { label: 'Privacy Policy', path: '/privacy' },
            { label: 'Terms of Service', path: '/terms' }
        ]
    };

    const socialLinks = [
        { icon: <FiInstagram />, label: 'Instagram', url: '#' },
        { icon: <FiTwitter />, label: 'Twitter', url: '#' },
        { icon: <FiFacebook />, label: 'Facebook', url: '#' },
        { icon: <FiYoutube />, label: 'YouTube', url: '#' }
    ];

    return (
        <footer className="footer">
            <div className="footer-main container">
                {/* Brand Column */}
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <span className="logo-icon">✦</span>
                        <span className="logo-text">Luxe<span className="text-gradient">Store</span></span>
                    </Link>
                    <p className="footer-description">
                        Discover premium products designed for the modern lifestyle.
                        Quality meets elegance in every piece.
                    </p>

                    {/* Contact Info */}
                    <div className="footer-contact">
                        <div className="contact-item">
                            <FiMail className="contact-icon" />
                            <span>support@luxestore.com</span>
                        </div>
                        <div className="contact-item">
                            <FiPhone className="contact-icon" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="contact-item">
                            <FiMapPin className="contact-icon" />
                            <span>New York, NY 10001</span>
                        </div>
                    </div>
                </div>

                {/* Links Columns */}
                <div className="footer-links">
                    <div className="footer-column">
                        <h4 className="footer-column-title">Shop</h4>
                        <ul className="footer-link-list">
                            {footerLinks.shop.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.path} className="footer-link">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-column-title">Support</h4>
                        <ul className="footer-link-list">
                            {footerLinks.support.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.path} className="footer-link">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-column-title">Company</h4>
                        <ul className="footer-link-list">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.path} className="footer-link">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Column */}
                <div className="footer-newsletter">
                    <h4 className="footer-column-title">Stay Updated</h4>
                    <p className="newsletter-description">
                        Subscribe to get special offers and updates.
                    </p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="newsletter-input form-input"
                        />
                        <button type="submit" className="btn btn-primary newsletter-btn">
                            Subscribe
                        </button>
                    </form>

                    {/* Social Links */}
                    <div className="footer-social">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.url}
                                className="social-link"
                                aria-label={social.label}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container footer-bottom-content">
                    <p className="copyright">
                        © {currentYear} LuxeStore. All rights reserved.
                    </p>
                    <div className="payment-methods">
                        <span className="payment-label">We accept:</span>
                        <div className="payment-icons">
                            <span className="payment-icon">💳</span>
                            <span className="payment-icon">🏦</span>
                            <span className="payment-icon">📱</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
