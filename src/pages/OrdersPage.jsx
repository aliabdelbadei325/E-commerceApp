import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiCalendar, FiDollarSign, FiClock, FiArrowLeft, FiChevronRight } from 'react-icons/fi';
import api from '../services/api';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                if (response.data.success) {
                    setOrders(response.data.orders);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'status-success';
            case 'shipped': return 'status-info';
            case 'pending': return 'status-warning';
            case 'cancelled': return 'status-error';
            default: return '';
        }
    };

    if (loading) return <div className="loading-screen">Loading your orders...</div>;

    return (
        <main className="orders-page" style={{ padding: '120px 0' }}>
            <div className="container animate-in">
                <div className="products-header">
                    <h1 className="products-title">My <span>Orders</span></h1>
                    <p className="products-count">{orders.length} orders found</p>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-state" style={{ textAlign: 'center', padding: '50px 0' }}>
                        <FiPackage size={50} style={{ color: 'var(--text-muted)', marginBottom: '20px' }} />
                        <h2>No orders yet</h2>
                        <p>You haven't placed any orders yet. Start shopping!</p>
                        <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>
                            Go Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card glass-card mb-md">
                                <div className="order-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid var(--color-border)' }}>
                                    <div className="order-meta">
                                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Order #</p>
                                        <p style={{ fontWeight: '600' }}>{order.orderNumber}</p>
                                    </div>
                                    <div className="order-meta">
                                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Placed on</p>
                                        <p style={{ fontWeight: '600' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="order-meta">
                                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Total</p>
                                        <p style={{ fontWeight: '600', color: 'var(--color-accent-primary)' }}>${(order.total || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="order-status">
                                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="order-body" style={{ padding: '20px' }}>
                                    <div className="order-items-preview" style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                                        {(order.items || []).map((item, idx) => (
                                            <img
                                                key={idx}
                                                src={item.image}
                                                alt={item.name}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                                            />
                                        ))}
                                    </div>
                                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                        <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">
                                            Order Details <FiChevronRight />
                                        </Link>
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

export default OrdersPage;
