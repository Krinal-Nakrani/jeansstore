import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders } from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts';

/* ─────────────────────────────────────────
   Design tokens  (shared across admin files)
───────────────────────────────────────── */
const T = {
  black:   '#0a0a0a',
  dark:    '#111111',
  card:    '#161620',
  card2:   '#1e1e2e',
  border:  '#2a2a3e',
  accent:  '#c8a96e',
  accent2: '#e8c98e',
  text:    '#f0f0f0',
  text2:   '#aaaaaa',
  muted:   '#55556a',
  red:     '#e74c3c',
  green:   '#27ae60',
  blue:    '#3498db',
  purple:  '#9b59b6',
  orange:  '#f39c12',
};

const STATUS_CFG = {
  pending:   { color: T.orange, bg: 'rgba(243,156,18,.12)',  border: 'rgba(243,156,18,.3)'  },
  confirmed: { color: T.blue,   bg: 'rgba(52,152,219,.12)',  border: 'rgba(52,152,219,.3)'  },
  shipped:   { color: T.purple, bg: 'rgba(155,89,182,.12)', border: 'rgba(155,89,182,.3)'  },
  delivered: { color: T.green,  bg: 'rgba(39,174,96,.12)',   border: 'rgba(39,174,96,.3)'   },
  cancelled: { color: T.red,    bg: 'rgba(231,76,60,.12)',   border: 'rgba(231,76,60,.3)'   },
};

/* ─────────────────────────────────────────
   Tiny reusable pieces
───────────────────────────────────────── */
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: 12, padding: '20px 22px',
      borderLeft: `3px solid ${color}`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ fontSize: 28, position: 'absolute', top: 16, right: 16, opacity: .22 }}>{icon}</div>
      <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 1, color: T.text, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: T.muted, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

function Panel({ children, style = {} }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden', ...style }}>
      {children}
    </div>
  );
}

function PanelHead({ title, right }) {
  return (
    <div style={{ padding: '15px 20px', borderBottom: `1px solid ${T.border}`, background: T.card2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{title}</span>
      {right}
    </div>
  );
}

/* ─────────────────────────────────────────
   Dashboard
───────────────────────────────────────── */
export default function AdminDashboard() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders()
      .then(r => setOrders(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const revenue   = orders.filter(o => o.orderStatus !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
  const pending   = orders.filter(o => o.orderStatus === 'pending').length;
  const delivered = orders.filter(o => o.orderStatus === 'delivered').length;
  const cancelled = orders.filter(o => o.orderStatus === 'cancelled').length;

  const byDate = {};
  orders.forEach(o => {
    const d = new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    if (!byDate[d]) byDate[d] = { date: d, orders: 0, revenue: 0 };
    byDate[d].orders++;
    byDate[d].revenue += o.total || 0;
  });
  const chartData = Object.values(byDate).slice(-7);

  const statusCount = {};
  orders.forEach(o => { statusCount[o.orderStatus] = (statusCount[o.orderStatus] || 0) + 1; });

  const tooltipStyle = { background: T.card2, border: `1px solid ${T.border}`, color: T.text, borderRadius: 8, fontSize: 12 };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 14 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 36, height: 36, border: `3px solid ${T.border}`, borderTopColor: T.accent, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      <span style={{ fontSize: 11, color: T.muted, letterSpacing: 2 }}>LOADING…</span>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans','Inter',sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, color: T.accent, letterSpacing: 3, marginBottom: 5, textTransform: 'uppercase', fontWeight: 700 }}>Overview</div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, letterSpacing: 2, color: T.text, margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon="💰" label="Total Revenue" value={`₹${revenue.toLocaleString()}`}  sub="Excl. cancelled"    color={T.accent} />
        <StatCard icon="📦" label="Total Orders"  value={orders.length}                    sub={`${pending} pending`} color={T.blue}   />
        <StatCard icon="✅" label="Delivered"     value={delivered}                        sub="Successfully"      color={T.green}  />
        <StatCard icon="❌" label="Cancelled"     value={cancelled}                        sub="Need review"       color={T.red}    />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* Revenue bar */}
        <Panel>
          <PanelHead title="Revenue — Last 7 Days" right={<span style={{ fontSize: 12, color: T.muted }}>₹{revenue.toLocaleString()} total</span>} />
          <div style={{ padding: 20 }}>
            {chartData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: T.muted }}>
                <div style={{ fontSize: 32, opacity: .35, marginBottom: 8 }}>📊</div>
                <div style={{ fontSize: 13 }}>No data yet — orders will show here</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.card2} />
                  <XAxis dataKey="date" stroke={T.muted} fontSize={11} tickLine={false} />
                  <YAxis stroke={T.muted} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill={T.accent} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        {/* Status breakdown */}
        <Panel>
          <PanelHead title="Order Status" right={<span style={{ fontSize: 12, color: T.muted }}>{orders.length} total</span>} />
          <div style={{ padding: 20 }}>
            {Object.keys(statusCount).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: T.muted, fontSize: 13 }}>No orders yet</div>
            ) : (
              Object.entries(statusCount).map(([status, count]) => {
                const cfg = STATUS_CFG[status] || { color: T.muted };
                return (
                  <div key={status} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 13 }}>
                      <span style={{ color: cfg.color, fontWeight: 600, textTransform: 'capitalize' }}>{status}</span>
                      <span style={{ color: T.muted }}>{count} / {orders.length}</span>
                    </div>
                    <div style={{ background: T.card2, borderRadius: 4, height: 6 }}>
                      <div style={{ background: cfg.color, height: '100%', borderRadius: 4, width: `${(count / orders.length) * 100}%`, transition: 'width .5s' }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Panel>
      </div>

      {/* Orders per day line */}
      {chartData.length > 0 && (
        <Panel style={{ marginBottom: 24 }}>
          <PanelHead title="Orders Per Day" />
          <div style={{ padding: 20 }}>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.card2} />
                <XAxis dataKey="date" stroke={T.muted} fontSize={11} tickLine={false} />
                <YAxis stroke={T.muted} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={v => [v, 'Orders']} />
                <Line type="monotone" dataKey="orders" stroke={T.blue} strokeWidth={2} dot={{ fill: T.blue, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      )}

      {/* Recent orders table */}
      <Panel>
        <PanelHead
          title="Recent Orders"
          right={<Link to="/admin/orders" style={{ fontSize: 12, color: T.accent, textDecoration: 'none', fontWeight: 600 }}>View all →</Link>}
        />
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 20px' }}>
            <div style={{ fontSize: 40, opacity: .35, marginBottom: 12 }}>🚀</div>
            <div style={{ fontSize: 14, color: T.text2, fontWeight: 600, marginBottom: 6 }}>No orders yet</div>
            <div style={{ fontSize: 13, color: T.muted }}>Share your store and watch orders roll in!</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f0f1a' }}>
                  {['Order ID', 'Customer', 'Amount', 'Items', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, borderBottom: `1px solid ${T.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 7).map(order => {
                  const cfg = STATUS_CFG[order.orderStatus] || { color: T.muted, bg: T.card2, border: T.border };
                  return (
                    <tr key={order._id}
                      style={{ borderBottom: `1px solid #12121e`, transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.025)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '13px 18px', fontFamily: 'monospace', fontSize: 12, color: T.accent, fontWeight: 600 }}>
                        #{order._id.slice(-7).toUpperCase()}
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{order.user?.name || 'Guest'}</div>
                        <div style={{ fontSize: 11, color: T.muted }}>{order.user?.email}</div>
                      </td>
                      <td style={{ padding: '13px 18px', fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: T.text, letterSpacing: 1 }}>
                        ₹{order.total?.toLocaleString()}
                      </td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: T.text2 }}>
                        {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'capitalize' }}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td style={{ padding: '13px 18px', fontSize: 12, color: T.muted }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import { getAllOrders } from '../../services/api';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// const STATUS_COLORS = {
//   pending: '#f39c12', confirmed: '#3498db',
//   shipped: '#9b59b6', delivered: '#27ae60', cancelled: '#e74c3c',
// };

// function StatCard({ icon, label, value, sub, color }) {
//   return (
//     <div style={{ background: '#0d0d18', border: '1px solid #1a1a2e', borderRadius: 14, padding: '22px 24px', borderLeft: `3px solid ${color}` }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//         <div>
//           <div style={{ fontSize: 12, color: '#555', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>{label}</div>
//           <div style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f0', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: 1 }}>{value}</div>
//           {sub && <div style={{ fontSize: 12, color: '#444', marginTop: 4 }}>{sub}</div>}
//         </div>
//         <div style={{ fontSize: 32, opacity: 0.7 }}>{icon}</div>
//       </div>
//     </div>
//   );
// }

// export default function AdminDashboard() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getAllOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   const totalRevenue = orders.filter(o => o.orderStatus !== 'cancelled').reduce((s, o) => s + o.total, 0);
//   const pending = orders.filter(o => o.orderStatus === 'pending').length;
//   const delivered = orders.filter(o => o.orderStatus === 'delivered').length;

//   // Chart data — group orders by date
//   const byDate = {};
//   orders.forEach(o => {
//     const date = new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
//     if (!byDate[date]) byDate[date] = { date, orders: 0, revenue: 0 };
//     byDate[date].orders++;
//     byDate[date].revenue += o.total;
//   });
//   const chartData = Object.values(byDate).slice(-7);

//   // Status breakdown
//   const statusCount = {};
//   orders.forEach(o => { statusCount[o.orderStatus] = (statusCount[o.orderStatus] || 0) + 1; });

//   if (loading) return <div style={{ textAlign: 'center', padding: 80, color: '#555' }}>Loading dashboard...</div>;

//   return (
//     <div>
//       {/* Header */}
//       <div style={{ marginBottom: 28 }}>
//         <div style={{ fontSize: 11, color: '#c8a96e', letterSpacing: 3, marginBottom: 4, textTransform: 'uppercase' }}>Overview</div>
//         <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 38, letterSpacing: 2, color: '#f0f0f0', margin: 0 }}>Dashboard</h1>
//       </div>

//       {/* Stat Cards */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
//         <StatCard icon="💰" label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} sub="All time" color="#c8a96e" />
//         <StatCard icon="📦" label="Total Orders" value={orders.length} sub={`${pending} pending`} color="#3498db" />
//         <StatCard icon="✅" label="Delivered" value={delivered} sub="Successfully" color="#27ae60" />
//         <StatCard icon="⏳" label="Pending" value={pending} sub="Need action" color="#f39c12" />
//       </div>

//       {/* Charts Row */}
//       <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }}>
//         {/* Revenue Chart */}
//         <div style={{ background: '#0d0d18', border: '1px solid #1a1a2e', borderRadius: 14, padding: 24 }}>
//           <div style={{ fontWeight: 700, marginBottom: 20, color: '#f0f0f0', fontSize: 14 }}>Revenue (Last 7 Days)</div>
//           {chartData.length === 0 ? (
//             <div style={{ textAlign: 'center', color: '#333', padding: 40 }}>No order data yet</div>
//           ) : (
//             <ResponsiveContainer width="100%" height={200}>
//               <BarChart data={chartData}>
//                 <XAxis dataKey="date" stroke="#333" fontSize={11} />
//                 <YAxis stroke="#333" fontSize={11} />
//                 <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a4e', color: '#f0f0f0', borderRadius: 8 }} />
//                 <Bar dataKey="revenue" fill="#c8a96e" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//         {/* Order Status Breakdown */}
//         <div style={{ background: '#0d0d18', border: '1px solid #1a1a2e', borderRadius: 14, padding: 24 }}>
//           <div style={{ fontWeight: 700, marginBottom: 20, color: '#f0f0f0', fontSize: 14 }}>Order Status</div>
//           {Object.entries(statusCount).length === 0 ? (
//             <div style={{ textAlign: 'center', color: '#333', padding: 40 }}>No orders yet</div>
//           ) : (
//             Object.entries(statusCount).map(([status, count]) => (
//               <div key={status} style={{ marginBottom: 14 }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
//                   <span style={{ color: STATUS_COLORS[status] || '#888', textTransform: 'capitalize', fontWeight: 600 }}>{status}</span>
//                   <span style={{ color: '#888' }}>{count} orders</span>
//                 </div>
//                 <div style={{ background: '#1a1a2e', borderRadius: 4, height: 6 }}>
//                   <div style={{ background: STATUS_COLORS[status] || '#888', height: '100%', borderRadius: 4, width: `${(count / orders.length) * 100}%`, transition: 'width 0.5s' }} />
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Recent Orders Table */}
//       <div style={{ background: '#0d0d18', border: '1px solid #1a1a2e', borderRadius: 14, overflow: 'hidden' }}>
//         <div style={{ padding: '20px 24px', borderBottom: '1px solid #1a1a2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <div style={{ fontWeight: 700, fontSize: 14, color: '#f0f0f0' }}>Recent Orders</div>
//           <a href="/admin/orders" style={{ fontSize: 12, color: '#c8a96e', textDecoration: 'none' }}>View all →</a>
//         </div>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr style={{ borderBottom: '1px solid #1a1a2e' }}>
//               {['Order ID', 'Customer', 'Amount', 'Items', 'Status', 'Date'].map(h => (
//                 <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, color: '#444', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {orders.slice(0, 6).map(order => (
//               <tr key={order._id} style={{ borderBottom: '1px solid #0f0f1a' }}>
//                 <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontSize: 12, color: '#c8a96e' }}>#{order._id.slice(-7).toUpperCase()}</td>
//                 <td style={{ padding: '14px 20px', fontSize: 13, color: '#ccc' }}>{order.user?.name || 'Unknown'}</td>
//                 <td style={{ padding: '14px 20px', fontWeight: 700, color: '#f0f0f0', fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: 1 }}>₹{order.total?.toLocaleString()}</td>
//                 <td style={{ padding: '14px 20px', fontSize: 13, color: '#888' }}>{order.items?.length} item(s)</td>
//                 <td style={{ padding: '14px 20px' }}>
//                   <span style={{ background: (STATUS_COLORS[order.orderStatus] || '#888') + '22', color: STATUS_COLORS[order.orderStatus] || '#888', border: `1px solid ${(STATUS_COLORS[order.orderStatus] || '#888')}44`, padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'capitalize' }}>{order.orderStatus}</span>
//                 </td>
//                 <td style={{ padding: '14px 20px', fontSize: 12, color: '#444' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {orders.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#333' }}>No orders yet. Share your store! 🚀</div>}
//       </div>
//     </div>
//   );
// }
