import StaticPageLayout from './StaticPageLayout';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const Contact = () => {
    return (
        <StaticPageLayout title="Contact Us" subtitle="We'd love to hear from you">
            <div style={{ display: 'grid', mdGridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div>
                    <h2>Get in Touch</h2>
                    <p>Have questions about our products, support services, or just want to say hello? We're here to help.</p>

                    <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', color: 'var(--color-primary)' }}>
                                <FiMail size={20} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>Email</h3>
                                <p style={{ margin: 0 }}>support@luxestore.com</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', color: 'var(--color-primary)' }}>
                                <FiPhone size={20} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>Phone</h3>
                                <p style={{ margin: 0 }}>+1 (555) 123-4567</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', color: 'var(--color-primary)' }}>
                                <FiMapPin size={20} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>Office</h3>
                                <p style={{ margin: 0 }}>123 Fashion Ave, New York, NY 10001</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form className="glass-card" style={{ padding: '30px', border: '1px solid var(--color-border)' }} onSubmit={e => e.preventDefault()}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-input" placeholder="Your name" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-input" placeholder="Your email" />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea className="form-input" rows="5" placeholder="How can we help?"></textarea>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
                </form>
            </div>
        </StaticPageLayout>
    );
};

export default Contact;
