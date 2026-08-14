import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { Package, Clock, CheckCircle, Truck, AlertCircle, Eye } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my')
      .then((res) => {
        if (res.data.success) setOrders(res.data.data);
      })
      .catch((err) => console.error('Failed to fetch orders:', err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span className="badge badge-pending">PENDING</span>;
      case 'CONFIRMED': return <span className="badge badge-confirmed">CONFIRMED</span>;
      case 'PROCESSING': return <span className="badge badge-processing">PROCESSING</span>;
      case 'SHIPPED': return <span className="badge badge-shipped">SHIPPED</span>;
      case 'DELIVERED': return <span className="badge badge-delivered">DELIVERED</span>;
      case 'CANCELLED': return <span className="badge badge-cancelled">CANCELLED</span>;
      default: return <span className="badge badge-pending">{status}</span>;
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading your order history...</div>;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>My Order History</h1>
        <p style={{ color: '#64748b' }}>Track real-time status updates of your organic farm orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
          <Package size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No orders placed yet</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Start your journey with pure organic products.</p>
          <Link to="/products" className="btn btn-primary">Browse Shop</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
              <div className="flex items-center justify-between" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginRight: '1rem' }}>
                    Order #{order.id}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Placed on: {new Date(order.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <Link to={`/orders/${order.id}`} className="btn btn-secondary btn-sm flex items-center gap-1">
                    <Eye size={14} /> Details
                  </Link>
                </div>
              </div>

              {/* Items Preview */}
              <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Ordered Items:</div>
                  <ul style={{ listStyle: 'none', fontSize: '0.9rem', color: '#1e293b' }}>
                    {order.items.map((item) => (
                      <li key={item.id} style={{ marginBottom: '4px' }}>
                        • {item.product?.name} <span style={{ color: '#64748b' }}>x {item.quantity}</span> (₹{item.totalPrice})
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Delivery Address:</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>{order.shippingAddress}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>Phone: {order.contactPhone}</div>
                </div>
              </div>

              <div className="flex items-center justify-between" style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '10px' }}>
                <span style={{ fontWeight: '600', color: '#475569' }}>Total Order Value:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#064e3b' }}>₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
