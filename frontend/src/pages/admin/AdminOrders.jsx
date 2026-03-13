import { useState, useEffect } from 'react';
import { getAllOrders, updateStatus } from '../../services/api';

const STATUS_CONFIG = {
  pending:   { color: 'var(--orange)', bg: 'rgba(243,156,18,.12)',  border: 'rgba(243,156,18,.28)',  label: 'Pending'   },
  confirmed: { color: 'var(--blue)',   bg: 'rgba(52,152,219,.12)',  border: 'rgba(52,152,219,.28)',  label: 'Confirmed' },
  shipped:   { color: 'var(--purple)', bg: 'rgba(155,89,182,.12)', border: 'rgba(155,89,182,.28)', label: 'Shipped'   },
  delivered: { color: 'var(--green)',  bg: 'rgba(39,174,96,.12)',   border: 'rgba(39,174,96,.28)',   label: 'Delivered' },
  cancelled: { color: 'var(--red)',    bg: 'rgba(231,76,60,.12)',   border: 'rgba(231,76,60,.28)',   label: 'Cancelled' },
};
const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const PAYMENT_ICON = { cod: '💵', online: '💳', razorpay: '📱' };

export default function AdminOrders() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [toast,    setToast]    = useState({ msg: '', type: 'success' });
  const [search,   setSearch]   = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 2500);
  };

  const load = () => {
    setLoading(true);
    getAllOrders()
      .then(r => setOrders(r.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateStatus(id, status);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));
      showToast(`Status updated → ${status}`);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Update failed', 'error');
    } finally { setUpdating(null); }
  };

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.orderStatus === s).length;
    return acc;
  }, {});

  const filtered = orders
    .filter(o => filter === 'all' || o.orderStatus === filter)
    .filter(o =>
      !search ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div>
      {/* ── Toast ── */}
      {toast.msg && (
        <div className="toast" style={{ borderLeft: `3px solid ${toast.type === 'error' ? 'var(--red)' : 'var(--accent)'}` }}>
          {toast.type === 'error' ? '✕' : '✓'} {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: 3, marginBottom: 5, textTransform: 'uppercase', fontWeight: 700 }}>Manage</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, letterSpacing: 2, color: 'var(--text)', margin: 0 }}>Orders</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{orders.length} total orders</p>
      </div>

      {/* ── Summary Strip ── */}
      <div className="a-stats-grid" style={{ marginBottom: 24 }}>
        <div className="a-stat-card" style={{ '--card-accent': 'var(--accent)' }}>
          <div className="a-stat-icon">📦</div>
          <div className="a-stat-label">Total Orders</div>
          <div className="a-stat-value">{orders.length}</div>
        </div>
        <div className="a-stat-card" style={{ '--card-accent': 'var(--orange)' }}>
          <div className="a-stat-icon">⏳</div>
          <div className="a-stat-label">Pending</div>
          <div className="a-stat-value">{counts.pending || 0}</div>
          <div className="a-stat-sub">Need action</div>
        </div>
        <div className="a-stat-card" style={{ '--card-accent': 'var(--purple)' }}>
          <div className="a-stat-icon">🚚</div>
          <div className="a-stat-label">Shipped</div>
          <div className="a-stat-value">{counts.shipped || 0}</div>
        </div>
        <div className="a-stat-card" style={{ '--card-accent': 'var(--green)' }}>
          <div className="a-stat-icon">✅</div>
          <div className="a-stat-label">Delivered</div>
          <div className="a-stat-value">{counts.delivered || 0}</div>
        </div>
      </div>

      {/* ── Search ── */}
      <div style={{ marginBottom: 16 }}>
        <div className="a-search" style={{ maxWidth: 360 }}>
          <span className="a-search-icon">🔍</span>
          <input
            className="a-search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or order ID…"
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', paddingRight:12, fontSize:16 }}>×</button>
          )}
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <FilterTab label="All" count={orders.length} active={filter === 'all'} color="var(--accent)" onClick={() => setFilter('all')} />
        {STATUSES.map(s => (
          <FilterTab key={s} label={STATUS_CONFIG[s].label} count={counts[s] || 0}
            active={filter === s} color={STATUS_CONFIG[s].color} onClick={() => setFilter(s)} />
        ))}
      </div>

      {/* ── Orders List ── */}
      {loading ? (
        <div className="a-panel">
          <div className="a-spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="a-panel">
          <div className="a-empty">
            <div className="a-empty-icon">📦</div>
            <div className="a-empty-title">No {filter !== 'all' ? filter : ''} orders found</div>
            <div className="a-empty-sub">
              {filter !== 'all'
                ? <button className="a-btn a-btn-outline a-btn-sm" onClick={() => setFilter('all')}>Show all orders</button>
                : 'Orders will appear here once customers start buying'
              }
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(order => {
            const cfg       = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
            const isOpen    = expanded === order._id;
            const isUpdating = updating === order._id;

            return (
              <div key={order._id} className="a-panel" style={{ border: `1px solid ${isOpen ? 'rgba(200,169,110,.35)' : 'var(--a-border)'}`, transition: 'border-color .2s' }}>

                {/* ── Order Row (header) ── */}
                <div
                  onClick={() => setExpanded(isOpen ? null : order._id)}
                  style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', cursor: 'pointer' }}
                >
                  {/* ID */}
                  <div style={{ minWidth: 100 }}>
                    <div className="a-stat-label" style={{ marginBottom: 3 }}>Order ID</div>
                    <div className="a-table-id">#{order._id.slice(-8).toUpperCase()}</div>
                  </div>

                  {/* Customer */}
                  <div style={{ flex: 1, minWidth: 130 }}>
                    <div className="a-stat-label" style={{ marginBottom: 3 }}>Customer</div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{order.user?.name || 'Guest'}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{order.user?.email}</div>
                  </div>

                  {/* Amount */}
                  <div style={{ minWidth: 90 }}>
                    <div className="a-stat-label" style={{ marginBottom: 3 }}>Amount</div>
                    <div className="a-table-amount">₹{order.total?.toLocaleString()}</div>
                  </div>

                  {/* Items */}
                  <div style={{ minWidth: 60, textAlign: 'center' }}>
                    <div className="a-stat-label" style={{ marginBottom: 3 }}>Items</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)' }}>{order.items?.length || 0}</div>
                  </div>

                  {/* Payment */}
                  <div style={{ minWidth: 80 }}>
                    <div className="a-stat-label" style={{ marginBottom: 3 }}>Payment</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                      {PAYMENT_ICON[order.paymentMethod] || '💳'} {order.paymentMethod?.toUpperCase()}
                    </div>
                  </div>

                  {/* Date */}
                  <div style={{ minWidth: 70 }}>
                    <div className="a-stat-label" style={{ marginBottom: 3 }}>Date</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </div>
                  </div>

                  {/* Status dropdown */}
                  <div onClick={e => e.stopPropagation()}>
                    <select
                      className="a-select"
                      value={order.orderStatus}
                      onChange={e => handleStatus(order._id, e.target.value)}
                      disabled={isUpdating}
                      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border, fontWeight: 700, fontSize: 12, opacity: isUpdating ? .6 : 1 }}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s} style={{ background: 'var(--card)', color: 'var(--text)' }}>
                          {STATUS_CONFIG[s].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Expand chevron */}
                  <div style={{ color: 'var(--muted)', fontSize: 12, marginLeft: 'auto', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                    ▼
                  </div>
                </div>

                {/* ── Expanded Panel ── */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--a-border)', padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                    {/* Items list */}
                    <div>
                      <div className="a-stat-label" style={{ marginBottom: 12 }}>Items Ordered</div>
                      {order.items?.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--a-border)' }}>
                          <div style={{
                            width: 44, height: 50, background: 'var(--card2)',
                            borderRadius: 7, overflow: 'hidden', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid var(--a-border)', fontSize: 18,
                          }}>
                            {item.image
                              ? <img src={item.image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                              : '👖'
                            }
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.name}</div>
                            <div style={{ marginTop: 4, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                              <span className="a-tag">Size: {item.size}</span>
                              <span className="a-tag">Color: {item.color}</span>
                              <span className="a-tag">Qty: {item.quantity}</span>
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}

                      {/* Order total summary */}
                      <div style={{ marginTop: 12, padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, color: 'var(--muted)' }}>Order Total</span>
                        <span className="a-table-amount">₹{order.total?.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Right column */}
                    <div>
                      {/* Shipping address */}
                      <div className="a-stat-label" style={{ marginBottom: 10 }}>Shipping Address</div>
                      <div style={{ background: 'var(--card2)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--a-border)', marginBottom: 20, lineHeight: 1.8 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>
                          {order.shippingAddress?.fullName}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text2)' }}>{order.shippingAddress?.address}</div>
                        <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                          {order.shippingAddress?.city} — {order.shippingAddress?.pincode}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                          📞 {order.shippingAddress?.phone}
                        </div>
                      </div>

                      {/* Quick status buttons */}
                      <div className="a-stat-label" style={{ marginBottom: 10 }}>Update Status</div>
                      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                        {STATUSES.map(s => {
                          const scfg     = STATUS_CONFIG[s];
                          const isActive = order.orderStatus === s;
                          return (
                            <button
                              key={s}
                              disabled={isUpdating || isActive}
                              onClick={() => handleStatus(order._id, s)}
                              className="a-btn a-btn-sm"
                              style={{
                                background:   isActive ? scfg.bg  : 'transparent',
                                color:        isActive ? scfg.color : 'var(--muted)',
                                borderColor:  isActive ? scfg.border : 'var(--a-border)',
                                border:       '1px solid',
                                opacity:      isUpdating ? .6 : 1,
                                cursor:       isActive ? 'default' : 'pointer',
                                fontWeight:   isActive ? 700 : 500,
                              }}
                            >
                              {scfg.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Filter Tab ── */
function FilterTab({ label, count, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 16px', borderRadius: 20, cursor: 'pointer',
        fontSize: 12, fontWeight: 600,
        border:      `1px solid ${active ? color : 'var(--a-border)'}`,
        background:  active ? `${color}18` : 'transparent',
        color:       active ? color : 'var(--muted)',
        transition:  'all .15s',
      }}
    >
      {label} <span style={{ opacity: .7 }}>({count})</span>
    </button>
  );
}

// import { useState, useEffect } from 'react';
// import { getAllOrders, updateStatus } from '../../services/api';

// const STATUS_COLORS = {
//   pending: '#f39c12', confirmed: '#3498db',
//   shipped: '#9b59b6', delivered: '#27ae60', cancelled: '#e74c3c',
// };
// const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

// export default function AdminOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all');
//   const [expanded, setExpanded] = useState(null);
//   const [updating, setUpdating] = useState(null);
//   const [toast, setToast] = useState('');

//   const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

//   const load = () => {
//     setLoading(true);
//     getAllOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
//   };

//   useEffect(() => { load(); }, []);

//   const handleStatus = async (id, status) => {
//     setUpdating(id);
//     try {
//       await updateStatus(id, status);
//       setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));
//       showToast(`✅ Status updated to "${status}"`);
//     } catch { showToast('❌ Update failed'); }
//     finally { setUpdating(null); }
//   };

//   const filtered = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

//   const counts = STATUSES.reduce((acc, s) => { acc[s] = orders.filter(o => o.orderStatus === s).length; return acc; }, {});

//   return (
//     <div>
//       {toast && <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0d0d18', border: '1px solid #c8a96e', color: '#f0f0f0', padding: '12px 20px', borderRadius: 10, zIndex: 9999, fontSize: 14 }}>{toast}</div>}

//       {/* Header */}
//       <div style={{ marginBottom: 28 }}>
//         <div style={{ fontSize: 11, color: '#c8a96e', letterSpacing: 3, marginBottom: 4 }}>MANAGE</div>
//         <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 38, letterSpacing: 2, color: '#f0f0f0', margin: 0 }}>Orders</h1>
//       </div>

//       {/* Filter Tabs */}
//       <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
//         <button onClick={() => setFilter('all')} style={{ padding: '8px 18px', borderRadius: 20, border: `1px solid ${filter === 'all' ? '#c8a96e' : '#1a1a2e'}`, background: filter === 'all' ? 'rgba(200,169,110,0.15)' : 'transparent', color: filter === 'all' ? '#c8a96e' : '#555', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
//           All ({orders.length})
//         </button>
//         {STATUSES.map(s => (
//           <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 18px', borderRadius: 20, border: `1px solid ${filter === s ? STATUS_COLORS[s] : '#1a1a2e'}`, background: filter === s ? STATUS_COLORS[s] + '22' : 'transparent', color: filter === s ? STATUS_COLORS[s] : '#555', cursor: 'pointer', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
//             {s} ({counts[s] || 0})
//           </button>
//         ))}
//       </div>

//       {/* Orders List */}
//       {loading ? (
//         <div style={{ textAlign: 'center', padding: 80, color: '#444' }}>Loading orders...</div>
//       ) : filtered.length === 0 ? (
//         <div style={{ textAlign: 'center', padding: 80, color: '#333' }}>
//           <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
//           <div>No {filter !== 'all' ? filter : ''} orders found.</div>
//         </div>
//       ) : (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//           {filtered.map(order => (
//             <div key={order._id} style={{ background: '#0d0d18', border: `1px solid ${expanded === order._id ? '#c8a96e44' : '#1a1a2e'}`, borderRadius: 14, overflow: 'hidden', transition: 'border 0.2s' }}>
//               {/* Order Row */}
//               <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', cursor: 'pointer' }}
//                 onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
//                 <div style={{ minWidth: 110 }}>
//                   <div style={{ fontSize: 10, color: '#444', marginBottom: 2 }}>ORDER ID</div>
//                   <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#c8a96e' }}>#{order._id.slice(-8).toUpperCase()}</div>
//                 </div>
//                 <div style={{ minWidth: 130, flex: 1 }}>
//                   <div style={{ fontSize: 10, color: '#444', marginBottom: 2 }}>CUSTOMER</div>
//                   <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{order.user?.name || 'Unknown'}</div>
//                   <div style={{ fontSize: 11, color: '#444' }}>{order.user?.email}</div>
//                 </div>
//                 <div style={{ minWidth: 100 }}>
//                   <div style={{ fontSize: 10, color: '#444', marginBottom: 2 }}>TOTAL</div>
//                   <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#c8a96e', letterSpacing: 1 }}>₹{order.total?.toLocaleString()}</div>
//                 </div>
//                 <div style={{ minWidth: 80 }}>
//                   <div style={{ fontSize: 10, color: '#444', marginBottom: 2 }}>PAYMENT</div>
//                   <div style={{ fontSize: 12, color: '#888' }}>{order.paymentMethod}</div>
//                 </div>
//                 <div style={{ minWidth: 80 }}>
//                   <div style={{ fontSize: 10, color: '#444', marginBottom: 2 }}>DATE</div>
//                   <div style={{ fontSize: 12, color: '#888' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
//                 </div>
//                 {/* Status Dropdown */}
//                 <div onClick={e => e.stopPropagation()}>
//                   <select
//                     value={order.orderStatus}
//                     onChange={e => handleStatus(order._id, e.target.value)}
//                     disabled={updating === order._id}
//                     style={{ background: STATUS_COLORS[order.orderStatus] + '22', border: `1px solid ${STATUS_COLORS[order.orderStatus]}55`, color: STATUS_COLORS[order.orderStatus], borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', outline: 'none', textTransform: 'capitalize' }}>
//                     {STATUSES.map(s => <option key={s} value={s} style={{ background: '#0d0d18', color: '#f0f0f0', textTransform: 'capitalize' }}>{s}</option>)}
//                   </select>
//                 </div>
//                 <div style={{ color: '#444', fontSize: 16, marginLeft: 'auto' }}>{expanded === order._id ? '▲' : '▼'}</div>
//               </div>

//               {/* Expanded Details */}
//               {expanded === order._id && (
//                 <div style={{ borderTop: '1px solid #1a1a2e', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
//                   {/* Items */}
//                   <div>
//                     <div style={{ fontSize: 11, color: '#444', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>Items Ordered</div>
//                     {order.items?.map((item, i) => (
//                       <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #0f0f1a' }}>
//                         <div style={{ width: 40, height: 40, background: '#131325', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                           {item.image ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 18 }}>👖</span>}
//                         </div>
//                         <div style={{ flex: 1 }}>
//                           <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f0' }}>{item.name}</div>
//                           <div style={{ fontSize: 11, color: '#555' }}>Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</div>
//                         </div>
//                         <div style={{ color: '#c8a96e', fontWeight: 600, fontSize: 14 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Shipping */}
//                   <div>
//                     <div style={{ fontSize: 11, color: '#444', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>Shipping Address</div>
//                     <div style={{ background: '#131325', borderRadius: 10, padding: 16, fontSize: 13, color: '#888', lineHeight: 2 }}>
//                       <div style={{ color: '#f0f0f0', fontWeight: 600 }}>{order.shippingAddress?.fullName}</div>
//                       <div>{order.shippingAddress?.address}</div>
//                       <div>{order.shippingAddress?.city} - {order.shippingAddress?.pincode}</div>
//                       <div>📞 {order.shippingAddress?.phone}</div>
//                     </div>
//                     <div style={{ marginTop: 16, fontSize: 11, color: '#444', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>Update Status</div>
//                     <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//                       {STATUSES.map(s => (
//                         <button key={s} onClick={() => handleStatus(order._id, s)} disabled={updating === order._id || order.orderStatus === s}
//                           style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${order.orderStatus === s ? STATUS_COLORS[s] : '#1a1a2e'}`, background: order.orderStatus === s ? STATUS_COLORS[s] + '22' : 'transparent', color: order.orderStatus === s ? STATUS_COLORS[s] : '#555', cursor: order.orderStatus === s ? 'default' : 'pointer', fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>
//                           {s}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
