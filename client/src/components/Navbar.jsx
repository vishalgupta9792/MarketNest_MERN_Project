import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out!');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Market<span>Nest</span>
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            {user.role === 'brand' ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/products/create" className="nav-link">+ New Product</Link>
              </>
            ) : (
              <Link to="/marketplace" className="nav-link">Marketplace</Link>
            )}
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
