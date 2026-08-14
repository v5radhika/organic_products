import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import { CustomerRoute, OwnerRoute } from './components/ProtectedRoutes';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerLogin from './pages/OwnerLogin';

import OwnerDashboard from './pages/owner/OwnerDashboard';
import ProductManagement from './pages/owner/ProductManagement';
import OrderManagement from './pages/owner/OrderManagement';
import CustomerManagement from './pages/owner/CustomerManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <ToastContainer />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/owner-login" element={<OwnerLogin />} />

                {/* Customer Protected Routes */}
                <Route element={<CustomerRoute />}>
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/orders/:id" element={<OrderDetails />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Owner Protected Routes */}
                <Route element={<OwnerRoute />}>
                  <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                  <Route path="/owner/products" element={<ProductManagement />} />
                  <Route path="/owner/orders" element={<OrderManagement />} />
                  <Route path="/owner/customers" element={<CustomerManagement />} />
                  <Route path="/owner/notifications" element={<Notifications />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
