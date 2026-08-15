import React, { useContext, useRef, useEffect } from 'react';
import { Bell, CheckCircle, Clock, Info, AlertCircle } from 'lucide-react';
import { NotificationContext } from '../context/NotificationContext';

const NotificationPanel = ({ isOpen, onClose, onToggle }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useContext(NotificationContext);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getIcon = (type) => {
    switch(type) {
      case 'upcoming_deadline': return <Clock size={16} color="var(--color-warning)" />;
      case 'interview': return <CheckCircle size={16} color="var(--color-success)" />;
      case 'application_update': return <Info size={16} color="var(--color-info)" />;
      default: return <AlertCircle size={16} color="var(--color-primary)" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // in seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div ref={panelRef}>
      <button className="btn-icon" onClick={onToggle} style={{ position: 'relative' }}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            backgroundColor: 'var(--color-danger)',
            color: 'white',
            fontSize: '0.65rem',
            fontWeight: 'bold',
            height: '16px',
            minWidth: '16px',
            padding: '0 4px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '120%',
          right: 0,
          width: '320px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          zIndex: 1000
        }} className="slide-up">
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '1rem', margin: 0 }}>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead} 
                className="btn-text" 
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  onClick={() => !notif.isRead && markAsRead(notif._id)}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: notif.isRead ? 'transparent' : 'var(--color-primary-light)',
                    cursor: notif.isRead ? 'default' : 'pointer',
                    display: 'flex',
                    gap: '0.75rem',
                    transition: 'background-color var(--transition-fast)'
                  }}
                >
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--color-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getIcon(notif.type)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.875rem', margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>{notif.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0 0 0.25rem 0' }}>{notif.message}</p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-light)' }}>{formatDate(notif.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
