import Skeleton from '../Skeleton/Skeleton';
import '../ProductCard/ProductCard.css';

const ProductCardSkeleton = () => {
    return (
        <div className="product-card glass-card">
            <div className="product-card-image-wrapper" style={{ background: 'transparent' }}>
                <Skeleton className="skeleton-image" height="100%" />
            </div>
            <div className="product-card-content">
                {/* Category placeholder */}
                <Skeleton width="40%" height="0.75rem" style={{ marginBottom: '12px' }} />

                {/* Title placeholder */}
                <Skeleton type="title" width="90%" height="1.2rem" style={{ marginBottom: '15px' }} />

                {/* Rating placeholder */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <Skeleton width="30%" height="1rem" />
                    <Skeleton width="40%" height="0.8rem" />
                </div>

                {/* Price placeholder */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <Skeleton width="35%" height="1.6rem" />
                    <Skeleton width="25%" height="1rem" />
                </div>

                {/* Button placeholder */}
                <Skeleton type="button" height="44px" />
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
