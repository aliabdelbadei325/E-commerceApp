import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import api from '../../services/api';
import './Dashboard.css';

/**
 * Addresses Page
 * Manage user shipping addresses
 */
const AddressesPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'United States',
        phone: '',
        isDefault: false
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const res = await api.get('/users/addresses');
            if (res.data.success) {
                setAddresses(res.data.addresses);
            }
        } catch (err) {
            console.error('Failed to fetch addresses', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            postalCode: '',
            country: 'United States',
            phone: '',
            isDefault: false
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (editingId) {
                res = await api.put(`/users/addresses/${editingId}`, formData);
            } else {
                res = await api.post('/users/addresses', formData);
            }

            if (res.data.success) {
                setAddresses(res.data.addresses);
                setMessage({ type: 'success', text: `Address ${editingId ? 'updated' : 'added'} successfully!` });
                resetForm();
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save address' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (address) => {
        setFormData({
            firstName: address.firstName,
            lastName: address.lastName,
            address: address.address,
            city: address.city,
            postalCode: address.postalCode,
            country: address.country,
            phone: address.phone,
            isDefault: address.isDefault
        });
        setEditingId(address._id);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            const res = await api.delete(`/users/addresses/${id}`);
            if (res.data.success) {
                setAddresses(res.data.addresses);
                setMessage({ type: 'success', text: 'Address deleted successfully!' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete address' });
        }
    };

    if (loading && addresses.length === 0) return <div className="loading-screen">Loading addresses...</div>;

    return (
        <div className="dashboard">
            <div className="container animate-in">
                <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="dashboard-welcome">
                        <Link to="/dashboard" className="back-link" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FiArrowLeft /> Back to Dashboard
                        </Link>
                        <h1>My <span>Addresses</span></h1>
                    </div>
                    {!showForm && (
                        <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiPlus /> Add New
                        </button>
                    )}
                </div>

                {message.text && (
                    <div className={`message-banner ${message.type}`} style={{
                        padding: '15px', borderRadius: '12px', marginBottom: '30px', textAlign: 'center',
                        background: message.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        color: message.type === 'success' ? '#4caf50' : '#f44336',
                        border: `1px solid ${message.type === 'success' ? '#4caf50' : '#f44336'}`
                    }}>
                        {message.text}
                    </div>
                )}

                {showForm && (
                    <div className="dashboard-card animate-fadeInUp" style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3>{editingId ? 'Edit Address' : 'Add New Address'}</h3>
                            <button className="btn-icon" onClick={resetForm}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="form-input" required />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="form-input" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Street Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="form-input" required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="form-input" required />
                                </div>
                                <div className="form-group">
                                    <label>Postal Code</label>
                                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="form-input" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Country</label>
                                    <select name="country" value={formData.country} onChange={handleInputChange} className="form-input">
                                        <option value="United States">United States</option>
                                        <option value="Canada">Canada</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" required />
                                </div>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: '20px 0' }}>
                                <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} />
                                Set as default address
                            </label>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    {editingId ? 'Update Address' : 'Save Address'}
                                </button>
                                <button type="button" className="btn btn-outline" onClick={resetForm} style={{ flex: 1 }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="cards-grid">
                    {addresses.length > 0 ? (
                        addresses.map(addr => (
                            <div key={addr._id} className={`dashboard-card address-card ${addr.isDefault ? 'default' : ''}`} style={{
                                position: 'relative', border: addr.isDefault ? '1px solid var(--color-primary)' : '1px solid var(--color-border)'
                            }}>
                                {addr.isDefault && (
                                    <span style={{
                                        position: 'absolute', top: '15px', right: '15px', background: 'var(--color-primary)',
                                        color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem'
                                    }}>
                                        Default
                                    </span>
                                )}
                                <h3><FiMapPin /> {addr.firstName} {addr.lastName}</h3>
                                <div style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                                    <p>{addr.address}</p>
                                    <p>{addr.city}, {addr.postalCode}</p>
                                    <p>{addr.country}</p>
                                    <p style={{ marginTop: '10px' }}>{addr.phone}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--color-border)', paddingTop: '15px' }}>
                                    <button className="btn btn-outline" style={{ flex: 1, padding: '8px' }} onClick={() => handleEdit(addr)}>
                                        <FiEdit2 /> Edit
                                    </button>
                                    <button className="btn-icon" style={{ color: 'var(--color-error)' }} onClick={() => handleDelete(addr._id)}>
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : !showForm && (
                        <div className="dashboard-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
                            <FiMapPin style={{ fontSize: '3rem', color: 'var(--color-border)', marginBottom: '20px' }} />
                            <h3>No addresses saved</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>Add your shipping addresses to speed up your checkout process.</p>
                            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                                Add Your First Address
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddressesPage;
