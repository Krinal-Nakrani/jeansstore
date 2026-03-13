import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';

const categories = [
  { name: 'Jeans', emoji: '👖', slug: 'jeans' },
  { name: 'Cargo', emoji: '🩳', slug: 'cargo' },
  { name: 'Shirts', emoji: '👕', slug: 'shirt' },
  { name: 'New Arrivals', emoji: '✨', slug: 'new' },
  { name: 'Sale', emoji: '🔥', slug: 'sale' },
  { name: 'All Products', emoji: '🛍️', slug: '' },
];

const bannerSlides = [
  {
    tag: 'NEW COLLECTION',
    heading: 'PREMIUM DENIM\nCRAFTED FOR YOU',
    sub: 'Handcrafted jeans for the bold. Every pair tells a story.',
    cta: 'Shop Now',
    bg: 'linear-gradient(135deg, #f5f0e8 0%, #e8ddd0 100%)',
    accent: '#1a1a1a',
  },
  {
    tag: 'END OF SEASON SALE',
    heading: 'UP TO 50% OFF\nSELECT STYLES',
    sub: 'Limited time. Limited stock. Unlimited style.',
    cta: 'View Sale',
    bg: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    accent: '#ffffff',
  },
  {
    tag: 'EXCLUSIVE DROP',
    heading: 'STREET READY\nBOLD & RAW',
    sub: 'New streetwear-inspired denim. Only at DENIMCO.',
    cta: 'Explore Drop',
    bg: 'linear-gradient(135deg, #eef2f7 0%, #dde6f0 100%)',
    accent: '#1a1a1a',
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts({ limit: 8 })
      .then(r => setProducts(r.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % bannerSlides.length), 4000);
    return () => clearInterval(t);
  }, []);

  const current = bannerSlides[slide];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#fff', color: '#1a1a1a' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;900&family=Bebas+Neue&display=swap" rel="stylesheet" />

      {/* ── ANNOUNCEMENT BAR ── */}
      <div style={{
        background: '#1a1a1a', color: '#fff', textAlign: 'center',
        padding: '8px 16px', fontSize: '12px', letterSpacing: '2px',
        fontWeight: 500,
      }}>
        🚚 FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;|&nbsp; USE CODE: <strong>DENIM10</strong> FOR 10% OFF
      </div>

      {/* ── HERO BANNER ── */}
      <div style={{
        position: 'relative', minHeight: '520px', display: 'flex',
        alignItems: 'center', overflow: 'hidden',
        background: current.bg,
        transition: 'background 0.8s ease',
      }}>
        {/* Decorative denim texture overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)`,
          backgroundSize: '10px 10px',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: '60px 24px',
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '40px',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'inline-block',
              background: current.accent === '#ffffff' ? 'rgba(255,255,255,0.15)' : '#1a1a1a',
              color: current.accent === '#ffffff' ? '#fff' : '#fff',
              padding: '4px 14px', fontSize: '11px', letterSpacing: '3px',
              fontWeight: 600, marginBottom: '20px', borderRadius: '2px',
            }}>
              {current.tag}
            </div>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(48px, 8vw, 88px)',
              lineHeight: 1, margin: '0 0 20px',
              color: current.accent,
              whiteSpace: 'pre-line',
              letterSpacing: '2px',
            }}>{current.heading}</h1>
            <p style={{
              fontSize: '15px', color: current.accent === '#ffffff' ? 'rgba(255,255,255,0.7)' : '#666',
              marginBottom: '32px', maxWidth: '400px', lineHeight: 1.6,
            }}>{current.sub}</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/shop" style={{
                background: current.accent, color: current.accent === '#ffffff' ? '#1a1a1a' : '#fff',
                padding: '14px 32px', textDecoration: 'none', fontSize: '13px',
                fontWeight: 600, letterSpacing: '1.5px', borderRadius: '2px',
                transition: 'opacity 0.2s',
              }}>{current.cta}</Link>
              <Link to="/shop" style={{
                background: 'transparent',
                color: current.accent,
                padding: '14px 32px', textDecoration: 'none', fontSize: '13px',
                fontWeight: 600, letterSpacing: '1.5px', borderRadius: '2px',
                border: `1.5px solid ${current.accent}`,
              }}>View Collection</Link>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'center' }}>
            {[['500+', 'Products'], ['50K+', 'Customers'], ['100%', 'Authentic']].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '36px', color: current.accent, lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: '11px', letterSpacing: '2px', color: current.accent === '#ffffff' ? 'rgba(255,255,255,0.6)' : '#888', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide indicators */}
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
          {bannerSlides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{
              width: i === slide ? '24px' : '8px', height: '8px',
              borderRadius: '4px', border: 'none', cursor: 'pointer',
              background: i === slide ? current.accent : 'rgba(0,0,0,0.2)',
              transition: 'all 0.3s', padding: 0,
            }} />
          ))}
        </div>
      </div>

      {/* ── TRUST STRIP ── */}
      <div style={{
        borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5',
        padding: '18px 24px',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px',
          textAlign: 'center',
        }}>
          {[
            ['🚚', 'Free Shipping', 'On orders above ₹999'],
            ['↩️', 'Easy Returns', '7-day hassle-free'],
            ['🔒', 'Secure Payment', 'Stripe + COD'],
            ['⭐', 'Premium Quality', 'Stretch denim fabric'],
          ].map(([icon, title, sub]) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
              <span style={{ fontSize: '22px' }}>{icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{title}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES GRID ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px 0' }}>
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#888', margin: '0 0 6px', fontWeight: 600 }}>BROWSE BY</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, margin: 0 }}>Featured Categories</h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '12px',
        }}>
          {categories.map((cat) => (
            <Link key={cat.name} to={`/shop?category=${cat.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#f8f8f8', borderRadius: '8px',
                padding: '24px 12px', textAlign: 'center',
                transition: 'all 0.25s', cursor: 'pointer',
                border: '1.5px solid transparent',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#1a1a1a';
                  e.currentTarget.style.borderColor = '#1a1a1a';
                  e.currentTarget.querySelector('.cat-label').style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#f8f8f8';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.querySelector('.cat-label').style.color = '#1a1a1a';
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{cat.emoji}</div>
                <div className="cat-label" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', color: '#1a1a1a', transition: 'color 0.25s' }}>{cat.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#888', margin: '0 0 6px', fontWeight: 600 }}>NEW ARRIVALS</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, margin: 0 }}>Featured Jeans</h2>
          </div>
          <Link to="/shop" style={{
            color: '#1a1a1a', textDecoration: 'none', fontSize: '13px',
            fontWeight: 600, letterSpacing: '1px', borderBottom: '1.5px solid #1a1a1a',
            paddingBottom: '2px',
          }}>View All →</Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: '#f0f0f0', borderRadius: '8px', height: '380px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>👖</div>
            <p style={{ fontSize: '15px' }}>No products yet. Add some from the admin panel!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px',
          }}>
            {products.map((p, idx) => (
              <ProductCard key={p._id} product={p} idx={idx} navigate={navigate} />
            ))}
          </div>
        )}
      </div>

      {/* ── BRAND BANNER ── */}
      <div style={{
        background: '#1a1a1a', color: '#fff',
        padding: '64px 24px', textAlign: 'center',
        margin: '0 0 0',
      }}>
        <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#888', marginBottom: '12px', fontWeight: 600 }}>WHY CHOOSE US</p>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '3px',
          margin: '0 0 16px',
        }}>WEAR THE DIFFERENCE</h2>
        <p style={{ color: '#aaa', maxWidth: '520px', margin: '0 auto 36px', lineHeight: 1.7, fontSize: '15px' }}>
          Every pair is crafted with premium stretch denim, designed to move with you. From streets to boardrooms — DENIMCO fits every moment.
        </p>
        <Link to="/shop" style={{
          background: '#fff', color: '#1a1a1a',
          padding: '14px 40px', textDecoration: 'none',
          fontSize: '13px', fontWeight: 700, letterSpacing: '2px', borderRadius: '2px',
        }}>SHOP NOW</Link>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1 }
          50% { opacity: 0.5 }
        }
      `}</style>
    </div>
  );
}

function ProductCard({ product, idx, navigate }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      style={{
        cursor: 'pointer', borderRadius: '8px', overflow: 'hidden',
        background: '#fff', border: '1px solid #eee',
        transition: 'box-shadow 0.25s, transform 0.25s',
        animationDelay: `${idx * 0.05}s`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'none';
      }}
    >
      {/* Image area */}
      <div style={{ position: 'relative', background: '#f8f8f8', height: '280px', overflow: 'hidden' }}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '48px',
          }}>👖</div>
        )}

        {/* Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {discountPct && (
            <span style={{
              background: '#e53935', color: '#fff',
              padding: '3px 8px', fontSize: '11px', fontWeight: 700,
              borderRadius: '2px', letterSpacing: '0.5px',
            }}>Save {discountPct}%</span>
          )}
          {product.stock === 0 && (
            <span style={{
              background: '#1a1a1a', color: '#fff',
              padding: '3px 8px', fontSize: '11px', fontWeight: 600,
              borderRadius: '2px',
            }}>OUT OF STOCK</span>
          )}
          {product.isNew && (
            <span style={{
              background: '#2e7d32', color: '#fff',
              padding: '3px 8px', fontSize: '11px', fontWeight: 600,
              borderRadius: '2px',
            }}>NEW</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 14px 16px' }}>
        <p style={{ fontSize: '11px', color: '#888', letterSpacing: '1.5px', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase' }}>
          {product.category || 'DENIM'}
        </p>
        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 10px', lineHeight: 1.3 }}>{product.name}</h3>

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {product.sizes.slice(0, 5).map(s => (
              <span key={s} style={{
                padding: '2px 7px', border: '1px solid #ddd',
                fontSize: '11px', borderRadius: '2px', color: '#555',
                fontWeight: 500,
              }}>{s}</span>
            ))}
          </div>
        )}

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px', fontWeight: 700 }}>₹{product.price?.toLocaleString()}</span>
          {hasDiscount && (
            <span style={{ fontSize: '13px', color: '#aaa', textDecoration: 'line-through' }}>
              ₹{product.originalPrice?.toLocaleString()}
            </span>
          )}
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