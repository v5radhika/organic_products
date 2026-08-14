import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Users, Mail, Phone, MapPin } from 'lucide-react';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/owner/customers')
      .then((res) => {
        if (res.data.success) setCustomers(res.data.data);
      })
      .catch((err) => console.error('Failed to fetch customers:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading registered customers...</div>;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Registered Customer Directory</h1>
        <p style={{ color: '#64748b' }}>View all customers who have registered on Venkatesha Organic Store</p>
      </div>

      <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px 16px' }}>Customer Name</th>
              <th style={{ padding: '12px 16px' }}>Email Address</th>
              <th style={{ padding: '12px 16px' }}>Phone Number</th>
              <th style={{ padding: '12px 16px' }}>Shipping Address</th>
              <th style={{ padding: '12px 16px' }}>Registered Date</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0f172a' }}>{c.fullName}</td>
                <td style={{ padding: '12px 16px', color: '#15803d', fontWeight: '600' }}>{c.email}</td>
                <td style={{ padding: '12px 16px', color: '#475569' }}>{c.phone || 'N/A'}</td>
                <td style={{ padding: '12px 16px', color: '#475569', fontSize: '0.85rem' }}>{c.address || 'N/A'}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b' }}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerManagement;
