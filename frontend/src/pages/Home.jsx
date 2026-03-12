import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getProducts({ limit: 4 }).then(res => setFeatured(res.data.products)).catch(() => {});
  }, []);

  return (
    <div style={{ paddingTop: 70 }}>
      {/* Hero Section */}
      <section style={{
        minHeight: '92vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0d0d0d 100%)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(200,169,110,0.06) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%',
          background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.03))',
          borderLeft: '1px solid rgba(200,169,110,0.08)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 1, background: '#c8a96e' }} />
              <span style={{ fontSize: 12, letterSpacing: 4, color: '#c8a96e', textTransform: 'uppercase' }}>Premium Denim Collection</span>
            </div>
            <h1 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(64px, 10vw, 110px)',
              lineHeight: 0.9, letterSpacing: 4,
              color: '#fff', marginBottom: 30,
            }}>
              WEAR THE<br />
              <span style={{ color: '#c8a96e' }}>STREET</span>
            </h1>
            <p style={{ fontSize: 16, color: '#888', lineHeight: 1.8, marginBottom: 40, maxWidth: 440 }}>
              Handcrafted denim for the bold. Every pair tells a story — yours starts here.
              Premium stretch fabric, built to last, designed to impress.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: 15, letterSpacing: 1 }}>
                Shop Now →
              </Link>
              <a href="#featured" className="btn btn-outline" style={{ padding: '16px 40px', fontSize: 15, letterSpacing: 1 }}>
                View Collection
              </a>
            </div>
            {/* Stats */}
            <div style={{ display: 'flex', gap: 40, marginTop: 60, paddingTop: 40, borderTop: '1px solid #1e1e1e' }}>
              {[['500+', 'Happy Customers'], ['50+', 'Styles'], ['100%', 'Premium Denim']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: '#c8a96e', letterSpacing: 2 }}>{num}</div>
                  <div style={{ fontSize: 12, color: '#555', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative jean icon */}
        <div style={{ position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-50%)', fontSize: 200, opacity: 0.04, userSelect: 'none' }}>
          👖
        </div>
      </section>

      {/* Features Strip */}
      <section style={{ background: '#111', borderTop: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {[
              ['🚚', 'Free Shipping', 'On orders above ₹999'],
              ['↩️', 'Easy Returns', '7-day hassle-free'],
              ['💳', 'Secure Payment', 'Stripe + COD'],
              ['⭐', 'Premium Quality', 'Stretch denim fabric'],
            ].map(([icon, title, sub], i) => (
              <div key={title} style={{
                padding: '28px 24px', textAlign: 'center',
                borderRight: i < 3 ? '1px solid #1e1e1e' : 'none',
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#f0f0f0', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12, color: '#555' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: 4, color: '#c8a96e', marginBottom: 8, textTransform: 'uppercase' }}>New Arrivals</div>
              <h2 className="section-title">Featured Jeans</h2>
            </div>
            <Link to="/shop" className="btn btn-outline">View All →</Link>
          </div>
          {featured.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#444', padding: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👖</div>
              <div>No products yet. Add some from the admin panel!</div>
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #c8a96e 0%, #a07840 100%)',
        padding: '60px 0', textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, color: '#000', letterSpacing: 3, marginBottom: 12 }}>
            FIRST ORDER? GET 10% OFF
          </h2>
          <p style={{ color: '#3d2e10', marginBottom: 28, fontSize: 15 }}>
            Use code <strong>DENIMCO10</strong> at checkout
          </p>
          <Link to="/register" className="btn" style={{ background: '#e0f9c0', color: '#c8a96e', padding: '14px 40px', fontSize: 15, letterSpacing: 1 }}>
            Create Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#080808', borderTop: '1px solid #1a1a1a', padding: '40px 0', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, letterSpacing: 4, color: '#c8a96e', marginBottom: 8 }}>DENIMCO</div>
        <div style={{ fontSize: 12, color: '#333' }}>© 2026 DenimCo. All rights reserved.</div>
      </footer>
    </div>
  );
}