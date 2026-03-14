import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';

const PAYMENTS = [
  { id: 'COD',    icon: '💵', label: 'Cash on Delivery',  sub: 'Pay when your order arrives at your door' },
  { id: 'Stripe', icon: '💳', label: 'Pay Online',         sub: 'Credit / Debit card via Stripe' },
];

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading,       setLoading]       = useState(false);
  const [success,       setSuccess]       = useState(false);
  const [errors,        setErrors]        = useState({});
  const [form, setForm] = useState({
    fullName: user?.name || '',
    address:  '',
    city:     '',
    pincode:  '',
    phone:    '',
  });

  const shipping   = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const er = {};
    if (!form.fullName.trim()) er.fullName = 'Full name is required';
    if (!form.address.trim())  er.address  = 'Address is required';
    if (!form.city.trim())     er.city     = 'City is required';
    if (!/^\d{6}$/.test(form.pincode)) er.pincode = 'Enter valid 6-digit pincode';
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) er.phone = 'Enter valid 10-digit phone';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await placeOrder({
        items: cart.map(i => ({
          product:  i._id,
          name:     i.name,
          image:    i.images?.[0] || '',
          price:    i.price,
          quantity: i.quantity,
          size:     i.size,
          color:    i.color,
        })),
        shippingAddress: form,
        paymentMethod,
      });
      clearCart();
      setSuccess(true);
      setTimeout(() => navigate('/my-orders'), 3200);
    } catch (err) {
      setErrors({ global: err.response?.data?.message || 'Order failed. Please try again.' });
    } finally { setLoading(false); }
  };

  /* ── SUCCESS STATE ── */
  if (success) return (
    <>
      <style>{`
        @keyframes popIn { from{opacity:0;transform:scale(.7)} to{opacity:1;transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Playfair+Display:wght@700&family=Bebas+Neue&display=swap" rel="stylesheet" />
      <div style={{
        minHeight: '100vh', background: '#faf7f2',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
        padding: '40px 20px', textAlign: 'center',
      }}>
        <div style={{ animation: 'popIn .5s cubic-bezier(.34,1.56,.64,1) both' }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: '#eaf7ef', border: '3px solid #2d7a4f',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, margin: '0 auto 24px',
          }}>✓</div>
        </div>
        <div style={{ animation: 'fadeUp .5s ease .2s both' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700,
            color: '#1c1c1c', margin: '0 0 12px',
          }}>Order Confirmed!</h2>
          <p style={{ color: '#9a9080', fontSize: 15, marginBottom: 8 }}>
            Thank you for shopping with INDUS.
          </p>
          <p style={{ color: '#b89b6a', fontSize: 13, letterSpacing: 1 }}>
            Redirecting to your orders…
          </p>
        </div>
      </div>
    </>
  );

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
          --green:  #2d7a4f;
          --red:    #c0392b;
        }

        .co-wrap {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          padding-top: 64px;
        }

        /* ── HEADER ── */
        .co-header {
          background: var(--beige);
          border-bottom: 1px solid var(--border);
          padding: 36px 0 28px;
        }
        .co-header-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 40px;
        }
        .co-eyebrow {
          font-size: 10px; font-weight: 700;
          letter-spacing: 3.5px; text-transform: uppercase;
          color: var(--gold); margin-bottom: 6px;
        }
        .co-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px,4vw,38px);
          font-weight: 700; color: var(--ink); margin: 0;
        }

        /* ── STEPS INDICATOR ── */
        .steps {
          display: flex; align-items: center; gap: 0;
          margin-top: 20px;
        }
        .step {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 600; letter-spacing: .5px;
        }
        .step-num {
          width: 24px; height: 24px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700;
        }
        .step-active .step-num  { background: var(--ink); color: #fff; }
        .step-done .step-num    { background: var(--green); color: #fff; }
        .step-inactive .step-num{ background: var(--sand); color: var(--muted); }
        .step-active  .step-lbl { color: var(--ink); }
        .step-done    .step-lbl { color: var(--green); }
        .step-inactive .step-lbl{ color: var(--muted); }
        .step-line {
          flex: 1; height: 1px; background: var(--border);
          margin: 0 10px; max-width: 40px;
        }

        /* ── BODY GRID ── */
        .co-body {
          max-width: 1200px; margin: 0 auto;
          padding: 36px 40px 64px;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
          align-items: start;
        }

        /* ── CARDS ── */
        .co-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .co-card:last-child { margin-bottom: 0; }
        .co-card-head {
          background: var(--beige);
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 10px;
        }
        .co-card-icon { font-size: 16px; }
        .co-card-title {
          font-size: 11px; font-weight: 800;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--ink);
        }
        .co-card-body { padding: 24px; }

        /* ── FORM ── */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .full-col { grid-column: 1 / -1; }

        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: var(--muted);
        }
        .field input {
          border: 1.5px solid var(--border);
          border-radius: 7px;
          padding: 11px 14px;
          font-size: 13px;
          font-family: inherit;
          background: var(--white);
          color: var(--ink);
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .field input:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(184,155,106,.1);
        }
        .field input.err { border-color: var(--red); }
        .field-err {
          font-size: 11px; color: var(--red);
          font-weight: 500;
        }

        /* ── PAYMENT OPTIONS ── */
        .pay-option {
          border: 1.5px solid var(--border);
          border-radius: 10px;
          padding: 16px 18px;
          margin-bottom: 10px;
          cursor: pointer;
          display: flex; align-items: center; gap: 14px;
          transition: all .18s;
          background: var(--white);
        }
        .pay-option:last-child { margin-bottom: 0; }
        .pay-option:hover      { border-color: var(--gold); }
        .pay-option.selected   { border-color: var(--ink); background: var(--beige); }
        .pay-radio {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: border-color .15s;
        }
        .pay-option.selected .pay-radio { border-color: var(--ink); }
        .pay-radio-dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: var(--ink);
        }
        .pay-icon  { font-size: 20px; flex-shrink: 0; }
        .pay-label { font-size: 14px; font-weight: 600; color: var(--ink); }
        .pay-sub   { font-size: 12px; color: var(--muted); margin-top: 2px; }

        /* ── ORDER SUMMARY ── */
        .summary-box {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          position: sticky;
          top: 84px;
        }
        .summary-head {
          background: var(--beige);
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
        }
        .summary-title {
          font-size: 11px; font-weight: 800;
          letter-spacing: 2.5px; text-transform: uppercase; color: var(--ink);
        }
        .summary-body { padding: 20px 24px; }
        .summary-item {
          display: flex; justify-content: space-between;
          align-items: flex-start; gap: 8px;
          font-size: 13px; margin-bottom: 10px;
        }
        .summary-item-name {
          color: var(--muted); flex: 1;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .summary-item-price { color: var(--ink2); font-weight: 500; flex-shrink: 0; }
        .summary-divider { height: 1px; background: var(--border); margin: 14px 0; }
        .summary-row {
          display: flex; justify-content: space-between;
          font-size: 13px; color: var(--ink2); margin-bottom: 8px;
        }
        .summary-total {
          display: flex; justify-content: space-between;
          align-items: baseline;
          margin-top: 14px; padding-top: 14px;
          border-top: 1.5px solid var(--sand);
        }
        .total-label  { font-size: 14px; font-weight: 700; color: var(--ink); }
        .total-amount {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px; letter-spacing: 1px; color: var(--ink);
        }

        .place-btn {
          width: 100%; margin-top: 20px;
          padding: 15px;
          background: var(--ink); color: #fff;
          border: none; border-radius: 7px;
          font-size: 13px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          cursor: pointer; font-family: inherit;
          transition: background .2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .place-btn:hover:not(:disabled) { background: var(--gold2); }
        .place-btn:disabled { opacity: .6; cursor: not-allowed; }

        .global-err {
          background: #fef0ee;
          border: 1px solid #f5c0bb;
          border-radius: 7px;
          padding: 12px 16px;
          font-size: 13px;
          color: var(--red);
          margin-top: 14px;
          font-weight: 500;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .co-body        { grid-template-columns: 1fr; padding: 24px 24px 48px; }
          .co-header-inner{ padding: 0 24px; }
          .summary-box    { position: static; }
          /* Move summary above form on mobile */
          .co-body { display: flex; flex-direction: column-reverse; }
        }
        @media (max-width: 600px) {
          .co-header-inner{ padding: 0 16px; }
          .co-body        { padding: 16px 16px 48px; }
          .form-grid      { grid-template-columns: 1fr; }
          .full-col       { grid-column: 1; }
          .steps          { display: none; }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&family=Bebas+Neue&display=swap" rel="stylesheet" />

      <div className="co-wrap">

        {/* ── HEADER ── */}
        <div className="co-header">
          <div className="co-header-inner">
            <div className="co-eyebrow">Almost There</div>
            <h1 className="co-title">Checkout</h1>

            {/* Steps */}
            <div className="steps">
              {[['Cart','step-done'],['Shipping','step-active'],['Confirmation','step-inactive']].map(([lbl,cls], i, arr) => (
                <div key={lbl} style={{ display:'flex', alignItems:'center', gap:0 }}>
                  <div className={`step ${cls}`}>
                    <div className="step-num">{cls === 'step-done' ? '✓' : i + 1}</div>
                    <span className="step-lbl">{lbl}</span>
                  </div>
                  {i < arr.length - 1 && <div className="step-line" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="co-body">

          {/* LEFT — Form */}
          <div>
            {/* Shipping Address */}
            <div className="co-card">
              <div className="co-card-head">
                <span className="co-card-icon">📦</span>
                <span className="co-card-title">Shipping Address</span>
              </div>
              <div className="co-card-body">
                <div className="form-grid">
                  <div className="field full-col">
                    <label>Full Name</label>
                    <input
                      name="fullName" value={form.fullName}
                      onChange={handleChange} placeholder="John Doe"
                      className={errors.fullName ? 'err' : ''}
                    />
                    {errors.fullName && <span className="field-err">{errors.fullName}</span>}
                  </div>
                  <div className="field full-col">
                    <label>Street Address</label>
                    <input
                      name="address" value={form.address}
                      onChange={handleChange} placeholder="Flat no., Street, Area"
                      className={errors.address ? 'err' : ''}
                    />
                    {errors.address && <span className="field-err">{errors.address}</span>}
                  </div>
                  <div className="field">
                    <label>City</label>
                    <input
                      name="city" value={form.city}
                      onChange={handleChange} placeholder="Mumbai"
                      className={errors.city ? 'err' : ''}
                    />
                    {errors.city && <span className="field-err">{errors.city}</span>}
                  </div>
                  <div className="field">
                    <label>Pincode</label>
                    <input
                      name="pincode" value={form.pincode}
                      onChange={handleChange} placeholder="400001"
                      className={errors.pincode ? 'err' : ''}
                      maxLength={6}
                    />
                    {errors.pincode && <span className="field-err">{errors.pincode}</span>}
                  </div>
                  <div className="field full-col">
                    <label>Phone Number</label>
                    <input
                      name="phone" value={form.phone}
                      onChange={handleChange} placeholder="9876543210"
                      className={errors.phone ? 'err' : ''}
                    />
                    {errors.phone && <span className="field-err">{errors.phone}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="co-card">
              <div className="co-card-head">
                <span className="co-card-icon">💳</span>
                <span className="co-card-title">Payment Method</span>
              </div>
              <div className="co-card-body">
                {PAYMENTS.map(p => (
                  <div
                    key={p.id}
                    className={`pay-option${paymentMethod === p.id ? ' selected' : ''}`}
                    onClick={() => setPaymentMethod(p.id)}
                  >
                    <div className="pay-radio">
                      {paymentMethod === p.id && <div className="pay-radio-dot" />}
                    </div>
                    <span className="pay-icon">{p.icon}</span>
                    <div>
                      <div className="pay-label">{p.label}</div>
                      <div className="pay-sub">{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Summary */}
          <div className="summary-box">
            <div className="summary-head">
              <div className="summary-title">Order Summary</div>
            </div>
            <div className="summary-body">
              {cart.map((item, i) => (
                <div className="summary-item" key={i}>
                  <span className="summary-item-name">{item.name} × {item.quantity}</span>
                  <span className="summary-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}

              <div className="summary-divider" />

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? '#2d7a4f' : '#1c1c1c', fontWeight: 600 }}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="summary-row">
                <span>Payment</span>
                <span style={{ fontWeight: 500 }}>{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'}</span>
              </div>

              <div className="summary-total">
                <span className="total-label">Total</span>
                <span className="total-amount">₹{grandTotal.toLocaleString()}</span>
              </div>

              <button
                className="place-btn"
                onClick={handleOrder}
                disabled={loading}
              >
                {loading
                  ? <><span style={{ animation: 'spin .7s linear infinite', display:'inline-block' }}>⏳</span> Placing Order…</>
                  : `Place Order — ₹${grandTotal.toLocaleString()}`
                }
              </button>

              {errors.global && (
                <div className="global-err">⚠ {errors.global}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import { placeOrder } from '../services/api';

// export default function Checkout() {
//   const { cart, total, clearCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [paymentMethod, setPaymentMethod] = useState('COD');
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [form, setForm] = useState({ fullName: user?.name || '', address: '', city: '', pincode: '', phone: '' });

//   const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

//   const handleOrder = async () => {
//     const { fullName, address, city, pincode, phone } = form;
//     if (!fullName || !address || !city || !pincode || !phone) return alert('Please fill all fields');
//     setLoading(true);
//     try {
//       await placeOrder({
//         items: cart.map(i => ({ product: i._id, name: i.name, image: i.images?.[0] || '', price: i.price, quantity: i.quantity, size: i.size, color: i.color })),
//         shippingAddress: form,
//         paymentMethod,
//       });
//       clearCart();
//       setSuccess(true);
//       setTimeout(() => navigate('/my-orders'), 3000);
//     } catch (err) {
//       alert(err.response?.data?.message || 'Order failed. Try again.');
//     } finally { setLoading(false); }
//   };

//   if (success) return (
//     <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: '80vh', textAlign: 'center' }}>
//       <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
//       <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, letterSpacing: 3, color: '#27ae60', marginBottom: 10 }}>Order Placed!</h2>
//       <p style={{ color: '#888' }}>Redirecting to your orders...</p>
//     </div>
//   );

//   return (
//     <div className="page" style={{ background: '#0a0a0a' }}>
//       <div className="container" style={{ padding: '40px 20px' }}>
//         <h1 className="section-title" style={{ marginBottom: 40 }}>Checkout</h1>
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
//           {/* Form */}
//           <div>
//             <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 28, marginBottom: 24 }}>
//               <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 2, marginBottom: 24 }}>SHIPPING ADDRESS</h3>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//                 <div className="form-group" style={{ gridColumn: '1/-1' }}>
//                   <label>Full Name</label>
//                   <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your full name" />
//                 </div>
//                 <div className="form-group" style={{ gridColumn: '1/-1' }}>
//                   <label>Address</label>
//                   <input name="address" value={form.address} onChange={handleChange} placeholder="Street address, flat no." />
//                 </div>
//                 <div className="form-group">
//                   <label>City</label>
//                   <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
//                 </div>
//                 <div className="form-group">
//                   <label>Pincode</label>
//                   <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="400001" />
//                 </div>
//                 <div className="form-group" style={{ gridColumn: '1/-1' }}>
//                   <label>Phone Number</label>
//                   <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
//                 </div>
//               </div>
//             </div>

//             {/* Payment */}
//             <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 28 }}>
//               <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 2, marginBottom: 24 }}>PAYMENT METHOD</h3>
//               {[
//                 { id: 'COD', label: '💵 Cash on Delivery', sub: 'Pay when your order arrives' },
//                 { id: 'Stripe', label: '💳 Pay Online (Stripe)', sub: 'Credit / Debit card' },
//               ].map(p => (
//                 <div key={p.id} onClick={() => setPaymentMethod(p.id)} style={{
//                   border: `2px solid ${paymentMethod === p.id ? '#c8a96e' : '#2a2a2a'}`,
//                   borderRadius: 10, padding: 16, marginBottom: 12,
//                   cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
//                   background: paymentMethod === p.id ? 'rgba(200,169,110,0.06)' : 'transparent',
//                 }}>
//                   <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${paymentMethod === p.id ? '#c8a96e' : '#444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                     {paymentMethod === p.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#c8a96e' }} />}
//                   </div>
//                   <div>
//                     <div style={{ fontWeight: 600, fontSize: 14 }}>{p.label}</div>
//                     <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{p.sub}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Summary */}
//           <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 28, position: 'sticky', top: 90 }}>
//             <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 2, marginBottom: 20 }}>ORDER TOTAL</h3>
//             {cart.map((item, i) => (
//               <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888', marginBottom: 8 }}>
//                 <span>{item.name} × {item.quantity}</span>
//                 <span>₹{(item.price * item.quantity).toLocaleString()}</span>
//               </div>
//             ))}
//             <div style={{ borderTop: '1px solid #1e1e1e', marginTop: 16, paddingTop: 16 }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: 13, marginBottom: 8 }}>
//                 <span>Shipping</span><span style={{ color: '#27ae60' }}>FREE</span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
//                 <span style={{ fontWeight: 700 }}>Total</span>
//                 <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, color: '#c8a96e', letterSpacing: 1 }}>₹{total.toLocaleString()}</span>
//               </div>
//             </div>
//             <button onClick={handleOrder} disabled={loading} className="btn btn-primary"
//               style={{ width: '100%', padding: 16, fontSize: 15, marginTop: 24, letterSpacing: 1, opacity: loading ? 0.7 : 1 }}>
//               {loading ? 'Placing Order...' : `Place Order — ₹${total.toLocaleString()}`}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }