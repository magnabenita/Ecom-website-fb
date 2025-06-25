// src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userDoc = await getDoc(doc(db, 'users', uid));
      setIsAdmin(userDoc.data()?.role === 'admin');

      const productSnap = await getDocs(collection(db, 'products'));
      setProducts(productSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) return alert("Only admins can delete.");
    await deleteDoc(doc(db, 'products', id));
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-gray-800 p-4 rounded shadow">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-2 rounded" />
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p>{product.description}</p>
            <p className="text-purple-400 mt-2">₹{product.price}</p>
            <p className="text-sm text-gray-400">Category: {product.category}</p>
            {isAdmin && (
              <button onClick={() => handleDelete(product.id)} className="mt-2 text-red-500 underline">Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
