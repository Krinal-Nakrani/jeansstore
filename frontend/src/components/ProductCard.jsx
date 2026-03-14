import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart({ ...product, size: product.sizes?.[0] || 'M', color: product.colors?.[0] || 'Default' });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const image = product.images?.[0] || null;

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#141414',
        borderRadius: 12,
        overflow: 'hidden',
        border: `1px solid ${hovered ? '#c8a96e' : '#1e1e1e'}`,
        cursor: 'pointer',
        transition: 'all 0.25s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 12px 40px rgba(200,169,110,0.12)' : 'none',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 280, background: '#1a1a1a', overflow: 'hidden' }}>
        {image ? (
          <img
            src={product.images[0]}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top',   // ← focus on top (face/product) not center
              imageRendering: 'auto',
            }}
          />
          // <img src={image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' , transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 48 }}>👖</span>
            <span style={{ fontSize: 11, color: '#444', letterSpacing: 2 }}>NO IMAGE</span>
          </div>
        )}
        {product.stock < 5 && product.stock > 0 && (
          <span className="badge badge-red" style={{ position: 'absolute', top: 12, left: 12 }}>Only {product.stock} left</span>
        )}
        {product.stock === 0 && (
          <span className="badge" style={{ position: 'absolute', top: 12, left: 12, background: '#333', color: '#666' }}>Out of Stock</span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px' }}>
        <div style={{ fontSize: 11, color: '#c8a96e', letterSpacing: 2, marginBottom: 4, textTransform: 'uppercase' }}>
          {product.category || 'Jeans'}
        </div>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, color: '#f0f0f0', lineHeight: 1.3 }}>
          {product.name}
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
          {product.sizes?.slice(0, 4).map(s => (
            <span key={s} style={{ fontSize: 10, padding: '2px 7px', border: '1px solid #2a2a2a', borderRadius: 4, color: '#888' }}>{s}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#c8a96e', letterSpacing: 1 }}>
            ₹{product.price?.toLocaleString()}
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: 12, opacity: product.stock === 0 ? 0.4 : 1 }}
          >
            {added ? '✓ Added!' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}