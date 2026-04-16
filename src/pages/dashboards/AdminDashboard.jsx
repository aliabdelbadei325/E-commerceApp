import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
    FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp,
    FiPackage, FiSettings, FiFileText, FiPlusCircle,
    FiLogOut, FiArrowRight, FiActivity, FiPercent, FiStar
} from 'react-icons/fi';
import './Dashboard.css';

/**
 * Admin Dashboard
 * Full admin panel with stats, user management, and quick actions
 */
const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        revenue: 0,
        growth: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, statsRes] = await Promise.all([
                    api.get('/users?limit=5'),
                    api.get('/orders/admin/stats')
                ]);

                if (usersRes.data.success) {
                    setUsers(usersRes.data.users);
                }

                if (statsRes.data.success && statsRes.data.stats) {
                    const { totalOrders = 0, totalRevenue = 0 } = statsRes.data.stats;
                    setStats({
                        totalUsers: usersRes.data.total || 0,
                        totalOrders: totalOrders,
                        revenue: totalRevenue,
                        growth: 23 // Mock growth for now
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        { icon: <FiUsers />, value: stats.totalUsers, label: 'Total Users', trend: '+12%', trendUp: true, iconClass: 'primary' },
        { icon: <FiShoppingBag />, value: stats.totalOrders, label: 'Total Orders', trend: '+8%', trendUp: true, iconClass: 'success' },
        { icon: <FiDollarSign />, value: `$${(stats.revenue || 0).toLocaleString()}`, label: 'Revenue', trend: '+15%', trendUp: true, iconClass: 'warning' },
        { icon: <FiTrendingUp />, value: `${stats.growth}%`, label: 'Growth', trend: '+5%', trendUp: true, iconClass: 'error' }
    ];

    const recentActivity = [
        { icon: '🛒', text: 'New order #ORD-2026-156 received', time: '2 minutes ago' },
        { icon: '👤', text: 'New user registered: john@example.com', time: '15 minutes ago' },
        { icon: '📦', text: 'Order #ORD-2026-155 shipped', time: '1 hour ago' },
        { icon: '⭐', text: 'New 5-star review on Premium Watch', time: '2 hours ago' },
        { icon: '💰', text: 'Payment received for order #ORD-2026-154', time: '3 hours ago' }
    ];

    const quickActions = [
        { icon: <FiPlusCircle />, label: 'Add Product', link: '/admin/products/new' },
        { icon: <FiPackage />, label: 'Products Management', link: '/admin/products' },
        { icon: <FiFileText />, label: 'Orders', link: '/admin/orders' },
        { icon: <FiUsers />, label: 'Users', link: '/admin/users' },
        { icon: <FiPercent />, label: 'Coupons', link: '/admin/coupons' },
        { icon: <FiStar />, label: 'Reviews', link: '/admin/reviews' },
        { icon: <FiSettings />, label: 'Settings', link: '/admin/settings' },
        { icon: <FiActivity />, label: 'Analytics', link: '/admin/analytics' }
    ];

    if (loading) {
        return <div className="loading-screen">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-page" style={{ padding: '40px 0', minHeight: '80vh' }}>
            <div className="container animate-in">
                <div className="dashboard-header">
                    <div className="dashboard-welcome">
                        <div className="dashboard-avatar">{user?.avatar || '👨‍💼'}</div>
                        <div className="dashboard-greeting">
                            <h1>Admin Dashboard</h1>
                            <p>Welcome back, {user?.firstName}! Here's your store overview.</p>
                        </div>
                    </div>
                    <span className="dashboard-role-badge">
                        🔐 {user?.role}
                    </span>
                </div>

                {/* Stats */}
                <div className="dashboard-stats">
                    {statCards.map((stat, index) => (
                        <div className="stat-card" key={index}>
                            <div className="stat-card-header">
                                <div className={`stat-card-icon ${stat.iconClass}`}>
                                    {stat.icon}
                                </div>
                                <span className={`stat-card-trend ${stat.trendUp ? 'up' : 'down'}`}>
                                    {stat.trendUp ? '↑' : '↓'} {stat.trend}
                                </span>
                            </div>
                            <div className="stat-card-value">{stat.value}</div>
                            <div className="stat-card-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="cards-grid">
                    {/* Quick Actions */}
                    <div className="dashboard-card">
                        <h3>
                            <FiSettings />
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

                    {/* Recent Activity */}
                    <div className="dashboard-card">
                        <h3>
                            <FiActivity />
                            Recent Activity
                        </h3>
                        <div className="activity-list">
                            {recentActivity.map((activity, index) => (
                                <div className="activity-item" key={index}>
                                    <div className="activity-icon">{activity.icon}</div>
                                    <div className="activity-content">
                                        <div className="activity-text">{activity.text}</div>
                                        <div className="activity-time">{activity.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* User Management Section */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <FiUsers style={{ marginRight: '8px' }} />
                            User Management
                        </h2>
                        <Link to="/admin/users" className="section-action">
                            Manage All Users <FiArrowRight />
                        </Link>
                    </div>
                    <div className="dashboard-card">
                        <div className="user-list">
                            {users.length > 0 ? (
                                users.map(u => (
                                    <div className="user-item" key={u.id}>
                                        <div className="user-avatar">{u.avatar || '👤'}</div>
                                        <div className="user-info">
                                            <div className="user-name">{u.firstName} {u.lastName}</div>
                                            <div className="user-email">{u.email}</div>
                                        </div>
                                        <div className="user-role">{u.role}</div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ padding: '20px', color: 'var(--text-secondary)' }}>No users found.</p>
                            )}
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

export default AdminDashboard;
