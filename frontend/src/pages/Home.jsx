import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';

const categories = [
  { name: 'Jeans',        emoji: '👖', slug: 'jeans' },
  { name: 'Cargo',        emoji: '🩳', slug: 'cargo' },
  { name: 'Shirts',       emoji: '👕', slug: 'shirt' },
  { name: 'New Arrivals', emoji: '✨', slug: 'new'   },
  { name: 'Sale',         emoji: '🔥', slug: 'sale'  },
  { name: 'All Products', emoji: '🛍️', slug: ''      },
];

const bannerSlides = [
  {
    tag: 'NEW COLLECTION',
    heading: ['PREMIUM DENIM', 'CRAFTED FOR YOU'],
    sub: 'Handcrafted jeans for the bold. Every pair tells a story.',
    cta: 'Shop Now',
    bg: 'linear-gradient(135deg, #f5f0e8 0%, #e8ddd0 100%)',
    accent: '#1a1a1a',
    stats: [['500+', 'Products'], ['50K+', 'Customers'], ['100%', 'Authentic']],
  },
  {
    tag: 'END OF SEASON SALE',
    heading: ['UP TO 50% OFF', 'SELECT STYLES'],
    sub: 'Limited time. Limited stock. Unlimited style.',
    cta: 'View Sale',
    bg: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    accent: '#ffffff',
    stats: [['40%', 'Avg Discount'], ['200+', 'Sale Items'], ['7 Days', 'Easy Return']],
  },
  {
    tag: 'EXCLUSIVE DROP',
    heading: ['STREET READY', 'BOLD & RAW'],
    sub: 'New streetwear-inspired denim. Only at DENIMCO.',
    cta: 'Explore Drop',
    bg: 'linear-gradient(135deg, #eef2f7 0%, #dde6f0 100%)',
    accent: '#1a1a1a',
    stats: [['NEW', 'Arrivals'], ['Limited', 'Stock'], ['Free', 'Shipping']],
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [slide, setSlide]       = useState(0);
  const [animKey, setAnimKey]   = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts({ limit: 8 })
      .then(r => setProducts(r.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setSlide(s => (s + 1) % bannerSlides.length);
      setAnimKey(k => k + 1);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const changeSlide = (i) => { setSlide(i); setAnimKey(k => k + 1); };
  const cur = bannerSlides[slide];
  const isDark = cur.accent === '#ffffff';

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#fff', color: '#1a1a1a', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;900&family=Bebas+Neue&display=swap" rel="stylesheet" />

      {/* ─── KEYFRAMES + RESPONSIVE CSS ─── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(55px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInUp  { from{opacity:0;transform:translateY(22px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInLeft{ from{opacity:0;transform:translateX(-22px)} to{opacity:1;transform:translateX(0)} }
        @keyframes statPop   { from{opacity:0;transform:scale(.55) translateY(18px)} to{opacity:1;transform:scale(1) translateY(0)} }

        /* Hero layout */
        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 40px 72px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }
        .hero-left  { flex: 1; min-width: 0; }
        .hero-right {
          display: flex;
          flex-direction: column;
          gap: 28px;
          flex-shrink: 0;
          width: 130px;
          text-align: center;
        }

        /* Trust strip */
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .trust-item { display:flex; align-items:center; gap:10px; justify-content:center; }

        /* Categories */
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
        }
        .cat-card {
          background: #f8f8f8;
          border-radius: 10px;
          padding: 22px 8px;
          text-align: center;
          cursor: pointer;
          border: 1.5px solid transparent;
          transition: all .25s;
        }
        .cat-card:hover { background:#1a1a1a!important; border-color:#1a1a1a!important; }
        .cat-card:hover .cat-label { color:#fff!important; }

        /* Products grid */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        /* ── TABLET ── */
        @media (max-width: 900px) {
          .hero-inner  { padding: 40px 24px 64px; gap: 24px; }
          .hero-right  { width: 110px; gap: 20px; }
          .trust-grid  { grid-template-columns: repeat(2, 1fr); }
          .cat-grid    { grid-template-columns: repeat(3, 1fr); }
          .product-grid{ grid-template-columns: repeat(2, 1fr); }
        }

        /* ── MOBILE ── */
        @media (max-width: 600px) {
          .hero-inner {
            flex-direction: column;
            align-items: flex-start;
            padding: 28px 18px 56px;
            gap: 20px;
          }
          .hero-left { width: 100%; }
          .hero-right {
            flex-direction: row!important;
            width: 100%!important;
            justify-content: space-between;
            border-top: 1px solid rgba(0,0,0,.12);
            padding-top: 16px;
            gap: 0!important;
          }
          .trust-grid  { grid-template-columns: repeat(2, 1fr); padding: 0 16px; }
          .cat-grid    { grid-template-columns: repeat(3, 1fr); }
          .product-grid{ grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .section-pad { padding-left: 16px!important; padding-right: 16px!important; }
        }
      `}</style>

      {/* ─── ANNOUNCEMENT BAR ─── */}
      <div style={{
        background: '#1a1a1a', color: '#fff', textAlign: 'center',
        padding: '8px 16px', fontSize: '12px', letterSpacing: '1.8px', fontWeight: 500,
      }}>
        🚚 FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;|&nbsp; CODE: <strong>DENIM10</strong> FOR 10% OFF
      </div>

      {/* ─── HERO BANNER ─── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: cur.bg, transition: 'background 0.85s ease',
        minHeight: 'clamp(380px, 55vw, 540px)',
        display: 'flex', alignItems: 'center',
      }}>
        {/* Denim texture */}
        <div style={{
          position:'absolute', inset:0, opacity:.04, pointerEvents:'none',
          backgroundImage:`repeating-linear-gradient(45deg,#000 0,#000 1px,transparent 0,transparent 50%)`,
          backgroundSize:'10px 10px',
        }} />

        <div className="hero-inner">

          {/* ── LEFT: animated text ── */}
          <div className="hero-left" key={`left-${animKey}`}>

            {/* Tag pill */}
            <div style={{
              display:'inline-block',
              background: isDark ? 'rgba(255,255,255,.15)' : '#1a1a1a',
              color:'#fff',
              padding:'4px 14px', fontSize:'11px', letterSpacing:'3px',
              fontWeight:600, marginBottom:'16px', borderRadius:'2px',
              animation:'slideDown .5s cubic-bezier(.22,1,.36,1) both',
            }}>{cur.tag}</div>

            {/* Heading */}
            <h1 style={{
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:'clamp(40px, 7vw, 88px)',
              lineHeight:1.05, margin:'0 0 16px',
              color:cur.accent, letterSpacing:'2px',
            }}>
              {cur.heading.map((line, li) => (
                <div key={li} style={{ overflow:'hidden' }}>
                  <span style={{
                    display:'block',
                    animation:`slideUp .65s cubic-bezier(.22,1,.36,1) ${.1 + li * .13}s both`,
                  }}>{line}</span>
                </div>
              ))}
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize:'clamp(13px,1.4vw,15px)',
              color: isDark ? 'rgba(255,255,255,.68)' : '#666',
              marginBottom:'28px', maxWidth:'380px', lineHeight:1.68,
              animation:'fadeInUp .7s cubic-bezier(.22,1,.36,1) .36s both',
            }}>{cur.sub}</p>

            {/* Buttons */}
            <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
              <Link to="/shop" style={{
                background:cur.accent,
                color: isDark ? '#1a1a1a' : '#fff',
                padding:'13px 30px', textDecoration:'none',
                fontSize:'clamp(11px,1.2vw,13px)', fontWeight:700,
                letterSpacing:'1.5px', borderRadius:'2px', display:'inline-block',
                animation:'fadeInLeft .6s cubic-bezier(.22,1,.36,1) .46s both',
              }}>{cur.cta}</Link>
              <Link to="/shop" style={{
                background:'transparent', color:cur.accent,
                padding:'13px 30px', textDecoration:'none',
                fontSize:'clamp(11px,1.2vw,13px)', fontWeight:700,
                letterSpacing:'1.5px', borderRadius:'2px', display:'inline-block',
                border:`1.5px solid ${cur.accent}`,
                animation:'fadeInLeft .6s cubic-bezier(.22,1,.36,1) .56s both',
              }}>View Collection</Link>
            </div>
          </div>

          {/* ── RIGHT: animated stats ── */}
          <div className="hero-right" key={`stats-${animKey}`}>
            {cur.stats.map(([num, label], si) => (
              <div key={si} style={{
                animation:`statPop .55s cubic-bezier(.34,1.56,.64,1) ${.18 + si * .16}s both`,
              }}>
                <div style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:'clamp(28px,4vw,44px)',
                  color:cur.accent, lineHeight:1,
                }}>{num}</div>
                <div style={{
                  fontSize:'clamp(9px,.9vw,11px)', letterSpacing:'2px',
                  color: isDark ? 'rgba(255,255,255,.5)' : '#999',
                  marginTop:'3px', textTransform:'uppercase',
                }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide dots */}
        <div style={{
          position:'absolute', bottom:'16px', left:'50%',
          transform:'translateX(-50%)', display:'flex', gap:'8px',
        }}>
          {bannerSlides.map((_, i) => (
            <button key={i} onClick={() => changeSlide(i)} style={{
              width: i===slide ? '26px' : '8px', height:'8px',
              borderRadius:'4px', border:'none', cursor:'pointer', padding:0,
              background: i===slide ? cur.accent : 'rgba(0,0,0,.22)',
              transition:'all .35s',
            }} />
          ))}
        </div>
      </div>

      {/* ─── TRUST STRIP ─── */}
      <div style={{ borderTop:'1px solid #e5e5e5', borderBottom:'1px solid #e5e5e5', padding:'18px 0' }}>
        <div className="trust-grid">
          {[
            ['🚚','Free Shipping','On orders above ₹999'],
            ['↩️','Easy Returns','7-day hassle-free'],
            ['🔒','Secure Payment','Stripe + COD'],
            ['⭐','Premium Quality','Stretch denim fabric'],
          ].map(([icon, title, sub]) => (
            <div className="trust-item" key={title}>
              <span style={{ fontSize:'20px' }}>{icon}</span>
              <div>
                <div style={{ fontSize:'12px', fontWeight:600 }}>{title}</div>
                <div style={{ fontSize:'11px', color:'#888' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CATEGORIES ─── */}
      <div className="section-pad" style={{ maxWidth:'1200px', margin:'0 auto', padding:'52px 40px 0' }}>
        <div style={{ marginBottom:'24px' }}>
          <p style={{ fontSize:'11px', letterSpacing:'3px', color:'#888', margin:'0 0 6px', fontWeight:600 }}>BROWSE BY</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(22px,4vw,32px)', fontWeight:700, margin:0 }}>Featured Categories</h2>
        </div>
        <div className="cat-grid">
          {categories.map(cat => (
            <Link key={cat.name} to={`/shop?category=${cat.slug}`} style={{ textDecoration:'none' }}>
              <div className="cat-card">
                <div style={{ fontSize:'clamp(24px,3vw,30px)', marginBottom:'8px' }}>{cat.emoji}</div>
                <div className="cat-label" style={{ fontSize:'11px', fontWeight:600, letterSpacing:'.5px', color:'#1a1a1a' }}>{cat.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── FEATURED PRODUCTS ─── */}
      <div className="section-pad" style={{ maxWidth:'1200px', margin:'0 auto', padding:'52px 40px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <p style={{ fontSize:'11px', letterSpacing:'3px', color:'#888', margin:'0 0 6px', fontWeight:600 }}>NEW ARRIVALS</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(22px,4vw,32px)', fontWeight:700, margin:0 }}>Featured Jeans</h2>
          </div>
          <Link to="/shop" style={{
            color:'#1a1a1a', textDecoration:'none', fontSize:'13px',
            fontWeight:600, letterSpacing:'1px',
            borderBottom:'1.5px solid #1a1a1a', paddingBottom:'2px',
          }}>View All →</Link>
        </div>

        {loading ? (
          <div className="product-grid">
            {[...Array(4)].map((_,i) => (
              <div key={i} style={{ background:'#f0f0f0', borderRadius:'8px', aspectRatio:'3/4', animation:'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'#888' }}>
            <div style={{ fontSize:'48px', marginBottom:'12px' }}>👖</div>
            <p>No products yet. Add some from the admin panel!</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(p => <ProductCard key={p._id} product={p} navigate={navigate} />)}
          </div>
        )}
      </div>

      {/* ─── BRAND BANNER ─── */}
      <div style={{
        background:'#1a1a1a', color:'#fff',
        padding:'clamp(44px,6vw,72px) clamp(16px,4vw,40px)',
        textAlign:'center',
      }}>
        <p style={{ fontSize:'11px', letterSpacing:'4px', color:'#666', marginBottom:'12px', fontWeight:600 }}>WHY CHOOSE US</p>
        <h2 style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:'clamp(32px,6vw,72px)', letterSpacing:'3px', margin:'0 0 16px',
        }}>WEAR THE DIFFERENCE</h2>
        <p style={{ color:'#aaa', maxWidth:'500px', margin:'0 auto 32px', lineHeight:1.7, fontSize:'clamp(13px,1.4vw,15px)' }}>
          Every pair is crafted with premium stretch denim, designed to move with you. From streets to boardrooms — DENIMCO fits every moment.
        </p>
        <Link to="/shop" style={{
          background:'#fff', color:'#1a1a1a',
          padding:'14px 40px', textDecoration:'none',
          fontSize:'13px', fontWeight:700, letterSpacing:'2px', borderRadius:'2px',
          display:'inline-block',
        }}>SHOP NOW</Link>
      </div>
    </div>
  );
}

/* ─── PRODUCT CARD COMPONENT ─── */
function ProductCard({ product, navigate }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const pct = hasDiscount ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      style={{
        cursor:'pointer', borderRadius:'10px', overflow:'hidden',
        background:'#fff', border:'1px solid #eee',
        transition:'box-shadow .25s, transform .25s',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='0 10px 36px rgba(0,0,0,.11)'; e.currentTarget.style.transform='translateY(-4px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}
    >
      <div style={{ position:'relative', background:'#f8f8f8', aspectRatio:'3/4', overflow:'hidden' }}>
        {product.images?.[0]
          ? <img src={product.images[0]} alt={product.name}
              style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .4s' }}
              onMouseEnter={e => e.target.style.transform='scale(1.05)'}
              onMouseLeave={e => e.target.style.transform='scale(1)'}
            />
          : <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'48px' }}>👖</div>
        }
        <div style={{ position:'absolute', top:'8px', left:'8px', display:'flex', flexDirection:'column', gap:'4px' }}>
          {pct && <span style={{ background:'#e53935',color:'#fff',padding:'3px 8px',fontSize:'10px',fontWeight:700,borderRadius:'2px' }}>Save {pct}%</span>}
          {product.stock === 0 && <span style={{ background:'#1a1a1a',color:'#fff',padding:'3px 8px',fontSize:'10px',fontWeight:600,borderRadius:'2px' }}>SOLD OUT</span>}
        </div>
      </div>
      <div style={{ padding:'12px 14px 16px' }}>
        <p style={{ fontSize:'10px',color:'#888',letterSpacing:'1.5px',margin:'0 0 3px',fontWeight:600,textTransform:'uppercase' }}>
          {product.category || 'DENIM'}
        </p>
        <h3 style={{ fontSize:'13px',fontWeight:600,margin:'0 0 8px',lineHeight:1.35 }}>{product.name}</h3>
        {product.sizes?.length > 0 && (
          <div style={{ display:'flex',gap:'3px',flexWrap:'wrap',marginBottom:'8px' }}>
            {product.sizes.slice(0,5).map(s => (
              <span key={s} style={{ padding:'2px 6px',border:'1px solid #ddd',fontSize:'10px',borderRadius:'2px',color:'#555' }}>{s}</span>
            ))}
          </div>
        )}
        <div style={{ display:'flex',alignItems:'center',gap:'8px' }}>
          <span style={{ fontSize:'15px',fontWeight:700 }}>₹{product.price?.toLocaleString()}</span>
          {hasDiscount && <span style={{ fontSize:'12px',color:'#bbb',textDecoration:'line-through' }}>₹{product.originalPrice?.toLocaleString()}</span>}
        </div>
      </div>
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import ProductCard from '../components/ProductCard';
// import { getProducts } from '../services/api';

// export default function Home() {
//   const [featured, setFeatured] = useState([]);

//   useEffect(() => {
//     getProducts({ limit: 4 }).then(res => setFeatured(res.data.products)).catch(() => {});
//   }, []);

//   return (
//     <div style={{ paddingTop: 70 }}>
//       {/* Hero Section */}
//       <section style={{
//         minHeight: '92vh',
//         background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0d0d0d 100%)',
//         display: 'flex', alignItems: 'center',
//         position: 'relative', overflow: 'hidden',
//       }}>
//         {/* Background texture */}
//         <div style={{
//           position: 'absolute', inset: 0,
//           backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(200,169,110,0.06) 0%, transparent 60%)',
//         }} />
//         <div style={{
//           position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%',
//           background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.03))',
//           borderLeft: '1px solid rgba(200,169,110,0.08)',
//         }} />

//         <div className="container" style={{ position: 'relative', zIndex: 1 }}>
//           <div style={{ maxWidth: 620 }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
//               <div style={{ width: 40, height: 1, background: '#c8a96e' }} />
//               <span style={{ fontSize: 12, letterSpacing: 4, color: '#c8a96e', textTransform: 'uppercase' }}>Premium Denim Collection</span>
//             </div>
//             <h1 style={{
//               fontFamily: 'Bebas Neue, sans-serif',
//               fontSize: 'clamp(64px, 10vw, 110px)',
//               lineHeight: 0.9, letterSpacing: 4,
//               color: '#fff', marginBottom: 30,
//             }}>
//               WEAR THE<br />
//               <span style={{ color: '#c8a96e' }}>STREET</span>
//             </h1>
//             <p style={{ fontSize: 16, color: '#888', lineHeight: 1.8, marginBottom: 40, maxWidth: 440 }}>
//               Handcrafted denim for the bold. Every pair tells a story — yours starts here.
//               Premium stretch fabric, built to last, designed to impress.
//             </p>
//             <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
//               <Link to="/shop" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: 15, letterSpacing: 1 }}>
//                 Shop Now →
//               </Link>
//               <a href="#featured" className="btn btn-outline" style={{ padding: '16px 40px', fontSize: 15, letterSpacing: 1 }}>
//                 View Collection
//               </a>
//             </div>
//             {/* Stats */}
//             <div style={{ display: 'flex', gap: 40, marginTop: 60, paddingTop: 40, borderTop: '1px solid #1e1e1e' }}>
//               {[['500+', 'Happy Customers'], ['50+', 'Styles'], ['100%', 'Premium Denim']].map(([num, label]) => (
//                 <div key={label}>
//                   <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: '#c8a96e', letterSpacing: 2 }}>{num}</div>
//                   <div style={{ fontSize: 12, color: '#555', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Decorative jean icon */}
//         <div style={{ position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-50%)', fontSize: 200, opacity: 0.04, userSelect: 'none' }}>
//           👖
//         </div>
//       </section>

//       {/* Features Strip */}
//       <section style={{ background: '#111', borderTop: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e' }}>
//         <div className="container">
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
//             {[
//               ['🚚', 'Free Shipping', 'On orders above ₹999'],
//               ['↩️', 'Easy Returns', '7-day hassle-free'],
//               ['💳', 'Secure Payment', 'Stripe + COD'],
//               ['⭐', 'Premium Quality', 'Stretch denim fabric'],
//             ].map(([icon, title, sub], i) => (
//               <div key={title} style={{
//                 padding: '28px 24px', textAlign: 'center',
//                 borderRight: i < 3 ? '1px solid #1e1e1e' : 'none',
//               }}>
//                 <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
//                 <div style={{ fontWeight: 600, fontSize: 14, color: '#f0f0f0', marginBottom: 4 }}>{title}</div>
//                 <div style={{ fontSize: 12, color: '#555' }}>{sub}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Products */}
//       <section id="featured" style={{ padding: '80px 0' }}>
//         <div className="container">
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
//             <div>
//               <div style={{ fontSize: 12, letterSpacing: 4, color: '#c8a96e', marginBottom: 8, textTransform: 'uppercase' }}>New Arrivals</div>
//               <h2 className="section-title">Featured Jeans</h2>
//             </div>
//             <Link to="/shop" className="btn btn-outline">View All →</Link>
//           </div>
//           {featured.length === 0 ? (
//             <div style={{ textAlign: 'center', color: '#444', padding: 60 }}>
//               <div style={{ fontSize: 48, marginBottom: 16 }}>👖</div>
//               <div>No products yet. Add some from the admin panel!</div>
//             </div>
//           ) : (
//             <div className="products-grid">
//               {featured.map(p => <ProductCard key={p._id} product={p} />)}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* CTA Banner */}
//       <section style={{
//         background: 'linear-gradient(135deg, #c8a96e 0%, #a07840 100%)',
//         padding: '60px 0', textAlign: 'center',
//       }}>
//         <div className="container">
//           <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, color: '#000', letterSpacing: 3, marginBottom: 12 }}>
//             FIRST ORDER? GET 10% OFF
//           </h2>
//           <p style={{ color: '#3d2e10', marginBottom: 28, fontSize: 15 }}>
//             Use code <strong>DENIMCO10</strong> at checkout
//           </p>
//           <Link to="/register" className="btn" style={{ background: '#e0f9c0', color: '#c8a96e', padding: '14px 40px', fontSize: 15, letterSpacing: 1 }}>
//             Create Account →
//           </Link>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer style={{ background: '#080808', borderTop: '1px solid #1a1a1a', padding: '40px 0', textAlign: 'center' }}>
//         <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, letterSpacing: 4, color: '#c8a96e', marginBottom: 8 }}>DENIMCO</div>
//         <div style={{ fontSize: 12, color: '#333' }}>© 2026 DenimCo. All rights reserved.</div>
//       </footer>
//     </div>
//   );
// }