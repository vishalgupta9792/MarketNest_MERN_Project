import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)', color: '#fff', padding: '6rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
          Fashion. Simplified.<br />
          <span style={{ color: '#E94560' }}>MarketNest.</span>
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: 500, margin: '0 auto 2rem' }}>
          Connect brands with customers. Discover curated fashion from top sellers.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
