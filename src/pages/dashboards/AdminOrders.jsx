import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag, FiSearch, FiFilter, FiEye } from 'react-icons/fi';
import api from '../../services/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // Note: Ensure this endpoint exists and returns all orders for admin
            const response = await api.get('/orders/admin/all');
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const response = await api.put(`/orders/${orderId}/status`, { status: newStatus });
            if (response.data.success) {
                setOrders(orders.map(order =>
                    (order._id || order.id) === orderId ? { ...order, status: newStatus } : order
                ));
            }
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update order status');
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'var(--color-success)';
            case 'shipped': return 'var(--color-info)';
            case 'processing': return 'var(--color-warning)';
            case 'cancelled': return 'var(--color-error)';
            default: return 'var(--color-text-secondary)';
        }
    };

    const filteredOrders = orders.filter(order =>
        (order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.user && order.user.email && order.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="loading-screen">Loading orders...</div>;

    return (
        <div className="dashboard-page" style={{ padding: '40px 0' }}>
            <div className="container animate-in">
                <div className="dashboard-header" style={{ marginBottom: '30px' }}>
                    <Link to="/admin" className="back-link"><FiArrowLeft /> Back to Dashboard</Link>
                    <h1 style={{ marginTop: '10px' }}>Order <span>Management</span></h1>
                </div>

                <div className="search-bar glass-card mb-lg" style={{ padding: '15px' }}>
                    <div style={{ position: 'relative' }}>
                        <FiSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                        <input
                            type="text"
                            placeholder="Search orders by ID or User Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 45px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                        />
                    </div>
                </div>

                <div className="glass-card" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <th style={{ padding: '20px', textAlign: 'left', color: 'var(--color-text-secondary)' }}>Order ID</th>
                                    <th style={{ padding: '20px', textAlign: 'left', color: 'var(--color-text-secondary)' }}>Customer</th>
                                    <th style={{ padding: '20px', textAlign: 'left', color: 'var(--color-text-secondary)' }}>Total</th>
                                    <th style={{ padding: '20px', textAlign: 'left', color: 'var(--color-text-secondary)' }}>Date</th>
                                    <th style={{ padding: '20px', textAlign: 'left', color: 'var(--color-text-secondary)' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map(order => (
                                        <tr key={order._id || order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '20px', fontFamily: 'monospace' }}>#{String(order._id || order.id).substring(0, 8)}...</td>
                                            <td style={{ padding: '20px' }}>
                                                <div>{order.user?.firstName || 'Guest'} {order.user?.lastName || ''}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{order.user?.email}</div>
                                            </td>
                                            <td style={{ padding: '20px', fontWeight: '600' }}>${(order.totalPrice || order.total || 0).toFixed(2)}</td>
                                            <td style={{ padding: '20px', fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order._id || order.id, e.target.value)}
                                                        disabled={updatingId === (order._id || order.id)}
                                                        style={{
                                                            padding: '6px 12px',
                                                            borderRadius: '20px',
                                                            border: `1px solid ${getStatusColor(order.status)}`,
                                                            color: getStatusColor(order.status),
                                                            background: 'rgba(0,0,0,0.2)',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                    <Link
                                                        to={`/admin/orders/${order._id || order.id}`}
                                                        className="btn-icon"
                                                        style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        title="View Details"
                                                    >
                                                        <FiEye />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                            No orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
