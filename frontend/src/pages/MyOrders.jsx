import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  pending: '#f39c12', confirmed: '#3498db',
  shipped: '#9b59b6', delivered: '#27ae60', cancelled: '#e74c3c',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate('/login');
    getMyOrders().then(res => setOrders(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page" style={{ background: '#0a0a0a' }}>
      <div className="container" style={{ padding: '40px 20px' }}>
        <h1 className="section-title" style={{ marginBottom: 8 }}>My Orders</h1>
        <p style={{ color: '#555', marginBottom: 40, fontSize: 14 }}>Hello, {user?.name}! Here are all your orders.</p>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#444' }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>📦</div>
            <h3 style={{ marginBottom: 12 }}>No orders yet</h3>
            <button onClick={() => navigate('/shop')} className="btn btn-primary">Start Shopping</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {orders.map(order => (
              <div key={order._id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, overflow: 'hidden' }}>
                {/* Order Header */}
                <div style={{ padding: '16px 24px', background: '#161616', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid #1e1e1e' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#555', marginBottom: 2, letterSpacing: 1 }}>ORDER ID</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#c8a96e' }}>#{order._id.slice(-8).toUpperCase()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#555', marginBottom: 2 }}>DATE</div>
                    <div style={{ fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#555', marginBottom: 2 }}>PAYMENT</div>
                    <div style={{ fontSize: 13 }}>{order.paymentMethod}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#555', marginBottom: 2 }}>TOTAL</div>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#c8a96e', letterSpacing: 1 }}>₹{order.total?.toLocaleString()}</div>
                  </div>
                  <span style={{
                    background: (STATUS_COLORS[order.orderStatus] || '#888') + '22',
                    color: STATUS_COLORS[order.orderStatus] || '#888',
                    border: `1px solid ${STATUS_COLORS[order.orderStatus] || '#888'}55`,
                    padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                    textTransform: 'capitalize', letterSpacing: 1,
                  }}>{order.orderStatus}</span>
                </div>

                {/* Items */}
                <div style={{ padding: '16px 24px' }}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                      <div style={{ width: 52, height: 52, background: '#1a1a1a', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>👖</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: '#555' }}>Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</div>
                      </div>
                      <div style={{ color: '#c8a96e', fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                {/* Shipping */}
                <div style={{ padding: '12px 24px', background: '#0d0d0d', fontSize: 12, color: '#555' }}>
                  📦 Delivering to: {order.shippingAddress?.fullName}, {order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}