// src/pages/AdminOrders.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/'); // 🔒 redirect non-admins
      return;
    }

    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .map(order => {
            // ✅ Show if no addedBy (default) OR matches current admin UID
            const filteredCart = order.cart.filter(
              item => !item.addedBy || item.addedBy === currentUser.uid
            );

            if (filteredCart.length > 0) {
              const total = filteredCart.reduce(
                (sum, item) => sum + item.price * (item.quantity || 1),
                0
              );
              return {
                ...order,
                cart: filteredCart,
                total,
              };
            } else {
              return null;
            }
          })
          .filter(Boolean); // remove nulls

        setOrders(data);
      } catch (err) {
        console.error(err);
        alert('Failed to load admin orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, role, navigate]);

  if (loading) return <p className="text-white text-center mt-10">Loading admin orders...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">📦 Admin Order Dashboard</h2>
      {orders.length === 0 ? (
        <p className="text-center">No orders found for your products.</p>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order.id} className="bg-gray-800 p-6 rounded shadow">
              <div className="mb-2 text-sm text-gray-400">
                Ordered by UID: <span className="text-white">{order.userId}</span><br />
                Date: {order.createdAt?.toDate().toLocaleString()}
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
                Total for your products: ₹{order.total}
              </div>
              <div className="mt-2 text-sm text-gray-400">
                Ship To: {order.shipping?.name}, {order.shipping?.address} ({order.shipping?.phone})
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
