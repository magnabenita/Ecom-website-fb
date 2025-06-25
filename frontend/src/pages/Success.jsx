// src/pages/Success.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h2 className="text-4xl font-bold mb-4 text-green-400">🎉 Order Successful!</h2>
      <p className="mb-6 text-center">Thank you for your purchase. Your order has been placed successfully.</p>
      <Link to="/orders" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded">
        View My Orders
      </Link>
    </div>
  );
};

export default Success;
