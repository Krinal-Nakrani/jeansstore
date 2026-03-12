const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  stock:       { type: Number, required: true, default: 0 },
  sizes:       [{ type: String }],          // ["28","30","32","34","36"]
  colors:      [{ type: String }],          // ["Black","Blue","Grey"]
  images:      [{ type: String }],          // Cloudinary URLs
  category:    { type: String, default: 'Jeans' },
  tags:        [{ type: String }],          // ["slim-fit","casual","stretch"]
  isActive:    { type: Boolean, default: true },
  rating:      { type: Number, default: 0 },
  numReviews:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);