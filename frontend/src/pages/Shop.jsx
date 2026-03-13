import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProducts } from '../services/api';

const SIZES  = ['28', '30', '32', '34', '36', '38'];
const COLORS = ['Black', 'Blue', 'Grey', 'White', 'Brown'];
const SORTS  = [
  { label: 'Newest First',   value: 'newest'      },
  { label: 'Price: Low–High',value: 'price_asc'   },
  { label: 'Price: High–Low',value: 'price_desc'  },
  { label: 'Most Popular',   value: 'popular'     },
];

const COLOR_DOTS = {
  Black: '#1a1a1a', Blue: '#3b5bdb', Grey: '#868e96',
  White: '#dee2e6', Brown: '#8b5e3c',
};

export default function Shop() {
  const [products, setProducts]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [total,    setTotal]      = useState(0);
  const [page,     setPage]       = useState(1);
  const [pages,    setPages]      = useState(1);
  const [drawerOpen, setDrawer]   = useState(false);
  const [sort,     setSort]       = useState('newest');
  const [filters,  setFilters]    = useState({
    size: '', color: '', minPrice: '', maxPrice: '', search: '',
  });

  const location = useLocation();
  const navigate = useNavigate();

  /* pick up ?category= from URL (from Home page category grid) */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) setFilters(f => ({ ...f, search: cat }));
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, sort };
      if (filters.size)     params.size     = filters.size;
      if (filters.color)    params.color    = filters.color;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.search)   params.search   = filters.search;
      const res = await getProducts(params);
      setProducts(res.data.products || []);
      setTotal(res.data.total   || 0);
      setPages(res.data.pages   || 1);
    } catch { setProducts([]); }
    finally  { setLoading(false); }
  };

  useEffect(() => { setPage(1); }, [filters, sort]);
  useEffect(() => { fetchProducts(); }, [filters, sort, page]);

  const clearFilters = () => {
    setFilters({ size: '', color: '', minPrice: '', maxPrice: '', search: '' });
    setSort('newest');
  };

  const activeCount = [filters.size, filters.color, filters.minPrice, filters.maxPrice]
    .filter(Boolean).length;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        /* ── tokens ── */
        :root {
          --cream:  #faf7f2;
          --beige:  #f0ebe1;
          --sand:   #e2d9cc;
          --ink:    #1c1c1c;
          --ink2:   #4a4a4a;
          --muted:  #9a9080;
          --gold:   #b89b6a;
          --gold2:  #8a7048;
          --white:  #ffffff;
          --border: #e0d8ce;
          --danger: #c0392b;
        }

        .shop-wrap {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          padding-top: 64px; /* navbar offset */
        }

        /* ── HERO HEADER ── */
        .shop-hero {
          background: var(--beige);
          border-bottom: 1px solid var(--border);
          padding: 44px 0 32px;
        }
        .shop-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .shop-eyebrow {
          font-size: 10px;
          letter-spacing: 3.5px;
          color: var(--gold);
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .shop-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 700;
          color: var(--ink);
          margin: 0 0 4px;
          line-height: 1.1;
        }
        .shop-count {
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 24px;
        }

        /* Search bar */
        .search-bar {
          display: flex;
          align-items: center;
          background: var(--white);
          border: 1.5px solid var(--border);
          border-radius: 6px;
          max-width: 420px;
          overflow: hidden;
          transition: border-color .2s, box-shadow .2s;
        }
        .search-bar:focus-within {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(184,155,106,.12);
        }
        .search-icon {
          padding: 0 14px;
          color: var(--muted);
          font-size: 15px;
          flex-shrink: 0;
        }
        .search-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 11px 12px 11px 0;
          font-size: 13px;
          font-family: inherit;
          background: transparent;
          color: var(--ink);
        }
        .search-input::placeholder { color: var(--muted); }
        .search-clear {
          padding: 0 14px;
          background: none;
          border: none;
          color: var(--muted);
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
        }

        /* ── LAYOUT ── */
        .shop-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 40px 60px;
          display: flex;
          gap: 32px;
          align-items: flex-start;
        }

        /* ── SIDEBAR ── */
        .shop-sidebar {
          width: 230px;
          flex-shrink: 0;
          position: sticky;
          top: 84px;
        }
        .sidebar-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }
        .sidebar-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
        }
        .sidebar-head-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--ink);
        }
        .sidebar-clear {
          font-size: 11px;
          color: var(--gold);
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          letter-spacing: .5px;
        }
        .filter-section {
          padding: 18px 20px;
          border-bottom: 1px solid var(--border);
        }
        .filter-section:last-child { border-bottom: none; }
        .filter-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 12px;
        }

        /* Size pills */
        .size-grid { display: flex; flex-wrap: wrap; gap: 7px; }
        .size-btn {
          padding: 6px 11px;
          border-radius: 5px;
          border: 1.5px solid var(--border);
          background: transparent;
          color: var(--ink2);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all .18s;
          font-family: inherit;
        }
        .size-btn:hover   { border-color: var(--gold); color: var(--gold); }
        .size-btn.active  { background: var(--ink); border-color: var(--ink); color: #fff; }

        /* Color rows */
        .color-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 0;
          cursor: pointer;
          border-radius: 5px;
          transition: background .15s;
        }
        .color-row:hover { background: var(--beige); margin: 0 -6px; padding-left: 6px; padding-right: 6px; }
        .color-dot {
          width: 16px; height: 16px; border-radius: 50%;
          border: 1.5px solid rgba(0,0,0,.12);
          flex-shrink: 0;
        }
        .color-name { font-size: 13px; color: var(--ink2); flex: 1; }
        .color-check { font-size: 12px; color: var(--gold); }

        /* Price inputs */
        .price-row { display: flex; gap: 8px; align-items: center; }
        .price-input {
          flex: 1;
          border: 1.5px solid var(--border);
          border-radius: 5px;
          padding: 8px 10px;
          font-size: 12px;
          font-family: inherit;
          background: var(--white);
          color: var(--ink);
          outline: none;
          transition: border-color .2s;
        }
        .price-input:focus { border-color: var(--gold); }
        .price-sep { font-size: 12px; color: var(--muted); }

        /* ── MAIN CONTENT ── */
        .shop-main { flex: 1; min-width: 0; }

        /* Sort + count bar */
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .toolbar-left { font-size: 13px; color: var(--muted); }
        .sort-select {
          border: 1.5px solid var(--border);
          border-radius: 6px;
          padding: 8px 14px;
          font-size: 12px;
          font-family: inherit;
          color: var(--ink);
          background: var(--white);
          outline: none;
          cursor: pointer;
          transition: border-color .2s;
        }
        .sort-select:focus { border-color: var(--gold); }

        /* Filter chip (mobile) */
        .filter-chip-btn {
          display: none;
          align-items: center;
          gap: 7px;
          border: 1.5px solid var(--border);
          border-radius: 6px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          font-family: inherit;
          color: var(--ink);
          background: var(--white);
          cursor: pointer;
          position: relative;
        }
        .filter-badge {
          position: absolute;
          top: -6px; right: -6px;
          background: var(--gold);
          color: #fff;
          border-radius: 50%;
          width: 17px; height: 17px;
          font-size: 10px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }

        /* Active filter tags */
        .active-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 20px;
        }
        .active-tag {
          display: flex;
          align-items: center;
          gap: 5px;
          background: var(--beige);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 4px 10px 4px 12px;
          font-size: 11px;
          color: var(--ink2);
          font-weight: 500;
        }
        .active-tag button {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--muted);
          font-size: 14px;
          line-height: 1;
          padding: 0;
          display: flex; align-items: center;
        }

        /* ── PRODUCT GRID ── */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        /* ── PRODUCT CARD ── */
        .pcard {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          transition: box-shadow .25s, transform .25s;
        }
        .pcard:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,.09);
          transform: translateY(-4px);
        }
        .pcard-img {
          position: relative;
          background: var(--beige);
          aspect-ratio: 3/4;
          overflow: hidden;
        }
        .pcard-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform .45s ease;
        }
        .pcard:hover .pcard-img img { transform: scale(1.05); }
        .pcard-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center;
          justify-content: center; font-size: 52px;
        }
        .pcard-badges {
          position: absolute;
          top: 10px; left: 10px;
          display: flex; flex-direction: column; gap: 5px;
        }
        .badge-save {
          background: var(--danger);
          color: #fff;
          padding: 3px 8px;
          font-size: 10px; font-weight: 700;
          border-radius: 3px; letter-spacing: .5px;
        }
        .badge-sold {
          background: var(--ink);
          color: #fff;
          padding: 3px 8px;
          font-size: 10px; font-weight: 600;
          border-radius: 3px;
        }
        .pcard-body { padding: 13px 14px 16px; }
        .pcard-cat {
          font-size: 9px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: var(--muted); margin-bottom: 4px;
        }
        .pcard-name {
          font-size: 13px; font-weight: 600;
          color: var(--ink); margin-bottom: 8px;
          line-height: 1.35;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pcard-sizes {
          display: flex; flex-wrap: wrap; gap: 3px;
          margin-bottom: 10px;
        }
        .pcard-size {
          padding: 2px 6px;
          border: 1px solid var(--border);
          border-radius: 3px;
          font-size: 10px; color: var(--ink2);
        }
        .pcard-price {
          display: flex; align-items: center; gap: 8px;
        }
        .price-now  { font-size: 15px; font-weight: 700; color: var(--ink); }
        .price-was  { font-size: 12px; color: #bbb; text-decoration: line-through; }

        /* ── SKELETON ── */
        .skeleton { animation: shimmer 1.5s infinite; }
        @keyframes shimmer {
          0%,100% { opacity: 1 }
          50%      { opacity: .45 }
        }

        /* ── PAGINATION ── */
        .pagination {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 48px;
          flex-wrap: wrap;
        }
        .page-btn {
          width: 38px; height: 38px;
          border-radius: 7px;
          border: 1.5px solid var(--border);
          background: var(--white);
          color: var(--ink2);
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          transition: all .18s;
          font-family: inherit;
          display: flex; align-items: center; justify-content: center;
        }
        .page-btn:hover   { border-color: var(--gold); color: var(--gold); }
        .page-btn.active  { background: var(--ink); border-color: var(--ink); color: #fff; }

        /* ── EMPTY STATE ── */
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: var(--muted);
        }
        .empty-icon { font-size: 52px; margin-bottom: 16px; }
        .empty-title { font-size: 18px; font-weight: 600; color: var(--ink2); margin-bottom: 8px; }
        .empty-sub   { font-size: 13px; margin-bottom: 24px; }
        .empty-btn {
          display: inline-block;
          padding: 11px 28px;
          background: var(--ink);
          color: #fff;
          border: none;
          border-radius: 5px;
          font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          letter-spacing: 1px;
        }

        /* ── MOBILE FILTER DRAWER ── */
        .drawer-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,.38);
          z-index: 1200;
          animation: fadeOverlay .2s;
        }
        @keyframes fadeOverlay { from{opacity:0} to{opacity:1} }
        .drawer-overlay.open { display: block; }

        .filter-drawer {
          position: fixed;
          left: 0; top: 0; bottom: 0;
          width: min(320px, 88vw);
          background: var(--white);
          z-index: 1300;
          overflow-y: auto;
          transform: translateX(-100%);
          transition: transform .28s cubic-bezier(.4,0,.2,1);
          display: flex; flex-direction: column;
        }
        .filter-drawer.open { transform: translateX(0); }
        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 20px 16px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
          background: var(--beige);
        }
        .drawer-title { font-size: 14px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
        .drawer-close {
          background: none; border: none;
          font-size: 22px; cursor: pointer;
          color: var(--ink2); padding: 0 4px;
        }
        .drawer-body { flex: 1; overflow-y: auto; }
        .drawer-footer {
          padding: 16px 20px;
          border-top: 1px solid var(--border);
          display: flex; gap: 10px;
          flex-shrink: 0;
        }
        .drawer-apply {
          flex: 1; padding: 13px;
          background: var(--ink); color: #fff;
          border: none; border-radius: 5px;
          font-size: 13px; font-weight: 700;
          font-family: inherit; cursor: pointer;
          letter-spacing: 1.5px;
        }
        .drawer-reset {
          padding: 13px 18px;
          background: transparent;
          border: 1.5px solid var(--border);
          border-radius: 5px;
          font-size: 13px; font-weight: 600;
          font-family: inherit; cursor: pointer;
          color: var(--ink2);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .shop-body        { padding: 28px 24px 48px; }
          .shop-hero-inner  { padding: 0 24px; }
          .product-grid     { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
        @media (max-width: 768px) {
          .shop-sidebar     { display: none; }
          .filter-chip-btn  { display: flex !important; }
          .shop-body        { padding: 20px 16px 48px; gap: 0; }
          .shop-hero-inner  { padding: 0 16px; }
          .product-grid     { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .shop-hero        { padding: 28px 0 22px; }
        }
        @media (max-width: 400px) {
          .product-grid { grid-template-columns: repeat(1, 1fr); }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700;900&family=Bebas+Neue&display=swap" rel="stylesheet" />

      <div className="shop-wrap">

        {/* ── HERO HEADER ── */}
        <div className="shop-hero">
          <div className="shop-hero-inner">
            <div className="shop-eyebrow">Our Collection</div>
            <h1 className="shop-title">Shop All Styles</h1>
            <div className="shop-count">
              {loading ? 'Loading…' : `${total} product${total !== 1 ? 's' : ''} found`}
            </div>
            {/* Search */}
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Search by name, style, or color…"
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              />
              {filters.search && (
                <button className="search-clear" onClick={() => setFilters(f => ({ ...f, search: '' }))}>×</button>
              )}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="shop-body">

          {/* ── DESKTOP SIDEBAR ── */}
          <aside className="shop-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-head">
                <span className="sidebar-head-title">Filters</span>
                {activeCount > 0 && (
                  <button className="sidebar-clear" onClick={clearFilters}>Clear all ({activeCount})</button>
                )}
              </div>

              {/* Size */}
              <div className="filter-section">
                <div className="filter-label">Size</div>
                <div className="size-grid">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      className={`size-btn${filters.size === s ? ' active' : ''}`}
                      onClick={() => setFilters(f => ({ ...f, size: f.size === s ? '' : s }))}
                    >{s}</button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="filter-section">
                <div className="filter-label">Color</div>
                {COLORS.map(c => (
                  <div
                    key={c}
                    className="color-row"
                    onClick={() => setFilters(f => ({ ...f, color: f.color === c ? '' : c }))}
                  >
                    <div className="color-dot" style={{ background: COLOR_DOTS[c] }} />
                    <span className="color-name" style={{ color: filters.color === c ? '#1c1c1c' : undefined, fontWeight: filters.color === c ? 600 : 400 }}>{c}</span>
                    {filters.color === c && <span className="color-check">✓</span>}
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="filter-section">
                <div className="filter-label">Price Range (₹)</div>
                <div className="price-row">
                  <input className="price-input" placeholder="Min" type="number"
                    value={filters.minPrice}
                    onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
                  <span className="price-sep">–</span>
                  <input className="price-input" placeholder="Max" type="number"
                    value={filters.maxPrice}
                    onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
                </div>
              </div>
            </div>
          </aside>

          {/* ── MAIN ── */}
          <main className="shop-main">

            {/* Toolbar */}
            <div className="toolbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {/* Mobile filter button */}
                <button className="filter-chip-btn" onClick={() => setDrawer(true)}>
                  ⚙ Filters
                  {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
                </button>
                <span className="toolbar-left">
                  {!loading && `${total} result${total !== 1 ? 's' : ''}`}
                </span>
              </div>
              <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {/* Active filter tags */}
            {activeCount > 0 && (
              <div className="active-tags">
                {filters.size  && <FilterTag label={`Size: ${filters.size}`}  onRemove={() => setFilters(f=>({...f,size:''}))} />}
                {filters.color && <FilterTag label={`Color: ${filters.color}`} onRemove={() => setFilters(f=>({...f,color:''}))} />}
                {filters.minPrice && <FilterTag label={`Min: ₹${filters.minPrice}`} onRemove={() => setFilters(f=>({...f,minPrice:''}))} />}
                {filters.maxPrice && <FilterTag label={`Max: ₹${filters.maxPrice}`} onRemove={() => setFilters(f=>({...f,maxPrice:''}))} />}
              </div>
            )}

            {/* Products */}
            {loading ? (
              <div className="product-grid">
                {[...Array(9)].map((_,i) => (
                  <div key={i} className="pcard skeleton" style={{ aspectRatio:'3/5', background:'#ede8e0', borderRadius:10 }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <div className="empty-title">No products found</div>
                <div className="empty-sub">Try adjusting your filters or search term</div>
                <button className="empty-btn" onClick={clearFilters}>Clear All Filters</button>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map(p => <PCard key={p._id} product={p} navigate={navigate} />)}
                </div>
                {pages > 1 && (
                  <div className="pagination">
                    {page > 1 && (
                      <button className="page-btn" onClick={() => setPage(p => p - 1)}>‹</button>
                    )}
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} className={`page-btn${page === p ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                    ))}
                    {page < pages && (
                      <button className="page-btn" onClick={() => setPage(p => p + 1)}>›</button>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ── */}
      <div className={`drawer-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawer(false)} />
      <div className={`filter-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-title">Filters {activeCount > 0 && `(${activeCount})`}</span>
          <button className="drawer-close" onClick={() => setDrawer(false)}>×</button>
        </div>
        <div className="drawer-body">
          {/* Size */}
          <div className="filter-section" style={{ padding:'18px 20px', borderBottom:'1px solid var(--border)' }}>
            <div className="filter-label">Size</div>
            <div className="size-grid">
              {SIZES.map(s => (
                <button
                  key={s}
                  className={`size-btn${filters.size === s ? ' active' : ''}`}
                  onClick={() => setFilters(f => ({ ...f, size: f.size === s ? '' : s }))}
                >{s}</button>
              ))}
            </div>
          </div>
          {/* Color */}
          <div className="filter-section" style={{ padding:'18px 20px', borderBottom:'1px solid var(--border)' }}>
            <div className="filter-label">Color</div>
            {COLORS.map(c => (
              <div key={c} className="color-row"
                onClick={() => setFilters(f => ({ ...f, color: f.color === c ? '' : c }))}>
                <div className="color-dot" style={{ background: COLOR_DOTS[c] }} />
                <span className="color-name" style={{ fontWeight: filters.color === c ? 600 : 400 }}>{c}</span>
                {filters.color === c && <span className="color-check">✓</span>}
              </div>
            ))}
          </div>
          {/* Price */}
          <div className="filter-section" style={{ padding:'18px 20px' }}>
            <div className="filter-label">Price Range (₹)</div>
            <div className="price-row">
              <input className="price-input" placeholder="Min" type="number"
                value={filters.minPrice}
                onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
              <span className="price-sep">–</span>
              <input className="price-input" placeholder="Max" type="number"
                value={filters.maxPrice}
                onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="drawer-footer">
          <button className="drawer-reset" onClick={clearFilters}>Reset</button>
          <button className="drawer-apply" onClick={() => setDrawer(false)}>Apply Filters</button>
        </div>
      </div>
    </>
  );
}

/* ── Sub-components ── */

function PCard({ product, navigate }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const pct = hasDiscount ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <div className="pcard" onClick={() => navigate(`/product/${product._id}`)}>
      <div className="pcard-img">
        {product.images?.[0]
          ? <img src={product.images[0]} alt={product.name} />
          : <div className="pcard-placeholder">👖</div>
        }
        <div className="pcard-badges">
          {pct && <span className="badge-save">–{pct}%</span>}
          {product.stock === 0 && <span className="badge-sold">SOLD OUT</span>}
        </div>
      </div>
      <div className="pcard-body">
        <div className="pcard-cat">{product.category || 'DENIM'}</div>
        <div className="pcard-name">{product.name}</div>
        {product.sizes?.length > 0 && (
          <div className="pcard-sizes">
            {product.sizes.slice(0, 5).map(s => (
              <span className="pcard-size" key={s}>{s}</span>
            ))}
          </div>
        )}
        <div className="pcard-price">
          <span className="price-now">₹{product.price?.toLocaleString()}</span>
          {hasDiscount && <span className="price-was">₹{product.originalPrice?.toLocaleString()}</span>}
        </div>
      </div>
    </div>
  );
}

function FilterTag({ label, onRemove }) {
  return (
    <div className="active-tag">
      {label}
      <button onClick={onRemove}>×</button>
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import ProductCard from '../components/ProductCard';
// import { getProducts } from '../services/api';

// const SIZES = ['28', '30', '32', '34', '36', '38'];
// const COLORS = ['Black', 'Blue', 'Grey', 'White', 'Brown'];

// export default function Shop() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [filters, setFilters] = useState({ size: '', color: '', minPrice: '', maxPrice: '', search: '' });

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const params = { page, limit: 9 };
//       if (filters.size) params.size = filters.size;
//       if (filters.color) params.color = filters.color;
//       if (filters.minPrice) params.minPrice = filters.minPrice;
//       if (filters.maxPrice) params.maxPrice = filters.maxPrice;
//       if (filters.search) params.search = filters.search;
//       const res = await getProducts(params);
//       setProducts(res.data.products);
//       setTotal(res.data.total);
//       setPages(res.data.pages);
//     } catch { setProducts([]); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { setPage(1); }, [filters]);
//   useEffect(() => { fetchProducts(); }, [filters, page]);

//   const clearFilters = () => setFilters({ size: '', color: '', minPrice: '', maxPrice: '', search: '' });

//   return (
//     <div className="page" style={{ background: '#0a0a0a' }}>
//       {/* Header */}
//       <div style={{ background: '#0d0d0d', borderBottom: '1px solid #1e1e1e', padding: '40px 0 30px' }}>
//         <div className="container">
//           <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a96e', marginBottom: 8, textTransform: 'uppercase' }}>Our Collection</div>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
//             <h1 className="section-title" style={{ margin: 0 }}>Shop Jeans</h1>
//             <span style={{ color: '#555', fontSize: 13 }}>{total} products found</span>
//           </div>
//           {/* Search */}
//           <div style={{ marginTop: 20, position: 'relative', maxWidth: 400 }}>
//             <input
//               placeholder="Search jeans..."
//               value={filters.search}
//               onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
//               style={{ paddingLeft: 40 }}
//             />
//             <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#555' }}>🔍</span>
//           </div>
//         </div>
//       </div>

//       <div className="container" style={{ display: 'flex', gap: 32, padding: '32px 20px', alignItems: 'flex-start' }}>
//         {/* Sidebar Filters */}
//         <aside style={{ width: 220, flexShrink: 0, position: 'sticky', top: 90 }}>
//           <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 20 }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//               <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>FILTERS</span>
//               <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#c8a96e', fontSize: 12, cursor: 'pointer' }}>Clear all</button>
//             </div>

//             {/* Size Filter */}
//             <div style={{ marginBottom: 24 }}>
//               <div style={{ fontSize: 11, letterSpacing: 2, color: '#555', marginBottom: 12, textTransform: 'uppercase' }}>Size</div>
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                 {SIZES.map(s => (
//                   <button key={s} onClick={() => setFilters(f => ({ ...f, size: f.size === s ? '' : s }))}
//                     style={{
//                       padding: '6px 12px', borderRadius: 6, border: `1px solid ${filters.size === s ? '#c8a96e' : '#2a2a2a'}`,
//                       background: filters.size === s ? '#c8a96e' : 'transparent',
//                       color: filters.size === s ? '#000' : '#888',
//                       fontSize: 12, fontWeight: 600, cursor: 'pointer',
//                     }}>{s}</button>
//                 ))}
//               </div>
//             </div>

//             {/* Color Filter */}
//             <div style={{ marginBottom: 24 }}>
//               <div style={{ fontSize: 11, letterSpacing: 2, color: '#555', marginBottom: 12, textTransform: 'uppercase' }}>Color</div>
//               {COLORS.map(c => (
//                 <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}>
//                   <input type="radio" checked={filters.color === c} onChange={() => setFilters(f => ({ ...f, color: f.color === c ? '' : c }))}
//                     style={{ width: 'auto', accentColor: '#c8a96e' }} />
//                   <span style={{ fontSize: 13, color: filters.color === c ? '#c8a96e' : '#888' }}>{c}</span>
//                 </label>
//               ))}
//             </div>

//             {/* Price Filter */}
//             <div>
//               <div style={{ fontSize: 11, letterSpacing: 2, color: '#555', marginBottom: 12, textTransform: 'uppercase' }}>Price Range (₹)</div>
//               <div style={{ display: 'flex', gap: 8 }}>
//                 <input placeholder="Min" value={filters.minPrice} type="number"
//                   onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
//                   style={{ padding: '8px 10px', fontSize: 12 }} />
//                 <input placeholder="Max" value={filters.maxPrice} type="number"
//                   onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
//                   style={{ padding: '8px 10px', fontSize: 12 }} />
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Products */}
//         <div style={{ flex: 1 }}>
//           {loading ? (
//             <div className="spinner" />
//           ) : products.length === 0 ? (
//             <div style={{ textAlign: 'center', padding: 80, color: '#444' }}>
//               <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
//               <div style={{ fontSize: 18, marginBottom: 8 }}>No products found</div>
//               <button onClick={clearFilters} className="btn btn-outline" style={{ marginTop: 16 }}>Clear Filters</button>
//             </div>
//           ) : (
//             <>
//               <div className="products-grid">
//                 {products.map(p => <ProductCard key={p._id} product={p} />)}
//               </div>
//               {/* Pagination */}
//               {pages > 1 && (
//                 <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
//                   {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
//                     <button key={p} onClick={() => setPage(p)} style={{
//                       width: 38, height: 38, borderRadius: 8,
//                       border: `1px solid ${page === p ? '#c8a96e' : '#2a2a2a'}`,
//                       background: page === p ? '#c8a96e' : 'transparent',
//                       color: page === p ? '#000' : '#888',
//                       fontWeight: 600, cursor: 'pointer',
//                     }}>{p}</button>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }