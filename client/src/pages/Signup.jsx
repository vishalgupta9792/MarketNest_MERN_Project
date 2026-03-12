import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) return toast.error('Please select a role');
    setLoading(true);
    try {
      const user = await signup(form.name, form.email, form.password, form.role);
      toast.success('Welcome to MarketNest! 🎉');
      navigate(user.role === 'brand' ? '/dashboard' : '/marketplace');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Join MarketNest</h1>
        <p className="auth-sub">Create your account to get started</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" className="form-control" placeholder="Your name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" className="form-control" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
          </div>

          <div className="form-group">
            <label>I want to</label>
            <div className="role-selector">
              {[
                { value: 'brand', icon: '🏪', label: 'Sell Products', desc: 'Brand / Seller' },
                { value: 'customer', icon: '🛍️', label: 'Buy Products', desc: 'Customer / Buyer' },
              ].map((r) => (
                <div
                  key={r.value}
                  className={`role-option ${form.role === r.value ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, role: r.value })}
                >
                  <div className="role-icon">{r.icon}</div>
                  <div className="role-label">{r.label}</div>
                  <div className="role-desc">{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </div>
    </div>
  );
}
