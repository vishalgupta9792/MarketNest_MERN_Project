import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const headline = 'Fashion. Simplified.';
  const brand = 'MarketNest.';

  return (
    <div>
      <div className="home-hero">
        <h1 className="home-hero-title">
          <span className="home-hero-line" aria-label={headline}>
            {headline.split('').map((char, index) => (
              <span
                key={`${char}-${index}`}
                className={`hero-letter${char === ' ' ? ' hero-letter-space' : ''}`}
                style={{ animationDelay: `${index * 0.06}s` }}
                aria-hidden="true"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
          <br />
          <span className="home-hero-brand" aria-label={brand}>
            {brand.split('').map((char, index) => (
              <span
                key={`${char}-${index}`}
                className={`hero-letter hero-letter-brand${char === ' ' ? ' hero-letter-space' : ''}`}
                style={{ animationDelay: `${0.9 + index * 0.05}s` }}
                aria-hidden="true"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </h1>
        <p className="home-hero-copy">
          Connect brands with customers. Discover curated fashion from top sellers.
        </p>
        <div className="home-hero-actions">
          {user ? (
            user.role === 'brand'
              ? <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
              : <Link to="/marketplace" className="btn btn-primary">Browse Marketplace</Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
              <Link to="/login" className="btn btn-ghost">Sign In</Link>
            </>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '4rem auto', padding: '0 1.5rem' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '3rem', color: '#1A1A2E' }}>
          Everything you need
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          {[
            { icon: '🏪', title: 'Brand Dashboard', desc: 'Manage your products, track performance, and grow your fashion brand.' },
            { icon: '🔍', title: 'Smart Search', desc: 'Customers find exactly what they want with search and category filters.' },
            { icon: '🖼️', title: 'Image Gallery', desc: 'Showcase products with multiple high-quality images via Cloudinary.' },
            { icon: '🔐', title: 'Secure Auth', desc: 'JWT-based authentication with access & refresh tokens for security.' },
          ].map((f) => (
            <div key={f.title} style={{ background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', marginBottom: '0.5rem', color: '#1A1A2E' }}>{f.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
