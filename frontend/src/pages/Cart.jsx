import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, removeItem, updateQty, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) return navigate('/login');
    navigate('/checkout');
  };

  if (cart.length === 0) return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
      <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, letterSpacing: 3, marginBottom: 10 }}>Your Cart is Empty</h2>
      <p style={{ color: '#555', marginBottom: 30 }}>Looks like you haven't added any jeans yet.</p>
      <Link to="/shop" className="btn btn-primary">Browse Collection</Link>
    </div>
  );

  return (
    <div className="page" style={{ background: '#0a0a0a' }}>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <h1 className="section-title">Your Cart</h1>
          <button onClick={clearCart} style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: 13, cursor: 'pointer' }}>Clear Cart</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cart.map((item, index) => (
              <div key={index} style={{
                background: '#111', border: '1px solid #1e1e1e',
                borderRadius: 12, padding: 20,
                display: 'flex', gap: 20, alignItems: 'center',
              }}>
                {/* Image */}
                <div style={{ width: 90, height: 90, background: '#1a1a1a', borderRadius: 8, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <span style={{ fontSize: 32 }}>👖</span>}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#555', marginBottom: 8 }}>
                    Size: <span style={{ color: '#c8a96e' }}>{item.size}</span> &nbsp;|&nbsp;
                    Color: <span style={{ color: '#c8a96e' }}>{item.color}</span>
                  </div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#c8a96e', letterSpacing: 1 }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>

                {/* Qty Control */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button onClick={() => item.quantity > 1 ? updateQty(index, item.quantity - 1) : removeItem(index)}
                    style={{ width: 32, height: 32, border: '1px solid #2a2a2a', borderRadius: 6, background: 'transparent', color: '#fff', fontSize: 18, cursor: 'pointer' }}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQty(index, item.quantity + 1)}
                    style={{ width: 32, height: 32, border: '1px solid #2a2a2a', borderRadius: 6, background: 'transparent', color: '#fff', fontSize: 18, cursor: 'pointer' }}>+</button>
                </div>

                {/* Remove */}
                <button onClick={() => removeItem(index)}
                  style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 18, padding: 8 }}>✕</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 28, position: 'sticky', top: 90 }}>
            <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, letterSpacing: 2, marginBottom: 24 }}>ORDER SUMMARY</h3>
            <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 16 }}>
              {cart.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13, color: '#888' }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #1e1e1e', marginTop: 16, paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#888', fontSize: 13 }}>
                <span>Shipping</span><span style={{ color: '#27ae60' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, color: '#c8a96e', letterSpacing: 1 }}>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', padding: 16, fontSize: 15, marginTop: 24, letterSpacing: 1 }}>
              Proceed to Checkout →
            </button>
            <Link to="/shop" style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 13, color: '#555' }}>← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}