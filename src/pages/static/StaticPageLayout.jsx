import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './StaticPage.css';

const StaticPageLayout = ({ title, subtitle, children }) => {
    return (
        <div className="static-page animate-in">
            <div className="container">
                <div className="static-header">
                    <Link to="/" className="back-link"><FiArrowLeft /> Back to Home</Link>
                    <h1 className="static-title">{title}</h1>
                    {subtitle && <p className="static-subtitle">{subtitle}</p>}
                </div>
                <div className="static-content glass-card">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default StaticPageLayout;
