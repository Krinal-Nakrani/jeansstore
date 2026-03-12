const router = require('express').Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ message: 'Invalid token' }); }
};
const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admins only' }); next();
};

// POST /api/orders — place order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await Order.create({ user: req.user.id, items, shippingAddress, paymentMethod, total });
    res.status(201).json({ order, message: '✅ Order placed successfully!' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/orders/me — my orders
router.get('/me', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).populate('items.product', 'name images');
  res.json(orders);
});

// GET /api/orders — all orders (admin)
router.get('/', protect, isAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
  res.json(orders);
});

// PUT /api/orders/:id/status — update status (admin)
router.put('/:id/status', protect, isAdmin, async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.status });
  res.json({ message: 'Order status updated' });
});

module.exports = router;