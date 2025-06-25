// src/pages/OrderHistory.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Redirect admin
  useEffect(() => {
    if (role === 'admin' && currentUser) {
      navigate('/admin/orders');
    }
  }, [role, currentUser, navigate]);

  // ✅ Fetch orders only for 'user' role
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err.message);
        alert('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && role === 'user') {
      fetchOrders();
    }
  }, [currentUser, role]);

  if (loading) return <p className="text-white text-center mt-10">Loading your orders...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">📦 Order History</h2>
      {orders.length === 0 ? (
        <p className="text-center">No past orders found.</p>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order.id} className="bg-gray-800 p-6 rounded shadow">
              <div className="mb-2 text-sm text-gray-400">
                Ordered on: {order.createdAt?.toDate().toLocaleString()}
              </div>
              <div className="space-y-2">
                {order.cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between border-b border-gray-700 pb-2">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-400">Qty: {item.quantity || 1}</p>
                    </div>
                    <div className="text-purple-300 font-bold">
                      ₹{item.price * (item.quantity || 1)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right text-lg font-bold text-purple-400">
                Total: ₹{order.total}
              </div>
              <div className="mt-2 text-sm text-gray-400">
                Shipping to: {order.shipping?.name}, {order.shipping?.address} ({order.shipping?.phone})
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
