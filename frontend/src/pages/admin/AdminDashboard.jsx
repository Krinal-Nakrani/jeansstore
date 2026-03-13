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