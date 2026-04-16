import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
    FiPackage, FiClipboard, FiUsers, FiMessageCircle,
    FiTruck, FiAlertTriangle, FiCheckCircle, FiClock,
    FiLogOut, FiArrowRight, FiBox
} from 'react-icons/fi';
import './Dashboard.css';

/**
 * Staff Dashboard
 * Staff panel for order management and customer support
 */
const StaffDashboard = () => {
    const { user, logout } = useAuth();
    const [pendingOrders, setPendingOrders] = useState([]);
    const [processingOrders, setProcessingOrders] = useState([]);
    const [completedCount, setCompletedCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pendingRes, processingRes, completedRes] = await Promise.all([
                    api.get('/orders/admin/all?status=pending&limit=5'),
                    api.get('/orders/admin/all?status=processing&limit=5'),
                    api.get('/orders/admin/all?status=delivered&limit=1') // Just to get count
                ]);

                if (pendingRes.data.success) {
                    setPendingOrders(pendingRes.data.orders);
                }

                if (processingRes.data.success) {
                    setProcessingOrders(processingRes.data.orders);
                }

                if (completedRes.data.success) {
                    setCompletedCount(completedRes.data.total);
                }
            } catch (error) {
                console.error('Error fetching staff data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const stats = [
        { icon: <FiPackage />, value: pendingOrders.length, label: 'Pending Orders', trend: 'Needs attention', trendUp: false, iconClass: 'warning' },
        { icon: <FiTruck />, value: processingOrders.length, label: 'Ready to Ship', trend: '', trendUp: null, iconClass: 'primary' },
        { icon: <FiMessageCircle />, value: '0', label: 'Support Tickets', trend: '0 new', trendUp: false, iconClass: 'success' }, // Mock for now
        { icon: <FiCheckCircle />, value: completedCount, label: 'Completed Orders', trend: 'Total', trendUp: true, iconClass: 'success' }
    ];

    const dailyTasks = [
        { icon: <FiPackage />, text: 'Process pending orders', count: pendingOrders.length, status: pendingOrders.length > 0 ? 'pending' : 'completed' },
        { icon: <FiTruck />, text: 'Prepare shipments', count: processingOrders.length, status: processingOrders.length > 0 ? 'pending' : 'completed' },
        { icon: <FiClipboard />, text: 'Update inventory', count: 0, status: 'completed' },
        { icon: <FiMessageCircle />, text: 'Respond to tickets', count: 0, status: 'completed' },
        { icon: <FiCheckCircle />, text: 'Quality checks', count: 0, status: 'completed' }
    ];

    const quickActions = [
        { icon: <FiPackage />, label: 'Process Orders', link: '/admin/orders' },
        { icon: <FiTruck />, label: 'Shipping', link: '/admin/orders' },
        { icon: <FiBox />, label: 'Inventory', link: '/admin/products' },
        { icon: <FiMessageCircle />, label: 'Support', link: '/admin/users' } // Staff can view users for basic support
    ];

    if (loading) {
        return <div className="loading-screen">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <div className="dashboard-welcome">
                        <div className="dashboard-avatar">{user?.avatar || '👨‍💻'}</div>
                        <div className="dashboard-greeting">
                            <h1>Staff Dashboard</h1>
                            <p>Good to see you, {user?.firstName}! Here's your work overview.</p>
                        </div>
                    </div>
                    <span className="dashboard-role-badge">
                        👨‍💻 {user?.role}
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
                                        {stat.trendUp ? '↑' : ''} {stat.trend}
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
                    {/* Pending Orders */}
                    <div className="dashboard-card">
                        <h3>
                            <FiClock />
                            Pending Orders
                        </h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Order</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingOrders.length > 0 ? (
                                        pendingOrders.map(order => (
                                            <tr key={order._id}>
                                                <td>{order.orderNumber}</td>
                                                <td>{order.user?.firstName} {order.user?.lastName}</td>
                                                <td>${(order.total || 0).toFixed(2)}</td>
                                                <td>
                                                    <span className="status-badge pending">
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                                No pending orders
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Link to="/admin/orders" className="section-action" style={{ marginTop: 'var(--spacing-md)', display: 'inline-flex' }}>
                            View All Orders <FiArrowRight />
                        </Link>
                    </div>

                    {/* Daily Tasks & Quick Actions */}
                    <div className="dashboard-card">
                        <h3>
                            <FiClipboard />
                            Daily Tasks
                        </h3>
                        <div className="activity-list">
                            {dailyTasks.map((task, index) => (
                                <div className="activity-item" key={index}>
                                    <div className="activity-icon">{task.icon}</div>
                                    <div className="activity-content">
                                        <div className="activity-text">{task.text}</div>
                                        <div className="activity-time">{task.count} items</div>
                                    </div>
                                    <span className={`status-badge ${task.status === 'completed' ? 'completed' : task.status === 'in-progress' ? 'shipped' : 'pending'}`}>
                                        {task.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <h3 style={{ marginTop: 'var(--spacing-xl)' }}>
                            <FiUsers />
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
                    </div>
                </div>

                {/* Logout */}
                <div style={{ marginTop: 'var(--spacing-xl)' }}>
                    <button className="logout-btn" onClick={logout}>
                        <FiLogOut />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
