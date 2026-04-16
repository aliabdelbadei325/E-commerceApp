import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiImage, FiPackage, FiSearch } from 'react-icons/fi';
import api, { API_URL } from '../../services/api';

const AdminProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id && id !== 'new');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        category: 'Electronics',
        stockQuantity: 100,
        image: '',
        featured: false,
        isActive: true,
        badges: []
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [error, setError] = useState('');

    const [categories, setCategories] = useState(['Watches', 'Bags', 'Accessories', 'Jewelry', 'Clothing', 'Shoes', 'Electronics']);
    const badgeOptions = ['new', 'best-seller', 'sale', 'limited', 'popular'];

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
        fetchCategories();
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/products/categories');
            if (response.data.success && response.data.categories.length > 0) {
                // Merge default and fetched to ensure no duplicates
                const unique = [...new Set([...categories, ...response.data.categories])];
                setCategories(unique);
            }
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            if (response.data.success) {
                const p = response.data.product;
                setFormData({
                    name: p.name || '',
                    description: p.description || '',
                    price: p.price || 0,
                    originalPrice: p.originalPrice || 0,
                    category: p.category || 'Electronics',
                    stockQuantity: p.stockQuantity || 0,
                    image: p.image || '',
                    featured: p.featured || false,
                    isActive: p.isActive !== undefined ? p.isActive : true,
                    badges: p.badges || []
                });
            }
        } catch (error) {
            setError('Failed to fetch product details');
            console.error(error);
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleBadgeChange = (badge) => {
        setFormData(prev => ({
            ...prev,
            badges: prev.badges.includes(badge)
                ? prev.badges.filter(b => b !== badge)
                : [...prev.badges, badge]
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            setLoading(true);
            const res = await api.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setFormData(prev => ({ ...prev, image: res.data.url }));
            }
        } catch (err) {
            setError('Failed to upload image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Prepare payload with correct types
        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            originalPrice: parseFloat(formData.originalPrice || 0),
            stockQuantity: parseInt(formData.stockQuantity),
        };

        try {
            if (isEditMode) {
                await api.put(`/products/${id}`, payload);
            } else {
                await api.post('/products', payload);
            }
            navigate('/admin/products');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save product');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="loading-screen">Loading product details...</div>;

    return (
        <div className="dashboard-page" style={{ padding: '40px 0' }}>
            <div className="container animate-in">
                <div className="dashboard-header" style={{ marginBottom: '30px' }}>
                    <Link to="/admin/products" className="back-link"><FiArrowLeft /> Back to Inventory</Link>
                    <h1 style={{ marginTop: '10px' }}>{isEditMode ? 'Edit' : 'Add New'} <span>Product</span></h1>
                </div>

                {error && (
                    <div className="glass-card mb-lg" style={{ padding: '15px', border: '1px solid var(--color-error)', color: 'var(--color-error)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '30px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                        {/* Basic Info */}
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Category (Type or Select)</label>
                            <input
                                list="category-options"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                placeholder="Select or type new..."
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                            />
                            <datalist id="category-options">
                                {categories.map(cat => <option key={cat} value={cat} />)}
                            </datalist>
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                required
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                            ></textarea>
                        </div>

                        {/* Pricing and Stock */}
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Sale Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Original Price ($) (Optional)</label>
                            <input
                                type="number"
                                name="originalPrice"
                                value={formData.originalPrice}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Stock Quantity</label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleChange}
                                min="0"
                                required
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Product Image</label>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '120px', height: '120px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    {formData.image ? (
                                        <img
                                            src={formData.image.startsWith('/') ? `${API_URL.replace('/api', '')}${formData.image}` : formData.image}
                                            alt="Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <FiImage style={{ fontSize: '2rem', color: 'var(--color-text-tertiary)' }} />
                                    )}
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <label htmlFor="product-image-upload" className="btn btn-sm btn-outline" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <FiImage /> Upload Image
                                        </label>
                                        <input
                                            type="file"
                                            id="product-image-upload"
                                            hidden
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                        <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.8rem', alignSelf: 'center' }}>Or enter URL below</span>
                                    </div>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '12px', color: 'var(--color-text-secondary)' }}>Product Badges</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                {badgeOptions.map(badge => (
                                    <label key={badge} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.badges.includes(badge)}
                                            onChange={() => handleBadgeChange(badge)}
                                        />
                                        <span style={{ textTransform: 'capitalize' }}>{badge.replace('-', ' ')}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Switches */}
                        <div style={{ display: 'flex', gap: '40px', gridColumn: 'span 2' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                />
                                <span>Featured Product</span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                                <span>Active (Visible on store)</span>
                            </label>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {loading ? 'Saving...' : <><FiSave /> Save Product</>}
                        </button>
                        <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-secondary">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminProductForm;
