import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { path: '/admin',          icon: '📊', label: 'Dashboard'  },
  { path: '/admin/products', icon: '👖', label: 'Products'   },
  { path: '/admin/orders',   icon: '📦', label: 'Orders'     },
  { path: '/admin/customers',icon: '👥', label: 'Customers'  },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07070f', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 220,
        background: '#0d0d18',
        borderRight: '1px solid #1a1a2e',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #1a1a2e', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#c8a96e,#a07840)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>👖</div>
          {!collapsed && <div>
            <div style={{ fontWeight: 800, fontSize: 13, color: '#c8a96e', letterSpacing: 2 }}>DENIMCO</div>
            <div style={{ fontSize: 10, color: '#444', letterSpacing: 1 }}>ADMIN PANEL</div>
          </div>}
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '16px 8px' }}>
          {NAV.map(n => {
            const active = location.pathname === n.path;
            return (
              <Link key={n.path} to={n.path} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 12px', borderRadius: 10, marginBottom: 4,
                background: active ? 'rgba(200,169,110,0.12)' : 'transparent',
                border: active ? '1px solid rgba(200,169,110,0.2)' : '1px solid transparent',
                color: active ? '#c8a96e' : '#555',
                textDecoration: 'none', transition: 'all 0.15s',
                whiteSpace: 'nowrap', overflow: 'hidden',
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
                {!collapsed && <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{n.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid #1a1a2e' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, color: '#444', textDecoration: 'none', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>🌐</span>
            {!collapsed && <span style={{ fontSize: 12 }}>View Store</span>}
          </Link>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>🚪</span>
            {!collapsed && <span style={{ fontSize: 12 }}>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: collapsed ? 64 : 220, flex: 1, transition: 'margin-left 0.25s ease', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top Bar */}
        <header style={{
          height: 60, background: '#0d0d18', borderBottom: '1px solid #1a1a2e',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <button onClick={() => setCollapsed(c => !c)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 20, padding: 4 }}>
            {collapsed ? '→' : '←'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#555' }}>Welcome,</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#c8a96e' }}>{user?.name}</span>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#c8a96e,#a07840)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#000' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
