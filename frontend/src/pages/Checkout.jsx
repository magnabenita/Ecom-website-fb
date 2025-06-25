// ✅ Checkout.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      const params = new URLSearchParams(window.location.search);
      const isSingle = params.get('single') === 'true';

      if (isSingle) {
        const item = JSON.parse(localStorage.getItem('checkoutItem'));
        if (item) {
          setCartItems([item]);
        } else {
          alert('Missing product.');
          navigate('/products');
        }
        setLoading(false);
        return;
      }

      if (!currentUser) return;

      try {
        const snapshot = await getDocs(collection(db, 'users', currentUser.uid, 'cart'));
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCartItems(items);
      } catch (err) {
        console.error('Failed to load cart:', err.message);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [currentUser, navigate]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) return alert('You must be logged in.');
    if (!form.name || !form.address || !form.phone) {
      return alert('Please fill all fields.');
    }

    try {
      // ✅ Make sure every item includes its addedBy
      const cartWithAdminRef = cartItems.map((item) => ({
        ...item,
        addedBy: item.addedBy || null, // fallback to null if missing
      }));

      await addDoc(collection(db, 'orders'), {
        userId: currentUser.uid,
        cart: cartWithAdminRef,
        shipping: form,
        total: totalPrice,
        createdAt: serverTimestamp(),
      });

      const isSingle = new URLSearchParams(window.location.search).get('single') === 'true';
      if (!isSingle) {
        const cartRef = collection(db, 'users', currentUser.uid, 'cart');
        const snapshot = await getDocs(cartRef);
        snapshot.forEach((docSnap) =>
          deleteDoc(doc(db, 'users', currentUser.uid, 'cart', docSnap.id))
        );
      } else {
        localStorage.removeItem('checkoutItem');
      }

      alert('🎉 Order placed successfully!');
      setForm({ name: '', address: '', phone: '' });
      navigate('/success');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Something went wrong.');
    }
  };

  if (loading) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  if (!cartItems.length) {
    return <div className="text-white text-center mt-10">🛒 Nothing to checkout.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">🛍️ Checkout</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 bg-gray-700 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            placeholder="Shipping Address"
            className="w-full p-3 bg-gray-700 rounded"
            rows={3}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-3 bg-gray-700 rounded"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <div className="text-lg font-medium text-right mt-4">
            Total: <span className="text-purple-400 font-bold">₹{totalPrice}</span>
          </div>

          <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded">
            🛒 Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
