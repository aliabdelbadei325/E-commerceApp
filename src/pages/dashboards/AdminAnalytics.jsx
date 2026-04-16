import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign, FiActivity, FiPieChart } from 'react-icons/fi';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import api from '../../services/api';

const AdminAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [ordersRes, usersRes] = await Promise.all([
                api.get('/orders/admin/stats'),
                api.get('/users/stats')
            ]);

            if (ordersRes.data.success) {
                const s = ordersRes.data.stats;
                setStats({
                    ...s,
                    monthlyData: s.monthlyData?.length ? s.monthlyData : [],
                    categoryData: [
                        { name: 'Electronics', value: 45, color: '#6366f1' },
                        { name: 'Fashion', value: 30, color: '#a855f7' },
                        { name: 'Home', value: 15, color: '#ec4899' },
                        { name: 'Sports', value: 10, color: '#3b82f6' },
                    ],
                    activeUsers: usersRes.data.success ? usersRes.data.stats.active : 0
                });
            }
        } catch (error) {
            console.error('Failed to fetch analytics', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-screen">Loading analytics...</div>;

    return (
        <div className="dashboard-page" style={{ padding: '40px 0', minHeight: '100vh' }}>
            <div className="container animate-in">
                <div className="dashboard-header" style={{ marginBottom: '30px' }}>
                    <Link to="/admin" className="back-link" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '15px' }}>
                        <FiArrowLeft /> Back to Dashboard
                    </Link>
                    <h1 className="heading-lg">Store <span className="text-gradient">Analytics</span></h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Comprehensive overview of your store performance.</p>
                </div>

                {/* Scorecards */}
                <div className="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <div className="glass-card" style={{ padding: '25px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ color: 'var(--color-text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}><FiDollarSign /></div>
                            Total Revenue
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                            ${(stats?.totalRevenue || 0).toLocaleString()}
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--color-success)' }}>↑ 12.5% from last month</div>
                    </div>

                    <div className="glass-card" style={{ padding: '25px' }}>
                        <div style={{ color: 'var(--color-text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}><FiShoppingBag /></div>
                            Total Orders
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                            {stats?.totalOrders || 0}
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--color-success)' }}>↑ 8.2% from last month</div>
                    </div>

                    <div className="glass-card" style={{ padding: '25px' }}>
                        <div style={{ color: 'var(--color-text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}><FiUsers /></div>
                            Active Users
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                            {stats?.activeUsers || 0}
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--color-success)' }}>↑ 5.1% from last month</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', marginBottom: '30px' }}>
                    {/* Sales Area Chart */}
                    <div className="glass-card" style={{ padding: '30px' }}>
                        <h3 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiTrendingUp /> Sales Performance
                        </h3>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <AreaChart data={stats?.monthlyData}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-tertiary)', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-tertiary)', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(15, 15, 25, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Pie Chart */}
                    <div className="glass-card" style={{ padding: '30px' }}>
                        <h3 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiPieChart /> Inventory Distribution
                        </h3>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={stats?.categoryData}
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats?.categoryData?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(15, 15, 25, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Orders Bar Chart */}
                <div className="glass-card" style={{ padding: '30px', marginBottom: '40px' }}>
                    <h3 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiActivity /> Order Volume
                    </h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={stats?.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-tertiary)', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-tertiary)', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 15, 25, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="orders" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
