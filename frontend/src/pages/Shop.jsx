import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

const SIZES = ['28', '30', '32', '34', '36', '38'];
const COLORS = ['Black', 'Blue', 'Grey', 'White', 'Brown'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({ size: '', color: '', minPrice: '', maxPrice: '', search: '' });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (filters.size) params.size = filters.size;
      if (filters.color) params.color = filters.color;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.search) params.search = filters.search;
      const res = await getProducts(params);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { setPage(1); }, [filters]);
  useEffect(() => { fetchProducts(); }, [filters, page]);

  const clearFilters = () => setFilters({ size: '', color: '', minPrice: '', maxPrice: '', search: '' });

  return (
    <div className="page" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div style={{ background: '#0d0d0d', borderBottom: '1px solid #1e1e1e', padding: '40px 0 30px' }}>
        <div className="container">
          <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a96e', marginBottom: 8, textTransform: 'uppercase' }}>Our Collection</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <h1 className="section-title" style={{ margin: 0 }}>Shop Jeans</h1>
            <span style={{ color: '#555', fontSize: 13 }}>{total} products found</span>
          </div>
          {/* Search */}
          <div style={{ marginTop: 20, position: 'relative', maxWidth: 400 }}>
            <input
              placeholder="Search jeans..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              style={{ paddingLeft: 40 }}
            />
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#555' }}>🔍</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ display: 'flex', gap: 32, padding: '32px 20px', alignItems: 'flex-start' }}>
        {/* Sidebar Filters */}
        <aside style={{ width: 220, flexShrink: 0, position: 'sticky', top: 90 }}>
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>FILTERS</span>
              <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#c8a96e', fontSize: 12, cursor: 'pointer' }}>Clear all</button>
            </div>

            {/* Size Filter */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: '#555', marginBottom: 12, textTransform: 'uppercase' }}>Size</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SIZES.map(s => (
                  <button key={s} onClick={() => setFilters(f => ({ ...f, size: f.size === s ? '' : s }))}
                    style={{
                      padding: '6px 12px', borderRadius: 6, border: `1px solid ${filters.size === s ? '#c8a96e' : '#2a2a2a'}`,
                      background: filters.size === s ? '#c8a96e' : 'transparent',
                      color: filters.size === s ? '#000' : '#888',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: '#555', marginBottom: 12, textTransform: 'uppercase' }}>Color</div>
              {COLORS.map(c => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}>
                  <input type="radio" checked={filters.color === c} onChange={() => setFilters(f => ({ ...f, color: f.color === c ? '' : c }))}
                    style={{ width: 'auto', accentColor: '#c8a96e' }} />
                  <span style={{ fontSize: 13, color: filters.color === c ? '#c8a96e' : '#888' }}>{c}</span>
                </label>
              ))}
            </div>

            {/* Price Filter */}
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, color: '#555', marginBottom: 12, textTransform: 'uppercase' }}>Price Range (₹)</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input placeholder="Min" value={filters.minPrice} type="number"
                  onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                  style={{ padding: '8px 10px', fontSize: 12 }} />
                <input placeholder="Max" value={filters.maxPrice} type="number"
                  onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                  style={{ padding: '8px 10px', fontSize: 12 }} />
              </div>
            </div>
          </div>
        </aside>

        {/* Products */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div className="spinner" />
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 80, color: '#444' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 18, marginBottom: 8 }}>No products found</div>
              <button onClick={clearFilters} className="btn btn-outline" style={{ marginTop: 16 }}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              {/* Pagination */}
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} style={{
                      width: 38, height: 38, borderRadius: 8,
                      border: `1px solid ${page === p ? '#c8a96e' : '#2a2a2a'}`,
                      background: page === p ? '#c8a96e' : 'transparent',
                      color: page === p ? '#000' : '#888',
                      fontWeight: 600, cursor: 'pointer',
                    }}>{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}