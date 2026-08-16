import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useContext(AuthContext);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'https://jobtracker-backend-4mt6.onrender.com';
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const { data } = await axios.get(`${backendUrl}/api/notifications`, config);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'https://jobtracker-backend-4mt6.onrender.com';
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await axios.put(`${backendUrl}/api/notifications/${id}/read`, {}, config);
      
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'https://jobtracker-backend-4mt6.onrender.com';
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await axios.put(`${backendUrl}/api/notifications/read-all`, {}, config);
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const addLocalNotification = (notification) => {
    const newNotification = {
      _id: Date.now().toString(),
      isRead: false,
      createdAt: new Date().toISOString(),
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      fetchNotifications, 
      markAsRead, 
      markAllAsRead,
      addLocalNotification 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
