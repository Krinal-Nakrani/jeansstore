import { useState, useEffect } from 'react';
import { getAllOrders } from '../../services/api';

/* ── Light theme tokens ── */
const T = {
  bg:       '#faf7f2',
  beige:    '#f0ebe1',
  sand:     '#e2d9cc',
  card:     '#ffffff',
  border:   '#e0d8ce',
  ink:      '#1c1c1c',
  ink2:     '#4a4a4a',
  muted:    '#9a9080',
  gold:     '#b89b6a',
  gold2:    '#8a7048',
  red:      '#c0392b',  redBg:   '#fef0ee', redBdr:   '#f5c0bb',
  green:    '#2d7a4f',  greenBg: '#edf7f2', greenBdr: '#a8dfc0',
};

/* ── Avatar colors by index ── */
const AVATAR_COLORS = ['#b89b6a', '#8a7048', '#2d7a4f', '#1a5fa8', '#6b3fa0', '#b07d0e'];

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [expanded,  setExpanded]  = useState(null);

  useEffect(() => {
    getAllOrders()
      .then(r => {
        const map = {};
        r.data.forEach(order => {
          const u = order.user;
          if (!u) return;
          if (!map[u._id]) map[u._id] = { ...u, orders: 0, totalSpent: 0, lastOrder: null, statuses: {} };
          map[u._id].orders++;
          map[u._id].totalSpent += order.total || 0;
          map[u._id].statuses[order.orderStatus] = (map[u._id].statuses[order.orderStatus] || 0) + 1;
          if (!map[u._id].lastOrder || new Date(order.createdAt) > new Date(map[u._id].lastOrder))
            map[u._id].lastOrder = order.createdAt;
        });
        setCustomers(Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgSpend     = customers.length ? Math.round(totalRevenue / customers.length) : 0;

  return (
    <div style={{ fontFamily: "'DM Sans','Inter',sans-serif", color: T.ink }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: T.gold, letterSpacing: 3, marginBottom: 5, textTransform: 'uppercase', fontWeight: 700 }}>Manage</div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, letterSpacing: 2, color: T.ink, margin: 0 }}>Customers</h1>
        <p style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{customers.length} registered customers</p>
      </div>

      {/* ── Stat strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '👥', label: 'Total Customers', value: customers.length,              color: T.gold   },
          { icon: '💰', label: 'Total Revenue',   value: `₹${totalRevenue.toLocaleString()}`, color: T.green  },
          { icon: '📊', label: 'Avg. Spend',      value: `₹${avgSpend.toLocaleString()}`,     color: T.blue || '#1a5fa8' },
        ].map(s => (
          <div key={s.label} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '18px 20px', borderTop: `3px solid ${s.color}`, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 34, letterSpacing: 1, color: T.ink, lineHeight: 1 }}>{s.value}</div>
              </div>
              <div style={{ fontSize: 24, opacity: .4 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 8, overflow: 'hidden', maxWidth: 380, transition: 'border-color .2s' }}
          onFocusCapture={e => e.currentTarget.style.borderColor = T.gold}
          onBlurCapture={e => e.currentTarget.style.borderColor = T.border}>
          <span style={{ padding: '0 12px', color: T.muted }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
            style={{ flex: 1, background: 'transparent', border: 'none', color: T.ink, padding: '10px 0', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', paddingRight: 12, fontSize: 18 }}>×</button>}
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: T.beige }}>
                {['Customer', 'Email', 'Orders', 'Total Spent', 'Last Order', 'Details'].map(h => (
                  <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, borderBottom: `1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 60, textAlign: 'center' }}>
                  <div style={{ width: 34, height: 34, border: `3px solid ${T.sand}`, borderTopColor: T.gold, borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto' }} />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: 40, marginBottom: 12, opacity: .3 }}>👥</div>
                  <div style={{ fontSize: 14, color: T.ink2, fontWeight: 600, marginBottom: 6 }}>{search ? 'No customers match' : 'No customers yet'}</div>
                  <div style={{ fontSize: 13, color: T.muted }}>Customers appear here after their first order</div>
                </td></tr>
              ) : filtered.map((c, i) => {
                const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const isTop       = i === 0;
                const isExpanded  = expanded === c._id;

                return (
                  <>
                    <tr key={c._id}
                      style={{ borderBottom: `1px solid ${T.border}`, transition: 'background .15s', background: i % 2 === 0 ? T.card : T.bg }}
                      onMouseEnter={e => e.currentTarget.style.background = T.beige}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? T.card : T.bg}>

                      {/* Customer */}
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 38, height: 38, borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: '#fff', flexShrink: 0, border: `2px solid ${T.border}` }}>
                            {c.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: T.ink }}>{c.name}</div>
                            {isTop && (
                              <span style={{ fontSize: 9, background: T.beige, color: T.gold2, border: `1px solid ${T.border}`, padding: '1px 7px', borderRadius: 10, fontWeight: 800, letterSpacing: 1 }}>
                                ★ TOP BUYER
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: '13px 18px', fontSize: 13, color: T.muted }}>{c.email}</td>

                      {/* Orders */}
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: T.ink }}>{c.orders}</span>
                        <span style={{ fontSize: 11, color: T.muted, marginLeft: 4 }}>order{c.orders !== 1 ? 's' : ''}</span>
                      </td>

                      {/* Total spent */}
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: T.ink, letterSpacing: 1 }}>₹{c.totalSpent?.toLocaleString()}</div>
                        {customers.length > 1 && (
                          <div style={{ fontSize: 10, color: T.muted, marginTop: 1 }}>
                            {Math.round((c.totalSpent / totalRevenue) * 100)}% of total
                          </div>
                        )}
                      </td>

                      {/* Last order */}
                      <td style={{ padding: '13px 18px', fontSize: 12, color: T.muted }}>
                        {c.lastOrder
                          ? new Date(c.lastOrder).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'}
                      </td>

                      {/* Expand */}
                      <td style={{ padding: '13px 18px' }}>
                        <button onClick={() => setExpanded(isExpanded ? null : c._id)}
                          style={{ background: isExpanded ? T.beige : T.bg, border: `1px solid ${T.border}`, color: T.gold2, padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'inherit', transition: 'all .15s' }}>
                          {isExpanded ? '▲ Hide' : '▼ View'}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {isExpanded && (
                      <tr key={`${c._id}-exp`} style={{ background: T.bg }}>
                        <td colSpan={6} style={{ padding: '16px 24px', borderBottom: `1px solid ${T.border}` }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>

                            {/* Order breakdown by status */}
                            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '14px 16px' }}>
                              <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Order Breakdown</div>
                              {Object.entries(c.statuses).map(([status, count]) => (
                                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                                  <span style={{ color: T.ink2, textTransform: 'capitalize' }}>{status}</span>
                                  <span style={{ fontWeight: 700, color: T.ink }}>{count}</span>
                                </div>
                              ))}
                            </div>

                            {/* Avg order value */}
                            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '14px 16px' }}>
                              <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Avg Order Value</div>
                              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: T.ink, letterSpacing: 1 }}>
                                ₹{Math.round(c.totalSpent / c.orders).toLocaleString()}
                              </div>
                            </div>

                            {/* Customer since */}
                            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '14px 16px' }}>
                              <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Last Order</div>
                              <div style={{ fontSize: 14, color: T.ink, fontWeight: 600 }}>
                                {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                              </div>
                            </div>

                            {/* Buyer tier */}
                            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '14px 16px' }}>
                              <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Buyer Tier</div>
                              <span style={{
                                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                                background: c.totalSpent >= 5000 ? T.greenBg : c.totalSpent >= 2000 ? T.beige : T.bg,
                                color:      c.totalSpent >= 5000 ? T.green   : c.totalSpent >= 2000 ? T.gold2  : T.muted,
                                border:     `1px solid ${c.totalSpent >= 5000 ? T.greenBdr : c.totalSpent >= 2000 ? T.border : T.border}`,
                              }}>
                                {c.totalSpent >= 5000 ? '★ Premium' : c.totalSpent >= 2000 ? '◆ Regular' : '◇ New'}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        {filtered.length > 0 && (
          <div style={{ padding: '12px 20px', background: T.beige, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: T.muted }}>Showing {filtered.length} of {customers.length} customers</span>
            <span style={{ fontSize: 12, color: T.muted }}>Total revenue: <strong style={{ color: T.gold2 }}>₹{totalRevenue.toLocaleString()}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import { getAllOrders } from '../../services/api';

// export default function AdminCustomers() {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     getAllOrders().then(r => {
//       // Build customer list from orders
//       const map = {};
//       r.data.forEach(order => {
//         const u = order.user;
//         if (!u) return;
//         if (!map[u._id]) map[u._id] = { ...u, orders: 0, totalSpent: 0, lastOrder: null };
//         map[u._id].orders++;
//         map[u._id].totalSpent += order.total;
//         if (!map[u._id].lastOrder || new Date(order.createdAt) > new Date(map[u._id].lastOrder))
//           map[u._id].lastOrder = order.createdAt;
//       });
//       setCustomers(Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent));
//     }).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   const filtered = customers.filter(c =>
//     c.name?.toLowerCase().includes(search.toLowerCase()) ||
//     c.email?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div>
//       <div style={{ marginBottom: 28 }}>
//         <div style={{ fontSize: 11, color: '#c8a96e', letterSpacing: 3, marginBottom: 4 }}>MANAGE</div>
//         <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 38, letterSpacing: 2, color: '#f0f0f0', margin: 0 }}>Customers</h1>
//       </div>

//       {/* Search */}
//       <div style={{ position: 'relative', maxWidth: 340, marginBottom: 24 }}>
//         <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
//           style={{ background: '#0d0d18', border: '1px solid #1a1a2e', color: '#f0f0f0', borderRadius: 10, padding: '10px 14px 10px 38px', fontSize: 13, width: '100%', outline: 'none' }} />
//         <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#444' }}>🔍</span>
//       </div>

//       {/* Table */}
//       <div style={{ background: '#0d0d18', border: '1px solid #1a1a2e', borderRadius: 14, overflow: 'hidden' }}>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr style={{ borderBottom: '1px solid #1a1a2e' }}>
//               {['Customer', 'Email', 'Total Orders', 'Total Spent', 'Last Order'].map(h => (
//                 <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, color: '#444', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr><td colSpan={5} style={{ textAlign: 'center', padding: 48, color: '#444' }}>Loading...</td></tr>
//             ) : filtered.length === 0 ? (
//               <tr><td colSpan={5} style={{ textAlign: 'center', padding: 64, color: '#333' }}>
//                 <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
//                 <div>No customers yet. Share your store!</div>
//               </td></tr>
//             ) : filtered.map((c, i) => (
//               <tr key={c._id} style={{ borderBottom: '1px solid #0f0f1a' }}>
//                 <td style={{ padding: '14px 20px' }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                     <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#c8a96e,#a07840)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#000', flexShrink: 0 }}>
//                       {c.name?.[0]?.toUpperCase()}
//                     </div>
//                     <div>
//                       <div style={{ fontWeight: 600, fontSize: 13, color: '#f0f0f0' }}>{c.name}</div>
//                       {i === 0 && <span style={{ fontSize: 10, background: '#c8a96e22', color: '#c8a96e', padding: '1px 7px', borderRadius: 10, fontWeight: 700 }}>TOP BUYER</span>}
//                     </div>
//                   </div>
//                 </td>
//                 <td style={{ padding: '14px 20px', fontSize: 13, color: '#888' }}>{c.email}</td>
//                 <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#f0f0f0' }}>{c.orders}</td>
//                 <td style={{ padding: '14px 20px', fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#c8a96e', letterSpacing: 1 }}>₹{c.totalSpent?.toLocaleString()}</td>
//                 <td style={{ padding: '14px 20px', fontSize: 12, color: '#555' }}>
//                   {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
