import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS = {
  pending:   { color: '#b07d0e', bg: '#fef9ec', border: '#f5e0a0', label: 'Pending',   icon: '🕐' },
  confirmed: { color: '#1a5fa8', bg: '#edf4fd', border: '#b3d1f5', label: 'Confirmed', icon: '✓'  },
  shipped:   { color: '#6b3fa0', bg: '#f5f0fc', border: '#d5bcf5', label: 'Shipped',   icon: '🚚' },
  delivered: { color: '#2d7a4f', bg: '#edf7f2', border: '#a8dfc0', label: 'Delivered', icon: '✅' },
  cancelled: { color: '#c0392b', bg: '#fef0ee', border: '#f5c0bb', label: 'Cancelled', icon: '✕'  },
};

const STEPS = ['confirmed', 'shipped', 'delivered'];

export default function MyOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const { user }  = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    if (!user) return navigate('/login');
    getMyOrders()
      .then(res => {
        const data = res.data || [];
        setOrders(data);
        if (data.length > 0) setExpanded(data[0]._id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ── LOADING ── */
  if (loading) return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{
        minHeight: '100vh', background: '#faf7f2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16, paddingTop: 64,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e2d9cc', borderTopColor: '#b89b6a', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
        <span style={{ fontSize: 13, letterSpacing: 2, color: '#9a9080' }}>LOADING ORDERS…</span>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        :root {
          --cream:  #faf7f2;
          --beige:  #f0ebe1;
          --sand:   #e2d9cc;
          --ink:    #1c1c1c;
          --ink2:   #4a4a4a;
          --muted:  #9a9080;
          --gold:   #b89b6a;
          --gold2:  #8a7048;
          --white:  #ffffff;
          --border: #e0d8ce;
        }

        .mo-wrap {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          padding-top: 64px;
        }

        /* ── HEADER ── */
        .mo-header {
          background: var(--beige);
          border-bottom: 1px solid var(--border);
          padding: 36px 0 28px;
        }
        .mo-header-inner {
          max-width: 900px; margin: 0 auto; padding: 0 40px;
          display: flex; justify-content: space-between;
          align-items: flex-end; flex-wrap: wrap; gap: 12px;
        }
        .mo-eyebrow {
          font-size: 10px; font-weight: 700;
          letter-spacing: 3.5px; text-transform: uppercase;
          color: var(--gold); margin-bottom: 6px;
        }
        .mo-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 700; color: var(--ink); margin: 0 0 4px;
        }
        .mo-sub { font-size: 13px; color: var(--muted); }

        /* ── STATS STRIP ── */
        .mo-stats {
          max-width: 900px; margin: 0 auto;
          padding: 20px 40px;
          display: flex; gap: 0;
          border-bottom: 1px solid var(--border);
        }
        .mo-stat {
          flex: 1; text-align: center;
          padding: 12px 0;
          border-right: 1px solid var(--border);
        }
        .mo-stat:last-child { border-right: none; }
        .mo-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; color: var(--ink); letter-spacing: 1px;
        }
        .mo-stat-lbl {
          font-size: 10px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: var(--muted); margin-top: 2px;
        }

        /* ── BODY ── */
        .mo-body {
          max-width: 900px; margin: 0 auto;
          padding: 28px 40px 64px;
          display: flex; flex-direction: column; gap: 14px;
        }

        /* ── ORDER CARD ── */
        .order-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          transition: box-shadow .2s;
        }
        .order-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,.07); }

        /* Card header */
        .order-head {
          padding: 16px 24px;
          background: var(--beige);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }
        .order-head-left {
          display: flex; align-items: center; gap: 20px;
          flex-wrap: wrap;
        }
        .order-id-label { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 3px; }
        .order-id-val   { font-family: monospace; font-size: 13px; font-weight: 600; color: var(--gold2); }

        .order-meta-group { }
        .order-meta-label { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 3px; }
        .order-meta-val   { font-size: 13px; color: var(--ink2); font-weight: 500; }

        .order-total-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px; color: var(--ink); letter-spacing: 1px;
        }

        /* Status pill */
        .status-pill {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px; font-weight: 700;
          letter-spacing: .8px; text-transform: capitalize;
          display: flex; align-items: center; gap: 5px;
          border: 1px solid;
          flex-shrink: 0;
        }

        /* Expand toggle */
        .expand-icon {
          font-size: 14px; color: var(--muted);
          transition: transform .25s;
          flex-shrink: 0;
        }
        .expand-icon.open { transform: rotate(180deg); }

        /* Progress tracker */
        .progress-track {
          padding: 18px 24px;
          border-bottom: 1px solid var(--border);
          background: var(--white);
        }
        .progress-steps {
          display: flex; align-items: center;
        }
        .prog-step {
          display: flex; flex-direction: column;
          align-items: center; flex: 1;
          text-align: center;
        }
        .prog-dot {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700;
          border: 2px solid var(--border);
          background: var(--white);
          margin-bottom: 6px;
          transition: all .3s;
          z-index: 1;
        }
        .prog-dot.done   { background: #2d7a4f; border-color: #2d7a4f; color: #fff; }
        .prog-dot.active { background: var(--ink); border-color: var(--ink); color: #fff; }
        .prog-dot.future { color: var(--muted); }
        .prog-label { font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
        .prog-label.done   { color: #2d7a4f; }
        .prog-label.active { color: var(--ink); }
        .prog-line {
          flex: 1; height: 2px;
          background: var(--border);
          margin-bottom: 22px;
          position: relative; overflow: hidden;
        }
        .prog-line.filled::after {
          content: '';
          position: absolute; inset: 0;
          background: #2d7a4f;
        }

        /* Items */
        .order-items { padding: 0 24px; }
        .order-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid var(--beige);
        }
        .order-item:last-child { border-bottom: none; }
        .item-thumb {
          width: 56px; height: 64px;
          background: var(--beige);
          border-radius: 7px; overflow: hidden;
          flex-shrink: 0; border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
        }
        .item-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .item-name  { font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
        .item-tags  { display: flex; flex-wrap: wrap; gap: 5px; }
        .item-tag   {
          font-size: 10px; padding: 2px 7px;
          background: var(--beige); border: 1px solid var(--border);
          border-radius: 3px; color: var(--ink2); font-weight: 500;
        }
        .item-price { margin-left: auto; font-size: 14px; font-weight: 700; color: var(--ink); flex-shrink: 0; }

        /* Shipping footer */
        .order-foot {
          padding: 12px 24px;
          background: var(--beige);
          border-top: 1px solid var(--border);
          font-size: 12px; color: var(--muted);
          display: flex; align-items: center; gap: 8px;
        }

        /* Empty */
        .mo-empty {
          text-align: center; padding: 80px 20px;
        }
        .mo-empty-icon  { font-size: 60px; margin-bottom: 20px; }
        .mo-empty-title { font-family: 'Playfair Display',serif; font-size: 24px; font-weight:700; color: var(--ink); margin-bottom: 10px; }
        .mo-empty-sub   { font-size: 14px; color: var(--muted); margin-bottom: 28px; }
        .mo-shop-btn {
          display: inline-block;
          background: var(--ink); color: #fff;
          padding: 13px 32px; text-decoration: none;
          font-size: 13px; font-weight: 700;
          letter-spacing: 2px; border-radius: 5px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 700px) {
          .mo-header-inner { padding: 0 16px; }
          .mo-stats        { padding: 14px 16px; }
          .mo-body         { padding: 20px 16px 48px; }
          .order-head      { padding: 14px 16px; }
          .order-head-left { gap: 14px; }
          .progress-track  { padding: 14px 16px; }
          .order-items     { padding: 0 16px; }
          .order-foot      { padding: 10px 16px; }
          .prog-label      { font-size: 9px; }
        }
        @media (max-width: 460px) {
          .order-head-left { flex-direction: column; align-items: flex-start; gap: 8px; }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&family=Bebas+Neue&display=swap" rel="stylesheet" />

      <div className="mo-wrap">

        {/* ── HEADER ── */}
        <div className="mo-header">
          <div className="mo-header-inner">
            <div>
              <div className="mo-eyebrow">Order History</div>
              <h1 className="mo-title">My Orders</h1>
              <p className="mo-sub">Welcome back, {user?.name}!</p>
            </div>
            <Link to="/shop" style={{
              background: 'var(--ink)', color: '#fff',
              padding: '11px 24px', textDecoration: 'none',
              fontSize: '12px', fontWeight: 700,
              letterSpacing: '1.5px', borderRadius: '5px',
              whiteSpace: 'nowrap',
            }}>+ Shop More</Link>
          </div>
        </div>

        {/* ── STATS ── */}
        {orders.length > 0 && (() => {
          const delivered  = orders.filter(o => o.orderStatus === 'delivered').length;
          const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);
          return (
            <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
              <div className="mo-stats">
                {[
                  [orders.length,              'Total Orders'],
                  [delivered,                  'Delivered'],
                  [`₹${totalSpent.toLocaleString()}`, 'Total Spent'],
                ].map(([val, lbl]) => (
                  <div className="mo-stat" key={lbl}>
                    <div className="mo-stat-num">{val}</div>
                    <div className="mo-stat-lbl">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── BODY ── */}
        <div className="mo-body">
          {orders.length === 0 ? (
            <div className="mo-empty">
              <div className="mo-empty-icon">📦</div>
              <div className="mo-empty-title">No Orders Yet</div>
              <div className="mo-empty-sub">You haven't placed any orders yet. Start exploring!</div>
              <Link to="/shop" className="mo-shop-btn">Browse Collection</Link>
            </div>
          ) : orders.map(order => {
            const st      = STATUS[order.orderStatus] || STATUS.pending;
            const isOpen  = expanded === order._id;
            const stepIdx = STEPS.indexOf(order.orderStatus);
            const isCancelled = order.orderStatus === 'cancelled';

            return (
              <div className="order-card" key={order._id}>

                {/* ── Card Header (clickable) ── */}
                <div className="order-head" onClick={() => setExpanded(isOpen ? null : order._id)}>
                  <div className="order-head-left">
                    <div>
                      <div className="order-id-label">Order ID</div>
                      <div className="order-id-val">#{order._id.slice(-8).toUpperCase()}</div>
                    </div>
                    <div className="order-meta-group">
                      <div className="order-meta-label">Date</div>
                      <div className="order-meta-val">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                      </div>
                    </div>
                    <div className="order-meta-group">
                      <div className="order-meta-label">Payment</div>
                      <div className="order-meta-val">{order.paymentMethod}</div>
                    </div>
                    <div className="order-meta-group">
                      <div className="order-meta-label">Total</div>
                      <div className="order-total-val">₹{order.total?.toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span
                      className="status-pill"
                      style={{ color: st.color, background: st.bg, borderColor: st.border }}
                    >
                      {st.icon} {st.label}
                    </span>
                    <span className={`expand-icon${isOpen ? ' open' : ''}`}>▼</span>
                  </div>
                </div>

                {/* ── Progress Tracker ── */}
                {isOpen && !isCancelled && (
                  <div className="progress-track">
                    <div className="progress-steps">
                      {STEPS.map((step, si) => {
                        const isDone   = stepIdx > si;
                        const isActive = stepIdx === si;
                        const cls = isDone ? 'done' : isActive ? 'active' : 'future';
                        return (
                          <div key={step} style={{ display:'flex', alignItems:'center', flex: si < STEPS.length - 1 ? '1' : '0' }}>
                            <div className="prog-step" style={{ flex: 'none', minWidth: 60 }}>
                              <div className={`prog-dot ${cls}`}>
                                {isDone ? '✓' : si + 1}
                              </div>
                              <div className={`prog-label ${cls}`}>{step}</div>
                            </div>
                            {si < STEPS.length - 1 && (
                              <div className={`prog-line${isDone ? ' filled' : ''}`} style={{ flex:1 }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Items (expanded) ── */}
                {isOpen && (
                  <div className="order-items">
                    {order.items?.map((item, i) => (
                      <div className="order-item" key={i}>
                        <div className="item-thumb">
                          {item.image
                            ? <img src={item.image} alt={item.name} />
                            : '👖'
                          }
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div className="item-name">{item.name}</div>
                          <div className="item-tags">
                            {item.size  && <span className="item-tag">Size: {item.size}</span>}
                            {item.color && <span className="item-tag">Color: {item.color}</span>}
                            <span className="item-tag">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="item-price">₹{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Shipping Footer (expanded) ── */}
                {isOpen && order.shippingAddress && (
                  <div className="order-foot">
                    <span>📦</span>
                    <span>
                      Delivering to <strong style={{ color:'var(--ink2)' }}>{order.shippingAddress.fullName}</strong>,&nbsp;
                      {order.shippingAddress.address}, {order.shippingAddress.city} – {order.shippingAddress.pincode}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getMyOrders } from '../services/api';
// import { useAuth } from '../context/AuthContext';

// const STATUS_COLORS = {
//   pending: '#f39c12', confirmed: '#3498db',
//   shipped: '#9b59b6', delivered: '#27ae60', cancelled: '#e74c3c',
// };

// export default function MyOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!user) return navigate('/login');
//     getMyOrders().then(res => setOrders(res.data)).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div className="page"><div className="spinner" /></div>;

//   return (
//     <div className="page" style={{ background: '#0a0a0a' }}>
//       <div className="container" style={{ padding: '40px 20px' }}>
//         <h1 className="section-title" style={{ marginBottom: 8 }}>My Orders</h1>
//         <p style={{ color: '#555', marginBottom: 40, fontSize: 14 }}>Hello, {user?.name}! Here are all your orders.</p>

//         {orders.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: 80, color: '#444' }}>
//             <div style={{ fontSize: 60, marginBottom: 20 }}>📦</div>
//             <h3 style={{ marginBottom: 12 }}>No orders yet</h3>
//             <button onClick={() => navigate('/shop')} className="btn btn-primary">Start Shopping</button>
//           </div>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
//             {orders.map(order => (
//               <div key={order._id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, overflow: 'hidden' }}>
//                 {/* Order Header */}
//                 <div style={{ padding: '16px 24px', background: '#161616', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid #1e1e1e' }}>
//                   <div>
//                     <div style={{ fontSize: 11, color: '#555', marginBottom: 2, letterSpacing: 1 }}>ORDER ID</div>
//                     <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#c8a96e' }}>#{order._id.slice(-8).toUpperCase()}</div>
//                   </div>
//                   <div>
//                     <div style={{ fontSize: 11, color: '#555', marginBottom: 2 }}>DATE</div>
//                     <div style={{ fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
//                   </div>
//                   <div>
//                     <div style={{ fontSize: 11, color: '#555', marginBottom: 2 }}>PAYMENT</div>
//                     <div style={{ fontSize: 13 }}>{order.paymentMethod}</div>
//                   </div>
//                   <div>
//                     <div style={{ fontSize: 11, color: '#555', marginBottom: 2 }}>TOTAL</div>
//                     <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#c8a96e', letterSpacing: 1 }}>₹{order.total?.toLocaleString()}</div>
//                   </div>
//                   <span style={{
//                     background: (STATUS_COLORS[order.orderStatus] || '#888') + '22',
//                     color: STATUS_COLORS[order.orderStatus] || '#888',
//                     border: `1px solid ${STATUS_COLORS[order.orderStatus] || '#888'}55`,
//                     padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
//                     textTransform: 'capitalize', letterSpacing: 1,
//                   }}>{order.orderStatus}</span>
//                 </div>

//                 {/* Items */}
//                 <div style={{ padding: '16px 24px' }}>
//                   {order.items?.map((item, i) => (
//                     <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
//                       <div style={{ width: 52, height: 52, background: '#1a1a1a', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                         {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>👖</span>}
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <div style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</div>
//                         <div style={{ fontSize: 12, color: '#555' }}>Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</div>
//                       </div>
//                       <div style={{ color: '#c8a96e', fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Shipping */}
//                 <div style={{ padding: '12px 24px', background: '#0d0d0d', fontSize: 12, color: '#555' }}>
//                   📦 Delivering to: {order.shippingAddress?.fullName}, {order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }