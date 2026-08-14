import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationBell from './NotificationBell';
import { ShoppingBag, Leaf, User as UserIcon, LogOut, LayoutDashboard, Package, Users, Shield, Bell } from 'lucide-react';
import API from '../api/axios';

const Navbar = () => {
  const { user, logout, isOwner, isCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isCustomer) {
      API.get('/cart')
        .then((res) => {
          if (res.data.success) {
            const count = res.data.data.items.reduce((sum, i) => sum + i.quantity, 0);
            setCartCount(count);
          }
        })
        .catch(() => {});
    }
  }, [isCustomer, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', sticky: 'top', top: 0, zIndex: 1000, boxShadow: 'var(--shadow-sm)' }}>
      <div className="container flex items-center justify-between" style={{ height: '76px' }}>
        {/* Brand Logo */}
        <Link to={isOwner ? '/owner/dashboard' : '/'} className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#dcfce7', padding: '10px', borderRadius: '14px', display: 'flex', alignItems: 'center' }}>
            <Leaf color="#15803d" size={26} />
          </div>
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#064e3b', fontFamily: 'Outfit', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
              Venkatesha
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#d97706', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Organic Products
            </span>
          </div>
        </Link>

        {/* Owner Navigation Links */}
        {isOwner ? (
          <nav className="flex items-center gap-6">
            <Link to="/owner/dashboard" className="btn btn-secondary btn-sm flex items-center gap-2">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link to="/owner/products" className="btn btn-secondary btn-sm flex items-center gap-2">
              <Package size={16} /> Products
            </Link>
            <Link to="/owner/orders" className="btn btn-secondary btn-sm flex items-center gap-2">
              <ShoppingBag size={16} /> Orders
            </Link>
            <Link to="/owner/customers" className="btn btn-secondary btn-sm flex items-center gap-2">
              <Users size={16} /> Customers
            </Link>
          </nav>
        ) : (
          /* Customer / Visitor Navigation Links */
          <nav className="flex items-center gap-6">
            <Link to="/" style={{ color: location.pathname === '/' ? '#15803d' : '#475569', fontWeight: '600' }}>
              Home
            </Link>
            <Link to="/products" style={{ color: location.pathname === '/products' ? '#15803d' : '#475569', fontWeight: '600' }}>
              Products
            </Link>
            {isCustomer && (
              <Link to="/my-orders" style={{ color: location.pathname === '/my-orders' ? '#15803d' : '#475569', fontWeight: '600' }}>
                My Orders
              </Link>
            )}
          </nav>
        )}

        {/* Right Actions Header */}
        <div className="flex items-center gap-4">
          {/* Notification Bell Component */}
          {user && <NotificationBell />}

          {/* Cart Icon for Customer */}
          {(!user || isCustomer) && (
            <Link to="/cart" className="btn btn-outline btn-sm flex items-center gap-2" style={{ position: 'relative' }}>
              <ShoppingBag size={18} />
              <span>Cart</span>
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* User Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2" style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '10px' }}>
                <UserIcon size={16} color="#15803d" />
                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1e293b' }}>
                  {user.fullName || user.email}
                </span>
                {isOwner && <span className="badge badge-organic" style={{ background: '#fef3c7', color: '#b45309' }}>OWNER</span>}
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Customer Login
              </Link>
              <Link to="/owner-login" className="btn btn-outline btn-sm flex items-center gap-1" style={{ borderColor: '#d97706', color: '#b45309' }}>
                <Shield size={14} /> Owner Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
