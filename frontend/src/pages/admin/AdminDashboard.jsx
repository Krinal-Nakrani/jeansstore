import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders } from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, CartesianGrid,
} from 'recharts';

const STATUS_CONFIG = {
  pending:   { color: '#f39c12', bg: '#fef9ec', border: '#f5e0a0', label: 'Pending'   },
  confirmed: { color: '#3498db', bg: '#edf4fd', border: '#b3d1f5', label: 'Confirmed' },
  shipped:   { color: '#9b59b6', bg: '#f5f0fc', border: '#d5bcf5', label: 'Shipped'   },
  delivered: { color: '#27ae60', bg: '#edf7f2', border: '#a8dfc0', label: 'Delivered' },
  cancelled: { color: '#e74c3c', bg: '#fef0ee', border: '#f5c0bb', label: 'Cancelled' },
};

export default function AdminDashboard() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders()
      .then(r => setOrders(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ── Derived stats ── */
  const revenue   = orders.filter(o => o.orderStatus !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
  const pending   = orders.filter(o => o.orderStatus === 'pending').length;
  const delivered = orders.filter(o => o.orderStatus === 'delivered').length;
  const cancelled = orders.filter(o => o.orderStatus === 'cancelled').length;

  /* ── Chart data (last 7 days) ── */
  const byDate = {};
  orders.forEach(o => {
    const d = new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    if (!byDate[d]) byDate[d] = { date: d, orders: 0, revenue: 0 };
    byDate[d].orders++;
    byDate[d].revenue += o.total || 0;
  });
  const chartData = Object.values(byDate).slice(-7);

  /* ── Status breakdown ── */
  const statusCount = {};
  orders.forEach(o => { statusCount[o.orderStatus] = (statusCount[o.orderStatus] || 0) + 1; });

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
      <div className="a-spinner" />
      <span style={{ fontSize: 12, letterSpacing: 2, color: 'var(--muted)' }}>LOADING…</span>
    </div>
  );

  return (
    <div>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: 3, marginBottom: 5, textTransform: 'uppercase', fontWeight: 700 }}>Overview</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, letterSpacing: 2, color: 'var(--text)', margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="a-stats-grid">
        <StatCard icon="💰" label="Total Revenue"  value={`₹${revenue.toLocaleString()}`}  sub="Excl. cancelled"   color="#c8a96e" />
        <StatCard icon="📦" label="Total Orders"   value={orders.length}                    sub={`${pending} pending`} color="#3498db" />
        <StatCard icon="✅" label="Delivered"      value={delivered}                        sub="Successfully"     color="#27ae60" />
        <StatCard icon="❌" label="Cancelled"      value={cancelled}                        sub="Need review"      color="#e74c3c" />
      </div>

      {/* ── Charts Row ── */}
      <div className="a-charts-grid">

        {/* Revenue Bar Chart */}
        <div className="a-panel">
          <div className="a-panel-head">
            <span className="a-panel-title">Revenue — Last 7 Days</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>₹{revenue.toLocaleString()} total</span>
          </div>
          <div className="a-panel-body">
            {chartData.length === 0 ? (
              <div className="a-empty">
                <div className="a-empty-icon">📊</div>
                <div className="a-empty-title">No data yet</div>
                <div className="a-empty-sub">Orders will appear here once placed</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                  <XAxis dataKey="date" stroke="#555" fontSize={11} tickLine={false} />
                  <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1e1e2e', border: '1px solid #2a2a3e', color: '#f0f0f0', borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#c8a96e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="a-panel">
          <div className="a-panel-head">
            <span className="a-panel-title">Order Status</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{orders.length} total</span>
          </div>
          <div className="a-panel-body">
            {Object.keys(statusCount).length === 0 ? (
              <div className="a-empty">
                <div className="a-empty-icon">📋</div>
                <div className="a-empty-sub">No orders yet</div>
              </div>
            ) : (
              Object.entries(statusCount).map(([status, count]) => {
                const cfg = STATUS_CONFIG[status] || { color: '#888', label: status };
                return (
                  <div key={status} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 13 }}>
                      <span style={{ color: cfg.color, fontWeight: 600, textTransform: 'capitalize' }}>{cfg.label}</span>
                      <span style={{ color: 'var(--muted)' }}>{count} / {orders.length}</span>
                    </div>
                    <div className="a-progress-bar">
                      <div className="a-progress-fill" style={{
                        width: `${(count / orders.length) * 100}%`,
                        background: cfg.color,
                      }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Orders Line Chart ── */}
      {chartData.length > 0 && (
        <div className="a-panel" style={{ marginBottom: 24 }}>
          <div className="a-panel-head">
            <span className="a-panel-title">Orders Per Day</span>
          </div>
          <div className="a-panel-body">
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="date" stroke="#555" fontSize={11} tickLine={false} />
                <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#1e1e2e', border: '1px solid #2a2a3e', color: '#f0f0f0', borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [v, 'Orders']}
                />
                <Line type="monotone" dataKey="orders" stroke="#3498db" strokeWidth={2} dot={{ fill: '#3498db', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Recent Orders Table ── */}
      <div className="a-panel">
        <div className="a-panel-head">
          <span className="a-panel-title">Recent Orders</span>
          <Link to="/admin/orders" className="a-btn a-btn-outline a-btn-sm">View All →</Link>
        </div>
        {orders.length === 0 ? (
          <div className="a-empty">
            <div className="a-empty-icon">🚀</div>
            <div className="a-empty-title">No orders yet</div>
            <div className="a-empty-sub">Share your store and orders will appear here!</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="a-table">
              <thead>
                <tr>
                  {['Order ID', 'Customer', 'Amount', 'Items', 'Status', 'Date'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 7).map(order => {
                  const cfg = STATUS_CONFIG[order.orderStatus] || { color: '#888', bg: '#222', border: '#333', label: order.orderStatus };
                  return (
                    <tr key={order._id}>
                      <td><span className="a-table-id">#{order._id.slice(-7).toUpperCase()}</span></td>
                      <td style={{ color: 'var(--text)' }}>{order.user?.name || 'Guest'}</td>
                      <td><span className="a-table-amount">₹{order.total?.toLocaleString()}</span></td>
                      <td>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                      <td>
                        <span className="a-badge" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Stat Card Component ── */
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="a-stat-card" style={{ '--card-accent': color }}>
      <div className="a-stat-icon">{icon}</div>
      <div className="a-stat-label">{label}</div>
      <div className="a-stat-value">{value}</div>
      {sub && <div className="a-stat-sub">{sub}</div>}
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
