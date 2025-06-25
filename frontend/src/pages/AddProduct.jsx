// src/pages/AddProduct.jsx
import React from 'react';
import ProductForm from '../components/ProductForm';

const AddProduct = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      
      {/* Optional: floating blur background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-700 opacity-30 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-80px] right-[-80px] w-[250px] h-[250px] bg-pink-600 opacity-20 blur-[80px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-300">Add New Product</h2>
        <ProductForm />
      </div>
    </div>
  );
};

export default AddProduct;
