import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!form.email || !form.password) return setError('Please fill all fields');
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return <AuthPage title="Welcome Back" subtitle="Login to your account" error={error} loading={loading} onSubmit={handleSubmit}
    footer={<>Don't have an account? <Link to="/register" style={{ color: '#c8a96e' }}>Sign up</Link></>}>
    <div className="form-group">
      <label>Email Address</label>
      <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
    </div>
    <div className="form-group">
      <label>Password</label>
      <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
    </div>
  </AuthPage>;
}

export function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!form.name || !form.email || !form.password) return setError('Please fill all fields');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { registerUser } = await import('../services/api');
      const res = await registerUser(form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return <AuthPage title="Create Account" subtitle="Join DenimCo today" error={error} loading={loading} onSubmit={handleSubmit}
    footer={<>Already have an account? <Link to="/login" style={{ color: '#c8a96e' }}>Login</Link></>}>
    <div className="form-group">
      <label>Full Name</label>
      <input placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
    </div>
    <div className="form-group">
      <label>Email Address</label>
      <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
    </div>
    <div className="form-group">
      <label>Password</label>
      <input type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
    </div>
  </AuthPage>;
}

function AuthPage({ title, subtitle, children, error, loading, onSubmit, footer }) {
  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, letterSpacing: 4, color: '#c8a96e' }}>DENIM<span style={{ color: '#fff' }}>CO</span></Link>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, letterSpacing: 2, marginTop: 24 }}>{title}</h2>
          <p style={{ color: '#555', fontSize: 14, marginTop: 6 }}>{subtitle}</p>
        </div>
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 32 }}>
          {error && <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid #e74c3c44', color: '#e74c3c', padding: '10px 14px', borderRadius: 8, marginBottom: 20, fontSize: 13 }}>⚠️ {error}</div>}
          {children}
          <button onClick={onSubmit} disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: 16, fontSize: 15, marginTop: 8, letterSpacing: 1 }}>
            {loading ? 'Please wait...' : title}
          </button>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#555' }}>{footer}</p>
        </div>
      </div>
    </div>
  );
}