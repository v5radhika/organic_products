import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import API from '../api/axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, isOwner } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);

  const addToast = (notification) => {
    const toastId = Date.now() + Math.random();
    const newToast = { ...notification, toastId };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    setTimeout(() => {
      removeToast(toastId);
    }, 6000);
  };

  const removeToast = (toastId) => {
    setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const endpoint = isOwner ? '/owner/notifications' : '/notifications';
      const res = await API.get(endpoint);
      if (res.data && res.data.success) {
        const list = res.data.data || [];
        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.read).length);
      }
    } catch (err) {
      console.warn('Failed to fetch notification history:', err?.message);
    }
  };

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();

    let client = null;
    try {
      client = new Client({
        webSocketFactory: () => new SockJS('/ws-notifications'),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('Connected to Venkatesha WebSocket Notification Broker');

          client.subscribe('/topic/notifications/public', (message) => {
            try {
              const payload = JSON.parse(message.body);
              setNotifications((prev) => [payload, ...prev]);
              setUnreadCount((prev) => prev + 1);
              addToast(payload);
            } catch (e) {
              console.error(e);
            }
          });

          if (isOwner) {
            client.subscribe('/topic/notifications/owner', (message) => {
              try {
                const payload = JSON.parse(message.body);
                setNotifications((prev) => [payload, ...prev]);
                setUnreadCount((prev) => prev + 1);
                addToast({ ...payload, isOwner: true });
              } catch (e) {
                console.error(e);
              }
            });
          }

          if (user && !isOwner) {
            client.subscribe(`/topic/notifications/customer/${user.id}`, (message) => {
              try {
                const payload = JSON.parse(message.body);
                setNotifications((prev) => [payload, ...prev]);
                setUnreadCount((prev) => prev + 1);
                addToast(payload);
              } catch (e) {
                console.error(e);
              }
            });
          }
        },
        onStompError: (frame) => {
          console.warn('STOMP Broker notice:', frame?.headers?.['message']);
        },
        onWebSocketError: (event) => {
          console.warn('WebSocket connection notice:', event);
        }
      });

      client.activate();
    } catch (e) {
      console.warn('Could not initialize WebSocket client:', e);
    }

    return () => {
      if (client) {
        try {
          client.deactivate();
        } catch (e) {}
      }
    };
  }, [user, isOwner]);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        markAsRead,
        markAllAsRead,
        removeToast,
        refetch: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
