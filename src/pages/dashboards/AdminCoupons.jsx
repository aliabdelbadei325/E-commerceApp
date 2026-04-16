import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiPercent, FiDollarSign, FiX } from 'react-icons/fi';
import api from '../../services/api';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: 0,
        maxUses: '',
        expiryDate: '',
        isActive: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await api.get('/coupons');
            if (response.data.success) {
                setCoupons(response.data.coupons);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCoupon) {
                const response = await api.put(`/coupons/${editingCoupon._id}`, formData);
                if (response.data.success) {
                    setCoupons(coupons.map(c => c._id === editingCoupon._id ? response.data.coupon : c));
                    alert('Coupon updated successfully!');
                }
            } else {
                const response = await api.post('/coupons', formData);
                if (response.data.success) {
                    setCoupons([response.data.coupon, ...coupons]);
                    alert('Coupon created successfully!');
                }
            }
            closeModal();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save coupon');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            setCoupons(coupons.filter(c => c._id !== id));
            alert('Coupon deleted successfully!');
        } catch (error) {
            alert('Failed to delete coupon');
        }
    };

    const openModal = (coupon = null) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData({
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minOrderAmount: coupon.minOrderAmount,
                maxUses: coupon.maxUses,
                expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
                isActive: coupon.isActive
            });
        } else {
            setEditingCoupon(null);
            setFormData({
                code: '',
                discountType: 'percentage',
                discountValue: '',
                minOrderAmount: 0,
                maxUses: '',
                expiryDate: '',
                isActive: true
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCoupon(null);
    };

    if (loading) return <div className="loading-screen">Loading coupons...</div>;

    return (
        <div className="dashboard-page" style={{ padding: '40px 0 100px', minHeight: '90vh' }}>
            <div className="container animate-in">
                <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <Link to="/admin" className="back-link"><FiArrowLeft /> Back to Dashboard</Link>
                        <h1 style={{ marginTop: '10px' }}>Manage <span>Coupons</span></h1>
                    </div>
                    <button onClick={() => openModal()} className="btn btn-primary">
                        <FiPlus /> Create Coupon
                    </button>
                </div>

                <div className="glass-card" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <tr>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Code</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Discount</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Min. Order</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Uses</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Expiry</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.map(coupon => (
                                    <tr key={coupon._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '15px', fontWeight: '600', color: 'var(--color-primary)' }}>{coupon.code}</td>
                                        <td style={{ padding: '15px' }}>
                                            {coupon.discountType === 'percentage'
                                                ? `${coupon.discountValue}%`
                                                : `$${coupon.discountValue}`}
                                        </td>
                                        <td style={{ padding: '15px' }}>${coupon.minOrderAmount}</td>
                                        <td style={{ padding: '15px' }}>{coupon.usedCount || 0} / {coupon.maxUses || '∞'}</td>
                                        <td style={{ padding: '15px' }}>
                                            {new Date(coupon.expiryDate).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem',
                                                background: coupon.isActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(158, 158, 158, 0.1)',
                                                color: coupon.isActive ? '#4caf50' : '#9e9e9e'
                                            }}>
                                                {coupon.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                                <button onClick={() => openModal(coupon)} className="btn-icon" title="Edit">
                                                    <FiEdit2 />
                                                </button>
                                                <button onClick={() => handleDelete(coupon._id)} className="btn-icon" style={{ color: 'var(--color-error)' }} title="Delete">
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Coupon Modal */}
                {showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 9999, backdropFilter: 'blur(10px)', padding: '20px'
                    }}>
                        <div className="glass-card animate-in" style={{
                            padding: '30px', width: '90%', maxWidth: '720px',
                            maxHeight: '85vh', overflowY: 'auto', position: 'relative',
                            boxShadow: '0 30px 70px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(23, 23, 28, 0.99)',
                            borderRadius: '16px',
                            marginTop: '120px' // Moves it further down as requested
                        }}>
                            <button onClick={closeModal} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10 }}>
                                <FiX />
                            </button>
                            <h2 style={{ marginBottom: '20px', color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: '600' }}>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '20px' }}>
                                    <div className="form-group">
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Coupon Code</label>
                                        <input
                                            type="text" required
                                            value={formData.code}
                                            onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            placeholder="SUMMER2024"
                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white', textTransform: 'uppercase' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>Discount Type</label>
                                        <select
                                            value={formData.discountType}
                                            onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount ($)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>Discount Value</label>
                                        <input
                                            type="number" required min="0" step="0.01"
                                            value={formData.discountValue}
                                            onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                                            placeholder={formData.discountType === 'percentage' ? '20' : '10.00'}
                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,100,0,0.1)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>Min Order Amount ($)</label>
                                        <input
                                            type="number" min="0" step="0.01"
                                            value={formData.minOrderAmount}
                                            onChange={e => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>Max Uses</label>
                                        <input
                                            type="number" min="1"
                                            value={formData.maxUses}
                                            onChange={e => setFormData({ ...formData, maxUses: e.target.value })}
                                            placeholder="Unlimited"
                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>Expiry Date</label>
                                        <input
                                            type="date" required
                                            value={formData.expiryDate}
                                            onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                                        />
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.95rem', color: 'white' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                            style={{ width: '22px', height: '22px', accentColor: 'var(--color-primary)' }}
                                        />
                                        Make this coupon active immediately
                                    </label>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: '600', borderRadius: '10px' }}>
                                    {editingCoupon ? 'Save Changes' : 'Create New Coupon'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCoupons;
