// ============================================================
// JEANS ECOMMERCE — COMPLETE BACKEND STARTER
// File: backend/src/server.js
// Run: nodemon src/server.js
// ============================================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Sequelize, DataTypes, Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4200'] }));
app.use(helmet());
app.use(express.json());

// ─── Database ────────────────────────────────────────────────
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

// ─── Models ──────────────────────────────────────────────────
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password_hash: DataTypes.STRING,
  role: { type: DataTypes.STRING, defaultValue: 'customer' },
});

const Product = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.DECIMAL(10, 2),
  stock: DataTypes.INTEGER,
  sizes: DataTypes.ARRAY(DataTypes.STRING),
  colors: DataTypes.ARRAY(DataTypes.STRING),
  images: DataTypes.ARRAY(DataTypes.STRING),
  category: DataTypes.STRING,
  tags: DataTypes.ARRAY(DataTypes.STRING),
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
});

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  total: DataTypes.DECIMAL(10, 2),
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  payment_method: DataTypes.STRING,
  payment_status: { type: DataTypes.STRING, defaultValue: 'pending' },
  shipping_address: DataTypes.JSONB,
});

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  quantity: DataTypes.INTEGER,
  size: DataTypes.STRING,
  color: DataTypes.STRING,
  price_at_purchase: DataTypes.DECIMAL(10, 2),
});

// ─── Associations ─────────────────────────────────────────────
User.hasMany(Order);
Order.belongsTo(User);
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
OrderItem.belongsTo(Product);

// ─── Auth Middleware ──────────────────────────────────────────
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};

// ─── AUTH ROUTES ─────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PRODUCT ROUTES ───────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const { size, color, minPrice, maxPrice, page = 1, limit = 12, search } = req.query;
    const where = { is_active: true };

    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    if (size) where.sizes = { [Op.contains]: [size] };
    if (color) where.colors = { [Op.contains]: [color] };

    const { count, rows } = await Product.findAndCountAll({
      where, limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    res.json({ products: rows, total: count, pages: Math.ceil(count / limit), currentPage: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

app.post('/api/products', protect, isAdmin, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

app.put('/api/products/:id', protect, isAdmin, async (req, res) => {
  await Product.update(req.body, { where: { id: req.params.id } });
  res.json({ message: 'Product updated' });
});

app.delete('/api/products/:id', protect, isAdmin, async (req, res) => {
  await Product.update({ is_active: false }, { where: { id: req.params.id } });
  res.json({ message: 'Product removed' });
});

// ─── ORDER ROUTES ─────────────────────────────────────────────
app.post('/api/orders', protect, async (req, res) => {
  try {
    const { items, shipping_address, payment_method } = req.body;
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await Order.create({
      UserId: req.user.id, total, shipping_address,
      payment_method, payment_status: payment_method === 'COD' ? 'pending' : 'paid',
    });
    await Promise.all(items.map(item =>
      OrderItem.create({ OrderId: order.id, ProductId: item.productId, quantity: item.quantity, size: item.size, color: item.color, price_at_purchase: item.price })
    ));
    res.status(201).json({ order, message: 'Order placed successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/orders/me', protect, async (req, res) => {
  const orders = await Order.findAll({ where: { UserId: req.user.id }, include: [OrderItem], order: [['createdAt', 'DESC']] });
  res.json(orders);
});

app.get('/api/orders', protect, isAdmin, async (req, res) => {
  const orders = await Order.findAll({ include: [User, OrderItem], order: [['createdAt', 'DESC']] });
  res.json(orders);
});

app.put('/api/orders/:id/status', protect, isAdmin, async (req, res) => {
  await Order.update({ status: req.body.status }, { where: { id: req.params.id } });
  res.json({ message: 'Order status updated' });
});

// ─── SEED ADMIN ───────────────────────────────────────────────
app.post('/api/seed-admin', async (req, res) => {
  const exists = await User.findOne({ where: { role: 'admin' } });
  if (exists) return res.json({ message: 'Admin already exists' });
  const password_hash = await bcrypt.hash('Admin@123', 10);
  await User.create({ name: 'Admin', email: 'admin@jeansstore.com', password_hash, role: 'admin' });
  res.json({ message: 'Admin created: admin@jeansstore.com / Admin@123' });
});

// ─── HEALTH CHECK ─────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ─── START ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database synced');
  app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
}).catch(err => console.error('DB Error:', err));
