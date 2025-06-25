// routes/products.js

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET products (with search + filter)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// ✅ ADD THIS POST ROUTE
router.post('/', async (req, res) => {
  try {
    const { name, imageUrl, category, description, price } = req.body;

    if (!name || !imageUrl || !category || !description || !price) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newProduct = new Product({ name, imageUrl, category, description, price });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Error saving product', details: err.message });
  }
});

module.exports = router;
