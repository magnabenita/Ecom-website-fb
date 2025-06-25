// src/pages/EditProduct.jsx
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const EditProduct = () => {
  const { currentUser } = useAuth();
  const { id } = useParams(); // get product ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    category: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const ref = doc(db, 'products', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setFormData(snap.data());
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const ref = doc(db, 'products', id);
      await updateDoc(ref, {
        ...formData,
        price: parseFloat(formData.price),
      });
      alert('✅ Product updated!');
      navigate('/products');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="max-w-md mx-auto space-y-4 p-6 bg-gray-800 text-white rounded mt-10">
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="w-full p-2 bg-gray-700 rounded" />
      <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full p-2 bg-gray-700 rounded" />
      <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full p-2 bg-gray-700 rounded" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 bg-gray-700 rounded" />
      <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full p-2 bg-gray-700 rounded" />
      <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 py-2 rounded">Update Product</button>
    </form>
  );
};

export default EditProduct;
