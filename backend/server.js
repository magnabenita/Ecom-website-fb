// === backend/server.js ===
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
app.use(cors());
app.use(express.json());

// ✅ GET all products
app.get('/api/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// ✅ DELETE a product (admin only)
app.delete('/api/products/:id', async (req, res) => {
  const { uid } = req.headers; // 🔐 Expect client to send Firebase UID in headers

  if (!uid) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const userDoc = await db.collection('users').doc(uid).get();
    const role = userDoc.data()?.role;

    if (role !== 'admin') return res.status(403).json({ error: 'Access denied' });

    await db.collection('products').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
