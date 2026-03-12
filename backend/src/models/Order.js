const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:          { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:             String,
  image:            String,
  price:            Number,
  quantity:         { type: Number, required: true },
  size:             String,
  color:            String,
});

const orderSchema = new mongoose.Schema({
  user:             { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:            [orderItemSchema],
  shippingAddress:  {
    fullName:  String,
    address:   String,
    city:      String,
    pincode:   String,
    phone:     String,
  },
  paymentMethod:    { type: String, enum: ['COD', 'Stripe', 'Razorpay'], required: true },
  paymentStatus:    { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus:      { type: String, enum: ['pending','confirmed','shipped','delivered','cancelled'], default: 'pending' },
  total:            { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);