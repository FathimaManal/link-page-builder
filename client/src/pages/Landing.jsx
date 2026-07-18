import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PREVIEW_LINKS = [
  { label: 'Portfolio',  color: '#e85d04' },
  { label: 'Dribbble',   color: '#2563eb' },
  { label: 'GitHub',     color: '#16a34a' },
  { label: 'Substack',   color: '#7c3aed' },
];

export default function Landing() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <span className="landing-logo">LinkPage</span>
        <div className="landing-nav-actions">
          <Link to="/login"    className="btn btn-secondary btn-sm">Sign in</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
        </div>
      </nav>

      <div className="landing-hero">
        <div className="landing-left">
          <h1 className="landing-headline">
            Your links.<br />
            <span className="headline-accent">One page.</span>
          </h1>

          <p className="landing-sub">
            Put your portfolio, socials and projects all in one spot. Share it anywhere with a single link.
          </p>

          <div className="landing-ctas">
            <Link to="/register" className="btn btn-primary landing-cta-btn">Build your page</Link>
            <a href="/u/demo" className="btn btn-secondary landing-cta-btn">See a live example</a>
          </div>
          <Link to="/login" className="landing-demo-link">Already have an account? Sign in</Link>
        </div>

        <div className="landing-right">
          <div className="card landing-preview">
            <div className="preview-header">
              <div className="preview-avatar">SK</div>
              <div>
                <div className="preview-username">@sarakim</div>
                <div className="preview-bio">Product designer. London.</div>
              </div>
            </div>
            <div className="preview-links">
              {PREVIEW_LINKS.map(({ label, color }) => (
                <div
                  key={label}
                  className="preview-link-btn"
                  style={{ background: color, borderColor: color, boxShadow: `3px 3px 0 #0d0d0d`, color: '#fff' }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
