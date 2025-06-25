// src/pages/AdminAnalytics.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Chart.js components
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register chart types
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminAnalytics = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚫 Redirect if not admin
  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const snap = await getDocs(collection(db, 'orders'));
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err.message);
        alert('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [role, navigate]);

  if (loading) return <p className="text-white text-center mt-10">Loading analytics...</p>;

  // 📊 Metrics Calculations
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  let totalSales = 0;
  let ordersToday = 0;
  let ordersThisWeek = 0;
  const productMap = {};

  orders.forEach(order => {
    const cartItems = order.cart?.filter(item =>
      item.addedBy === currentUser?.uid || !item.addedBy
    );
    if (!cartItems?.length) return;

    const date = order.createdAt?.toDate?.() || new Date();
    const orderTotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    totalSales += orderTotal;
    if (date.toDateString() === new Date().toDateString()) ordersToday++;
    if (date >= startOfWeek) ordersThisWeek++;

    cartItems.forEach(item => {
      productMap[item.name] = (productMap[item.name] || 0) + (item.quantity || 1);
    });
  });

  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <h2 className="text-3xl text-center font-bold text-yellow-400 mb-6">📊 Admin Analytics</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-purple-300">Total Sales</h3>
          <p className="text-2xl font-bold text-green-400 mt-2">₹{totalSales}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-purple-300">Orders Today</h3>
          <p className="text-2xl font-bold text-yellow-400 mt-2">{ordersToday}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-purple-300">Orders This Week</h3>
          <p className="text-2xl font-bold text-orange-400 mt-2">{ordersThisWeek}</p>
        </div>
      </div>

      {/* 📊 Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {topProducts.length > 0 && (
          <>
            <div className="bg-gray-800 p-6 rounded shadow">
              <h3 className="text-center mb-4 font-semibold text-purple-300">Top-Selling Products</h3>
              <Bar
                data={{
                  labels: topProducts.map(p => p[0]),
                  datasets: [{
                    label: 'Units Sold',
                    data: topProducts.map(p => p[1]),
                    backgroundColor: 'rgba(168, 85, 247, 0.7)'
                  }]
                }}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
              />
            </div>

            <div className="bg-gray-800 p-6 rounded shadow">
              <h3 className="text-center mb-4 font-semibold text-purple-300">Sales Breakdown</h3>
              <Doughnut
                data={{
                  labels: topProducts.map(p => p[0]),
                  datasets: [{
                    data: topProducts.map(p => p[1]),
                    backgroundColor: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#a855f7']
                  }]
                }}
                options={{ responsive: true }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
