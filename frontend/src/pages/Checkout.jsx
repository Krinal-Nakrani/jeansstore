import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ fullName: user?.name || '', address: '', city: '', pincode: '', phone: '' });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleOrder = async () => {
    const { fullName, address, city, pincode, phone } = form;
    if (!fullName || !address || !city || !pincode || !phone) return alert('Please fill all fields');
    setLoading(true);
    try {
      await placeOrder({
        items: cart.map(i => ({ product: i._id, name: i.name, image: i.images?.[0] || '', price: i.price, quantity: i.quantity, size: i.size, color: i.color })),
        shippingAddress: form,
        paymentMethod,
      });
      clearCart();
      setSuccess(true);
      setTimeout(() => navigate('/my-orders'), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed. Try again.');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: '80vh', textAlign: 'center' }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
      <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, letterSpacing: 3, color: '#27ae60', marginBottom: 10 }}>Order Placed!</h2>
      <p style={{ color: '#888' }}>Redirecting to your orders...</p>
    </div>
  );

  return (
    <div className="page" style={{ background: '#0a0a0a' }}>
      <div className="container" style={{ padding: '40px 20px' }}>
        <h1 className="section-title" style={{ marginBottom: 40 }}>Checkout</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
          {/* Form */}
          <div>
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 28, marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 2, marginBottom: 24 }}>SHIPPING ADDRESS</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Full Name</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your full name" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Address</label>
                  <input name="address" value={form.address} onChange={handleChange} placeholder="Street address, flat no." />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="400001" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 28 }}>
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 2, marginBottom: 24 }}>PAYMENT METHOD</h3>
              {[
                { id: 'COD', label: '💵 Cash on Delivery', sub: 'Pay when your order arrives' },
                { id: 'Stripe', label: '💳 Pay Online (Stripe)', sub: 'Credit / Debit card' },
              ].map(p => (
                <div key={p.id} onClick={() => setPaymentMethod(p.id)} style={{
                  border: `2px solid ${paymentMethod === p.id ? '#c8a96e' : '#2a2a2a'}`,
                  borderRadius: 10, padding: 16, marginBottom: 12,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                  background: paymentMethod === p.id ? 'rgba(200,169,110,0.06)' : 'transparent',
                }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${paymentMethod === p.id ? '#c8a96e' : '#444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {paymentMethod === p.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#c8a96e' }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{p.label}</div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{p.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 28, position: 'sticky', top: 90 }}>
            <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 2, marginBottom: 20 }}>ORDER TOTAL</h3>
            {cart.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888', marginBottom: 8 }}>
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #1e1e1e', marginTop: 16, paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: 13, marginBottom: 8 }}>
                <span>Shipping</span><span style={{ color: '#27ae60' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, color: '#c8a96e', letterSpacing: 1 }}>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={handleOrder} disabled={loading} className="btn btn-primary"
              style={{ width: '100%', padding: 16, fontSize: 15, marginTop: 24, letterSpacing: 1, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Placing Order...' : `Place Order — ₹${total.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}