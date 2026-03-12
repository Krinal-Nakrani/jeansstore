const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.ADMIN_URL || 'http://localhost:4200'
  ]
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes (we'll add these next) ───
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// ─── Health Check ─────────────────────
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 JeansStore API is running!',
    time: new Date().toLocaleString()
  });
});

// ─── 404 Handler ──────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ─── MongoDB Connection + Start ────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
