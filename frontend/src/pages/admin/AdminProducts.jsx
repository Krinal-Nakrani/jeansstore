import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';

const EMPTY = { name: '', description: '', price: '', stock: '', sizes: '', colors: '', category: 'Jeans', tags: '', images: '' };

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#0d0d18', border: '1px solid #1a1a2e', borderRadius: 16, width: '100%', maxWidth: 580, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1a1a2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 2, color: '#f0f0f0' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const load = () => {
    setLoading(true);
    getProducts({ limit: 100 }).then(r => setProducts(r.data.products)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p, sizes: p.sizes?.join(',') || '', colors: p.colors?.join(',') || '', tags: p.tags?.join(',') || '', images: p.images?.join(',') || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) return alert('Name, price and stock are required');
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: form.colors ? form.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        images: form.images ? form.images.split(',').map(i => i.trim()).filter(Boolean) : [],
      };
      if (editing) await updateProduct(editing._id, payload);
      else await createProduct(payload);
      setShowModal(false);
      load();
      showToast(editing ? '✅ Product updated!' : '✅ Product added!');
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await deleteProduct(id);
    load();
    showToast('🗑️ Product removed');
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const F = ({ label, name, placeholder, type = 'text', rows }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, color: '#555', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</label>
      {rows ? (
        <textarea rows={rows} value={form[name] || ''} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} placeholder={placeholder}
          style={{ width: '100%', background: '#131325', border: '1px solid #1a1a2e', color: '#f0f0f0', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontFamily: 'Inter, sans-serif', resize: 'vertical', outline: 'none' }} />
      ) : (
        <input type={type} value={form[name] || ''} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} placeholder={placeholder}
          style={{ width: '100%', background: '#131325', border: '1px solid #1a1a2e', color: '#f0f0f0', borderRadius: 8, padding: '10px 14px', fontSize: 13, outline: 'none' }} />
      )}
    </div>
  );

  return (
    <div>
      {toast && <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0d0d18', border: '1px solid #c8a96e', color: '#f0f0f0', padding: '12px 20px', borderRadius: 10, zIndex: 9999, fontSize: 14 }}>{toast}</div>}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, color: '#c8a96e', letterSpacing: 3, marginBottom: 4 }}>MANAGE</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 38, letterSpacing: 2, color: '#f0f0f0', margin: 0 }}>Products</h1>
        </div>
        <button onClick={openAdd} style={{ background: 'linear-gradient(135deg,#c8a96e,#a07840)', border: 'none', color: '#000', padding: '12px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14, letterSpacing: 0.5 }}>
          + Add New Product
        </button>
      </div>

      {/* Search + Count */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            style={{ background: '#0d0d18', border: '1px solid #1a1a2e', color: '#f0f0f0', borderRadius: 10, padding: '10px 14px 10px 38px', fontSize: 13, width: '100%', outline: 'none' }} />
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#444' }}>🔍</span>
        </div>
        <span style={{ color: '#444', fontSize: 13 }}>{filtered.length} products</span>
      </div>

      {/* Table */}
      <div style={{ background: '#0d0d18', border: '1px solid #1a1a2e', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1a1a2e' }}>
              {['Product', 'Price', 'Stock', 'Sizes', 'Colors', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, color: '#444', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: '#444' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 64, color: '#333' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👖</div>
                <div>No products found.</div>
                <button onClick={openAdd} style={{ marginTop: 16, background: 'linear-gradient(135deg,#c8a96e,#a07840)', border: 'none', color: '#000', padding: '10px 22px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Add First Product</button>
              </td></tr>
            ) : filtered.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid #0f0f1a', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#111120'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, background: '#131325', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>👖</span>}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#f0f0f0' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{p.category}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#c8a96e', letterSpacing: 1 }}>₹{p.price?.toLocaleString()}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ color: p.stock < 5 ? '#e74c3c' : p.stock < 20 ? '#f39c12' : '#27ae60', fontWeight: 700, fontSize: 14 }}>{p.stock}</span>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#888' }}>{p.sizes?.join(', ') || '—'}</td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#888' }}>{p.colors?.join(', ') || '—'}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ background: p.isActive ? '#27ae6022' : '#e74c3c22', color: p.isActive ? '#27ae60' : '#e74c3c', border: `1px solid ${p.isActive ? '#27ae6044' : '#e74c3c44'}`, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                    {p.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(p)} style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', color: '#c8a96e', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Edit</button>
                    <button onClick={() => handleDelete(p._id, p.name)} style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)', color: '#e74c3c', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editing ? 'Edit Product' : 'Add New Product'} onClose={() => setShowModal(false)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div style={{ gridColumn: '1/-1' }}><F label="Product Name *" name="name" placeholder="e.g. Classic Slim Fit Jeans" /></div>
            <F label="Price (₹) *" name="price" type="number" placeholder="1299" />
            <F label="Stock *" name="stock" type="number" placeholder="50" />
            <div style={{ gridColumn: '1/-1' }}><F label="Description" name="description" placeholder="Describe the product..." rows={3} /></div>
            <F label="Sizes (comma separated)" name="sizes" placeholder="28,30,32,34,36" />
            <F label="Colors (comma separated)" name="colors" placeholder="Black,Blue,Grey" />
            <F label="Category" name="category" placeholder="Jeans" />
            <F label="Tags (comma separated)" name="tags" placeholder="slim-fit,casual,stretch" />
            <div style={{ gridColumn: '1/-1' }}><F label="Image URLs (comma separated)" name="images" placeholder="https://... , https://..." /></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button onClick={() => setShowModal(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #1a1a2e', color: '#888', padding: '12px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ flex: 2, background: 'linear-gradient(135deg,#c8a96e,#a07840)', border: 'none', color: '#000', padding: '12px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14, opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
