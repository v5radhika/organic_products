import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCheck, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary btn-sm"
        style={{ position: 'relative', padding: '8px 10px', borderRadius: '10px' }}
        aria-label="Notifications"
      >
        <Bell size={18} color="#334155" />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#d97706',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: '800',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '46px',
            width: '340px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)',
            zIndex: 2000,
            overflow: 'hidden',
          }}
        >
          <div className="flex items-center justify-between" style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{ background: 'none', color: '#15803d', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 8).map((n) => (
                <div
                  key={n.id || Math.random()}
                  onClick={() => !n.read && markAsRead(n.id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    background: n.read ? 'white' : '#f0fdf4',
                    cursor: n.read ? 'default' : 'pointer',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                  }}
                >
                  {!n.read && <Circle size={8} fill="#15803d" color="#15803d" style={{ marginTop: '6px' }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0f172a' }}>{n.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px', lineHeight: '1.4' }}>{n.message}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                      {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ padding: '10px', textAlign: 'center', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              style={{ fontSize: '0.8rem', fontWeight: '700', color: '#15803d' }}
            >
              View notification history
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
