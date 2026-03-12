import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleRoute } from './routes/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import BrandDashboard from './pages/BrandDashboard';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected – any logged-in user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/products/:id" element={<ProductDetail />} />
          </Route>

          {/* Customer only */}
          <Route element={<RoleRoute role="customer" />}>
            <Route path="/marketplace" element={<Marketplace />} />
          </Route>

          {/* Brand only */}
          <Route element={<RoleRoute role="brand" />}>
            <Route path="/dashboard" element={<BrandDashboard />} />
            <Route path="/products/create" element={<CreateProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
