import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';

const CATEGORIES = ['all', 'men', 'women', 'kids', 'accessories', 'footwear', 'bags', 'jewelry', 'other'];

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, search, category };
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div>
      <div className="hero">
        <h1>Discover Fashion</h1>
        <p>Explore curated collections from top brands</p>
      </div>

      <div className="page">
        <div className="search-bar">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, flexWrap: 'wrap' }}>
            <input
              className="search-input"
              placeholder="Search products…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
            {search && (
              <button type="button" className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>
                Clear
              </button>
            )}
          </form>
          <select className="search-select" value={category} onChange={(e) => handleCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            {total > 0 ? `${total} product${total !== 1 ? 's' : ''} found` : ''}
          </p>
        </div>

        {loading ? (
          <div className="loader-wrap"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🛍️</div>
            <h3>No products found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
