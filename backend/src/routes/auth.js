const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── REGISTER ──────────────────────────────
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    res.status(201).json({
      token: generateToken(user._id, user.role),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── LOGIN ─────────────────────────────────
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json({
      token: generateToken(user._id, user.role),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── SEED ADMIN (run once) ─────────────────
// POST /api/auth/seed-admin
router.post('/seed-admin', async (req, res) => {
  const exists = await User.findOne({ role: 'admin' });
  if (exists) return res.json({ message: 'Admin already exists. Login: admin@jeansstore.com / Admin@123' });
  await User.create({ name: 'Admin', email: 'admin@jeansstore.com', password: 'Admin@123', role: 'admin' });
  res.json({ message: '✅ Admin created! Email: admin@jeansstore.com | Password: Admin@123' });
});

module.exports = router;