import { useState, useEffect } from 'react';
import { getAllOrders } from '../../services/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllOrders().then(r => {
      // Build customer list from orders
      const map = {};
      r.data.forEach(order => {
        const u = order.user;
        if (!u) return;
        if (!map[u._id]) map[u._id] = { ...u, orders: 0, totalSpent: 0, lastOrder: null };
        map[u._id].orders++;
        map[u._id].totalSpent += order.total;
        if (!map[u._id].lastOrder || new Date(order.createdAt) > new Date(map[u._id].lastOrder))
          map[u._id].lastOrder = order.createdAt;
      });
      setCustomers(Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#c8a96e', letterSpacing: 3, marginBottom: 4 }}>MANAGE</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 38, letterSpacing: 2, color: '#f0f0f0', margin: 0 }}>Customers</h1>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 340, marginBottom: 24 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          style={{ background: '#0d0d18', border: '1px solid #1a1a2e', color: '#f0f0f0', borderRadius: 10, padding: '10px 14px 10px 38px', fontSize: 13, width: '100%', outline: 'none' }} />
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#444' }}>🔍</span>
      </div>

      {/* Table */}
      <div style={{ background: '#0d0d18', border: '1px solid #1a1a2e', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1a1a2e' }}>
              {['Customer', 'Email', 'Total Orders', 'Total Spent', 'Last Order'].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, color: '#444', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 48, color: '#444' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 64, color: '#333' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                <div>No customers yet. Share your store!</div>
              </td></tr>
            ) : filtered.map((c, i) => (
              <tr key={c._id} style={{ borderBottom: '1px solid #0f0f1a' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#c8a96e,#a07840)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#000', flexShrink: 0 }}>
                      {c.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#f0f0f0' }}>{c.name}</div>
                      {i === 0 && <span style={{ fontSize: 10, background: '#c8a96e22', color: '#c8a96e', padding: '1px 7px', borderRadius: 10, fontWeight: 700 }}>TOP BUYER</span>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#888' }}>{c.email}</td>
                <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#f0f0f0' }}>{c.orders}</td>
                <td style={{ padding: '14px 20px', fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#c8a96e', letterSpacing: 1 }}>₹{c.totalSpent?.toLocaleString()}</td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#555' }}>
                  {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
