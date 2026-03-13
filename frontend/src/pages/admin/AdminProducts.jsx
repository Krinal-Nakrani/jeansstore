import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';

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
  red:      '#c0392b',
  redBg:    '#fef0ee',
  redBdr:   '#f5c0bb',
  green:    '#2d7a4f',
  greenBg:  '#edf7f2',
  greenBdr: '#a8dfc0',
  orange:   '#b07d0e',
};

const CATEGORIES = ['Jeans', 'Cargo', 'Shorts', 'Joggers', 'Shirts', 'Other'];
const EMPTY = { name: '', description: '', price: '', originalPrice: '', stock: '', sizes: '', colors: '', category: 'Jeans', tags: '', images: '' };

function Field({ label, name, form, setForm, placeholder, type = 'text', rows }) {
  const base = {
    width: '100%', background: T.bg,
    border: `1.5px solid ${T.border}`, color: T.ink,
    borderRadius: 8, padding: '10px 14px',
    fontSize: 13, fontFamily: 'inherit', outline: 'none',
    transition: 'border-color .2s', boxSizing: 'border-box',
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 10, color: T.muted, marginBottom: 7, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>{label}</label>
      {rows
        ? <textarea rows={rows} value={form[name] || ''} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} placeholder={placeholder} style={{ ...base, resize: 'vertical' }}
            onFocus={e => e.target.style.borderColor = T.gold} onBlur={e => e.target.style.borderColor = T.border} />
        : <input type={type} value={form[name] || ''} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} placeholder={placeholder} style={base}
            onFocus={e => e.target.style.borderColor = T.gold} onBlur={e => e.target.style.borderColor = T.border} />
      }
    </div>
  );
}

export default function AdminProducts() {
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [search,    setSearch]    = useState('');
  const [deleting,  setDeleting]  = useState(null);
  const [toast,     setToast]     = useState({ msg: '', ok: true });

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg: '', ok: true }), 2600);
  };

  const load = () => {
    setLoading(true);
    getProducts({ limit: 100 })
      .then(r => setProducts(r.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p, sizes: p.sizes?.join(',') || '', colors: p.colors?.join(',') || '', tags: p.tags?.join(',') || '', images: p.images?.join(',') || '', originalPrice: p.originalPrice || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) { showToast('Name, price and stock are required', false); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price:         Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock:         Number(form.stock),
        sizes:   form.sizes  ? form.sizes.split(',').map(s => s.trim()).filter(Boolean)  : [],
        colors:  form.colors ? form.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
        tags:    form.tags   ? form.tags.split(',').map(t => t.trim()).filter(Boolean)   : [],
        images:  form.images ? form.images.split(',').map(i => i.trim()).filter(Boolean) : [],
      };
      if (editing) await updateProduct(editing._id, payload);
      else         await createProduct(payload);
      setShowModal(false); load();
      showToast(editing ? 'Product updated!' : 'Product added!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', false);
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteProduct(deleting.id);
      load(); showToast('Product removed');
    } catch (err) {
      showToast(err?.message || 'Delete failed', false);
    }
    setDeleting(null);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const stockColor = s => s === 0 ? T.red : s < 5 ? T.orange : T.green;

  return (
    <div style={{ fontFamily: "'DM Sans','Inter',sans-serif", color: T.ink }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      {/* Toast */}
      {toast.msg && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, background: T.card, borderLeft: `3px solid ${toast.ok ? T.gold : T.red}`, border: `1px solid ${toast.ok ? T.border : T.redBdr}`, color: T.ink, padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, animation: 'fadeUp .3s ease', boxShadow: '0 8px 24px rgba(0,0,0,.12)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: toast.ok ? T.gold : T.red }}>{toast.ok ? '✓' : '✕'}</span> {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: T.gold, letterSpacing: 3, marginBottom: 5, textTransform: 'uppercase', fontWeight: 700 }}>Manage</div>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, letterSpacing: 2, color: T.ink, margin: 0 }}>Products</h1>
          <p style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{products.length} total products</p>
        </div>
        <button onClick={openAdd} style={{ background: T.ink, color: '#fff', border: 'none', borderRadius: 8, padding: '11px 22px', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 1, textTransform: 'uppercase' }}>
          + Add Product
        </button>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 8, overflow: 'hidden', flex: 1, maxWidth: 360, transition: 'border-color .2s' }}
          onFocusCapture={e => e.currentTarget.style.borderColor = T.gold}
          onBlurCapture={e => e.currentTarget.style.borderColor = T.border}>
          <span style={{ padding: '0 12px', color: T.muted }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or category…"
            style={{ flex: 1, background: 'transparent', border: 'none', color: T.ink, padding: '10px 0', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', paddingRight: 12, fontSize: 18 }}>×</button>}
        </div>
        <span style={{ fontSize: 13, color: T.muted }}>{filtered.length} of {products.length}</span>
      </div>

      {/* Table */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: T.beige }}>
                {['Product', 'Category', 'Price', 'Stock', 'Sizes', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, borderBottom: `1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: 60, textAlign: 'center' }}>
                  <div style={{ width: 34, height: 34, border: `3px solid ${T.sand}`, borderTopColor: T.gold, borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto' }} />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '56px 20px' }}>
                  <div style={{ fontSize: 40, marginBottom: 12, opacity: .3 }}>👖</div>
                  <div style={{ fontSize: 14, color: T.ink2, fontWeight: 600, marginBottom: 14 }}>{search ? 'No products match' : 'No products yet'}</div>
                  <button onClick={search ? () => setSearch('') : openAdd}
                    style={{ background: T.beige, color: T.gold2, border: `1px solid ${T.border}`, padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 12 }}>
                    {search ? 'Clear search' : '+ Add First Product'}
                  </button>
                </td></tr>
              ) : filtered.map((p, i) => {
                const hasDiscount = p.originalPrice && p.originalPrice > p.price;
                const pct = hasDiscount ? Math.round((1 - p.price / p.originalPrice) * 100) : null;
                return (
                  <tr key={p._id}
                    style={{ borderBottom: `1px solid ${T.border}`, transition: 'background .15s', background: i % 2 === 0 ? T.card : T.bg }}
                    onMouseEnter={e => e.currentTarget.style.background = T.beige}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? T.card : T.bg}>
                    <td style={{ padding: '13px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 50, background: T.sand, borderRadius: 8, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${T.border}`, fontSize: 18 }}>
                          {p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👖'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: T.ink }}>{p.name}</div>
                          {pct && <div style={{ fontSize: 10, color: T.red, fontWeight: 700, marginTop: 2 }}>–{pct}% OFF</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 18px' }}>
                      <span style={{ background: T.beige, color: T.gold2, border: `1px solid ${T.sand}`, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{p.category || '—'}</span>
                    </td>
                    <td style={{ padding: '13px 18px' }}>
                      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: T.ink, letterSpacing: 1 }}>₹{p.price?.toLocaleString()}</div>
                      {hasDiscount && <div style={{ fontSize: 11, color: T.muted, textDecoration: 'line-through' }}>₹{p.originalPrice?.toLocaleString()}</div>}
                    </td>
                    <td style={{ padding: '13px 18px' }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: stockColor(p.stock) }}>{p.stock}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: stockColor(p.stock), letterSpacing: 1, marginLeft: 4 }}>{p.stock === 0 ? 'OUT' : p.stock < 5 ? 'LOW' : 'OK'}</span>
                    </td>
                    <td style={{ padding: '13px 18px' }}>
                      {p.sizes?.length > 0
                        ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            {p.sizes.map(s => <span key={s} style={{ background: T.beige, border: `1px solid ${T.border}`, color: T.ink2, padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{s}</span>)}
                          </div>
                        : <span style={{ color: T.muted }}>—</span>
                      }
                    </td>
                    <td style={{ padding: '13px 18px' }}>
                      <span style={{
                        background: p.isActive !== false ? T.greenBg : T.redBg,
                        color:      p.isActive !== false ? T.green   : T.red,
                        border:    `1px solid ${p.isActive !== false ? T.greenBdr : T.redBdr}`,
                        padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                      }}>
                        {p.isActive !== false ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 18px' }}>
                      <div style={{ display: 'flex', gap: 7 }}>
                        <button onClick={() => openEdit(p)} style={{ background: T.beige, color: T.gold2, border: `1px solid ${T.border}`, padding: '6px 13px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit' }}>✏ Edit</button>
                        <button onClick={() => setDeleting({ id: p._id, name: p.name })} style={{ background: T.redBg, color: T.red, border: `1px solid ${T.redBdr}`, padding: '6px 13px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit' }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,28,28,.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.15)', animation: 'fadeUp .25s ease' }}>
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.border}`, background: T.beige, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1 }}>
              <div>
                <div style={{ fontSize: 10, color: T.gold, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>{editing ? 'Editing' : 'New'}</div>
                <h3 style={{ margin: 0, fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: 2, color: T.ink }}>{editing ? 'Edit Product' : 'Add New Product'}</h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', fontSize: 22 }}>×</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <div style={{ gridColumn: '1/-1' }}><Field label="Product Name *" name="name" form={form} setForm={setForm} placeholder="e.g. Classic Slim Fit Jeans" /></div>
                <Field label="Selling Price (₹) *" name="price"         form={form} setForm={setForm} type="number" placeholder="1299" />
                <Field label="Original Price (₹)"  name="originalPrice" form={form} setForm={setForm} type="number" placeholder="1999" />
                <Field label="Stock *"              name="stock"         form={form} setForm={setForm} type="number" placeholder="50" />
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 10, color: T.muted, marginBottom: 7, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    style={{ width: '100%', background: T.bg, border: `1.5px solid ${T.border}`, color: T.ink, borderRadius: 8, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1/-1' }}><Field label="Description" name="description" form={form} setForm={setForm} placeholder="Describe the product…" rows={3} /></div>
                <Field label="Sizes (comma sep.)"  name="sizes"   form={form} setForm={setForm} placeholder="28,30,32,34,36" />
                <Field label="Colors (comma sep.)" name="colors"  form={form} setForm={setForm} placeholder="Black,Blue,Grey" />
                <Field label="Tags (comma sep.)"   name="tags"    form={form} setForm={setForm} placeholder="slim-fit,casual" />
                <div style={{ gridColumn: '1/-1' }}><Field label="Image URLs (comma sep.)" name="images" form={form} setForm={setForm} placeholder="https://… , https://…" /></div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, background: T.beige, border: `1px solid ${T.border}`, color: T.ink2, padding: 12, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600 }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={{ flex: 2, background: T.ink, border: 'none', color: '#fff', padding: 12, borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit', opacity: saving ? .7 : 1 }}>
                  {saving ? 'Saving…' : editing ? '✓ Update Product' : '+ Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleting && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,28,28,.55)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 28, maxWidth: 380, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,.15)', animation: 'fadeUp .25s ease' }}>
            <div style={{ fontSize: 38, marginBottom: 12, opacity: .6 }}>🗑️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginBottom: 8 }}>Delete Product?</div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>
              "<strong style={{ color: T.ink2 }}>{deleting.name}</strong>" will be permanently removed.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleting(null)} style={{ flex: 1, background: T.beige, border: `1px solid ${T.border}`, color: T.ink2, padding: 11, borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Cancel</button>
              <button onClick={confirmDelete} style={{ flex: 1, background: T.redBg, border: `1px solid ${T.redBdr}`, color: T.red, padding: 11, borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';

// const EMPTY = { name: '', description: '', price: '', stock: '', sizes: '', colors: '', category: 'Jeans', tags: '', images: '' };

// function Modal({ title, onClose, children }) {
//   return (
//     <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
//       <div style={{ background: '#0d0d18', border: '1px solid #1a1a2e', borderRadius: 16, width: '100%', maxWidth: 580, maxHeight: '90vh', overflow: 'auto' }}>
//         <div style={{ padding: '20px 24px', borderBottom: '1px solid #1a1a2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <h3 style={{ margin: 0, fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 2, color: '#f0f0f0' }}>{title}</h3>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 20 }}>✕</button>
//         </div>
//         <div style={{ padding: 24 }}>{children}</div>
//       </div>
//     </div>
//   );
// }

// export default function AdminProducts() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState(EMPTY);
//   const [saving, setSaving] = useState(false);
//   const [search, setSearch] = useState('');
//   const [toast, setToast] = useState('');

//   const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

//   const load = () => {
//     setLoading(true);
//     getProducts({ limit: 100 }).then(r => setProducts(r.data.products)).finally(() => setLoading(false));
//   };

//   useEffect(() => { load(); }, []);

//   const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
//   const openEdit = (p) => {
//     setEditing(p);
//     setForm({ ...p, sizes: p.sizes?.join(',') || '', colors: p.colors?.join(',') || '', tags: p.tags?.join(',') || '', images: p.images?.join(',') || '' });
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     if (!form.name || !form.price || !form.stock) return alert('Name, price and stock are required');
//     setSaving(true);
//     try {
//       const payload = {
//         ...form,
//         price: Number(form.price),
//         stock: Number(form.stock),
//         sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
//         colors: form.colors ? form.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
//         tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
//         images: form.images ? form.images.split(',').map(i => i.trim()).filter(Boolean) : [],
//       };
//       if (editing) await updateProduct(editing._id, payload);
//       else await createProduct(payload);
//       setShowModal(false);
//       load();
//       showToast(editing ? '✅ Product updated!' : '✅ Product added!');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Save failed');
//     } finally { setSaving(false); }
//   };

//   const handleDelete = async (id, name) => {
//     if (!confirm(`Delete "${name}"?`)) return;
//     await deleteProduct(id);
//     load();
//     showToast('🗑️ Product removed');
//   };

//   const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

//   const F = ({ label, name, placeholder, type = 'text', rows }) => (
//     <div style={{ marginBottom: 16 }}>
//       <label style={{ display: 'block', fontSize: 11, color: '#555', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</label>
//       {rows ? (
//         <textarea rows={rows} value={form[name] || ''} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} placeholder={placeholder}
//           style={{ width: '100%', background: '#131325', border: '1px solid #1a1a2e', color: '#f0f0f0', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontFamily: 'Inter, sans-serif', resize: 'vertical', outline: 'none' }} />
//       ) : (
//         <input type={type} value={form[name] || ''} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} placeholder={placeholder}
//           style={{ width: '100%', background: '#131325', border: '1px solid #1a1a2e', color: '#f0f0f0', borderRadius: 8, padding: '10px 14px', fontSize: 13, outline: 'none' }} />
//       )}
//     </div>
//   );

//   return (
//     <div>
//       {toast && <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0d0d18', border: '1px solid #c8a96e', color: '#f0f0f0', padding: '12px 20px', borderRadius: 10, zIndex: 9999, fontSize: 14 }}>{toast}</div>}

//       {/* Header */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
//         <div>
//           <div style={{ fontSize: 11, color: '#c8a96e', letterSpacing: 3, marginBottom: 4 }}>MANAGE</div>
//           <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 38, letterSpacing: 2, color: '#f0f0f0', margin: 0 }}>Products</h1>
//         </div>
//         <button onClick={openAdd} style={{ background: 'linear-gradient(135deg,#c8a96e,#a07840)', border: 'none', color: '#000', padding: '12px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14, letterSpacing: 0.5 }}>
//           + Add New Product
//         </button>
//       </div>

//       {/* Search + Count */}
//       <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
//         <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
//           <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
//             style={{ background: '#0d0d18', border: '1px solid #1a1a2e', color: '#f0f0f0', borderRadius: 10, padding: '10px 14px 10px 38px', fontSize: 13, width: '100%', outline: 'none' }} />
//           <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#444' }}>🔍</span>
//         </div>
//         <span style={{ color: '#444', fontSize: 13 }}>{filtered.length} products</span>
//       </div>

//       {/* Table */}
//       <div style={{ background: '#0d0d18', border: '1px solid #1a1a2e', borderRadius: 14, overflow: 'hidden' }}>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr style={{ borderBottom: '1px solid #1a1a2e' }}>
//               {['Product', 'Price', 'Stock', 'Sizes', 'Colors', 'Status', 'Actions'].map(h => (
//                 <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, color: '#444', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: '#444' }}>Loading...</td></tr>
//             ) : filtered.length === 0 ? (
//               <tr><td colSpan={7} style={{ textAlign: 'center', padding: 64, color: '#333' }}>
//                 <div style={{ fontSize: 40, marginBottom: 12 }}>👖</div>
//                 <div>No products found.</div>
//                 <button onClick={openAdd} style={{ marginTop: 16, background: 'linear-gradient(135deg,#c8a96e,#a07840)', border: 'none', color: '#000', padding: '10px 22px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Add First Product</button>
//               </td></tr>
//             ) : filtered.map(p => (
//               <tr key={p._id} style={{ borderBottom: '1px solid #0f0f1a', transition: 'background 0.15s' }}
//                 onMouseEnter={e => e.currentTarget.style.background = '#111120'}
//                 onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
//                 <td style={{ padding: '14px 20px' }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                     <div style={{ width: 44, height: 44, background: '#131325', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                       {p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>👖</span>}
//                     </div>
//                     <div>
//                       <div style={{ fontWeight: 600, fontSize: 13, color: '#f0f0f0' }}>{p.name}</div>
//                       <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{p.category}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td style={{ padding: '14px 20px', fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#c8a96e', letterSpacing: 1 }}>₹{p.price?.toLocaleString()}</td>
//                 <td style={{ padding: '14px 20px' }}>
//                   <span style={{ color: p.stock < 5 ? '#e74c3c' : p.stock < 20 ? '#f39c12' : '#27ae60', fontWeight: 700, fontSize: 14 }}>{p.stock}</span>
//                 </td>
//                 <td style={{ padding: '14px 20px', fontSize: 12, color: '#888' }}>{p.sizes?.join(', ') || '—'}</td>
//                 <td style={{ padding: '14px 20px', fontSize: 12, color: '#888' }}>{p.colors?.join(', ') || '—'}</td>
//                 <td style={{ padding: '14px 20px' }}>
//                   <span style={{ background: p.isActive ? '#27ae6022' : '#e74c3c22', color: p.isActive ? '#27ae60' : '#e74c3c', border: `1px solid ${p.isActive ? '#27ae6044' : '#e74c3c44'}`, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
//                     {p.isActive ? 'Active' : 'Hidden'}
//                   </span>
//                 </td>
//                 <td style={{ padding: '14px 20px' }}>
//                   <div style={{ display: 'flex', gap: 8 }}>
//                     <button onClick={() => openEdit(p)} style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', color: '#c8a96e', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Edit</button>
//                     <button onClick={() => handleDelete(p._id, p.name)} style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)', color: '#e74c3c', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Delete</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add/Edit Modal */}
//       {showModal && (
//         <Modal title={editing ? 'Edit Product' : 'Add New Product'} onClose={() => setShowModal(false)}>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
//             <div style={{ gridColumn: '1/-1' }}><F label="Product Name *" name="name" placeholder="e.g. Classic Slim Fit Jeans" /></div>
//             <F label="Price (₹) *" name="price" type="number" placeholder="1299" />
//             <F label="Stock *" name="stock" type="number" placeholder="50" />
//             <div style={{ gridColumn: '1/-1' }}><F label="Description" name="description" placeholder="Describe the product..." rows={3} /></div>
//             <F label="Sizes (comma separated)" name="sizes" placeholder="28,30,32,34,36" />
//             <F label="Colors (comma separated)" name="colors" placeholder="Black,Blue,Grey" />
//             <F label="Category" name="category" placeholder="Jeans" />
//             <F label="Tags (comma separated)" name="tags" placeholder="slim-fit,casual,stretch" />
//             <div style={{ gridColumn: '1/-1' }}><F label="Image URLs (comma separated)" name="images" placeholder="https://... , https://..." /></div>
//           </div>
//           <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
//             <button onClick={() => setShowModal(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #1a1a2e', color: '#888', padding: '12px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>Cancel</button>
//             <button onClick={handleSave} disabled={saving} style={{ flex: 2, background: 'linear-gradient(135deg,#c8a96e,#a07840)', border: 'none', color: '#000', padding: '12px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14, opacity: saving ? 0.7 : 1 }}>
//               {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }
