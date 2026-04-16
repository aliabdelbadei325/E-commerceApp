import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiCamera, FiSave } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api, { API_URL } from '../../services/api';
import './Dashboard.css';

/**
 * Profile Settings Page
 * Allow users to update their personal information
 */
const ProfileSettings = () => {
    const { user, login } = useAuth(); // We'll use login to update local state if needed OR just use context update
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        avatar: user?.avatar || '👤'
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleProfileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setLoading(true);
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setFormData(prev => ({ ...prev, avatar: res.data.url }));
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to upload image' });
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await api.put('/users/profile', formData);
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                // Note: AuthContext might need a way to refresh user state
                // For now, reload or manual update if possible
                window.location.reload();
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match' });
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await api.put('/auth/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <div className="container animate-in">
                <div className="dashboard-header">
                    <div className="dashboard-welcome">
                        <Link to="/dashboard" className="back-link" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FiArrowLeft /> Back to Dashboard
                        </Link>
                        <h1>Account <span>Settings</span></h1>
                    </div>
                </div>

                {message.text && (
                    <div className={`message-banner ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="cards-grid">
                    {/* Profile Information */}
                    <div className="dashboard-card">
                        <h3><FiUser /> Public Profile</h3>
                        <form onSubmit={handleProfileSubmit}>
                            <div className="avatar-selection" style={{ marginBottom: '25px', textAlign: 'center' }}>
                                <div className="profile-avatar-large" style={{
                                    fontSize: '3rem', width: '100px', height: '100px',
                                    margin: '0 auto 15px', background: 'var(--gradient-primary)',
                                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {formData.avatar && formData.avatar.startsWith('/') ? (
                                        <img
                                            src={`${API_URL.replace('/api', '')}${formData.avatar}`}
                                            alt="Avatar"
                                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        formData.avatar
                                    )}
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="avatar-upload" className="btn btn-sm btn-outline" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                        <FiCamera /> {loading ? 'Uploading...' : 'Upload Photo'}
                                    </label>
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        hidden
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="avatar-options" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    {['👤', '👨‍💻', '👩‍💻', '🎮', '🎨', '🚀'].map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            className={`avatar-opt-btn ${formData.avatar === emoji ? 'active' : ''}`}
                                            onClick={() => setFormData({ ...formData, avatar: emoji })}
                                            style={{
                                                fontSize: '1.5rem', background: 'none', border: formData.avatar === emoji ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                                borderRadius: '8px', cursor: 'pointer', padding: '5px'
                                            }}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label><FiUser /> First Name</label>
                                <input
                                    type="text" name="firstName"
                                    value={formData.firstName} onChange={handleProfileChange}
                                    className="form-input" required
                                />
                            </div>
                            <div className="form-group">
                                <label><FiUser /> Last Name</label>
                                <input
                                    type="text" name="lastName"
                                    value={formData.lastName} onChange={handleProfileChange}
                                    className="form-input" required
                                />
                            </div>
                            <div className="form-group">
                                <label><FiMail /> Email Address</label>
                                <input
                                    type="email" name="email"
                                    value={formData.email} onChange={handleProfileChange}
                                    className="form-input" required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
                                <FiSave /> {loading ? 'Saving...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="dashboard-card">
                        <h3><FiLock /> Security</h3>
                        <form onSubmit={handlePasswordSubmit}>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                                Update your password to keep your account secure.
                            </p>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password" name="currentPassword"
                                    value={passwordData.currentPassword} onChange={handlePasswordChange}
                                    className="form-input" required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password" name="newPassword"
                                    value={passwordData.newPassword} onChange={handlePasswordChange}
                                    className="form-input" required minLength="8"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password" name="confirmPassword"
                                    value={passwordData.confirmPassword} onChange={handlePasswordChange}
                                    className="form-input" required
                                />
                            </div>

                            <button type="submit" className="btn btn-outline" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
                                Change Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .message-banner {
                    padding: 15px;
                    border-radius: 12px;
                    margin-bottom: 30px;
                    text-align: center;
                    border: 1px solid transparent;
                }
                .message-banner.success {
                    background: rgba(76, 175, 80, 0.1);
                    color: #4caf50;
                    border-color: #4caf50;
                }
                .message-banner.error {
                    background: rgba(244, 67, 54, 0.1);
                    color: #f44336;
                    border-color: #f44336;
                }
                .avatar-opt-btn.active {
                    background: rgba(var(--color-primary-rgb), 0.1) !important;
                }
            `}</style>
        </div>
    );
};

export default ProfileSettings;
