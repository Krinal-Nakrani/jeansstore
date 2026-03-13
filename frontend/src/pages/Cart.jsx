import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, removeItem, updateQty, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) return navigate('/login');
    navigate('/checkout');
  };

  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  /* ── EMPTY STATE ── */
  if (cart.length === 0) return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { background: #faf7f2; }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&family=Bebas+Neue&display=swap" rel="stylesheet" />
      <div style={{
        minHeight: '100vh', background: '#faf7f2',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
        padding: '80px 20px', paddingTop: '120px',
      }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>🛍️</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(24px,4vw,36px)',
          fontWeight: 700, color: '#1c1c1c',
          margin: '0 0 12px', textAlign: 'center',
        }}>Your Cart is Empty</h2>
        <p style={{ color: '#9a9080', marginBottom: 32, fontSize: 15, textAlign: 'center' }}>
          Looks like you haven't added any jeans yet.
        </p>
        <Link to="/shop" style={{
          background: '#1c1c1c', color: '#fff',
          padding: '14px 36px', textDecoration: 'none',
          fontSize: '13px', fontWeight: 700,
          letterSpacing: '2px', borderRadius: '5px',
          textTransform: 'uppercase',
        }}>Browse Collection</Link>
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

        .cart-wrap {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          padding-top: 64px;
        }

        /* ── HEADER ── */
        .cart-header {
          background: var(--beige);
          border-bottom: 1px solid var(--border);
          padding: 36px 0 28px;
        }
        .cart-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .cart-eyebrow {
          font-size: 10px;
          letter-spacing: 3.5px;
          font-weight: 700;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .cart-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 700;
          color: var(--ink);
          margin: 0;
        }
        .cart-meta {
          font-size: 13px;
          color: var(--muted);
        }
        .clear-btn {
          background: none; border: none;
          font-size: 12px; font-weight: 600;
          color: var(--red); cursor: pointer;
          letter-spacing: .5px; padding: 0;
          font-family: inherit;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* ── BODY ── */
        .cart-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 36px 40px 64px;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
          align-items: start;
        }

        /* ── ITEM LIST ── */
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cart-item {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          gap: 18px;
          align-items: center;
          transition: box-shadow .2s;
        }
        .cart-item:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,.06);
        }

        /* Thumbnail */
        .item-thumb {
          width: 88px; height: 100px;
          background: var(--beige);
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--border);
        }
        .item-thumb img {
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .item-thumb-emoji { font-size: 36px; }

        /* Info */
        .item-info { flex: 1; min-width: 0; }
        .item-cat {
          font-size: 9px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: var(--muted); margin-bottom: 4px;
        }
        .item-name {
          font-size: 14px; font-weight: 600;
          color: var(--ink); margin-bottom: 6px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .item-meta {
          display: flex; flex-wrap: wrap; gap: 8px;
          margin-bottom: 10px;
        }
        .item-meta-tag {
          font-size: 11px;
          background: var(--beige);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 2px 8px;
          color: var(--ink2);
          font-weight: 500;
        }
        .item-price {
          font-size: 15px;
          font-weight: 700;
          color: var(--ink);
        }

        /* Qty */
        .qty-ctrl {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--border);
          border-radius: 7px;
          overflow: hidden;
          background: var(--white);
          flex-shrink: 0;
        }
        .qty-btn {
          width: 34px; height: 34px;
          background: none; border: none;
          font-size: 17px; cursor: pointer;
          color: var(--ink2);
          transition: background .15s;
          display: flex; align-items: center; justify-content: center;
        }
        .qty-btn:hover { background: var(--beige); }
        .qty-val {
          width: 34px; text-align: center;
          font-size: 13px; font-weight: 700;
          color: var(--ink);
          border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
        }

        /* Remove */
        .remove-btn {
          background: none; border: none;
          color: #ccc; cursor: pointer;
          font-size: 18px; padding: 6px;
          border-radius: 5px;
          transition: all .15s;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .remove-btn:hover { color: var(--red); background: #fef0ee; }

        /* ── ORDER SUMMARY ── */
        .order-summary {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          position: sticky;
          top: 84px;
        }
        .summary-head {
          background: var(--beige);
          padding: 18px 24px;
          border-bottom: 1px solid var(--border);
        }
        .summary-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--ink);
        }
        .summary-body { padding: 20px 24px; }

        .summary-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: var(--ink2);
          margin-bottom: 10px;
        }
        .summary-line-name {
          flex: 1;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-right: 8px;
          color: var(--muted);
        }
        .summary-line-price { font-weight: 500; flex-shrink: 0; }

        .summary-divider {
          height: 1px;
          background: var(--border);
          margin: 14px 0;
        }

        .summary-shipping {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--ink2);
          margin-bottom: 8px;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1.5px solid var(--sand);
        }
        .total-label { font-size: 14px; font-weight: 700; color: var(--ink); }
        .total-amount {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px; letter-spacing: 1px;
          color: var(--ink);
        }

        .checkout-btn {
          width: 100%;
          margin-top: 20px;
          padding: 15px;
          background: var(--ink);
          color: #fff;
          border: none;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: inherit;
          transition: background .2s;
        }
        .checkout-btn:hover { background: var(--gold2); }

        .continue-link {
          display: block;
          text-align: center;
          margin-top: 14px;
          font-size: 12px;
          color: var(--muted);
          text-decoration: none;
          transition: color .15s;
          letter-spacing: .5px;
        }
        .continue-link:hover { color: var(--gold); }

        /* Free shipping bar */
        .free-ship-bar {
          margin-top: 18px;
          padding: 12px 14px;
          background: #f0faf5;
          border: 1px solid #c3e6d1;
          border-radius: 8px;
          font-size: 12px;
          color: var(--green);
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .cart-body {
            grid-template-columns: 1fr;
            padding: 24px 24px 48px;
          }
          .cart-header-inner { padding: 0 24px; }
          .order-summary { position: static; }
        }
        @media (max-width: 600px) {
          .cart-header-inner { padding: 0 16px; }
          .cart-body { padding: 16px 16px 48px; }
          .cart-item { padding: 14px 14px; gap: 12px; }
          .item-thumb { width: 72px; height: 82px; }
          .item-name  { font-size: 13px; }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&family=Bebas+Neue&display=swap" rel="stylesheet" />

      <div className="cart-wrap">

        {/* ── HEADER ── */}
        <div className="cart-header">
          <div className="cart-header-inner">
            <div>
              <div className="cart-eyebrow">Review Your Selection</div>
              <h1 className="cart-title">Shopping Cart</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <span className="cart-meta">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
              <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="cart-body">

          {/* Items list */}
          <div className="cart-items">
            {cart.map((item, index) => (
              <div className="cart-item" key={index}>
                {/* Thumbnail */}
                <div className="item-thumb">
                  {item.images?.[0]
                    ? <img src={item.images[0]} alt={item.name} />
                    : <span className="item-thumb-emoji">👖</span>
                  }
                </div>

                {/* Info */}
                <div className="item-info">
                  <div className="item-cat">{item.category || 'DENIM'}</div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-meta">
                    {item.size  && <span className="item-meta-tag">Size: {item.size}</span>}
                    {item.color && <span className="item-meta-tag">Color: {item.color}</span>}
                  </div>
                  <div className="item-price">₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>

                {/* Qty */}
                <div className="qty-ctrl">
                  <button className="qty-btn"
                    onClick={() => item.quantity > 1 ? updateQty(index, item.quantity - 1) : removeItem(index)}>
                    −
                  </button>
                  <div className="qty-val">{item.quantity}</div>
                  <button className="qty-btn" onClick={() => updateQty(index, item.quantity + 1)}>
                    +
                  </button>
                </div>

                {/* Remove */}
                <button className="remove-btn" onClick={() => removeItem(index)} title="Remove item">
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-head">
              <div className="summary-title">Order Summary</div>
            </div>
            <div className="summary-body">
              {/* Line items */}
              {cart.map((item, i) => (
                <div className="summary-line" key={i}>
                  <span className="summary-line-name">{item.name} × {item.quantity}</span>
                  <span className="summary-line-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}

              <div className="summary-divider" />

              {/* Shipping */}
              <div className="summary-shipping">
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? '#2d7a4f' : '#1c1c1c', fontWeight: 600 }}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>

              {/* Free shipping nudge */}
              {shipping > 0 && (
                <div style={{
                  fontSize: 11, color: '#b89b6a', fontWeight: 500,
                  background: '#fdf8f0', border: '1px solid #e8dcc8',
                  borderRadius: 6, padding: '8px 12px', marginTop: 8,
                }}>
                  🚚 Add ₹{(999 - total).toLocaleString()} more for free shipping!
                </div>
              )}

              {/* Total */}
              <div className="summary-total">
                <span className="total-label">Total</span>
                <span className="total-amount">₹{grandTotal.toLocaleString()}</span>
              </div>

              {/* Checkout */}
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout →
              </button>

              {shipping === 0 && (
                <div className="free-ship-bar">
                  ✓ You've unlocked free shipping!
                </div>
              )}

              <Link to="/shop" className="continue-link">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// import { Link, useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';

// export default function Cart() {
//   const { cart, removeItem, updateQty, total, clearCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const handleCheckout = () => {
//     if (!user) return navigate('/login');
//     navigate('/checkout');
//   };

//   if (cart.length === 0) return (
//     <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
//       <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
//       <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, letterSpacing: 3, marginBottom: 10 }}>Your Cart is Empty</h2>
//       <p style={{ color: '#555', marginBottom: 30 }}>Looks like you haven't added any jeans yet.</p>
//       <Link to="/shop" className="btn btn-primary">Browse Collection</Link>
//     </div>
//   );

//   return (
//     <div className="page" style={{ background: '#0a0a0a' }}>
//       <div className="container" style={{ padding: '40px 20px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
//           <h1 className="section-title">Your Cart</h1>
//           <button onClick={clearCart} style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: 13, cursor: 'pointer' }}>Clear Cart</button>
//         </div>

//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
//           {/* Items */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//             {cart.map((item, index) => (
//               <div key={index} style={{
//                 background: '#111', border: '1px solid #1e1e1e',
//                 borderRadius: 12, padding: 20,
//                 display: 'flex', gap: 20, alignItems: 'center',
//               }}>
//                 {/* Image */}
//                 <div style={{ width: 90, height: 90, background: '#1a1a1a', borderRadius: 8, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   {item.images?.[0] ? (
//                     <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                   ) : <span style={{ fontSize: 32 }}>👖</span>}
//                 </div>

//                 {/* Info */}
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
//                   <div style={{ fontSize: 12, color: '#555', marginBottom: 8 }}>
//                     Size: <span style={{ color: '#c8a96e' }}>{item.size}</span> &nbsp;|&nbsp;
//                     Color: <span style={{ color: '#c8a96e' }}>{item.color}</span>
//                   </div>
//                   <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#c8a96e', letterSpacing: 1 }}>
//                     ₹{(item.price * item.quantity).toLocaleString()}
//                   </div>
//                 </div>

//                 {/* Qty Control */}
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                   <button onClick={() => item.quantity > 1 ? updateQty(index, item.quantity - 1) : removeItem(index)}
//                     style={{ width: 32, height: 32, border: '1px solid #2a2a2a', borderRadius: 6, background: 'transparent', color: '#fff', fontSize: 18, cursor: 'pointer' }}>−</button>
//                   <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
//                   <button onClick={() => updateQty(index, item.quantity + 1)}
//                     style={{ width: 32, height: 32, border: '1px solid #2a2a2a', borderRadius: 6, background: 'transparent', color: '#fff', fontSize: 18, cursor: 'pointer' }}>+</button>
//                 </div>

//                 {/* Remove */}
//                 <button onClick={() => removeItem(index)}
//                   style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 18, padding: 8 }}>✕</button>
//               </div>
//             ))}
//           </div>

//           {/* Summary */}
//           <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 28, position: 'sticky', top: 90 }}>
//             <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, letterSpacing: 2, marginBottom: 24 }}>ORDER SUMMARY</h3>
//             <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 16 }}>
//               {cart.map((item, i) => (
//                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13, color: '#888' }}>
//                   <span>{item.name} × {item.quantity}</span>
//                   <span>₹{(item.price * item.quantity).toLocaleString()}</span>
//                 </div>
//               ))}
//             </div>
//             <div style={{ borderTop: '1px solid #1e1e1e', marginTop: 16, paddingTop: 16 }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#888', fontSize: 13 }}>
//                 <span>Shipping</span><span style={{ color: '#27ae60' }}>FREE</span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
//                 <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
//                 <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, color: '#c8a96e', letterSpacing: 1 }}>₹{total.toLocaleString()}</span>
//               </div>
//             </div>
//             <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', padding: 16, fontSize: 15, marginTop: 24, letterSpacing: 1 }}>
//               Proceed to Checkout →
//             </button>
//             <Link to="/shop" style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 13, color: '#555' }}>← Continue Shopping</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }