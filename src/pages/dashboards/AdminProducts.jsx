import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await api.delete(`/products/${id}`);
                if (response.data.success) {
                    setProducts(products.filter(p => (p._id || p.id) !== id));
                    alert('Product deleted successfully');
                }
            } catch (error) {
                console.error('Delete failed:', error);
                alert('Failed to delete product');
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-screen">Loading inventory...</div>;

    return (
        <div className="dashboard-page" style={{ padding: '40px 0', minHeight: '80vh' }}>
            <div className="container animate-in">
                <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <Link to="/admin" className="back-link"><FiArrowLeft /> Back to Dashboard</Link>
                        <h1 style={{ marginTop: '10px' }}>Manage <span>Products</span></h1>
                    </div>
                    <Link to="/admin/products/new" className="btn btn-primary">
                        <FiPlus /> Add New Product
                    </Link>
                </div>

                <div className="search-bar glass-card mb-lg" style={{ padding: '15px' }}>
                    <div style={{ position: 'relative' }}>
                        <FiSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                        <input
                            type="text"
                            placeholder="Search products by name or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 45px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                        />
                    </div>
                </div>

                <div className="glass-card" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="dashboard-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <tr>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Product</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Category</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Price</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Stock</th>
                                    <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product._id || product.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <img src={product.image} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                                                <span>{product.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px' }}>{product.category}</td>
                                        <td style={{ padding: '15px' }}>${product.price.toFixed(2)}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ color: product.stockQuantity > 10 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                                                {product.stockQuantity > 0 ? product.stockQuantity : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                                <Link to={`/admin/products/edit/${product._id || product.id}`} className="btn-icon" style={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit">
                                                    <FiEdit2 />
                                                </Link>
                                                <button
                                                    className="btn-icon"
                                                    style={{ width: '35px', height: '35px', color: 'var(--color-error)' }}
                                                    title="Delete"
                                                    onClick={() => handleDelete(product._id || product.id)}
                                                >
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
            </div>
        </div>
    );
};

export default AdminProducts;
