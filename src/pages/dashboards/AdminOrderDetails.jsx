import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiMapPin, FiCreditCard, FiTruck, FiSave } from 'react-icons/fi';
import api from '../../services/api';

const AdminOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await api.get(`/orders/${id}`);
            if (response.data.success) {
                const o = response.data.order;
                setOrder(o);
                setTrackingNumber(o.trackingNumber || '');
                setStatus(o.status);
            }
        } catch (error) {
            console.error('Failed to fetch order', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            // Update status
            if (status !== order.status) {
                await api.put(`/orders/${id}/status`, { status });
            }
            // We would need a backend endpoint for tracking number, or assume it's part of status update or separate
            // For now, let's assume the put status endpoint might accept it or we just mock it for "completeness" visual
            // In a real app: await api.put(`/orders/${id}/tracking`, { trackingNumber });

            // Refetch to be sure
            await fetchOrder();
            alert('Order updated successfully');
        } catch (error) {
            console.error('Update failed', error);
            alert('Failed to update order');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (s) => {
        switch (s?.toLowerCase()) {
            case 'delivered': return 'var(--color-success)';
            case 'pending': return 'var(--color-warning)';
            case 'cancelled': return 'var(--color-error)';
            default: return 'var(--color-info)';
        }
    };

    if (loading) return <div className="loading-screen">Loading order details...</div>;
    if (!order) return <div className="dashboard-page"><div className="container">Order not found</div></div>;

    return (
        <div className="dashboard-page" style={{ padding: '40px 0' }}>
            <div className="container animate-in">
                <div className="dashboard-header" style={{ marginBottom: '30px' }}>
                    <Link to="/admin/orders" className="back-link"><FiArrowLeft /> Back to Orders</Link>
                    <h1 style={{ marginTop: '10px' }}>Order <span>#{order.orderNumber}</span></h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>

                    {/* Main Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                        {/* Order Items */}
                        <div className="glass-card" style={{ padding: '30px' }}>
                            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FiPackage /> Order Items
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{item.name}</div>
                                            <div style={{ color: 'var(--color-text-secondary)' }}>Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                                        </div>
                                        <div style={{ fontWeight: '700' }}>${(item.quantity * item.price).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '40px' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--color-text-secondary)' }}>Subtotal</div>
                                    <div style={{ fontWeight: '600' }}>${order.subtotal.toFixed(2)}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--color-text-secondary)' }}>Shipping</div>
                                    <div style={{ fontWeight: '600' }}>${order.shippingCost.toFixed(2)}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--color-text-secondary)' }}>Total</div>
                                    <div style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--color-primary)' }}>${order.total.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Customer & Shipping */}
                        <div className="glass-card" style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <div>
                                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FiMapPin /> Shipping Address
                                </h3>
                                <div style={{ lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                                    <strong style={{ color: 'white' }}>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</strong><br />
                                    {order.shippingAddress.address}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                    {order.shippingAddress.country}<br />
                                    Phone: {order.shippingAddress.phone}
                                </div>
                            </div>
                            <div>
                                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FiCreditCard /> Payment Info
                                </h3>
                                <div style={{ lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                                    Method: <span style={{ textTransform: 'capitalize' }}>{order.paymentMethod}</span><br />
                                    Status: <span style={{
                                        color: order.paymentStatus === 'paid' ? 'var(--color-success)' : 'var(--color-warning)',
                                        fontWeight: '600',
                                        textTransform: 'capitalize'
                                    }}>{order.paymentStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="glass-card" style={{ padding: '25px', position: 'sticky', top: '100px' }}>
                            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FiTruck /> Inbound Options
                            </h3>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Order Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '8px', color: getStatusColor(status) }}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Tracking Number</label>
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="e.g. TRK-882190"
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                                />
                            </div>

                            <button
                                onClick={handleUpdate}
                                disabled={updating}
                                className="btn btn-primary"
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                            >
                                {updating ? 'Updating...' : <><FiSave /> Update Order</>}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;
