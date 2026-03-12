import { useState } from "react";

const sections = [
  "Overview",
  "Tech Stack",
  "Folder Structure",
  "Flow & Architecture",
  "Setup & Install",
  "Key Code",
  "Admin Panel",
  "Cloud Deploy",
  "Marketing",
];

const colors = {
  bg: "#0a0a0f",
  card: "#12121a",
  border: "#1e1e2e",
  accent: "#6c63ff",
  accent2: "#ff6584",
  accent3: "#43e97b",
  text: "#e2e2f0",
  muted: "#8888aa",
};

function Badge({ color, children }) {
  return (
    <span style={{
      background: color + "22",
      border: `1px solid ${color}55`,
      color: color,
      borderRadius: 6,
      padding: "2px 10px",
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 1,
    }}>{children}</span>
  );
}

function Card({ title, accent, children }) {
  return (
    <div style={{
      background: colors.card,
      border: `1px solid ${accent || colors.border}44`,
      borderLeft: `3px solid ${accent || colors.accent}`,
      borderRadius: 12,
      padding: "20px 24px",
      marginBottom: 18,
    }}>
      {title && <div style={{ color: accent || colors.accent, fontWeight: 800, fontSize: 13, letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>{title}</div>}
      {children}
    </div>
  );
}

function Code({ children }) {
  return (
    <pre style={{
      background: "#07070e",
      border: `1px solid ${colors.border}`,
      borderRadius: 8,
      padding: "14px 18px",
      overflowX: "auto",
      fontSize: 12,
      color: "#b8c0d4",
      lineHeight: 1.7,
      margin: "10px 0",
    }}>{children}</pre>
  );
}

function Tree({ items, indent = 0 }) {
  return (
    <div style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 1.8 }}>
      {items.map((item, i) => (
        <div key={i}>
          <span style={{ color: colors.muted }}>{" ".repeat(indent * 2)}{indent > 0 ? "├── " : ""}</span>
          <span style={{ color: item.type === "folder" ? colors.accent : item.type === "important" ? colors.accent3 : colors.text }}>
            {item.name}
          </span>
          {item.note && <span style={{ color: colors.muted, fontSize: 11 }}>  ← {item.note}</span>}
          {item.children && <Tree items={item.children} indent={indent + 1} />}
        </div>
      ))}
    </div>
  );
}

const folderStructure = [
  {
    name: "jeans-ecommerce/", type: "folder", children: [
      {
        name: "frontend/  (React — Customer Site)", type: "folder", children: [
          { name: "public/", type: "folder" },
          {
            name: "src/", type: "folder", children: [
              { name: "components/", type: "folder", note: "Navbar, Footer, ProductCard, Cart" },
              { name: "pages/", type: "folder", note: "Home, Shop, ProductDetail, Cart, Checkout, Orders" },
              { name: "context/", type: "folder", note: "CartContext, AuthContext" },
              { name: "hooks/", type: "folder", note: "useProducts, useAuth, useCart" },
              { name: "services/", type: "folder", note: "api.js — all Axios calls" },
              { name: "styles/", type: "folder", note: "global.css, variables.css" },
              { name: "utils/", type: "folder", note: "formatPrice, validators" },
              { name: "App.jsx", type: "important" },
              { name: "main.jsx", type: "important" },
            ]
          },
          { name: "package.json", type: "file" },
          { name: ".env", type: "file", note: "VITE_API_URL=http://localhost:5000" },
        ]
      },
      {
        name: "admin/  (Angular — Admin Dashboard)", type: "folder", children: [
          {
            name: "src/app/", type: "folder", children: [
              { name: "modules/", type: "folder", note: "products/, orders/, users/, analytics/" },
              { name: "services/", type: "folder", note: "api.service.ts, auth.service.ts" },
              { name: "guards/", type: "folder", note: "auth.guard.ts" },
              { name: "components/", type: "folder", note: "sidebar, header, tables" },
            ]
          },
          { name: "environments/", type: "folder" },
          { name: "angular.json", type: "file" },
        ]
      },
      {
        name: "backend/  (Node + Express)", type: "folder", children: [
          {
            name: "src/", type: "folder", children: [
              { name: "routes/", type: "folder", note: "products, auth, orders, payments, users" },
              { name: "controllers/", type: "folder", note: "business logic per route" },
              { name: "models/", type: "folder", note: "Sequelize models: User, Product, Order" },
              { name: "middleware/", type: "folder", note: "authMiddleware, errorHandler, upload" },
              { name: "config/", type: "folder", note: "db.js, passport.js, stripe.js" },
              { name: "utils/", type: "folder", note: "sendEmail, generateToken" },
              { name: "app.js", type: "important" },
              { name: "server.js", type: "important" },
            ]
          },
          { name: ".env", type: "file", note: "DB_URL, JWT_SECRET, STRIPE_KEY" },
          { name: "package.json", type: "file" },
        ]
      },
      {
        name: "database/", type: "folder", children: [
          { name: "migrations/", type: "folder" },
          { name: "seeders/", type: "folder" },
          { name: "schema.sql", type: "important", note: "All table definitions" },
        ]
      },
      { name: "docker-compose.yml", type: "important", note: "Local dev: postgres + backend + frontend" },
      { name: "README.md", type: "file" },
      { name: ".gitignore", type: "file" },
    ]
  }
];

const flowSteps = [
  { label: "Customer visits site", icon: "🌐", color: colors.accent },
  { label: "Browses Jeans (filter by size, color, price)", icon: "👖", color: colors.accent },
  { label: "Add to Cart / Wishlist", icon: "🛒", color: "#43e97b" },
  { label: "Register / Login (JWT Auth)", icon: "🔐", color: "#f7971e" },
  { label: "Checkout — Enter address", icon: "📦", color: "#f7971e" },
  { label: "Payment: Razorpay / Stripe / COD", icon: "💳", color: colors.accent2 },
  { label: "Order Confirmed → Email sent", icon: "✅", color: colors.accent3 },
  { label: "Admin sees order in dashboard", icon: "🖥️", color: colors.accent },
  { label: "Admin updates status → Customer notified", icon: "🔔", color: colors.accent2 },
];

const apiEndpoints = [
  { method: "POST", path: "/api/auth/register", desc: "Register new user" },
  { method: "POST", path: "/api/auth/login", desc: "Login, returns JWT" },
  { method: "GET", path: "/api/products", desc: "List products (filter, paginate)" },
  { method: "GET", path: "/api/products/:id", desc: "Single product detail" },
  { method: "POST", path: "/api/products", desc: "Admin: Add product" },
  { method: "PUT", path: "/api/products/:id", desc: "Admin: Edit product" },
  { method: "DELETE", path: "/api/products/:id", desc: "Admin: Delete product" },
  { method: "POST", path: "/api/orders", desc: "Place order" },
  { method: "GET", path: "/api/orders/me", desc: "My orders" },
  { method: "GET", path: "/api/orders", desc: "Admin: All orders" },
  { method: "PUT", path: "/api/orders/:id/status", desc: "Admin: Update status" },
  { method: "POST", path: "/api/payment/create-session", desc: "Stripe/Razorpay session" },
  { method: "POST", path: "/api/payment/webhook", desc: "Payment webhook" },
];

const methodColor = { GET: "#43e97b", POST: colors.accent, PUT: "#f7971e", DELETE: colors.accent2 };

export default function App() {
  const [active, setActive] = useState("Overview");

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", color: colors.text }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #12121a 0%, #1a1030 100%)`,
        borderBottom: `1px solid ${colors.border}`,
        padding: "28px 40px 20px",
      }}>
        <div style={{ fontSize: 11, color: colors.accent, letterSpacing: 3, marginBottom: 6, textTransform: "uppercase" }}>Full-Stack Blueprint</div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, background: "linear-gradient(90deg, #6c63ff, #ff6584)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          👖 JeansStore — Complete eCommerce System
        </h1>
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge color={colors.accent}>React</Badge>
          <Badge color="#dd4b35">Angular</Badge>
          <Badge color={colors.accent3}>Node + Express</Badge>
          <Badge color="#336791">PostgreSQL</Badge>
          <Badge color="#ff6584">REST API</Badge>
          <Badge color="#f7971e">Cloud Deploy</Badge>
        </div>
      </div>

      {/* Nav Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${colors.border}`, overflowX: "auto", background: colors.card }}>
        {sections.map(s => (
          <button key={s} onClick={() => setActive(s)} style={{
            background: active === s ? colors.accent + "22" : "transparent",
            border: "none",
            borderBottom: active === s ? `2px solid ${colors.accent}` : "2px solid transparent",
            color: active === s ? colors.accent : colors.muted,
            padding: "12px 18px",
            cursor: "pointer",
            fontWeight: active === s ? 700 : 400,
            fontSize: 13,
            whiteSpace: "nowrap",
            transition: "all 0.2s",
          }}>{s}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "30px 24px" }}>

        {active === "Overview" && (
          <div>
            <Card title="What you're building" accent={colors.accent}>
              <p style={{ margin: 0, lineHeight: 1.8, color: colors.muted }}>
                A production-grade <strong style={{ color: colors.text }}>Jeans eCommerce platform</strong> with a customer-facing React storefront, an Angular admin dashboard, a Node.js/Express REST API backend, PostgreSQL database, Stripe/Razorpay payment integration, and cloud deployment on <strong style={{ color: colors.text }}>Railway or Render (free tier)</strong> or <strong style={{ color: colors.text }}>AWS (production)</strong>.
              </p>
            </Card>
            <Card title="3 Separate Applications" accent={colors.accent2}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[
                  { icon: "🛍️", name: "Customer Site", tech: "React + Vite", port: ":3000" },
                  { icon: "🔧", name: "Admin Panel", tech: "Angular 17", port: ":4200" },
                  { icon: "⚙️", name: "API Server", tech: "Node + Express", port: ":5000" },
                ].map(a => (
                  <div key={a.name} style={{ background: colors.bg, borderRadius: 10, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 28 }}>{a.icon}</div>
                    <div style={{ fontWeight: 700, marginTop: 8 }}>{a.name}</div>
                    <div style={{ color: colors.accent, fontSize: 12 }}>{a.tech}</div>
                    <div style={{ color: colors.muted, fontSize: 11 }}>{a.port}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card title="Recommended Tool: VS Code" accent={colors.accent3}>
              <p style={{ margin: 0, color: colors.muted, lineHeight: 1.8 }}>
                Use <strong style={{ color: colors.text }}>Visual Studio Code</strong> — it's the industry standard. Install these extensions:
              </p>
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["ESLint", "Prettier", "GitLens", "Thunder Client (API test)", "Angular Language Service", "ES7+ React Snippets", "PostgreSQL (cweijan)", "Docker"].map(e => (
                  <Badge key={e} color={colors.accent}>{e}</Badge>
                ))}
              </div>
            </Card>
          </div>
        )}

        {active === "Tech Stack" && (
          <div>
            {[
              { layer: "Frontend (Customer)", color: colors.accent, items: [
                { name: "React 18 + Vite", reason: "Fastest dev experience, component-based UI" },
                { name: "React Router v6", reason: "Client-side routing (pages)" },
                { name: "Axios", reason: "HTTP requests to backend API" },
                { name: "Context API + useReducer", reason: "Cart & Auth state management" },
                { name: "Tailwind CSS", reason: "Rapid, beautiful UI styling" },
                { name: "Framer Motion", reason: "Smooth animations for product cards, modals" },
              ]},
              { layer: "Admin Panel", color: "#dd4b35", items: [
                { name: "Angular 17 (standalone)", reason: "Enterprise-grade, structured for dashboards" },
                { name: "Angular Material", reason: "Tables, forms, dialogs, charts out of the box" },
                { name: "HttpClient", reason: "Built-in Angular API service" },
                { name: "Route Guards", reason: "Protect admin routes" },
              ]},
              { layer: "Backend", color: colors.accent3, items: [
                { name: "Node.js 20 LTS + Express 4", reason: "Fast REST API server" },
                { name: "Sequelize ORM", reason: "Model-based PostgreSQL interaction" },
                { name: "JWT (jsonwebtoken)", reason: "Secure auth tokens" },
                { name: "bcryptjs", reason: "Password hashing" },
                { name: "Multer + Cloudinary", reason: "Image upload for products" },
                { name: "Nodemailer", reason: "Order confirmation emails" },
                { name: "Stripe / Razorpay SDK", reason: "Online payment processing" },
              ]},
              { layer: "Database", color: "#336791", items: [
                { name: "PostgreSQL 16", reason: "Reliable relational DB, great for orders/inventory" },
                { name: "Sequelize Migrations", reason: "Version-controlled schema changes" },
              ]},
            ].map(section => (
              <Card key={section.layer} title={section.layer} accent={section.color}>
                {section.items.map(item => (
                  <div key={item.name} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${colors.border}`, padding: "8px 0", alignItems: "flex-start" }}>
                    <strong style={{ color: section.color, minWidth: 200 }}>{item.name}</strong>
                    <span style={{ color: colors.muted, fontSize: 13 }}>{item.reason}</span>
                  </div>
                ))}
              </Card>
            ))}
          </div>
        )}

        {active === "Folder Structure" && (
          <div>
            <Card title="Complete Project Tree" accent={colors.accent}>
              <Tree items={folderStructure} />
            </Card>
            <Card title="Database Schema — Key Tables" accent="#336791">
              <Code>{`-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100), email VARCHAR UNIQUE,
  password_hash VARCHAR, role VARCHAR DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products (Jeans)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200), description TEXT,
  price DECIMAL(10,2), stock INT,
  sizes VARCHAR[], colors VARCHAR[],
  images VARCHAR[],  -- Cloudinary URLs
  category VARCHAR, tags VARCHAR[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  total DECIMAL(10,2), status VARCHAR DEFAULT 'pending',
  payment_method VARCHAR, payment_status VARCHAR,
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INT, size VARCHAR, color VARCHAR,
  price_at_purchase DECIMAL(10,2)
);`}</Code>
            </Card>
          </div>
        )}

        {active === "Flow & Architecture" && (
          <div>
            <Card title="Customer Order Flow" accent={colors.accent}>
              <div style={{ position: "relative", padding: "10px 0" }}>
                {flowSteps.map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: step.color + "22", border: `2px solid ${step.color}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, flexShrink: 0
                    }}>{step.icon}</div>
                    <div style={{ width: 2, height: i < flowSteps.length - 1 ? 0 : 0, background: step.color, margin: "0 0 0 17px" }} />
                    <div style={{ marginLeft: 14, color: colors.text, fontSize: 14 }}>{step.label}</div>
                    {i < flowSteps.length - 1 && (
                      <div style={{ position: "absolute", left: 17, marginTop: 44 + i * 44, width: 2, height: 8, background: colors.border }} />
                    )}
                  </div>
                ))}
              </div>
            </Card>
            <Card title="REST API Endpoints" accent={colors.accent2}>
              <div style={{ overflowX: "auto" }}>
                {apiEndpoints.map((ep, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 0", borderBottom: `1px solid ${colors.border}` }}>
                    <span style={{ background: methodColor[ep.method] + "22", color: methodColor[ep.method], borderRadius: 4, padding: "2px 8px", fontWeight: 700, fontSize: 11, minWidth: 50, textAlign: "center" }}>{ep.method}</span>
                    <code style={{ color: colors.accent, fontSize: 12, minWidth: 230 }}>{ep.path}</code>
                    <span style={{ color: colors.muted, fontSize: 12 }}>{ep.desc}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {active === "Setup & Install" && (
          <div>
            <Card title="Step 1 — Prerequisites" accent={colors.accent}>
              <p style={{ color: colors.muted, margin: "0 0 10px" }}>Install these first (in order):</p>
              <Code>{`# 1. Node.js 20 LTS — https://nodejs.org
node -v   # Should show v20.x.x

# 2. PostgreSQL 16 — https://www.postgresql.org/download/
psql --version

# 3. Git — https://git-scm.com
git --version

# 4. VS Code — https://code.visualstudio.com

# 5. Global tools
npm install -g @angular/cli nodemon`}</Code>
            </Card>
            <Card title="Step 2 — Initialize Projects" accent={colors.accent2}>
              <Code>{`# Create root folder
mkdir jeans-ecommerce && cd jeans-ecommerce
git init

# ─── React Frontend ───
npm create vite@latest frontend -- --template react
cd frontend
npm install axios react-router-dom tailwindcss framer-motion
npx tailwindcss init -p
cd ..

# ─── Angular Admin ───
ng new admin --routing --style=css --standalone
cd admin
ng add @angular/material
cd ..

# ─── Node Backend ───
mkdir backend && cd backend
npm init -y
npm install express sequelize pg pg-hstore cors dotenv helmet
npm install bcryptjs jsonwebtoken multer nodemailer stripe
npm install -D nodemon
cd ..`}</Code>
            </Card>
            <Card title="Step 3 — Setup PostgreSQL" accent="#336791">
              <Code>{`# Open psql shell
psql -U postgres

# Create DB and user
CREATE DATABASE jeansstore;
CREATE USER jeansuser WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE jeansstore TO jeansuser;
\\q

# In backend/.env
DATABASE_URL=postgresql://jeansuser:yourpassword@localhost:5432/jeansstore
JWT_SECRET=your_super_secret_key_here
STRIPE_SECRET_KEY=sk_test_xxxx
CLOUDINARY_URL=cloudinary://xxx:xxx@xxx
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password
PORT=5000`}</Code>
            </Card>
            <Card title="Step 4 — Run Everything" accent={colors.accent3}>
              <Code>{`# Terminal 1 — Backend
cd backend && nodemon src/server.js

# Terminal 2 — React Frontend  
cd frontend && npm run dev

# Terminal 3 — Angular Admin
cd admin && ng serve

# ✅ Visit:
# Customer site → http://localhost:5173
# Admin panel   → http://localhost:4200
# API           → http://localhost:5000/api`}</Code>
            </Card>
          </div>
        )}

        {active === "Key Code" && (
          <div>
            <Card title="backend/src/server.js" accent={colors.accent}>
              <Code>{`const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { sequelize } = require('./config/db');

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4200'] }));
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(\`🚀 Server on port \${PORT}\`));
});`}</Code>
            </Card>
            <Card title="backend/src/routes/products.js" accent={colors.accent2}>
              <Code>{`const router = require('express').Router();
const { Product } = require('../models');
const { protect, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public: Get all products with filters
router.get('/', async (req, res) => {
  const { size, color, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
  const where = { is_active: true };
  if (minPrice || maxPrice) where.price = { 
    ...(minPrice && { [Op.gte]: minPrice }), 
    ...(maxPrice && { [Op.lte]: maxPrice }) 
  };
  const products = await Product.findAndCountAll({
    where, limit, offset: (page - 1) * limit, order: [['created_at', 'DESC']]
  });
  res.json({ products: products.rows, total: products.count, pages: Math.ceil(products.count / limit) });
});

// Admin: Create product
router.post('/', protect, isAdmin, upload.array('images', 5), async (req, res) => {
  const imageUrls = req.files.map(f => f.path); // Cloudinary URLs
  const product = await Product.create({ ...req.body, images: imageUrls });
  res.status(201).json(product);
});

router.put('/:id', protect, isAdmin, async (req, res) => {
  await Product.update(req.body, { where: { id: req.params.id } });
  res.json({ message: 'Updated' });
});

router.delete('/:id', protect, isAdmin, async (req, res) => {
  await Product.update({ is_active: false }, { where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
});

module.exports = router;`}</Code>
            </Card>
            <Card title="frontend/src/pages/Shop.jsx" accent={colors.accent3}>
              <Code>{`import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ size: '', color: '', minPrice: '', maxPrice: '' });
  const [page, setPage] = useState(1);

  useEffect(() => {
    getProducts({ ...filters, page }).then(res => setProducts(res.data.products));
  }, [filters, page]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filter Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-6 pt-20">
        <h3 className="font-bold text-lg mb-4">Filter Jeans</h3>
        {['28','30','32','34','36'].map(size => (
          <label key={size} className="flex items-center gap-2 mb-2 cursor-pointer">
            <input type="checkbox" onChange={() => setFilters(f => ({...f, size}))} />
            Size {size}
          </label>
        ))}
      </aside>

      {/* Products Grid */}
      <main className="ml-64 p-8 pt-20">
        <div className="grid grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </main>
    </div>
  );
}`}</Code>
            </Card>
            <Card title="backend: Payment (Stripe)" accent={colors.accent2}>
              <Code>{`// routes/payment.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-session', protect, async (req, res) => {
  const { items } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: { name: item.name, images: [item.image] },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    success_url: \`\${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.FRONTEND_URL}/cart\`,
  });
  res.json({ url: session.url });
});`}</Code>
            </Card>
          </div>
        )}

        {active === "Admin Panel" && (
          <div>
            <Card title="Angular Admin — Features" accent="#dd4b35">
              {[
                { icon: "📊", title: "Dashboard", desc: "Revenue charts, order stats, low stock alerts" },
                { icon: "👖", title: "Products", desc: "Add/Edit/Delete jeans, upload images, manage inventory" },
                { icon: "📦", title: "Orders", desc: "View all orders, update status (Pending → Shipped → Delivered)" },
                { icon: "👥", title: "Customers", desc: "User list, order history per user, ban/unban" },
                { icon: "🏷️", title: "Coupons", desc: "Create discount codes, set expiry and usage limits" },
                { icon: "📈", title: "Analytics", desc: "Best-selling products, revenue by date, traffic sources" },
              ].map(f => (
                <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 0", borderBottom: `1px solid ${colors.border}` }}>
                  <span style={{ fontSize: 24 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>{f.title}</div>
                    <div style={{ color: colors.muted, fontSize: 13 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </Card>
            <Card title="Angular Admin Auth Guard" accent="#dd4b35">
              <Code>{`// admin/src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin()) return true;
  router.navigate(['/login']);
  return false;
};

// app.routes.ts
{ path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },
{ path: 'products', component: ProductsComponent, canActivate: [adminGuard] },
{ path: 'orders', component: OrdersComponent, canActivate: [adminGuard] }`}</Code>
            </Card>
          </div>
        )}

        {active === "Cloud Deploy" && (
          <div>
            <Card title="🥇 Recommended: Railway (Best for Beginners)" accent={colors.accent3}>
              <p style={{ color: colors.muted, lineHeight: 1.8, margin: 0 }}>
                Railway gives you <strong style={{ color: colors.text }}>free PostgreSQL + Node hosting</strong> in one platform, with GitHub auto-deploy. Zero DevOps overhead — ideal for launch.
              </p>
              <Code>{`# 1. Push code to GitHub
git add . && git commit -m "initial" && git push origin main

# 2. Go to railway.app → New Project → Deploy from GitHub
# 3. Add PostgreSQL plugin in Railway dashboard
# 4. Set environment variables in Railway dashboard
# 5. Railway gives you: https://your-app.up.railway.app

# Frontend — deploy to Vercel (free)
npm install -g vercel
cd frontend && vercel --prod

# Admin — deploy to Vercel too
cd admin && ng build --prod
vercel --prod`}</Code>
            </Card>
            <Card title="🥈 Production Scale: AWS" accent={colors.accent2}>
              {[
                { service: "EC2 (t3.micro)", use: "Run Node.js backend" },
                { service: "RDS PostgreSQL", use: "Managed database" },
                { service: "S3 + CloudFront", use: "Host React/Angular static builds" },
                { service: "Route 53", use: "Custom domain (yourbrand.com)" },
                { service: "ACM", use: "Free SSL/HTTPS certificate" },
                { service: "Elastic Beanstalk", use: "Easy Node deployment with scaling" },
              ].map(a => (
                <div key={a.service} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${colors.border}` }}>
                  <strong style={{ color: colors.accent2 }}>{a.service}</strong>
                  <span style={{ color: colors.muted, fontSize: 13 }}>{a.use}</span>
                </div>
              ))}
            </Card>
            <Card title="🥉 Also Great: Render.com" accent={colors.muted}>
              <p style={{ color: colors.muted, margin: 0 }}>
                Free tier with auto-deploy from GitHub. Good for backend (Node) + PostgreSQL add-on. Frontend on Netlify or Vercel.
              </p>
            </Card>
            <Card title="Deployment Comparison" accent={colors.accent}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                      {["Platform", "Cost", "Ease", "Scale", "Best For"].map(h => (
                        <th key={h} style={{ padding: "8px 12px", color: colors.accent, textAlign: "left", fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Railway", "Free→$5/mo", "⭐⭐⭐⭐⭐", "Medium", "Beginners / MVP"],
                      ["Render", "Free→$7/mo", "⭐⭐⭐⭐", "Medium", "Simple apps"],
                      ["AWS", "$20-100+/mo", "⭐⭐⭐", "Unlimited", "Production scale"],
                      ["Vercel", "Free", "⭐⭐⭐⭐⭐", "High", "Frontend only"],
                    ].map(row => (
                      <tr key={row[0]} style={{ borderBottom: `1px solid ${colors.border}33` }}>
                        {row.map((cell, i) => (
                          <td key={i} style={{ padding: "8px 12px", color: i === 0 ? colors.text : colors.muted }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {active === "Marketing" && (
          <div>
            <Card title="Online Marketing Strategy for Jeans Brand" accent={colors.accent2}>
              {[
                { icon: "📸", title: "Instagram + Facebook Shops", desc: "Connect your product catalog. Run ₹200/day targeted ads to 18-35 age group interested in fashion." },
                { icon: "🎯", title: "Google Shopping Ads", desc: "Appear when someone searches 'buy slim fit jeans online'. Use Google Merchant Center + your product API feed." },
                { icon: "💌", title: "Email Marketing", desc: "Collect emails at checkout. Send abandoned cart reminders, new arrivals, and exclusive discount codes." },
                { icon: "🤝", title: "Influencer Collaboration", desc: "Partner with micro-influencers (10k-100k followers) in fashion niche for product shoots and reels." },
                { icon: "🏷️", title: "Flash Sales & Coupons", desc: "Limited-time 20% off codes via WhatsApp broadcast lists. Creates urgency, drives conversions." },
                { icon: "⭐", title: "Reviews & UGC", desc: "After delivery, auto-email asking for review + photo. Show reviews on product pages — builds trust." },
                { icon: "🔄", title: "Retargeting Ads", desc: "Facebook Pixel + Google Tag on your site. Retarget visitors who didn't buy with reminder ads." },
                { icon: "📦", title: "Free Shipping Threshold", desc: "Free shipping over ₹999 increases average order value. Show progress bar in cart." },
              ].map(m => (
                <div key={m.title} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 0", borderBottom: `1px solid ${colors.border}` }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: colors.accent2 }}>{m.title}</div>
                    <div style={{ color: colors.muted, fontSize: 13, lineHeight: 1.6 }}>{m.desc}</div>
                  </div>
                </div>
              ))}
            </Card>
            <Card title="Must-Have UX Features for Conversions" accent={colors.accent3}>
              {[
                "Size guide popup with measurements",
                "360° product view / zoom on hover",
                "WhatsApp chat button (bottom right)",
                "Sticky 'Add to Cart' button on scroll",
                "Recently viewed products",
                "'Only 3 left!' stock urgency badge",
                "COD badge prominently shown",
                "Easy returns policy banner",
              ].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                  <span style={{ color: colors.accent3 }}>✓</span>
                  <span style={{ color: colors.muted, fontSize: 13 }}>{f}</span>
                </div>
              ))}
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
