import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCheck, Circle, Sparkles, ShieldAlert } from 'lucide-react';

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Notification Center</h1>
          <p style={{ color: '#64748b' }}>Real-time farm alerts, order updates, stock and price notifications</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn btn-primary btn-sm flex items-center gap-2">
            <CheckCheck size={16} /> Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <Bell size={40} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <h3>No notifications found</h3>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id || Math.random()}
              onClick={() => !n.read && markAsRead(n.id)}
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                marginBottom: '1rem',
                border: '1px solid #e2e8f0',
                background: n.read ? 'white' : '#f0fdf4',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                cursor: n.read ? 'default' : 'pointer',
              }}
            >
              <div style={{ background: n.read ? '#f1f5f9' : '#dcfce7', padding: '10px', borderRadius: '10px' }}>
                <Sparkles size={20} color="#15803d" />
              </div>

              <div style={{ flex: 1 }}>
                <div className="flex items-center justify-between">
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>{n.title}</h4>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Just now'}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '4px', lineHeight: '1.5' }}>{n.message}</p>
                <div className="flex items-center gap-2" style={{ marginTop: '8px' }}>
                  <span className="badge badge-organic" style={{ fontSize: '0.7rem' }}>{n.type}</span>
                  {!n.read && <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: '700' }}>● Unread</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
