// backend/models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  category: String,
  description: String,
  price: Number
});

module.exports = mongoose.model('Product', productSchema);
