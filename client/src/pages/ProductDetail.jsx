import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => { toast.error('Product not found'); navigate('/marketplace'); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loader-wrap"><div className="spinner" /></div>;
  if (!product) return null;

  return (
    <div className="page">
      <button className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="product-detail">
        {/* Images */}
        <div>
          <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '0.75rem', background: '#f4f4f4', aspectRatio: '4/5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.images?.[activeImg]
              ? <img src={product.images[activeImg]} alt={product.title} className="product-main-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '5rem' }}>🛍️</span>}
          </div>
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  className={`product-thumb ${i === activeImg ? 'active' : ''}`}
                  style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: i === activeImg ? '2px solid #E94560' : '2px solid transparent' }}
                  onClick={() => setActiveImg(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: '2rem', marginTop: '0.75rem', marginBottom: '0.5rem', color: '#1A1A2E', fontFamily: 'Playfair Display, serif' }}>{product.title}</h1>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>by {product.brand?.name}</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#E94560', marginBottom: '1.5rem' }}>
            ₹{Number(product.price).toLocaleString('en-IN')}
          </p>
          <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>Description</h3>
            <p style={{ color: '#555', lineHeight: 1.8, fontSize: '0.95rem' }}>{product.description}</p>
          </div>
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f6f2', borderRadius: 10 }}>
            <p style={{ fontSize: '0.85rem', color: '#888' }}>Listed by</p>
            <p style={{ fontWeight: 600, color: '#1A1A2E' }}>{product.brand?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
