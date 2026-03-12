import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    getProductById(id)
      .then(res => {
        setProduct(res.data);
        setSelectedSize(res.data.sizes?.[0] || '');
        setSelectedColor(res.data.colors?.[0] || '');
      })
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) return alert('Please select a size');
    addToCart({ ...product, size: selectedSize, color: selectedColor });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (!product) return null;

  return (
    <div className="page" style={{ background: '#0a0a0a' }}>
      <div className="container" style={{ padding: '40px 20px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#888', marginBottom: 32, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Back to Shop
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
          {/* Images */}
          <div>
            <div style={{ background: '#141414', borderRadius: 16, overflow: 'hidden', height: 480, border: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {product.images?.[imgIdx] ? (
                <img src={product.images[imgIdx]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 80, marginBottom: 12 }}>👖</div>
                  <div style={{ color: '#333', fontSize: 12, letterSpacing: 2 }}>NO IMAGE</div>
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                {product.images.map((img, i) => (
                  <div key={i} onClick={() => setImgIdx(i)} style={{ width: 70, height: 70, border: `2px solid ${imgIdx === i ? '#c8a96e' : '#1e1e1e'}`, borderRadius: 8, overflow: 'hidden', cursor: 'pointer' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#c8a96e', marginBottom: 10, textTransform: 'uppercase' }}>{product.category}</div>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>{product.name}</h1>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 42, color: '#c8a96e', letterSpacing: 2, marginBottom: 20 }}>
              ₹{product.price?.toLocaleString()}
            </div>
            <p style={{ color: '#777', lineHeight: 1.8, marginBottom: 28, fontSize: 14 }}>{product.description}</p>

            {/* Size */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, letterSpacing: 2, color: '#555', marginBottom: 12, textTransform: 'uppercase', fontWeight: 600 }}>Size</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {product.sizes?.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} style={{
                    padding: '10px 18px', borderRadius: 8,
                    border: `1.5px solid ${selectedSize === s ? '#c8a96e' : '#2a2a2a'}`,
                    background: selectedSize === s ? '#c8a96e' : 'transparent',
                    color: selectedSize === s ? '#000' : '#888',
                    fontWeight: 700, cursor: 'pointer', fontSize: 13,
                  }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 12, letterSpacing: 2, color: '#555', marginBottom: 12, textTransform: 'uppercase', fontWeight: 600 }}>Color: <span style={{ color: '#c8a96e' }}>{selectedColor}</span></div>
              <div style={{ display: 'flex', gap: 10 }}>
                {product.colors?.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)} style={{
                    padding: '8px 16px', borderRadius: 8,
                    border: `1.5px solid ${selectedColor === c ? '#c8a96e' : '#2a2a2a'}`,
                    background: 'transparent',
                    color: selectedColor === c ? '#c8a96e' : '#666',
                    cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  }}>{c}</button>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: product.stock > 0 ? '#27ae60' : '#e74c3c' }} />
              <span style={{ fontSize: 13, color: product.stock > 0 ? '#27ae60' : '#e74c3c' }}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: 16, letterSpacing: 1, opacity: product.stock === 0 ? 0.4 : 1 }}
            >
              {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </button>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.tags.map(t => (
                  <span key={t} style={{ fontSize: 11, padding: '3px 10px', border: '1px solid #2a2a2a', borderRadius: 20, color: '#555' }}>#{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}