// src/pages/Wishlist.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!currentUser) return;
      const wishlistRef = collection(db, 'users', currentUser.uid, 'wishlist');
      const snap = await getDocs(wishlistRef);
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWishlist(items);
    };
    fetchWishlist();
  }, [currentUser]);

  const removeFromWishlist = async (id) => {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'wishlist', id));
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const moveToCart = async (item) => {
    const cartRef = doc(db, 'users', currentUser.uid, 'cart', item.id);
    await setDoc(cartRef, { ...item, quantity: 1 });
    await removeFromWishlist(item.id);
    alert('Moved to cart!');
  };

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900">
      <h2 className="text-2xl font-bold mb-4">❤️ Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No items in your wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlist.map(item => (
            <div key={item.id} className="bg-gray-800 p-4 rounded shadow">
              <img src={item.imageUrl} alt={item.name} className="h-40 w-full object-cover rounded mb-2" />
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-300">{item.description}</p>
              <p className="text-purple-400 font-bold mt-2">₹{item.price}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => moveToCart(item)} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded">
                  Move to Cart
                </button>
                <button onClick={() => removeFromWishlist(item.id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
