import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, ShieldAlert, Sparkles, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.toastId} className={`toast ${toast.isOwner ? 'toast-owner' : ''}`}>
          <div style={{ background: toast.isOwner ? '#fef3c7' : '#dcfce7', padding: '6px', borderRadius: '8px' }}>
            {toast.isOwner ? <ShieldAlert size={18} color="#b45309" /> : <Sparkles size={18} color="#15803d" />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#ffffff' }}>{toast.title}</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px', lineHeight: '1.4' }}>{toast.message}</div>
          </div>
          <button
            onClick={() => removeToast(toast.toastId)}
            style={{ background: 'none', color: '#94a3b8', padding: '2px' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
