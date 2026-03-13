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

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <style>{`
        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          width: 100%;
        }

        /* Desktop nav links */
        .nav-links {
          display: flex;
          gap: 28px;
          align-items: center;
        }

        /* Desktop auth buttons */
        .nav-auth {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Hamburger — hidden on desktop */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          z-index: 1100;
        }
        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.3s;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile drawer */
        .mobile-drawer {
          display: none;
          position: fixed;
          top: 64px;
          left: 0; right: 0;
          background: rgba(10,10,10,0.98);
          backdrop-filter: blur(12px);
          padding: 24px;
          flex-direction: column;
          gap: 0;
          border-top: 1px solid #222;
          z-index: 999;
          animation: drawerSlide 0.25s ease;
        }
        .mobile-drawer.open { display: flex; }

        @keyframes drawerSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .drawer-link {
          display: block;
          padding: 14px 0;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-decoration: none;
          border-bottom: 1px solid #222;
          transition: color 0.2s;
        }

        .drawer-auth {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .drawer-auth a {
          flex: 1;
          text-align: center;
          padding: 13px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-decoration: none;
          border-radius: 2px;
        }

        @media (max-width: 700px) {
          .nav-links  { display: none !important; }
          .nav-auth   { display: none !important; }
          .hamburger  { display: flex !important; }
          .navbar-container { padding: 0 16px; }
        }
      `}</style>

      {/* ── NAV BAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(10,10,10,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1e1e1e',
      }}>
        <div className="navbar-container">

          {/* Logo */}
          <Link to="/" onClick={closeMenu} style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 26, letterSpacing: 4,
            color: '#c8a96e', textDecoration: 'none',
          }}>
            DENIM<span style={{ color: '#fff' }}>CO</span>
          </Link>

          {/* ── DESKTOP: Nav links ── */}
          <div className="nav-links">
            {[['/', 'Home'], ['/shop', 'Shop']].map(([path, label]) => (
              <Link key={path} to={path} style={{
                fontSize: 13, fontWeight: 500, letterSpacing: 1,
                color: isActive(path) ? '#c8a96e' : '#aaa',
                textDecoration: 'none', textTransform: 'uppercase',
                borderBottom: isActive(path) ? '1px solid #c8a96e' : '1px solid transparent',
                paddingBottom: 2, transition: 'color 0.2s',
              }}>{label}</Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" style={{
                fontSize: 13, fontWeight: 500, letterSpacing: 1,
                color: '#c8a96e', textDecoration: 'none', textTransform: 'uppercase',
              }}>Admin</Link>
            )}
          </div>

          {/* ── DESKTOP: Right side ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Cart icon (always visible) */}
            <Link to="/cart" onClick={closeMenu} style={{ position: 'relative', padding: 6, display: 'flex' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: 0, right: 0,
                  background: '#c8a96e', color: '#000',
                  borderRadius: '50%', width: 17, height: 17,
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{count}</span>
              )}
            </Link>

            {/* Desktop auth */}
            <div className="nav-auth">
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Link to="/my-orders" style={{ fontSize: 13, color: '#aaa', textDecoration: 'none' }}>My Orders</Link>
                  <div
                    style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: '#c8a96e', color: '#000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    }}
                    title={`${user.name} — click to logout`}
                    onClick={handleLogout}
                  >
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login" style={{
                    padding: '8px 18px', fontSize: 13, fontWeight: 600,
                    letterSpacing: '1px', textDecoration: 'none',
                    border: '1.5px solid #c8a96e', color: '#c8a96e',
                    borderRadius: '2px', transition: 'all .2s',
                  }}>Login</Link>
                  <Link to="/register" style={{
                    padding: '8px 18px', fontSize: 13, fontWeight: 600,
                    letterSpacing: '1px', textDecoration: 'none',
                    background: '#c8a96e', color: '#000',
                    borderRadius: '2px',
                  }}>Sign Up</Link>
                </>
              )}
            </div>

            {/* Hamburger (mobile only) */}
            <button
              className={`hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div className={`mobile-drawer${menuOpen ? ' open' : ''}`}>

        {[['/', 'Home'], ['/shop', 'Shop']].map(([path, label]) => (
          <Link key={path} to={path} onClick={closeMenu} className="drawer-link" style={{
            color: isActive(path) ? '#c8a96e' : '#ccc',
          }}>{label}</Link>
        ))}

        {user?.role === 'admin' && (
          <Link to="/admin" onClick={closeMenu} className="drawer-link" style={{ color: '#c8a96e' }}>
            Admin Panel
          </Link>
        )}

        {user ? (
          <>
            <Link to="/my-orders" onClick={closeMenu} className="drawer-link" style={{ color: '#ccc' }}>
              My Orders
            </Link>
            <button onClick={handleLogout} style={{
              marginTop: 20, width: '100%', padding: '13px',
              background: 'transparent', border: '1.5px solid #555',
              color: '#aaa', fontSize: '13px', fontWeight: 600,
              letterSpacing: '1.5px', cursor: 'pointer', borderRadius: '2px',
            }}>LOGOUT ({user.name})</button>
          </>
        ) : (
          <div className="drawer-auth">
            <Link to="/login" onClick={closeMenu} style={{
              border: '1.5px solid #c8a96e', color: '#c8a96e',
            }}>LOGIN</Link>
            <Link to="/register" onClick={closeMenu} style={{
              background: '#c8a96e', color: '#000',
            }}>SIGN UP</Link>
          </div>
        )}
      </div>

      {/* Overlay to close drawer */}
      {menuOpen && (
        <div
          onClick={closeMenu}
          style={{
            position: 'fixed', inset: 0, zIndex: 998,
            background: 'rgba(0,0,0,0.4)',
            top: '64px',
          }}
        />
      )}
    </>
  );
}


// import { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useCart } from '../context/CartContext';

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const { count } = useCart();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const isActive = (path) => location.pathname === path;

//   return (
//     <nav style={{
//       position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
//       background: 'rgba(10,10,10,0.95)',
//       backdropFilter: 'blur(12px)',
//       borderBottom: '1px solid #1e1e1e',
//       height: 70,
//       display: 'flex', alignItems: 'center',
//     }}>
//       <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
//         {/* Logo */}
//         <Link to="/" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 4, color: '#c8a96e' }}>
//           DENIM<span style={{ color: '#fff' }}>CO</span>
//         </Link>

//         {/* Nav Links */}
//         <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
//           {[['/', 'Home'], ['/shop', 'Shop']].map(([path, label]) => (
//             <Link key={path} to={path} style={{
//               fontSize: 13, fontWeight: 500, letterSpacing: 1,
//               color: isActive(path) ? '#c8a96e' : '#aaa',
//               textTransform: 'uppercase',
//               borderBottom: isActive(path) ? '1px solid #c8a96e' : '1px solid transparent',
//               paddingBottom: 2,
//               transition: 'color 0.2s',
//             }}>{label}</Link>
//           ))}
//           {user?.role === 'admin' && (
//             <Link to="/admin" style={{ fontSize: 13, fontWeight: 500, letterSpacing: 1, color: '#c8a96e', textTransform: 'uppercase' }}>
//               Admin
//             </Link>
//           )}
//         </div>

//         {/* Right side */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//           {/* Cart */}
//           <Link to="/cart" style={{ position: 'relative', padding: 8 }}>
//             <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="2">
//               <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
//             </svg>
//             {count > 0 && (
//               <span style={{
//                 position: 'absolute', top: 2, right: 2,
//                 background: '#c8a96e', color: '#000',
//                 borderRadius: '50%', width: 18, height: 18,
//                 fontSize: 10, fontWeight: 700,
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//               }}>{count}</span>
//             )}
//           </Link>

//           {/* Auth */}
//           {user ? (
//             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//               <Link to="/my-orders" style={{ fontSize: 13, color: '#aaa' }}>My Orders</Link>
//               <div style={{
//                 width: 34, height: 34, borderRadius: '50%',
//                 background: '#c8a96e', color: '#000',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 fontWeight: 700, fontSize: 14, cursor: 'pointer',
//               }} title={user.name} onClick={handleLogout}>
//                 {user.name?.[0]?.toUpperCase()}
//               </div>
//             </div>
//           ) : (
//             <div style={{ display: 'flex', gap: 10 }}>
//               <Link to="/login" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: 13 }}>Login</Link>
//               <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>Sign Up</Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }