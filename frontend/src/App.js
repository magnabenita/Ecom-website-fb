import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddProduct from './pages/AddProduct';
import Products from './pages/Products';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import EditProduct from './pages/EditProduct';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import OrderHistory from './pages/OrderHistory'; 
import AdminOrders from './pages/AdminOrders';
import AdminAnalytics from './pages/AdminAnalytics';
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/addproduct" element={
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        } />

        <Route path="/edit/:id" element={
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        } />

        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />

        <Route path="/success" element={
          <Success />
        } />

        <Route path="/orders" element={
          <OrderHistory />
        } />
        
        <Route path="/admin/orders" element={
          <ProtectedRoute>
            <AdminOrders />
          </ProtectedRoute>
        } />

        <Route path="/admin/analytics" element={
          <ProtectedRoute>
            <AdminAnalytics />
          </ProtectedRoute>
        } />



      </Routes>
    </Router>
  );
}

export default App;
