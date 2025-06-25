import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const ProductForm = () => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    category: '',
    description: '',
    price: '',
  });

  // 🔐 Check admin role
  useEffect(() => {
    const checkAdmin = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const ref = doc(db, 'users', currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().role === 'admin') {
        setIsAdmin(true);
      }
      setLoading(false);
    };

    checkAdmin();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert('Please log in to add a product.');
      return;
    }

    if (!isAdmin) {
      alert('Only admins can add products.');
      return;
    }

    try {
      await addDoc(collection(db, 'products'), {
        ...formData,
        price: parseFloat(formData.price),
        createdBy: currentUser.uid,         // ✅ ensures admin ownership
        createdAt: serverTimestamp(),
      });

      alert('✅ Product added!');
      setFormData({ name: '', imageUrl: '', category: '', description: '', price: '' });
    } catch (error) {
      console.error(error);
      alert(error.message || 'Something went wrong.');
    }
  };

  if (loading) {
    return <div className="text-center text-white mt-10">Checking permissions...</div>;
  }

  if (!isAdmin) {
    return <div className="text-center text-red-400 mt-10">⛔ Access Denied. Only admins can add products.</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-gray-800 text-white rounded space-y-4 mt-10"
    >
      <input
        name="name"
        placeholder="Product Name"
        className="w-full p-2 bg-gray-700 rounded"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="imageUrl"
        placeholder="Image URL"
        className="w-full p-2 bg-gray-700 rounded"
        value={formData.imageUrl}
        onChange={handleChange}
      />
      <input
        name="category"
        placeholder="Category"
        className="w-full p-2 bg-gray-700 rounded"
        value={formData.category}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        className="w-full p-2 bg-gray-700 rounded"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        className="w-full p-2 bg-gray-700 rounded"
        value={formData.price}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
      >
        Add Product
      </button>
    </form>
  );
};

export default ProductForm;
