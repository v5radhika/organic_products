import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart');
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    try {
      const res = await API.put(`/cart/items/${itemId}`, { quantity: newQty });
      if (res.data.success) setCart(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const res = await API.delete(`/cart/items/${itemId}`);
      if (res.data.success) setCart(res.data.data);
    } catch (err) {
      alert('Failed to remove item from cart');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading shopping cart...</div>;

  const items = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Your Shopping Cart</h1>
        <p style={{ color: '#64748b' }}>Review items before placing your organic order</p>
      </div>

      {items.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
          <ShoppingBag size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' }}>Your cart is empty</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Looks like you haven't added any organic items yet.</p>
          <Link to="/products" className="btn btn-primary">Browse Organic Store</Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div style={{ gridColumn: 'span 2' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4"
                  style={{ padding: '1.25rem 0', borderBottom: '1px solid #f1f5f9' }}
                >
                  <img
                    src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
                    alt={item.product?.name}
                    style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
                  />

                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>{item.product?.name}</h4>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                      Price: ₹{item.unitPrice} / unit
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2" style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px' }}>-</button>
                    <span style={{ fontWeight: '700', padding: '0 8px' }}>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px' }}>+</button>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '100px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#064e3b' }}>₹{item.totalPrice}</div>
                    <button onClick={() => handleRemoveItem(item.id)} style={{ background: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: '600', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between" style={{ paddingTop: '1.5rem' }}>
                <Link to="/products" className="btn btn-secondary btn-sm flex items-center gap-2">
                  <ArrowLeft size={16} /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary Box */}
          <div>
            <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                Order Summary
              </h3>

              <div className="flex justify-between" style={{ marginBottom: '0.75rem', color: '#475569' }}>
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items):</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between" style={{ marginBottom: '1.25rem', color: '#475569' }}>
                <span>Delivery Charge:</span>
                <span style={{ color: '#15803d', fontWeight: '700' }}>FREE</span>
              </div>

              <div className="flex justify-between" style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>Total Amount:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#064e3b' }}>₹{totalAmount}</span>
              </div>

              <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
