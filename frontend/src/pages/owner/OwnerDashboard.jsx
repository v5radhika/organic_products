import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { DollarSign, ShoppingBag, Users, AlertTriangle, Package, TrendingUp, Clock, Eye } from 'lucide-react';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/owner/dashboard')
      .then((res) => {
        if (res.data.success) setData(res.data.data);
      })
      .catch((err) => console.error('Failed to fetch dashboard data:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading owner analytics dashboard...</div>;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#78350f' }}>Owner Control Dashboard</h1>
        <p style={{ color: '#64748b' }}>Real-time sales metrics, inventory low-stock alerts, customer & order management</p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #15803d' }}>
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total Revenue</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#064e3b', marginTop: '4px' }}>₹{data?.totalSales}</div>
            </div>
            <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '14px' }}>
              <DollarSign color="#15803d" size={26} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #0284c7' }}>
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total Orders</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{data?.totalOrders}</div>
              <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: '600' }}>{data?.pendingOrders} Pending Action</div>
            </div>
            <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '14px' }}>
              <ShoppingBag color="#0284c7" size={26} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #7e22ce' }}>
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Registered Customers</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{data?.totalCustomers}</div>
            </div>
            <div style={{ background: '#f3e8ff', padding: '12px', borderRadius: '14px' }}>
              <Users color="#7e22ce" size={26} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #d97706' }}>
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Low Stock Alert</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#b45309', marginTop: '4px' }}>{data?.lowStockProductsCount}</div>
              <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: '600' }}>Stock ≤ 5 units</div>
            </div>
            <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '14px' }}>
              <AlertTriangle color="#d97706" size={26} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Recent Orders List */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Recent Customer Orders</h3>
              <Link to="/owner/orders" className="btn btn-outline btn-sm">View All Orders</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(data?.recentOrders || []).map((order) => (
                <div key={order.id} className="flex items-center justify-between" style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>
                      Order #{order.id} — {order.customerName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      {new Date(order.createdAt).toLocaleString()} • {order.items.length} item(s)
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge badge-pending">{order.status}</span>
                    <span style={{ fontWeight: '800', color: '#064e3b' }}>₹{order.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Warnings Box */}
        <div>
          <div className="card" style={{ padding: '1.75rem', border: '2px solid #fde68a' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '1.25rem', color: '#b45309' }}>
              <AlertTriangle size={22} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Low Stock Warnings</h3>
            </div>

            {(data?.lowStockProducts || []).length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>All product stocks are healthy!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {(data?.lowStockProducts || []).map((product) => (
                  <div key={product.id} className="flex items-center justify-between" style={{ padding: '10px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fef08a' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#78350f' }}>{product.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#b45309' }}>Remaining: {product.stockQuantity} units</div>
                    </div>
                    <Link to="/owner/products" className="btn btn-accent btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                      Restock
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
