import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(10,10,10,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1e1e1e',
      height: 70,
      display: 'flex', alignItems: 'center',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Logo */}
        <Link to="/" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 4, color: '#c8a96e' }}>
          DENIM<span style={{ color: '#fff' }}>CO</span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {[['/', 'Home'], ['/shop', 'Shop']].map(([path, label]) => (
            <Link key={path} to={path} style={{
              fontSize: 13, fontWeight: 500, letterSpacing: 1,
              color: isActive(path) ? '#c8a96e' : '#aaa',
              textTransform: 'uppercase',
              borderBottom: isActive(path) ? '1px solid #c8a96e' : '1px solid transparent',
              paddingBottom: 2,
              transition: 'color 0.2s',
            }}>{label}</Link>
          ))}
          {user?.role === 'admin' && (
            <Link to="/admin" style={{ fontSize: 13, fontWeight: 500, letterSpacing: 1, color: '#c8a96e', textTransform: 'uppercase' }}>
              Admin
            </Link>
          )}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative', padding: 8 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && (
              <span style={{
                position: 'absolute', top: 2, right: 2,
                background: '#c8a96e', color: '#000',
                borderRadius: '50%', width: 18, height: 18,
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{count}</span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link to="/my-orders" style={{ fontSize: 13, color: '#aaa' }}>My Orders</Link>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: '#c8a96e', color: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }} title={user.name} onClick={handleLogout}>
                {user.name?.[0]?.toUpperCase()}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: 13 }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}