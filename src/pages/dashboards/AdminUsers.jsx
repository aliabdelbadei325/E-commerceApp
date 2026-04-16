import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMoreVertical, FiCheck, FiX, FiShield, FiAlertTriangle, FiTrash2, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'user' });

    useEffect(() => {
        fetchUsers();
    }, [search, roleFilter]);

    // Debounced search could be better, but for now simple effect dependency is fine
    // Or we can fetch on submit/change. Backend might handle search.

    const fetchUsers = async () => {
        try {
            // Build query
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (roleFilter) params.append('role', roleFilter);

            const response = await api.get(`/users?${params.toString()}`);
            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (error) {
            setError('Failed to fetch users');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        setUpdatingId(userId);
        try {
            const response = await api.put(`/users/${userId}`, { role: newRole });
            if (response.data.success) {
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, role: newRole } : user
                ));
            }
        } catch (error) {
            console.error('Failed to update role', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        setUpdatingId(userId);
        try {
            const newStatus = !currentStatus;
            const response = await api.put(`/users/${userId}`, { isActive: newStatus });
            if (response.data.success) {
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, isActive: newStatus } : user
                ));
            }
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            const response = await api.delete(`/users/${userId}`);
            if (response.data.success) {
                setUsers(users.filter(u => u._id !== userId));
            }
        } catch (error) {
            console.error('Failed to delete user', error);
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users', newUser);
            if (response.data.success) {
                setUsers([response.data.user, ...users]);
                setShowAddModal(false);
                setNewUser({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
                alert('User created successfully');
            }
        } catch (error) {
            console.error('Failed to create user', error);
            alert(error.response?.data?.message || 'Failed to create user');
        }
    };

    if (loading) return <div className="loading-screen">Loading users...</div>;

    return (
        <div className="dashboard-page" style={{ padding: '40px 0' }}>
            <div className="container animate-in">
                <div className="dashboard-header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Link to="/admin" className="back-link"><FiArrowLeft /> Back to Dashboard</Link>
                        <h1 style={{ marginTop: '10px' }}>User <span>Management</span></h1>
                    </div>
                    <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiPlus /> Add User
                    </button>
                </div>

                {error && (
                    <div className="glass-card mb-lg" style={{ padding: '15px', border: '1px solid var(--color-error)', color: 'var(--color-error)' }}>
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="glass-card mb-lg" style={{ padding: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
                        <FiSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 45px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                        />
                    </div>
                    <div style={{ position: 'relative', minWidth: '150px' }}>
                        <FiFilter style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 45px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                        >
                            <option value="">All Roles</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>
                </div>

                <div className="glass-card" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <th style={{ padding: '20px', textAlign: 'left', color: 'var(--color-text-secondary)' }}>User</th>
                                    <th style={{ padding: '20px', textAlign: 'left', color: 'var(--color-text-secondary)' }}>Email</th>
                                    <th style={{ padding: '20px', textAlign: 'left', color: 'var(--color-text-secondary)' }}>Role</th>
                                    <th style={{ padding: '20px', textAlign: 'left', color: 'var(--color-text-secondary)' }}>Status</th>
                                    <th style={{ padding: '20px', textAlign: 'left', color: 'var(--color-text-secondary)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{
                                                    width: '40px', height: '40px', borderRadius: '50%',
                                                    background: 'var(--gradient-primary)', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                                                }}>
                                                    {user.avatar || <FiUser />}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>{user.firstName} {user.lastName}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>ID: {user._id.substring(0, 8)}...</div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px' }}>{user.email}</td>
                                            <td style={{ padding: '20px' }}>
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    disabled={updatingId === user._id}
                                                    style={{
                                                        padding: '8px', borderRadius: '6px',
                                                        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)',
                                                        color: user.role === 'admin' ? 'var(--color-primary)' : 'white'
                                                    }}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="staff">Staff</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <span style={{
                                                    padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem',
                                                    background: user.isActive !== false ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                                    color: user.isActive !== false ? '#4caf50' : '#f44336',
                                                    border: `1px solid ${user.isActive !== false ? '#4caf50' : '#f44336'}`
                                                }}>
                                                    {user.isActive !== false ? 'Active' : 'Blocked'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button
                                                        onClick={() => handleStatusToggle(user._id, user.isActive !== false)}
                                                        disabled={updatingId === user._id}
                                                        className={`btn ${user.isActive !== false ? 'btn-outline' : 'btn-primary'}`}
                                                        style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                                                    >
                                                        {user.isActive !== false ? 'Block' : 'Unblock'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
                                                        disabled={updatingId === user._id}
                                                        className="btn-icon"
                                                        style={{ color: 'var(--color-error)', border: '1px solid var(--color-error)' }}
                                                        title="Delete User"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                            No users found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add User Modal */}
                {showAddModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '20px', zIndex: 9999, backdropFilter: 'blur(5px)'
                    }}>
                        <div className="glass-card animate-in" style={{
                            padding: '30px', width: '100%', maxWidth: '500px',
                            maxHeight: '90vh', overflowY: 'auto', position: 'relative',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <button
                                onClick={() => setShowAddModal(false)}
                                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                <FiX />
                            </button>
                            <h2 style={{ marginBottom: '20px' }}>Add New User</h2>
                            <form onSubmit={handleAddUser}>
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text" required
                                        value={newUser.firstName}
                                        onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}
                                        className="form-input" // Assuming existence of CSS class or fallback
                                        style={{ width: '100%', padding: '10px', marginBottom: '15px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text" required
                                        value={newUser.lastName}
                                        onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
                                        style={{ width: '100%', padding: '10px', marginBottom: '15px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email" required
                                        value={newUser.email}
                                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                        style={{ width: '100%', padding: '10px', marginBottom: '15px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password" required
                                        value={newUser.password}
                                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                        style={{ width: '100%', padding: '10px', marginBottom: '15px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select
                                        value={newUser.role}
                                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                        style={{ width: '100%', padding: '10px', marginBottom: '25px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'white' }}
                                    >
                                        <option value="user">User</option>
                                        <option value="staff">Staff</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create User</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
