import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader-wrap"><div className="spinner" /></div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RoleRoute({ role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader-wrap"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === 'brand' ? '/dashboard' : '/marketplace'} replace />;
  return <Outlet />;
}
