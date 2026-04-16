import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ProtectedRoute, { AdminRoute, StaffRoute } from './components/ProtectedRoute/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/static/Contact';
import About from './pages/static/About';
import FAQ from './pages/static/FAQ';
import Shipping from './pages/static/Shipping';
import Returns from './pages/static/Returns';
import Privacy from './pages/static/Privacy';
import Terms from './pages/static/Terms';
import UserDashboard from './pages/dashboards/UserDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import StaffDashboard from './pages/dashboards/StaffDashboard';
import WishlistPage from './pages/WishlistPage';
import AdminProducts from './pages/dashboards/AdminProducts';
import AdminProductForm from './pages/dashboards/AdminProductForm';
import AdminUsers from './pages/dashboards/AdminUsers';
import AdminAnalytics from './pages/dashboards/AdminAnalytics';
import AdminSettings from './pages/dashboards/AdminSettings';
import AdminOrders from './pages/dashboards/AdminOrders';
import AdminOrderDetails from './pages/dashboards/AdminOrderDetails';
import AdminCoupons from './pages/dashboards/AdminCoupons';
import AdminReviews from './pages/dashboards/AdminReviews';
import ProfileSettings from './pages/dashboards/ProfileSettings';
import AddressesPage from './pages/dashboards/AddressesPage';
import UserOrderDetails from './pages/dashboards/UserOrderDetails';
import OrdersPage from './pages/OrdersPage';
import './styles/index.css';

// Simple NotFound Component
const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--color-text-primary)' }}>
    <h1 style={{ fontSize: '4rem' }}>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you are looking for doesn't exist.</p>
    <a href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Back to Home</a>
  </div>
);

/**
 * Main App Component
 * E-commerce Frontend Showcase
 */
const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Router>
                <div className="app">
                  <Header />
                  <main className="app-main">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:id" element={<ProductDetails />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />

                      {/* Static Pages */}
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/shipping" element={<Shipping />} />
                      <Route path="/returns" element={<Returns />} />
                      <Route path="/faq" element={<FAQ />} />

                      {/* Protected Routes */}
                      <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/profile" element={<UserDashboard />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/orders/:id" element={<UserOrderDetails />} />
                        <Route path="/settings" element={<ProfileSettings />} />
                        <Route path="/addresses" element={<AddressesPage />} />
                      </Route>

                      {/* Admin Routes */}
                      <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/analytics" element={<AdminAnalytics />} />
                        <Route path="/admin/products" element={<AdminProducts />} />
                        <Route path="/admin/products/new" element={<AdminProductForm />} />
                        <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
                        <Route path="/admin/orders" element={<AdminOrders />} />
                        <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
                        <Route path="/admin/users" element={<AdminUsers />} />
                        <Route path="/admin/coupons" element={<AdminCoupons />} />
                        <Route path="/admin/reviews" element={<AdminReviews />} />
                        <Route path="/admin/settings" element={<AdminSettings />} />
                      </Route>

                      {/* Staff Routes */}
                      <Route element={<StaffRoute />}>
                        <Route path="/staff" element={<StaffDashboard />} />
                      </Route>

                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
