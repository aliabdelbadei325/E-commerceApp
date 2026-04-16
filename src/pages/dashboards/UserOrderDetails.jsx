import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiTruck, FiMapPin, FiCreditCard, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import api from '../../services/api';
import './Dashboard.css';

/**
 * User Order Details Page
 * Detailed view of a single order for the customer
 */
const UserOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                if (res.data.success) {
                    setOrder(res.data.order);
                }
            } catch (err) {
                setError('Failed to load order details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <div className="loading-screen">Loading order details...</div>;
    if (error) return (
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
            <h2>{error}</h2>
            <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '20px' }}>Back to Dashboard</Link>
        </div>
    );
    if (!order) return null;

    const statusColors = {
        pending: '#ff9800',
        confirmed: '#2196f3',
        shipped: '#9c27b0',
        delivered: '#4caf50',
        cancelled: '#f44336'
    };

    return (
        <div className="dashboard">
            <div className="container animate-in">
                <div className="dashboard-header">
                    <div className="dashboard-welcome">
                        <Link to="/orders" className="back-link" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FiArrowLeft /> Back to My Orders
                        </Link>
                        <h1>Order <span>#{order.orderNumber}</span></h1>
                    </div>
                    <span className="status-badge" style={{
                        background: `${statusColors[order.status]}20`,
                        color: statusColors[order.status],
                        border: `1px solid ${statusColors[order.status]}`
                    }}>
                        {order.status.toUpperCase()}
                    </span>
                </div>

                <div className="cards-grid">
                    {/* Order Summary */}
                    <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
                        <h3><FiPackage /> Items Ordered</h3>
                        <div className="order-items-list">
                            {order.items.map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex', gap: '15px', padding: '15px 0',
                                    borderBottom: index === order.items.length - 1 ? 'none' : '1px solid var(--color-border)'
                                }}>
                                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                            ${item.price.toFixed(2)} x {item.quantity}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '600' }}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span>Subtotal</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#4caf50' }}>
                                    <span>Discount ({order.coupon})</span>
                                    <span>-${order.discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span>Shipping</span>
                                <span>{order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}</span>
                            </div>
                            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span>Tax (10%)</span>
                                <span>${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--color-border)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                <span>Total</span>
                                <span className="text-gradient">${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping & Payment */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div className="dashboard-card">
                            <h3><FiMapPin /> Shipping Address</h3>
                            <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                                <p style={{ color: 'white', fontWeight: '600' }}>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.country}</p>
                                <p style={{ marginTop: '10px' }}>{order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        <div className="dashboard-card">
                            <h3><FiCreditCard /> Payment Information</h3>
                            <div style={{ color: 'var(--color-text-secondary)' }}>
                                <p>Method: <span style={{ color: 'white' }}>{order.paymentMethod.toUpperCase()}</span></p>
                                <p>Status: <span style={{ color: '#4caf50' }}>Paid</span></p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', fontSize: '0.85rem' }}>
                                    <FiCalendar /> Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {order.status !== 'pending' && order.status !== 'cancelled' && (
                            <div className="dashboard-card" style={{ border: '1px solid var(--color-primary)' }}>
                                <h3><FiTruck /> Tracking</h3>
                                <p style={{ color: 'var(--color-text-secondary)' }}>
                                    Status: <span style={{ color: 'var(--color-primary)' }}>{order.status}</span>
                                </p>
                                {order.trackingNumber ? (
                                    <p style={{ marginTop: '10px' }}>Tracking #: <span style={{ color: 'white' }}>{order.trackingNumber}</span></p>
                                ) : (
                                    <p style={{ marginTop: '10px', fontSize: '0.85rem', fontStyle: 'italic' }}>Tracking number will be available soon.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserOrderDetails;
