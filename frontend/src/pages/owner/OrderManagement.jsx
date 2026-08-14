import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { ShoppingBag, Eye, RefreshCw, CheckCircle } from 'lucide-react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/owner/orders');
      if (res.data.success) setOrders(res.data.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await API.put(`/owner/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        alert(`Order #${orderId} status updated to '${newStatus}'! Real-time WebSocket notification sent to customer.`);
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading store orders...</div>;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Store Order Management</h1>
        <p style={{ color: '#64748b' }}>Process customer orders and push real-time status updates</p>
      </div>

      <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px 16px' }}>Order ID</th>
              <th style={{ padding: '12px 16px' }}>Customer</th>
              <th style={{ padding: '12px 16px' }}>Order Items</th>
              <th style={{ padding: '12px 16px' }}>Total (₹)</th>
              <th style={{ padding: '12px 16px' }}>Placed Date</th>
              <th style={{ padding: '12px 16px' }}>Current Status</th>
              <th style={{ padding: '12px 16px' }}>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: '800', color: '#0f172a' }}>#{o.id}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{o.customerName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{o.customerEmail}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Phone: {o.contactPhone}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.85rem' }}>
                    {o.items.map((i) => (
                      <div key={i.id}>• {i.product?.name} x {i.quantity}</div>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: '800', color: '#064e3b' }}>₹{o.totalAmount}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b' }}>
                  {new Date(o.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span className="badge badge-pending">{o.status}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <select
                    value={o.status}
                    disabled={updatingId === o.id}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="input-field"
                    style={{ padding: '6px 10px', fontSize: '0.82rem', fontWeight: '600' }}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
