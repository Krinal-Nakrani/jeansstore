import { useState, useEffect } from 'react';
import { getAllOrders, updateStatus } from '../../services/api';

/* ── Light theme tokens ── */
const T = {
  bg:        '#faf7f2',
  beige:     '#f0ebe1',
  sand:      '#e2d9cc',
  card:      '#ffffff',
  border:    '#e0d8ce',
  ink:       '#1c1c1c',
  ink2:      '#4a4a4a',
  muted:     '#9a9080',
  gold:      '#b89b6a',
  gold2:     '#8a7048',
  red:       '#c0392b',   redBg:    '#fef0ee', redBdr:    '#f5c0bb',
  green:     '#2d7a4f',   greenBg:  '#edf7f2', greenBdr:  '#a8dfc0',
  blue:      '#1a5fa8',   blueBg:   '#edf4fd', blueBdr:   '#b3d1f5',
  purple:    '#6b3fa0',   purpleBg: '#f5f0fc', purpleBdr: '#d5bcf5',
  orange:    '#b07d0e',   orangeBg: '#fef9ec', orangeBdr: '#f5e0a0',
};

const STATUS_CFG = {
  pending:   { color: T.orange, bg: T.orangeBg, border: T.orangeBdr, label: 'Pending'   },
  confirmed: { color: T.blue,   bg: T.blueBg,   border: T.blueBdr,   label: 'Confirmed' },
  shipped:   { color: T.purple, bg: T.purpleBg, border: T.purpleBdr, label: 'Shipped'   },
  delivered: { color: T.green,  bg: T.greenBg,  border: T.greenBdr,  label: 'Delivered' },
  cancelled: { color: T.red,    bg: T.redBg,    border: T.redBdr,    label: 'Cancelled' },
};
const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const PAY_ICON = { cod: '💵', online: '💳', razorpay: '📱' };

/* ── Stat card ── */
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '18px 20px', borderTop: `3px solid ${color}`, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>{label}</div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 34, letterSpacing: 1, color: T.ink, lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{ fontSize: 24, opacity: .45 }}>{icon}</div>
      </div>
    </div>
  );
}

/* ── Filter tab ── */
function FilterTab({ label, count, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 16px', borderRadius: 20, cursor: 'pointer',
      fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
      border:     `1px solid ${active ? color : T.border}`,
      background: active ? `${color}18` : T.card,
      color:      active ? color : T.muted,
      transition: 'all .15s',
    }}>
      {label} <span style={{ opacity: .65 }}>({count})</span>
    </button>
  );
}

/* ── Main ── */
export default function AdminOrders() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [search,   setSearch]   = useState('');
  const [toast,    setToast]    = useState({ msg: '', ok: true });

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg: '', ok: true }), 2500);
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
      showToast(`Status → ${status}`);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Update failed', false);
    } finally { setUpdating(null); }
  };

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.orderStatus === s).length;
    return acc;
  }, {});

  const filtered = orders
    .filter(o => filter === 'all' || o.orderStatus === filter)
    .filter(o => !search ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div style={{ fontFamily: "'DM Sans','Inter',sans-serif", color: T.ink }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      {/* Toast */}
      {toast.msg && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, background: T.card, borderLeft: `3px solid ${toast.ok ? T.gold : T.red}`, border: `1px solid ${toast.ok ? T.border : T.redBdr}`, color: T.ink, padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, animation: 'fadeUp .3s ease', boxShadow: '0 8px 24px rgba(0,0,0,.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: toast.ok ? T.gold : T.red }}>{toast.ok ? '✓' : '✕'}</span> {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: T.gold, letterSpacing: 3, marginBottom: 5, textTransform: 'uppercase', fontWeight: 700 }}>Manage</div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, letterSpacing: 2, color: T.ink, margin: 0 }}>Orders</h1>
        <p style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{orders.length} total orders</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon="📦" label="Total Orders" value={orders.length}        sub=""             color={T.gold}   />
        <StatCard icon="⏳" label="Pending"      value={counts.pending || 0}  sub="Need action"  color={T.orange} />
        <StatCard icon="🚚" label="Shipped"      value={counts.shipped || 0}  sub=""             color={T.purple} />
        <StatCard icon="✅" label="Delivered"    value={counts.delivered || 0} sub=""            color={T.green}  />
      </div>

      {/* Search */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 8, overflow: 'hidden', maxWidth: 380, transition: 'border-color .2s' }}
          onFocusCapture={e => e.currentTarget.style.borderColor = T.gold}
          onBlurCapture={e => e.currentTarget.style.borderColor = T.border}>
          <span style={{ padding: '0 12px', color: T.muted }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or order ID…"
            style={{ flex: 1, background: 'transparent', border: 'none', color: T.ink, padding: '10px 0', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', paddingRight: 12, fontSize: 18 }}>×</button>}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <FilterTab label="All" count={orders.length} active={filter === 'all'} color={T.gold2} onClick={() => setFilter('all')} />
        {STATUSES.map(s => (
          <FilterTab key={s} label={STATUS_CFG[s].label} count={counts[s] || 0}
            active={filter === s} color={STATUS_CFG[s].color} onClick={() => setFilter(s)} />
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 60, textAlign: 'center' }}>
          <div style={{ width: 34, height: 34, border: `3px solid ${T.sand}`, borderTopColor: T.gold, borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '60px 20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: .3 }}>📦</div>
          <div style={{ fontSize: 14, color: T.ink2, fontWeight: 600, marginBottom: 8 }}>No {filter !== 'all' ? filter : ''} orders found</div>
          {filter !== 'all' && (
            <button onClick={() => setFilter('all')} style={{ background: T.beige, color: T.gold2, border: `1px solid ${T.border}`, padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 12 }}>
              Show all orders
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(order => {
            const cfg      = STATUS_CFG[order.orderStatus] || STATUS_CFG.pending;
            const isOpen   = expanded === order._id;
            const isUpd    = updating === order._id;

            return (
              <div key={order._id} style={{
                background: T.card,
                border: `1px solid ${isOpen ? T.gold : T.border}`,
                borderRadius: 12, overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,.04)',
                transition: 'border-color .2s',
              }}>

                {/* Order row */}
                <div onClick={() => setExpanded(isOpen ? null : order._id)}
                  style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', cursor: 'pointer' }}
                  onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = T.bg; }}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                  {/* Order ID */}
                  <div style={{ minWidth: 100 }}>
                    <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>Order ID</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, color: T.gold2, fontWeight: 700 }}>#{order._id.slice(-8).toUpperCase()}</div>
                  </div>

                  {/* Customer */}
                  <div style={{ flex: 1, minWidth: 130 }}>
                    <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>Customer</div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: T.ink }}>{order.user?.name || 'Guest'}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{order.user?.email}</div>
                  </div>

                  {/* Amount */}
                  <div style={{ minWidth: 90 }}>
                    <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>Amount</div>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: T.ink, letterSpacing: 1 }}>₹{order.total?.toLocaleString()}</div>
                  </div>

                  {/* Items */}
                  <div style={{ minWidth: 50 }}>
                    <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>Items</div>
                    <div style={{ fontSize: 13, color: T.ink2 }}>{order.items?.length || 0}</div>
                  </div>

                  {/* Payment */}
                  <div style={{ minWidth: 80 }}>
                    <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>Payment</div>
                    <div style={{ fontSize: 12, color: T.ink2 }}>{PAY_ICON[order.paymentMethod] || '💳'} {order.paymentMethod?.toUpperCase()}</div>
                  </div>

                  {/* Date */}
                  <div style={{ minWidth: 70 }}>
                    <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>Date</div>
                    <div style={{ fontSize: 12, color: T.muted }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</div>
                  </div>

                  {/* Status dropdown */}
                  <div onClick={e => e.stopPropagation()}>
                    <select value={order.orderStatus} onChange={e => handleStatus(order._id, e.target.value)} disabled={isUpd}
                      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', outline: 'none', fontFamily: 'inherit', opacity: isUpd ? .6 : 1 }}>
                      {STATUSES.map(s => <option key={s} value={s} style={{ background: T.card, color: T.ink }}>{STATUS_CFG[s].label}</option>)}
                    </select>
                  </div>

                  {/* Chevron */}
                  <div style={{ color: T.muted, fontSize: 11, marginLeft: 'auto', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>▼</div>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div style={{ borderTop: `1px solid ${T.border}`, padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, background: T.bg }}>

                    {/* Items */}
                    <div>
                      <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Items Ordered</div>
                      {order.items?.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${T.border}` }}>
                          <div style={{ width: 44, height: 50, background: T.sand, borderRadius: 7, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${T.border}`, fontSize: 18 }}>
                            {item.image ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👖'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{item.name}</div>
                            <div style={{ marginTop: 4, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                              {[`Size: ${item.size}`, `Color: ${item.color}`, `Qty: ${item.quantity}`].map(tag => (
                                <span key={tag} style={{ background: T.beige, border: `1px solid ${T.border}`, color: T.ink2, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{tag}</span>
                              ))}
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: T.gold2 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                      ))}
                      <div style={{ marginTop: 12, padding: '10px 0', display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${T.border}` }}>
                        <span style={{ fontSize: 13, color: T.muted, fontWeight: 600 }}>Order Total</span>
                        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: T.ink, letterSpacing: 1 }}>₹{order.total?.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Right: address + status */}
                    <div>
                      <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Shipping Address</div>
                      <div style={{ background: T.card, borderRadius: 10, padding: '14px 16px', border: `1px solid ${T.border}`, marginBottom: 20, lineHeight: 1.9 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: T.ink }}>{order.shippingAddress?.fullName}</div>
                        <div style={{ fontSize: 13, color: T.ink2 }}>{order.shippingAddress?.address}</div>
                        <div style={{ fontSize: 13, color: T.ink2 }}>{order.shippingAddress?.city} — {order.shippingAddress?.pincode}</div>
                        <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>📞 {order.shippingAddress?.phone}</div>
                      </div>

                      <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Update Status</div>
                      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                        {STATUSES.map(s => {
                          const sc = STATUS_CFG[s];
                          const isActive = order.orderStatus === s;
                          return (
                            <button key={s} disabled={isUpd || isActive} onClick={() => handleStatus(order._id, s)}
                              style={{ padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: isActive ? 700 : 500, fontFamily: 'inherit', cursor: isActive ? 'default' : 'pointer', border: `1px solid ${isActive ? sc.border : T.border}`, background: isActive ? sc.bg : T.card, color: isActive ? sc.color : T.muted, opacity: isUpd ? .6 : 1, transition: 'all .15s' }}>
                              {sc.label}
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
