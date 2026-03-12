import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const statusClass = { published: 'badge-published', draft: 'badge-draft', archived: 'badge-archived' };

export default function BrandDashboard() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/products/dashboard');
      setStats(data.stats);
    } catch { toast.error('Failed to load dashboard'); }
  };

  const fetchProducts = async () => {
    try {
      const params = { page, limit: 8 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/products/brand/all', { params });
      setAllProducts(data.products);
      setTotalPages(data.totalPages);
    } catch {}
  };

  useEffect(() => {
    Promise.all([fetchDashboard(), fetchProducts()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchProducts(); }, [page, statusFilter]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="loader-wrap"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Brand Dashboard</h1>
        <Link to="/products/create" className="btn btn-primary">+ New Product</Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          {[
            { label: 'Total Products', value: stats.total, cls: 'stat-total' },
            { label: 'Published', value: stats.published, cls: 'stat-published' },
            { label: 'Drafts', value: stats.draft, cls: 'stat-draft' },
            { label: 'Archived', value: stats.archived, cls: 'stat-archived' },
          ].map((s) => (
            <div key={s.label} className={`stat-card ${s.cls}`}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Products Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#1A1A2E' }}>My Products</h2>
          <select className="search-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {allProducts.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📦</div>
            <h3>No products yet</h3>
            <p>Create your first product to start selling</p>
            <Link to="/products/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Product</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {p.images?.[0]
                          ? <img src={p.images[0]} alt={p.title} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
                          : <div style={{ width: 44, height: 44, background: '#f0f0f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛍️</div>}
                        <span style={{ fontWeight: 500 }}>{p.title}</span>
                      </div>
                    </td>
                    <td style={{ textTransform: 'capitalize', color: '#666' }}>{p.category}</td>
                    <td style={{ fontWeight: 600 }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                    <td><span className={`badge ${statusClass[p.status]}`}>{p.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => navigate(`/products/edit/${p._id}`)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
                <span style={{ padding: '0.4rem 0.75rem', fontSize: '0.9rem' }}>{page}/{totalPages}</span>
                <button className="btn btn-outline btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next ›</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
