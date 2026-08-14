import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Truck, CheckCircle, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/cart')
      .then((res) => {
        if (res.data.success) setCart(res.data.data);
      })
      .catch((err) => setError('Failed to fetch cart details'))
      .finally(() => setLoading(false));
  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress || !contactPhone) {
      setError('Please provide shipping address and contact phone number.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const res = await API.post('/orders', { shippingAddress, contactPhone });
      if (res.data.success) {
        alert('Order placed successfully! Real-time notification sent to farm owner.');
        navigate('/my-orders');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading checkout...</div>;

  const items = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Your cart is empty!</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <button onClick={() => navigate('/cart')} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Cart
      </button>

      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '2rem' }}>Checkout & Order Review</h1>

      {error && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem' }}>Shipping & Contact Details</h3>

            <form onSubmit={handlePlaceOrder}>
              <div className="input-group">
                <label className="input-label">Customer Name</label>
                <input type="text" value={user?.fullName || ''} disabled className="input-field" style={{ background: '#f1f5f9' }} />
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input type="email" value={user?.email || ''} disabled className="input-field" style={{ background: '#f1f5f9' }} />
              </div>

              <div className="input-group">
                <label className="input-label">Delivery Shipping Address *</label>
                <textarea
                  rows="3"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter full street address, landmark, city and pincode..."
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Contact Phone Number *</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="input-field"
                  required
                />
              </div>

              <div style={{ background: '#f0fdf4', padding: '1.25rem', borderRadius: '12px', border: '1px solid #bbf7d0', margin: '1.5rem 0' }}>
                <div className="flex items-center gap-2" style={{ fontWeight: '700', color: '#15803d', marginBottom: '4px' }}>
                  <ShieldCheck size={20} /> Payment Option: Cash on Delivery / Pay on Harvest
                </div>
                <div style={{ fontSize: '0.85rem', color: '#166534' }}>
                  Pay securely after inspecting your fresh organic delivery.
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}>
                {submitting ? 'Placing Order...' : `Confirm & Place Order (₹${totalAmount})`}
              </button>
            </form>
          </div>
        </div>

        {/* Items Summary Side Box */}
        <div>
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              Order Breakdown ({items.length} items)
            </h3>

            <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '1rem' }}>
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between" style={{ padding: '8px 0', borderBottom: '1px dashed #f1f5f9', fontSize: '0.9rem' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{item.product?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: '700', color: '#064e3b' }}>₹{item.totalPrice}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between" style={{ borderTop: '2px solid #e2e8f0', paddingTop: '1rem', fontSize: '1.2rem', fontWeight: '800' }}>
              <span>Total Payable:</span>
              <span style={{ color: '#064e3b' }}>₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
