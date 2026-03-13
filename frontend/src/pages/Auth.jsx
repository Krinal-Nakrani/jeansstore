import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ─────────────────────────────────────────
   LOGIN
───────────────────────────────────────── */
export function Login() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!form.email || !form.password) return setError('Please fill in all fields');
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to your INDUS. account"
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
      submitLabel="Sign In"
      footer={<>Don't have an account? <Link to="/register" style={{ color: 'var(--gold)', fontWeight: 600 }}>Create one →</Link></>}
    >
      <Field label="Email Address">
        <input
          type="email" placeholder="you@example.com"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          className="auth-input"
        />
      </Field>
      <Field label="Password">
        <div style={{ position: 'relative' }}>
          <input
            type={showPwd ? 'text' : 'password'}
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="auth-input"
            style={{ paddingRight: 44 }}
          />
          <button
            type="button"
            onClick={() => setShowPwd(v => !v)}
            style={{
              position: 'absolute', right: 12, top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 16,
              color: 'var(--muted)', padding: 2,
            }}
          >{showPwd ? '🙈' : '👁'}</button>
        </div>
      </Field>
    </AuthShell>
  );
}

/* ─────────────────────────────────────────
   REGISTER
───────────────────────────────────────── */
export function Register() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!form.name || !form.email || !form.password) return setError('Please fill in all fields');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { registerUser } = await import('../services/api');
      const res = await registerUser(form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const strength = getPasswordStrength(form.password);

  return (
    <AuthShell
      title="Create Account"
      subtitle="Join INDUS. — premium INDUS. awaits"
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
      submitLabel="Create Account"
      footer={<>Already have an account? <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>Sign in →</Link></>}
    >
      <Field label="Full Name">
        <input
          placeholder="John Doe"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="auth-input"
        />
      </Field>
      <Field label="Email Address">
        <input
          type="email" placeholder="you@example.com"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="auth-input"
        />
      </Field>
      <Field label="Password">
        <div style={{ position: 'relative' }}>
          <input
            type={showPwd ? 'text' : 'password'}
            placeholder="Min 6 characters"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="auth-input"
            style={{ paddingRight: 44 }}
          />
          <button
            type="button"
            onClick={() => setShowPwd(v => !v)}
            style={{
              position: 'absolute', right: 12, top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 16,
              color: 'var(--muted)', padding: 2,
            }}
          >{showPwd ? '🙈' : '👁'}</button>
        </div>
        {/* Password strength bar */}
        {form.password.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: i <= strength.level ? strength.color : 'var(--sand)',
                  transition: 'background .3s',
                }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: strength.color, marginTop: 4, fontWeight: 600 }}>
              {strength.label}
            </div>
          </div>
        )}
      </Field>
    </AuthShell>
  );
}

/* ─────────────────────────────────────────
   SHARED SHELL
───────────────────────────────────────── */
function AuthShell({ title, subtitle, children, error, loading, onSubmit, submitLabel, footer }) {
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
          --red:    #c0392b;
        }

        .auth-wrap {
          min-height: 100vh;
          background: var(--cream);
          display: flex;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── LEFT PANEL (decorative) ── */
        .auth-left {
          flex: 1;
          background: var(--ink);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          position: relative;
          overflow: hidden;
        }
        .auth-left-texture {
          position: absolute; inset: 0; opacity: .05;
          background-image: repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%);
          background-size: 14px 14px;
          pointer-events: none;
        }
        .auth-left-content { position: relative; text-align: center; }
        .auth-left-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px; letter-spacing: 6px;
          color: var(--gold); margin-bottom: 32px;
          text-decoration: none; display: block;
        }
        .auth-left-logo span { color: #fff; }
        .auth-tagline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 2.5vw, 32px);
          color: #fff; font-weight: 700;
          line-height: 1.3; margin-bottom: 20px;
        }
        .auth-tagline-sub {
          font-size: 14px; color: rgba(255,255,255,.5);
          line-height: 1.7; max-width: 280px; margin: 0 auto;
        }
        .auth-perks {
          margin-top: 40px;
          display: flex; flex-direction: column; gap: 14px;
          text-align: left;
        }
        .auth-perk {
          display: flex; align-items: center; gap: 12px;
          font-size: 13px; color: rgba(255,255,255,.7);
        }
        .auth-perk-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(255,255,255,.08);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0;
        }

        /* ── RIGHT PANEL (form) ── */
        .auth-right {
          width: min(480px, 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(32px, 5vw, 60px) clamp(24px, 5vw, 52px);
          background: var(--white);
          border-left: 1px solid var(--border);
        }
        .auth-right-inner { width: 100%; max-width: 360px; }

        /* Mobile logo (only on small screens) */
        .auth-mobile-logo {
          display: none;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px; letter-spacing: 5px;
          color: var(--gold); text-decoration: none;
          margin-bottom: 28px;
          text-align: center;
        }
        .auth-mobile-logo span { color: var(--ink); }

        .auth-form-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 700; color: var(--ink);
          margin: 0 0 6px;
        }
        .auth-form-sub {
          font-size: 13px; color: var(--muted);
          margin-bottom: 28px;
        }

        /* Error box */
        .auth-error {
          background: #fef0ee;
          border: 1px solid #f5c0bb;
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 13px;
          color: var(--red);
          margin-bottom: 20px;
          font-weight: 500;
          display: flex; align-items: center; gap: 8px;
        }

        /* Field */
        .auth-field { margin-bottom: 18px; }
        .auth-field-label {
          display: block;
          font-size: 10px; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--muted); margin-bottom: 7px;
        }
        .auth-input {
          width: 100%;
          border: 1.5px solid var(--border);
          border-radius: 7px;
          padding: 12px 14px;
          font-size: 14px;
          font-family: inherit;
          background: var(--white);
          color: var(--ink);
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .auth-input:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(184,155,106,.12);
        }

        /* Submit button */
        .auth-submit {
          width: 100%;
          padding: 14px;
          background: var(--ink); color: #fff;
          border: none; border-radius: 7px;
          font-size: 13px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          cursor: pointer; font-family: inherit;
          margin-top: 6px;
          transition: background .2s, transform .1s;
        }
        .auth-submit:hover:not(:disabled) { background: var(--gold2); }
        .auth-submit:active:not(:disabled){ transform: scale(.99); }
        .auth-submit:disabled { opacity: .6; cursor: not-allowed; }

        .auth-footer {
          text-align: center;
          margin-top: 22px;
          font-size: 13px;
          color: var(--muted);
        }

        .auth-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 22px 0;
        }
        .auth-divider-line { flex: 1; height: 1px; background: var(--border); }
        .auth-divider-text { font-size: 11px; color: var(--muted); letter-spacing: 1px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .auth-left         { display: none; }
          .auth-right        { width: 100%; border-left: none; background: var(--cream); }
          .auth-mobile-logo  { display: block; }
        }
        @media (max-width: 400px) {
          .auth-right { padding: 28px 20px; }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&family=Bebas+Neue&display=swap" rel="stylesheet" />

      <div className="auth-wrap">

        {/* ── LEFT: Brand panel ── */}
        <div className="auth-left">
          <div className="auth-left-texture" />
          <div className="auth-left-content">
            <Link to="/" className="auth-left-logo">INDUS<span>.</span></Link>
            <div className="auth-tagline">Premium INDUS<br />Crafted for You</div>
            <p className="auth-tagline-sub">
              Discover handcrafted jeans built for the bold. Every pair tells a story.
            </p>
            <div className="auth-perks">
              {[
                ['🚚', 'Free shipping on orders above ₹999'],
                ['↩️', '7-day hassle-free returns'],
                ['🔒', 'Secure payments — Stripe & COD'],
                ['⭐', 'Premium quality stretch INDUS'],
              ].map(([icon, text]) => (
                <div className="auth-perk" key={text}>
                  <div className="auth-perk-icon">{icon}</div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form ── */}
        <div className="auth-right">
          <div className="auth-right-inner">

            {/* Mobile logo */}
            <Link to="/" className="auth-mobile-logo">INDUS<span>.</span></Link>

            <h2 className="auth-form-title">{title}</h2>
            <p className="auth-form-sub">{subtitle}</p>

            {error && (
              <div className="auth-error">
                <span>⚠</span> {error}
              </div>
            )}

            {children}

            <button
              className="auth-submit"
              onClick={onSubmit}
              disabled={loading}
            >
              {loading
                ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    <span style={{ animation:'spin .7s linear infinite', display:'inline-block' }}>⏳</span>
                    Please wait…
                  </span>
                : submitLabel
              }
            </button>

            <p className="auth-footer">{footer}</p>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">SECURE CHECKOUT</span>
              <div className="auth-divider-line" />
            </div>

            <div style={{ display:'flex', justifyContent:'center', gap:16, fontSize:20 }}>
              <span title="Stripe">💳</span>
              <span title="UPI">📱</span>
              <span title="COD">💵</span>
              <span title="Secure">🔒</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

/* ─── helpers ─── */

function Field({ label, children }) {
  return (
    <div className="auth-field">
      <label className="auth-field-label">{label}</label>
      {children}
    </div>
  );
}

function getPasswordStrength(pwd) {
  if (!pwd)           return { level: 0, label: '',        color: 'var(--muted)' };
  if (pwd.length < 6) return { level: 1, label: 'Weak',    color: '#e74c3c' };
  if (pwd.length < 8) return { level: 2, label: 'Fair',    color: '#e67e22' };
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd))
                       return { level: 4, label: 'Strong',  color: '#2d7a4f' };
  return               { level: 3, label: 'Good',   color: '#b89b6a' };
}

// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { loginUser } from '../services/api';
// import { useAuth } from '../context/AuthContext';

// export function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async () => {
//     setError('');
//     if (!form.email || !form.password) return setError('Please fill all fields');
//     setLoading(true);
//     try {
//       const res = await loginUser(form);
//       login(res.data.user, res.data.token);
//       navigate(res.data.user.role === 'admin' ? '/admin' : '/');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     } finally { setLoading(false); }
//   };

//   return <AuthPage title="Welcome Back" subtitle="Login to your account" error={error} loading={loading} onSubmit={handleSubmit}
//     footer={<>Don't have an account? <Link to="/register" style={{ color: '#c8a96e' }}>Sign up</Link></>}>
//     <div className="form-group">
//       <label>Email Address</label>
//       <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
//     </div>
//     <div className="form-group">
//       <label>Password</label>
//       <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
//     </div>
//   </AuthPage>;
// }

// export function Register() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name: '', email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async () => {
//     setError('');
//     if (!form.name || !form.email || !form.password) return setError('Please fill all fields');
//     if (form.password.length < 6) return setError('Password must be at least 6 characters');
//     setLoading(true);
//     try {
//       const { registerUser } = await import('../services/api');
//       const res = await registerUser(form);
//       login(res.data.user, res.data.token);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed');
//     } finally { setLoading(false); }
//   };

//   return <AuthPage title="Create Account" subtitle="Join INDUS today" error={error} loading={loading} onSubmit={handleSubmit}
//     footer={<>Already have an account? <Link to="/login" style={{ color: '#c8a96e' }}>Login</Link></>}>
//     <div className="form-group">
//       <label>Full Name</label>
//       <input placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
//     </div>
//     <div className="form-group">
//       <label>Email Address</label>
//       <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
//     </div>
//     <div className="form-group">
//       <label>Password</label>
//       <input type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
//     </div>
//   </AuthPage>;
// }

// function AuthPage({ title, subtitle, children, error, loading, onSubmit, footer }) {
//   return (
//     <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a0a' }}>
//       <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
//         <div style={{ textAlign: 'center', marginBottom: 40 }}>
//           <Link to="/" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, letterSpacing: 4, color: '#c8a96e' }}>INDUS<span style={{ color: '#fff' }}>CO</span></Link>
//           <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, letterSpacing: 2, marginTop: 24 }}>{title}</h2>
//           <p style={{ color: '#555', fontSize: 14, marginTop: 6 }}>{subtitle}</p>
//         </div>
//         <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 32 }}>
//           {error && <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid #e74c3c44', color: '#e74c3c', padding: '10px 14px', borderRadius: 8, marginBottom: 20, fontSize: 13 }}>⚠️ {error}</div>}
//           {children}
//           <button onClick={onSubmit} disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: 16, fontSize: 15, marginTop: 8, letterSpacing: 1 }}>
//             {loading ? 'Please wait...' : title}
//           </button>
//           <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#555' }}>{footer}</p>
//         </div>
//       </div>
//     </div>
//   );
// }