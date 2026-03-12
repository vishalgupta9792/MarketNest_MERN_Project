import { useNavigate } from 'react-router-dom';

const PLACEHOLDER = 'https://via.placeholder.com/300x400?text=No+Image';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="card product-card" onClick={() => navigate(`/products/${product._id}`)}>
      <div className="product-card-img">
        {product.images?.[0]
          ? <img src={product.images[0]} alt={product.title} loading="lazy" />
          : <span>🛍️</span>}
      </div>
      <div className="product-card-body">
        <p className="product-title">{product.title}</p>
        <p className="product-price">₹{Number(product.price).toLocaleString('en-IN')}</p>
        <p className="product-brand">{product.brand?.name || 'Unknown Brand'}</p>
        <span className="badge" style={{ background: '#f1f5f9', color: '#475569', marginTop: '0.5rem', display: 'inline-block' }}>
          {product.category}
        </span>
      </div>
    </div>
  );
}
