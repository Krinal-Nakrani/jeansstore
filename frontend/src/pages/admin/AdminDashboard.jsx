import { useState, useEffect } from 'react';
import { getAllOrders } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const STATUS_COLORS = {
  pending: '#f39c12', confirmed: '#3498db',
  shipped: '#9b59b6', delivered: '#27ae60', cancelled: '#e74c3c',
};

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{ background: '#0d0d18', border: '1px solid #1a1a2e', borderRadius: 14, padding: '22px 24px', borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, color: '#555', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>{label}</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f0', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: '#444', marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{ fontSize: 32, opacity: 0.7 }}>{icon}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.filter(o => o.orderStatus !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.orderStatus === 'pending').length;
  const delivered = orders.filter(o => o.orderStatus === 'delivered').length;

  // Chart data — group orders by date
  const byDate = {};
  orders.forEach(o => {
    const date = new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    if (!byDate[date]) byDate[date] = { date, orders: 0, revenue: 0 };
    byDate[date].orders++;
    byDate[date].revenue += o.total;
  });
  const chartData = Object.values(byDate).slice(-7);

  // Status breakdown
  const statusCount = {};
  orders.forEach(o => { statusCount[o.orderStatus] = (statusCount[o.orderStatus] || 0) + 1; });

  if (loading) return <div style={{ textAlign: 'center', padding: 80, color: '#555' }}>Loading dashboard...</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#c8a96e', letterSpacing: 3, marginBottom: 4, textTransform: 'uppercase' }}>Overview</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 38, letterSpacing: 2, color: '#f0f0f0', margin: 0 }}>Dashboard</h1>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard icon="💰" label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} sub="All time" color="#c8a96e" />
        <StatCard icon="📦" label="Total Orders" value={orders.length} sub={`${pending} pending`} color="#3498db" />
        <StatCard icon="✅" label="Delivered" value={delivered} sub="Successfully" color="#27ae60" />
        <StatCard icon="⏳" label="Pending" value={pending} sub="Need action" color="#f39c12" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* Revenue Chart */}
        <div style={{ background: '#0d0d18', border: '1px solid #1a1a2e', borderRadius: 14, padding: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 20, color: '#f0f0f0', fontSize: 14 }}>Revenue (Last 7 Days)</div>
          {chartData.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#333', padding: 40 }}>No order data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" stroke="#333" fontSize={11} />
                <YAxis stroke="#333" fontSize={11} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a4e', color: '#f0f0f0', borderRadius: 8 }} />
                <Bar dataKey="revenue" fill="#c8a96e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div style={{ background: '#0d0d18', border: '1px solid #1a1a2e', borderRadius: 14, padding: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 20, color: '#f0f0f0', fontSize: 14 }}>Order Status</div>
          {Object.entries(statusCount).length === 0 ? (
            <div style={{ textAlign: 'center', color: '#333', padding: 40 }}>No orders yet</div>
          ) : (
            Object.entries(statusCount).map(([status, count]) => (
              <div key={status} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: STATUS_COLORS[status] || '#888', textTransform: 'capitalize', fontWeight: 600 }}>{status}</span>
                  <span style={{ color: '#888' }}>{count} orders</span>
                </div>
                <div style={{ background: '#1a1a2e', borderRadius: 4, height: 6 }}>
                  <div style={{ background: STATUS_COLORS[status] || '#888', height: '100%', borderRadius: 4, width: `${(count / orders.length) * 100}%`, transition: 'width 0.5s' }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div style={{ background: '#0d0d18', border: '1px solid #1a1a2e', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1a1a2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#f0f0f0' }}>Recent Orders</div>
          <a href="/admin/orders" style={{ fontSize: 12, color: '#c8a96e', textDecoration: 'none' }}>View all →</a>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1a1a2e' }}>
              {['Order ID', 'Customer', 'Amount', 'Items', 'Status', 'Date'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, color: '#444', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 6).map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #0f0f1a' }}>
                <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontSize: 12, color: '#c8a96e' }}>#{order._id.slice(-7).toUpperCase()}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#ccc' }}>{order.user?.name || 'Unknown'}</td>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#f0f0f0', fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: 1 }}>₹{order.total?.toLocaleString()}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#888' }}>{order.items?.length} item(s)</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ background: (STATUS_COLORS[order.orderStatus] || '#888') + '22', color: STATUS_COLORS[order.orderStatus] || '#888', border: `1px solid ${(STATUS_COLORS[order.orderStatus] || '#888')}44`, padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'capitalize' }}>{order.orderStatus}</span>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#444' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#333' }}>No orders yet. Share your store! 🚀</div>}
      </div>
    </div>
  );
}
