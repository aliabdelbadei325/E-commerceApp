import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiTrash2, FiStar } from 'react-icons/fi';
import api from '../../services/api';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await api.get('/reviews/admin/all');
            if (response.data.success) {
                setReviews(response.data.reviews);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await api.delete(`/reviews/${id}`);
            setReviews(reviews.filter(r => r._id !== id));
            alert('Review deleted successfully!');
        } catch (error) {
            alert('Failed to delete review');
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <FiStar key={i} style={{
                fill: i < rating ? 'var(--color-primary)' : 'none',
                color: i < rating ? 'var(--color-primary)' : 'var(--color-text-tertiary)'
            }} />
        ));
    };

    if (loading) return <div className="loading-screen">Loading reviews...</div>;

    return (
        <div className="dashboard-page" style={{ padding: '40px 0' }}>
            <div className="container animate-in">
                <div className="dashboard-header" style={{ marginBottom: '30px' }}>
                    <Link to="/admin" className="back-link"><FiArrowLeft /> Back to Dashboard</Link>
                    <h1 style={{ marginTop: '10px' }}>Review <span>Moderation</span></h1>
                </div>

                <div className="glass-card" style={{ padding: '20px' }}>
                    {reviews.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {reviews.map(review => (
                                <div key={review._id} style={{
                                    padding: '20px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '10px',
                                    border: '1px solid var(--color-border)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                                <div>
                                                    <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                                                        {review.user?.firstName} {review.user?.lastName}
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                                        {review.user?.email}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '3px' }}>
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '10px' }}>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '5px' }}>
                                                    Product: {review.product?.name}
                                                </div>
                                                <p style={{ margin: 0, lineHeight: '1.6' }}>{review.comment}</p>
                                            </div>
                                            <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--color-text-tertiary)' }}>
                                                {new Date(review.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                        {review.product?.image && (
                                            <img
                                                src={review.product.image}
                                                alt={review.product.name}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginLeft: '15px' }}
                                            />
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => handleDelete(review._id)}
                                            className="btn btn-outline"
                                            style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '8px' }}
                                        >
                                            <FiTrash2 /> Delete Review
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                            No reviews found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminReviews;
