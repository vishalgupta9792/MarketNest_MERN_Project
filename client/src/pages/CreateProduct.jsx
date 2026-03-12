import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import ImageUpload from '../components/ImageUpload';
import toast from 'react-hot-toast';

const CATEGORIES = ['men', 'women', 'kids', 'accessories', 'footwear', 'bags', 'jewelry', 'other'];

export default function CreateProduct() {
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', status: 'draft' });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append('images', f));

      await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Product created! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Create New Product</h1>
        <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </div>

      <div className="card" style={{ maxWidth: 720, padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Title *</label>
            <input name="title" className="form-control" placeholder="e.g. Summer Floral Dress" value={form.title} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Price (₹) *</label>
              <input name="price" type="number" min="0" step="0.01" className="form-control" placeholder="999" value={form.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" className="form-control" value={form.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" className="form-control" placeholder="Describe your product in detail…" rows={4} value={form.description} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" className="form-control" value={form.status} onChange={handleChange}>
              <option value="draft">Draft (not visible to customers)</option>
              <option value="published">Published (live on marketplace)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Product Images (max 5)</label>
            <ImageUpload files={files} setFiles={setFiles} maxFiles={5} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating…' : '✓ Create Product'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
