import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Protected Route Component
 * Restricts access based on authentication and role
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Show nothing while loading auth state
    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role authorization
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return (
            <div className="access-denied">
                <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚫</div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--color-text-primary)' }}>
                        Access Denied
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                        You don't have permission to access this page.
                    </p>
                    <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem' }}>
                        Required role: <strong>{allowedRoles.join(' or ')}</strong>
                        <br />
                        Your role: <strong>{user?.role}</strong>
                    </p>
                    <a
                        href="/"
                        style={{
                            display: 'inline-block',
                            marginTop: '30px',
                            padding: '12px 24px',
                            background: 'var(--gradient-primary)',
                            borderRadius: '8px',
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: '600'
                        }}
                    >
                        Go to Home
                    </a>
                </div>
            </div>
        );
    }

    return children ? children : <Outlet />;
};

export const AdminRoute = () => <ProtectedRoute allowedRoles={['admin']} />;
export const StaffRoute = () => <ProtectedRoute allowedRoles={['staff', 'admin']} />;

export default ProtectedRoute;
