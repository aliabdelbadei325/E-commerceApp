import ProductCard from '../ProductCard/ProductCard';
import './ProductGrid.css';

/**
 * ProductGrid Component
 * Displays products in a responsive grid layout
 */
const ProductGrid = ({ products, loading = false }) => {
    // Loading skeleton
    if (loading) {
        return (
            <div className="product-grid">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="product-skeleton glass-card">
                        <div className="skeleton-image shimmer"></div>
                        <div className="skeleton-content">
                            <div className="skeleton-line shimmer"></div>
                            <div className="skeleton-line short shimmer"></div>
                            <div className="skeleton-line medium shimmer"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Empty state
    if (!products || products.length === 0) {
        return (
            <div className="product-grid-empty">
                <div className="empty-icon">🛍️</div>
                <h3 className="empty-title">No products found</h3>
                <p className="empty-description">
                    Try adjusting your filters or search terms.
                </p>
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map((product, index) => (
                <div
                    key={product.id}
                    className="product-grid-item animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;
