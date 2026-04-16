import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import api, { API_URL } from '../../services/api';
import {
    FiPackage, FiHeart, FiCreditCard, FiMapPin,
    FiShoppingBag, FiTruck, FiLogOut, FiArrowRight
} from 'react-icons/fi';
import './Dashboard.css';

/**
 * User Dashboard
 * Personal dashboard for regular users
 */
const UserDashboard = () => {
    const { user, logout } = useAuth();
    const { wishlist } = useWishlist();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders?limit=4');
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

    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    const stats = [
        { icon: <FiShoppingBag />, value: orders.length, label: 'Total Orders', trend: '', trendUp: null, iconClass: 'primary' },
        { icon: <FiHeart />, value: wishlist.length, label: 'Wishlist Items', trend: '', trendUp: null, iconClass: 'error' },
        { icon: <FiCreditCard />, value: `$${totalSpent.toFixed(2)}`, label: 'Total Spent', trend: '', trendUp: null, iconClass: 'success' },
        { icon: <FiMapPin />, value: user?.addresses?.length || '0', label: 'Saved Addresses', trend: '', trendUp: null, iconClass: 'warning' }
    ];

    const quickActions = [
        { icon: <FiPackage />, label: 'My Orders', link: '/orders' },
        { icon: <FiHeart />, label: 'My Wishlist', link: '/wishlist' },
        { icon: <FiMapPin />, label: 'Addresses', link: '/addresses' },
        { icon: <FiCreditCard />, label: 'Profile Settings', link: '/settings' }
    ];

    if (loading) {
        return <div className="loading-screen">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <div className="dashboard-welcome">
                        <div className="dashboard-avatar">
                            {user?.avatar && user.avatar.startsWith('/') ? (
                                <img
                                    src={`${API_URL.replace('/api', '')}${user.avatar}`}
                                    alt="Avatar"
                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            ) : (
                                user?.avatar || '👤'
                            )}
                        </div>
                        <div className="dashboard-greeting">
                            <h1>Welcome back, {user?.firstName}!</h1>
                            <p>Manage your orders, wishlist, and account settings</p>
                        </div>
                    </div>
                    <span className="dashboard-role-badge">
                        {user?.role} Account
                    </span>
                </div>

                {/* Stats */}
                <div className="dashboard-stats">
                    {stats.map((stat, index) => (
                        <div className="stat-card" key={index}>
                            <div className="stat-card-header">
                                <div className={`stat-card-icon ${stat.iconClass}`}>
                                    {stat.icon}
                                </div>
                                {stat.trend && (
                                    <span className={`stat-card-trend ${stat.trendUp ? 'up' : 'down'}`}>
                                        {stat.trend}
                                    </span>
                                )}
                            </div>
                            <div className="stat-card-value">{stat.value}</div>
                            <div className="stat-card-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="cards-grid">
                    {/* Recent Orders */}
                    <div className="dashboard-card">
                        <h3>
                            <FiTruck />
                            Recent Orders
                        </h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Order</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length > 0 ? (
                                        orders.map(order => (
                                            <tr key={order._id} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/orders/${order._id}`}>
                                                <td>#{order.orderNumber}</td>
                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td>${(order.total || 0).toFixed(2)}</td>
                                                <td>
                                                    <span className={`status-badge ${order.status}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                                No orders found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Link to="/orders" className="section-action" style={{ marginTop: 'var(--spacing-md)', display: 'inline-flex' }}>
                            View All Orders <FiArrowRight />
                        </Link>
                    </div>

                    {/* Quick Actions */}
                    <div className="dashboard-card">
                        <h3>
                            <FiPackage />
                            Quick Actions
                        </h3>
                        <div className="quick-actions">
                            {quickActions.map((action, index) => (
                                <Link
                                    key={index}
                                    to={action.link}
                                    className="quick-action-btn"
                                >
                                    {action.icon}
                                    {action.label}
                                </Link>
                            ))}
                        </div>

                        <div style={{ marginTop: 'var(--spacing-xl)' }}>
                            <button className="logout-btn" onClick={logout}>
                                <FiLogOut />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
