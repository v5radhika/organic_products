import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { ArrowLeft, CheckCircle2, Clock, Truck, Package, ShieldCheck } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then((res) => {
        if (res.data.success) setOrder(res.data.data);
      })
      .catch((err) => setError('Order not found or access denied'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading order details...</div>;
  if (error || !order) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: '#ef4444' }}>{error}</div>;

  const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <button onClick={() => navigate('/my-orders')} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to My Orders
      </button>

      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div className="flex items-center justify-between" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Order #{order.id}</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-delivered" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Live Order Status Timeline */}
        {order.status !== 'CANCELLED' && (
          <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem', textAlign: 'center' }}>Real-time Delivery Timeline</h4>
            <div className="flex items-center justify-between" style={{ position: 'relative' }}>
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                return (
                  <div key={step} style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: isCompleted ? '#15803d' : '#e2e8f0',
                        color: isCompleted ? 'white' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px auto',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={20} /> : idx + 1}
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: isCompleted ? '700' : '500', color: isCompleted ? '#15803d' : '#64748b' }}>
                      {step}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Items Breakdown */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem' }}>Items in this Order</h3>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between" style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9' }}>
              <div className="flex items-center gap-3">
                <img src={item.product?.imageUrl} alt={item.product?.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{item.product?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>₹{item.priceAtPurchase} x {item.quantity} unit(s)</div>
                </div>
              </div>
              <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#064e3b' }}>₹{item.totalPrice}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center" style={{ background: '#f0fdf4', padding: '1.25rem 1.5rem', borderRadius: '12px' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>Total Amount Paid / Payable:</span>
          <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#064e3b' }}>₹{order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
