import { useState, useEffect } from 'react';
import { getAllOrders, updateStatus } from '../../services/api';

const STATUS_COLORS = {
  pending: '#f39c12', confirmed: '#3498db',
  shipped: '#9b59b6', delivered: '#27ae60', cancelled: '#e74c3c',
};
const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const load = () => {
    setLoading(true);
    getAllOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateStatus(id, status);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));
      showToast(`✅ Status updated to "${status}"`);
    } catch { showToast('❌ Update failed'); }
    finally { setUpdating(null); }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

  const counts = STATUSES.reduce((acc, s) => { acc[s] = orders.filter(o => o.orderStatus === s).length; return acc; }, {});

  return (
    <div>
      {toast && <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0d0d18', border: '1px solid #c8a96e', color: '#f0f0f0', padding: '12px 20px', borderRadius: 10, zIndex: 9999, fontSize: 14 }}>{toast}</div>}

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#c8a96e', letterSpacing: 3, marginBottom: 4 }}>MANAGE</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 38, letterSpacing: 2, color: '#f0f0f0', margin: 0 }}>Orders</h1>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={{ padding: '8px 18px', borderRadius: 20, border: `1px solid ${filter === 'all' ? '#c8a96e' : '#1a1a2e'}`, background: filter === 'all' ? 'rgba(200,169,110,0.15)' : 'transparent', color: filter === 'all' ? '#c8a96e' : '#555', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
          All ({orders.length})
        </button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 18px', borderRadius: 20, border: `1px solid ${filter === s ? STATUS_COLORS[s] : '#1a1a2e'}`, background: filter === s ? STATUS_COLORS[s] + '22' : 'transparent', color: filter === s ? STATUS_COLORS[s] : '#555', cursor: 'pointer', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
            {s} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#444' }}>Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#333' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <div>No {filter !== 'all' ? filter : ''} orders found.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(order => (
            <div key={order._id} style={{ background: '#0d0d18', border: `1px solid ${expanded === order._id ? '#c8a96e44' : '#1a1a2e'}`, borderRadius: 14, overflow: 'hidden', transition: 'border 0.2s' }}>
              {/* Order Row */}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                <div style={{ minWidth: 110 }}>
                  <div style={{ fontSize: 10, color: '#444', marginBottom: 2 }}>ORDER ID</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#c8a96e' }}>#{order._id.slice(-8).toUpperCase()}</div>
                </div>
                <div style={{ minWidth: 130, flex: 1 }}>
                  <div style={{ fontSize: 10, color: '#444', marginBottom: 2 }}>CUSTOMER</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{order.user?.name || 'Unknown'}</div>
                  <div style={{ fontSize: 11, color: '#444' }}>{order.user?.email}</div>
                </div>
                <div style={{ minWidth: 100 }}>
                  <div style={{ fontSize: 10, color: '#444', marginBottom: 2 }}>TOTAL</div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#c8a96e', letterSpacing: 1 }}>₹{order.total?.toLocaleString()}</div>
                </div>
                <div style={{ minWidth: 80 }}>
                  <div style={{ fontSize: 10, color: '#444', marginBottom: 2 }}>PAYMENT</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{order.paymentMethod}</div>
                </div>
                <div style={{ minWidth: 80 }}>
                  <div style={{ fontSize: 10, color: '#444', marginBottom: 2 }}>DATE</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                </div>
                {/* Status Dropdown */}
                <div onClick={e => e.stopPropagation()}>
                  <select
                    value={order.orderStatus}
                    onChange={e => handleStatus(order._id, e.target.value)}
                    disabled={updating === order._id}
                    style={{ background: STATUS_COLORS[order.orderStatus] + '22', border: `1px solid ${STATUS_COLORS[order.orderStatus]}55`, color: STATUS_COLORS[order.orderStatus], borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', outline: 'none', textTransform: 'capitalize' }}>
                    {STATUSES.map(s => <option key={s} value={s} style={{ background: '#0d0d18', color: '#f0f0f0', textTransform: 'capitalize' }}>{s}</option>)}
                  </select>
                </div>
                <div style={{ color: '#444', fontSize: 16, marginLeft: 'auto' }}>{expanded === order._id ? '▲' : '▼'}</div>
              </div>

              {/* Expanded Details */}
              {expanded === order._id && (
                <div style={{ borderTop: '1px solid #1a1a2e', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  {/* Items */}
                  <div>
                    <div style={{ fontSize: 11, color: '#444', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>Items Ordered</div>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #0f0f1a' }}>
                        <div style={{ width: 40, height: 40, background: '#131325', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {item.image ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 18 }}>👖</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f0' }}>{item.name}</div>
                          <div style={{ fontSize: 11, color: '#555' }}>Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</div>
                        </div>
                        <div style={{ color: '#c8a96e', fontWeight: 600, fontSize: 14 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping */}
                  <div>
                    <div style={{ fontSize: 11, color: '#444', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>Shipping Address</div>
                    <div style={{ background: '#131325', borderRadius: 10, padding: 16, fontSize: 13, color: '#888', lineHeight: 2 }}>
                      <div style={{ color: '#f0f0f0', fontWeight: 600 }}>{order.shippingAddress?.fullName}</div>
                      <div>{order.shippingAddress?.address}</div>
                      <div>{order.shippingAddress?.city} - {order.shippingAddress?.pincode}</div>
                      <div>📞 {order.shippingAddress?.phone}</div>
                    </div>
                    <div style={{ marginTop: 16, fontSize: 11, color: '#444', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>Update Status</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {STATUSES.map(s => (
                        <button key={s} onClick={() => handleStatus(order._id, s)} disabled={updating === order._id || order.orderStatus === s}
                          style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${order.orderStatus === s ? STATUS_COLORS[s] : '#1a1a2e'}`, background: order.orderStatus === s ? STATUS_COLORS[s] + '22' : 'transparent', color: order.orderStatus === s ? STATUS_COLORS[s] : '#555', cursor: order.orderStatus === s ? 'default' : 'pointer', fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
