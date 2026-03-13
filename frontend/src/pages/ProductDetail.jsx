import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';

const COLOR_MAP = {
  Black: '#1a1a1a', Blue: '#3b5bdb', Grey: '#868e96',
  White: '#dee2e6', Brown: '#8b5e3c', Navy: '#1e3a5f',
  Beige: '#c8a96e', Olive: '#6b7c45',
};

export default function ProductDetail() {
  const { id }         = useParams();
  const navigate       = useNavigate();
  const { addToCart }  = useCart();

  const [product,       setProduct]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [selectedSize,  setSelectedSize]  = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added,         setAdded]         = useState(false);
  const [imgIdx,        setImgIdx]        = useState(0);
  const [sizeErr,       setSizeErr]       = useState(false);
  const [qty,           setQty]           = useState(1);

  useEffect(() => {
    getProductById(id)
      .then(res => {
        setProduct(res.data);
        setSelectedSize(res.data.sizes?.[0]  || '');
        setSelectedColor(res.data.colors?.[0] || '');
      })
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeErr(true); return; }
    setSizeErr(false);
    for (let i = 0; i < qty; i++) {
      addToCart({ ...product, size: selectedSize, color: selectedColor });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const hasDiscount = product?.originalPrice && product.originalPrice > product.price;
  const pct = hasDiscount ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#faf7f2', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 64 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, color: '#9a9080' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e2d9cc', borderTopColor: '#b89b6a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ fontSize: 13, letterSpacing: 2 }}>LOADING…</span>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!product) return null;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
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
          --green:  #2d7a4f;
          --red:    #c0392b;
        }

        .pd-wrap {
          min-height: 100vh;
          background: var(--cream);
          padding-top: 64px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── BREADCRUMB ── */
        .breadcrumb {
          background: var(--beige);
          border-bottom: 1px solid var(--border);
          padding: 12px 0;
        }
        .breadcrumb-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--muted);
        }
        .bc-link {
          cursor: pointer;
          transition: color .15s;
          background: none; border: none;
          font-family: inherit; font-size: 12px;
          color: var(--muted); padding: 0;
        }
        .bc-link:hover { color: var(--gold); }
        .bc-sep { color: var(--sand); }
        .bc-current { color: var(--ink2); font-weight: 500; }

        /* ── MAIN GRID ── */
        .pd-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 40px 64px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }

        /* ── IMAGE SECTION ── */
        .img-main {
          position: relative;
          background: var(--beige);
          border-radius: 14px;
          overflow: hidden;
          aspect-ratio: 3/4;
          border: 1px solid var(--border);
        }
        .img-main img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform .5s ease;
        }
        .img-main:hover img { transform: scale(1.04); }
        .img-placeholder {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 12px;
        }
        .img-badges {
          position: absolute;
          top: 14px; left: 14px;
          display: flex; flex-direction: column; gap: 6px;
        }
        .badge-sale {
          background: var(--red); color: #fff;
          padding: 4px 10px; font-size: 11px;
          font-weight: 700; border-radius: 4px;
          letter-spacing: .5px;
        }
        .badge-oos {
          background: var(--ink); color: #fff;
          padding: 4px 10px; font-size: 11px;
          font-weight: 600; border-radius: 4px;
        }

        /* Thumbnails */
        .thumbs {
          display: flex;
          gap: 10px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .thumb {
          width: 68px; height: 68px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid var(--border);
          transition: border-color .2s;
          flex-shrink: 0;
        }
        .thumb.active  { border-color: var(--gold); }
        .thumb:hover   { border-color: var(--gold2); }
        .thumb img     { width: 100%; height: 100%; object-fit: cover; }

        /* ── DETAIL SECTION ── */
        .pd-info { display: flex; flex-direction: column; }

        .pd-eyebrow {
          font-size: 10px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase;
          color: var(--gold); margin-bottom: 10px;
        }
        .pd-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 3vw, 38px);
          font-weight: 700; color: var(--ink);
          line-height: 1.2; margin: 0 0 16px;
        }

        /* Price block */
        .price-block {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 8px;
        }
        .price-now {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 4vw, 48px);
          color: var(--ink);
          letter-spacing: 1px;
          line-height: 1;
        }
        .price-was {
          font-size: 18px;
          color: #bbb;
          text-decoration: line-through;
        }
        .price-save {
          background: #fef3ed;
          color: var(--red);
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: .5px;
        }

        .pd-divider {
          height: 1px;
          background: var(--border);
          margin: 20px 0;
        }

        .pd-desc {
          font-size: 14px;
          color: var(--ink2);
          line-height: 1.8;
          margin-bottom: 24px;
        }

        /* Stock indicator */
        .stock-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }
        .stock-dot {
          width: 8px; height: 8px;
          border-radius: 50%; flex-shrink: 0;
        }
        .stock-text { font-size: 13px; font-weight: 500; }

        /* ── SIZE SELECTOR ── */
        .selector-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--muted); margin-bottom: 10px;
        }
        .selector-label span { color: var(--ink); font-weight: 600; font-size: 12px; letter-spacing: 0; }

        .size-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 6px; }
        .size-btn {
          min-width: 50px;
          padding: 10px 14px;
          border-radius: 7px;
          border: 1.5px solid var(--border);
          background: var(--white);
          color: var(--ink2);
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          transition: all .18s;
          font-family: inherit;
          text-align: center;
        }
        .size-btn:hover { border-color: var(--gold); color: var(--gold); }
        .size-btn.active {
          background: var(--ink);
          border-color: var(--ink);
          color: #fff;
        }
        .size-err { font-size: 11px; color: var(--red); margin-bottom: 16px; font-weight: 500; }

        /* ── COLOR SELECTOR ── */
        .color-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .color-pill {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 14px;
          border-radius: 7px;
          border: 1.5px solid var(--border);
          background: var(--white);
          cursor: pointer;
          transition: all .18s;
          font-size: 13px; font-weight: 500;
          color: var(--ink2);
          font-family: inherit;
        }
        .color-pill:hover   { border-color: var(--gold); }
        .color-pill.active  { border-color: var(--ink); background: var(--beige); color: var(--ink); font-weight: 600; }
        .color-swatch {
          width: 13px; height: 13px; border-radius: 50%;
          border: 1px solid rgba(0,0,0,.15); flex-shrink: 0;
        }

        /* ── QTY + ADD ── */
        .buy-row {
          display: flex;
          gap: 12px;
          align-items: stretch;
          margin-top: 8px;
        }
        .qty-ctrl {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--border);
          border-radius: 7px;
          overflow: hidden;
          background: var(--white);
          flex-shrink: 0;
        }
        .qty-btn {
          width: 38px; height: 100%;
          background: none; border: none;
          font-size: 18px; cursor: pointer;
          color: var(--ink2); font-weight: 300;
          transition: background .15s;
          display: flex; align-items: center; justify-content: center;
        }
        .qty-btn:hover { background: var(--beige); }
        .qty-val {
          width: 38px; text-align: center;
          font-size: 14px; font-weight: 600;
          color: var(--ink); border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
        }
        .add-btn {
          flex: 1;
          padding: 15px 24px;
          border-radius: 7px;
          border: none;
          background: var(--ink);
          color: #fff;
          font-size: 14px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          cursor: pointer;
          transition: all .2s;
          font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .add-btn:hover:not(:disabled) { background: var(--gold2); }
        .add-btn:disabled { opacity: .4; cursor: not-allowed; }
        .add-btn.success  { background: var(--green); }

        /* Tags */
        .tag-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 20px; }
        .tag-pill {
          font-size: 11px; padding: 4px 11px;
          border: 1px solid var(--border);
          border-radius: 20px; color: var(--muted);
          background: var(--beige);
        }

        /* ── INFO STRIPS ── */
        .info-strips {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-top: 28px;
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
        }
        .info-strip {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          font-size: 13px;
          color: var(--ink2);
          background: var(--white);
          border-bottom: 1px solid var(--border);
        }
        .info-strip:last-child { border-bottom: none; }
        .info-strip-icon { font-size: 16px; flex-shrink: 0; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .pd-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 24px 24px 48px;
          }
          .breadcrumb-inner { padding: 0 24px; }
        }
        @media (max-width: 600px) {
          .pd-grid { padding: 20px 16px 48px; }
          .breadcrumb-inner { padding: 0 16px; }
          .buy-row { flex-direction: column; }
          .qty-ctrl { width: 100%; justify-content: center; height: 48px; }
          .add-btn  { width: 100%; }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700;900&family=Bebas+Neue&display=swap" rel="stylesheet" />

      <div className="pd-wrap">

        {/* ── BREADCRUMB ── */}
        <div className="breadcrumb">
          <div className="breadcrumb-inner">
            <button className="bc-link" onClick={() => navigate('/')}>Home</button>
            <span className="bc-sep">›</span>
            <button className="bc-link" onClick={() => navigate('/shop')}>Shop</button>
            <span className="bc-sep">›</span>
            <span className="bc-current">{product.name}</span>
          </div>
        </div>

        {/* ── MAIN ── */}
        <div className="pd-grid">

          {/* LEFT — Images */}
          <div>
            <div className="img-main">
              {product.images?.[imgIdx] ? (
                <img src={product.images[imgIdx]} alt={product.name} />
              ) : (
                <div className="img-placeholder">
                  <span style={{ fontSize: 80 }}>👖</span>
                  <span style={{ fontSize: 11, letterSpacing: 3, color: '#bbb' }}>NO IMAGE</span>
                </div>
              )}
              <div className="img-badges">
                {pct          && <span className="badge-sale">–{pct}% OFF</span>}
                {product.stock === 0 && <span className="badge-oos">SOLD OUT</span>}
              </div>
            </div>

            {product.images?.length > 1 && (
              <div className="thumbs">
                {product.images.map((img, i) => (
                  <div key={i} className={`thumb${imgIdx === i ? ' active' : ''}`} onClick={() => setImgIdx(i)}>
                    <img src={img} alt={`View ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Details */}
          <div className="pd-info">

            <div className="pd-eyebrow">{product.category || 'DENIM'}</div>
            <h1 className="pd-title">{product.name}</h1>

            {/* Price */}
            <div className="price-block">
              <span className="price-now">₹{product.price?.toLocaleString()}</span>
              {hasDiscount && <span className="price-was">₹{product.originalPrice?.toLocaleString()}</span>}
              {pct         && <span className="price-save">Save {pct}%</span>}
            </div>

            <div className="pd-divider" />

            {/* Description */}
            {product.description && (
              <p className="pd-desc">{product.description}</p>
            )}

            {/* Stock */}
            <div className="stock-row">
              <div className="stock-dot" style={{ background: product.stock > 0 ? '#2d7a4f' : '#c0392b' }} />
              <span className="stock-text" style={{ color: product.stock > 0 ? '#2d7a4f' : '#c0392b' }}>
                {product.stock > 10
                  ? 'In Stock'
                  : product.stock > 0
                  ? `Only ${product.stock} left — hurry!`
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div className="selector-label">
                  Size {selectedSize && <span>— {selectedSize}</span>}
                </div>
                <div className="size-grid">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      className={`size-btn${selectedSize === s ? ' active' : ''}`}
                      onClick={() => { setSelectedSize(s); setSizeErr(false); }}
                    >{s}</button>
                  ))}
                </div>
                {sizeErr && <div className="size-err">⚠ Please select a size to continue</div>}
              </div>
            )}

            {/* Color */}
            {product.colors?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div className="selector-label">
                  Color {selectedColor && <span>— {selectedColor}</span>}
                </div>
                <div className="color-pills">
                  {product.colors.map(c => (
                    <button
                      key={c}
                      className={`color-pill${selectedColor === c ? ' active' : ''}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      <div className="color-swatch" style={{ background: COLOR_MAP[c] || '#ccc' }} />
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add to cart */}
            <div className="buy-row">
              <div className="qty-ctrl">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <div className="qty-val">{qty}</div>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock || 10, q + 1))}>+</button>
              </div>
              <button
                className={`add-btn${added ? ' success' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {added
                  ? <><span>✓</span> Added to Cart</>
                  : <><span>🛒</span> Add to Cart</>
                }
              </button>
            </div>

            {/* Info strips */}
            <div className="info-strips">
              <div className="info-strip">
                <span className="info-strip-icon">🚚</span>
                <div>
                  <strong>Free Shipping</strong> on orders above ₹999
                </div>
              </div>
              <div className="info-strip">
                <span className="info-strip-icon">↩️</span>
                <div>
                  <strong>7-Day Easy Returns</strong> — no questions asked
                </div>
              </div>
              <div className="info-strip">
                <span className="info-strip-icon">🔒</span>
                <div>
                  <strong>Secure Payment</strong> — Stripe, UPI & COD
                </div>
              </div>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="tag-list">
                {product.tags.map(t => (
                  <span className="tag-pill" key={t}>#{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getProductById } from '../services/api';
// import { useCart } from '../context/CartContext';

// export default function ProductDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useCart();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedSize, setSelectedSize] = useState('');
//   const [selectedColor, setSelectedColor] = useState('');
//   const [added, setAdded] = useState(false);
//   const [imgIdx, setImgIdx] = useState(0);

//   useEffect(() => {
//     getProductById(id)
//       .then(res => {
//         setProduct(res.data);
//         setSelectedSize(res.data.sizes?.[0] || '');
//         setSelectedColor(res.data.colors?.[0] || '');
//       })
//       .catch(() => navigate('/shop'))
//       .finally(() => setLoading(false));
//   }, [id]);

//   const handleAddToCart = () => {
//     if (!selectedSize) return alert('Please select a size');
//     addToCart({ ...product, size: selectedSize, color: selectedColor });
//     setAdded(true);
//     setTimeout(() => setAdded(false), 2000);
//   };

//   if (loading) return <div className="page"><div className="spinner" /></div>;
//   if (!product) return null;

//   return (
//     <div className="page" style={{ background: '#0a0a0a' }}>
//       <div className="container" style={{ padding: '40px 20px' }}>
//         <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#888', marginBottom: 32, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
//           ← Back to Shop
//         </button>

//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
//           {/* Images */}
//           <div>
//             <div style={{ background: '#141414', borderRadius: 16, overflow: 'hidden', height: 480, border: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               {product.images?.[imgIdx] ? (
//                 <img src={product.images[imgIdx]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//               ) : (
//                 <div style={{ textAlign: 'center' }}>
//                   <div style={{ fontSize: 80, marginBottom: 12 }}>👖</div>
//                   <div style={{ color: '#333', fontSize: 12, letterSpacing: 2 }}>NO IMAGE</div>
//                 </div>
//               )}
//             </div>
//             {product.images?.length > 1 && (
//               <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
//                 {product.images.map((img, i) => (
//                   <div key={i} onClick={() => setImgIdx(i)} style={{ width: 70, height: 70, border: `2px solid ${imgIdx === i ? '#c8a96e' : '#1e1e1e'}`, borderRadius: 8, overflow: 'hidden', cursor: 'pointer' }}>
//                     <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Details */}
//           <div>
//             <div style={{ fontSize: 11, letterSpacing: 3, color: '#c8a96e', marginBottom: 10, textTransform: 'uppercase' }}>{product.category}</div>
//             <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>{product.name}</h1>
//             <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 42, color: '#c8a96e', letterSpacing: 2, marginBottom: 20 }}>
//               ₹{product.price?.toLocaleString()}
//             </div>
//             <p style={{ color: '#777', lineHeight: 1.8, marginBottom: 28, fontSize: 14 }}>{product.description}</p>

//             {/* Size */}
//             <div style={{ marginBottom: 24 }}>
//               <div style={{ fontSize: 12, letterSpacing: 2, color: '#555', marginBottom: 12, textTransform: 'uppercase', fontWeight: 600 }}>Size</div>
//               <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
//                 {product.sizes?.map(s => (
//                   <button key={s} onClick={() => setSelectedSize(s)} style={{
//                     padding: '10px 18px', borderRadius: 8,
//                     border: `1.5px solid ${selectedSize === s ? '#c8a96e' : '#2a2a2a'}`,
//                     background: selectedSize === s ? '#c8a96e' : 'transparent',
//                     color: selectedSize === s ? '#000' : '#888',
//                     fontWeight: 700, cursor: 'pointer', fontSize: 13,
//                   }}>{s}</button>
//                 ))}
//               </div>
//             </div>

//             {/* Color */}
//             <div style={{ marginBottom: 32 }}>
//               <div style={{ fontSize: 12, letterSpacing: 2, color: '#555', marginBottom: 12, textTransform: 'uppercase', fontWeight: 600 }}>Color: <span style={{ color: '#c8a96e' }}>{selectedColor}</span></div>
//               <div style={{ display: 'flex', gap: 10 }}>
//                 {product.colors?.map(c => (
//                   <button key={c} onClick={() => setSelectedColor(c)} style={{
//                     padding: '8px 16px', borderRadius: 8,
//                     border: `1.5px solid ${selectedColor === c ? '#c8a96e' : '#2a2a2a'}`,
//                     background: 'transparent',
//                     color: selectedColor === c ? '#c8a96e' : '#666',
//                     cursor: 'pointer', fontSize: 13, fontWeight: 500,
//                   }}>{c}</button>
//                 ))}
//               </div>
//             </div>

//             {/* Stock */}
//             <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
//               <div style={{ width: 8, height: 8, borderRadius: '50%', background: product.stock > 0 ? '#27ae60' : '#e74c3c' }} />
//               <span style={{ fontSize: 13, color: product.stock > 0 ? '#27ae60' : '#e74c3c' }}>
//                 {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
//               </span>
//             </div>

//             <button
//               onClick={handleAddToCart}
//               disabled={product.stock === 0}
//               className="btn btn-primary"
//               style={{ width: '100%', padding: '16px', fontSize: 16, letterSpacing: 1, opacity: product.stock === 0 ? 0.4 : 1 }}
//             >
//               {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
//             </button>

//             {/* Tags */}
//             {product.tags?.length > 0 && (
//               <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//                 {product.tags.map(t => (
//                   <span key={t} style={{ fontSize: 11, padding: '3px 10px', border: '1px solid #2a2a2a', borderRadius: 20, color: '#555' }}>#{t}</span>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }