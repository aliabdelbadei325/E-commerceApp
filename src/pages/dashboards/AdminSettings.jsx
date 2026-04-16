import React from 'react';
import { FiSettings, FiSave, FiLock, FiGlobe, FiBell } from 'react-icons/fi';

const AdminSettings = () => {
    return (
        <div className="dashboard-page" style={{ padding: '40px 0', minHeight: '100vh' }}>
            <div className="container animate-in">
                <div className="dashboard-header" style={{ marginBottom: '30px' }}>
                    <h1 className="heading-lg">Admin <span className="text-gradient">Settings</span></h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Manage your store configuration and preferences.</p>
                </div>

                <div className="grid grid-2" style={{ gap: '30px' }}>
                    {/* General Settings */}
                    <div className="glass-card" style={{ padding: '30px' }}>
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiGlobe /> General Configuration
                        </h3>
                        <div className="form-group">
                            <label className="form-label">Store Name</label>
                            <input type="text" className="form-input" defaultValue="Antigravity E-commerce" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Support Email</label>
                            <input type="email" className="form-input" defaultValue="support@example.com" />
                        </div>
                        <button className="btn btn-primary" style={{ marginTop: '10px' }}>
                            <FiSave /> Save Changes
                        </button>
                    </div>

                    {/* Security Settings */}
                    <div className="glass-card" style={{ padding: '30px' }}>
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiLock /> Security & Access
                        </h3>
                        <div className="form-group">
                            <label className="form-label">Maintenance Mode</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input type="checkbox" id="maintenance" />
                                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Enable maintenance mode for users</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Two-Factor Authentication</label>
                            <button className="btn btn-secondary btn-sm">Setup 2FA</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
