import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import ProductCard from '../components/ProductCard/ProductCard';
import ProductCardSkeleton from '../components/ProductCard/ProductCardSkeleton';
import api from '../services/api';
import './Products.css';

// Reusing existing categories from mock for now, or fetch from API if available


/**
 * Products Page
 * Product listing with filtering and search
 */
const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [categories, setCategories] = useState([{ id: "all", name: "All Products", icon: "🛍️" }]); // Default

    // Filter states
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [sortBy, setSortBy] = useState('featured');
    const [priceRange, setPriceRange] = useState([0, 100000]);

    // Fetch Products and Categories
    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                // Fetch products
                try {
                    const productsRes = await api.get('/products?limit=100');
                    if (productsRes.data.success) {
                        setProducts(productsRes.data.products);
                    }
                } catch (e) {
                    console.error('Failed to fetch products', e);
                    // Don't set global error yet, try to load categories at least
                }

                // Fetch categories
                try {
                    const categoriesRes = await api.get('/products/categories');
                    if (categoriesRes.data.success) {
                        const dynamicCats = categoriesRes.data.categories.map(cat => ({
                            id: cat,
                            name: cat,
                            icon: "📦"
                        }));
                        setCategories([
                            { id: "all", name: "All Products", icon: "🛍️" },
                            ...dynamicCats
                        ]);
                    }
                } catch (e) {
                    console.error('Failed to fetch categories', e);
                }

                // If both empty, then set error
                // setProduct logic happens in state
                // We won't block render on one failure

            } catch (err) {
                console.error('Error loading page data:', err);
                setError('Failed to load products.');
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    // Update search params when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        setSearchParams(params);
    }, [searchQuery, selectedCategory, setSearchParams]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        if (!products.length) return [];

        let result = [...products];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Price range filter
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Sort
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Featured
                result = result.filter(p => p.featured).concat(result.filter(p => !p.featured));
                break;
        }

        return result;
    }, [products, searchQuery, selectedCategory, sortBy, priceRange]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setIsFilterOpen(false);
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSortBy('featured');
        setPriceRange([0, 100000]); // Reset to full range
        setSearchParams({});
    };

    const hasActiveFilters = searchQuery || selectedCategory !== 'all' || sortBy !== 'featured' || priceRange[0] !== 0 || priceRange[1] !== 100000;

    // if (loading) return <div className="loading-screen">Loading products...</div>;
    // if (error) return <div className="error-message">{error}</div>; // Allow partial render

    return (
        <main className="products-page">
            <div className="container animate-in">
                {/* Header Section */}
                <div className="products-header">
                    <h1 className="page-title">
                        {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name || 'Products'}
                    </h1>
                    <button
                        className={`filter-toggle-btn ${isFilterOpen ? 'active' : ''}`}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <FiFilter /> Filters
                    </button>
                </div>

                <div className="products-layout">
                    {/* Filters Sidebar (Mobile: Slide-out, Desktop: Sidebar) */}
                    <aside className={`products-sidebar glass-card ${isFilterOpen ? 'open' : ''}`}>
                        <div className="sidebar-header">
                            <h3>Filters</h3>
                            <button className="close-filters" onClick={() => setIsFilterOpen(false)}>
                                <FiX />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="filter-group">
                            <label>Search</label>
                            <div className="search-input-wrapper">
                                <FiSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="form-input"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="filter-group">
                            <label>Category</label>
                            <div className="category-list">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                                        onClick={() => handleCategoryChange(cat.id)}
                                    >
                                        <span>{cat.icon || '📦'}</span>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="filter-group">
                            <label>Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
                            <input
                                type="range"
                                min="0"
                                max="100000"
                                step="100"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                className="price-slider"
                            />
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button className="btn btn-outline" onClick={handleClearFilters} style={{ width: '100%' }}>
                                Clear Filters
                            </button>
                        )}
                    </aside>

                    {/* Products Grid */}
                    <div className="products-content">
                        {/* Loading State */}
                        {loading ? (
                            <div className="products-grid">
                                {[...Array(8)].map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <>
                                <div className="products-toolbar glass-card">
                                    <span className="products-count">{filteredProducts.length} products found</span>
                                    <div className="sort-wrapper">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="sort-select"
                                        >
                                            <option value="featured">Featured</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                            <option value="rating">Highest Rated</option>
                                            <option value="name">Name: A-Z</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="products-grid">
                                    {filteredProducts.map(product => (
                                        <ProductCard key={product.id || product._id} product={product} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="no-products glass-card">
                                <div className="no-products-content">
                                    <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍️</span>
                                    <h3>No products found</h3>
                                    <p>Try adjusting your filters or search terms.</p>
                                    <button className="btn btn-primary" onClick={handleClearFilters}>
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Overlay */}
            {isFilterOpen && (
                <div
                    className="filter-overlay"
                    onClick={() => setIsFilterOpen(false)}
                />
            )}
        </main>
    );
};

export default Products;
