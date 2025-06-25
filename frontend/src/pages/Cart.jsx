// src/pages/Cart.jsx

import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser) return;
      const cartRef = collection(db, 'users', currentUser.uid, 'cart');
      const snap = await getDocs(cartRef);
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCart(items);
    };
    fetchCart();
  }, [currentUser]);

  const removeFromCart = async (id) => {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'cart', id));
    setCart(cart.filter(item => item.id !== id));
  };

  const buyNow = (item) => {
    localStorage.setItem('checkoutItem', JSON.stringify(item));
    navigate('/checkout?single=true');
  };

  const updateQuantity = async (itemId, delta) => {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    const newQty = (item.quantity || 1) + delta;
    if (newQty < 1) return;

    await updateDoc(doc(db, 'users', currentUser.uid, 'cart', itemId), {
      quantity: newQty
    });

    setCart(cart.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
  };

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900">
      <h2 className="text-2xl font-bold mb-6">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p>No items in your cart.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cart.map(item => (
              <div key={item.id} className="bg-gray-800 p-4 rounded shadow">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-40 w-full object-cover rounded mb-2"
                />
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-300">{item.description}</p>
                <p className="text-purple-400 font-bold mt-2">
                  ₹{item.price} × {item.quantity || 1}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="px-2 bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    −
                  </button>
                  <span>{item.quantity || 1}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-2 bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    +
                  </button>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => buyNow(item)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Checkout All Button */}
          <div className="mt-8 text-right">
            <button
              onClick={() => navigate('/checkout')}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-semibold"
            >
              🛍️ Checkout All
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
