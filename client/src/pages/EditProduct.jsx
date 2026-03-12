import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import ImageUpload from '../components/ImageUpload';
import toast from 'react-hot-toast';

const CATEGORIES = ['men', 'women', 'kids', 'accessories', 'footwear', 'bags', 'jewelry', 'other'];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', status: '' });
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch product (using brand/all which returns own products)
    api.get('/products/brand/all?limit=100')
      .then(({ data }) => {
        const p = data.products.find((x) => x._id === id);
        if (!p) { toast.error('Product not found'); navigate('/dashboard'); return; }
        setForm({ title: p.title, description: p.description, price: p.price, category: p.category, status: p.status });
        setExistingImages(p.images || []);
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append('images', f));
      await api.put(`/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Product updated!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader-wrap"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Edit Product</h1>
        <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </div>

      <div className="card" style={{ maxWidth: 720, padding: '2rem' }}>
        {existingImages.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Images</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {existingImages.map((img, i) => (
                <img key={i} src={img} alt={`img-${i}`} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Title *</label>
            <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Price (₹) *</label>
              <input name="price" type="number" min="0" className="form-control" value={form.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" className="form-control" value={form.category} onChange={handleChange} required>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" className="form-control" rows={4} value={form.description} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" className="form-control" value={form.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="form-group">
            <label>Add More Images</label>
            <ImageUpload files={files} setFiles={setFiles} maxFiles={5 - existingImages.length} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : '✓ Save Changes'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
