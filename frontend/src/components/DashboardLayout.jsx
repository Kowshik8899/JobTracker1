import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import NotificationPanel from './NotificationPanel';

const DashboardLayout = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="main-content">
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 99
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="btn-icon"
              style={{ display: 'none' }}
              onClick={() => setIsSidebarOpen(true)}
              id="mobile-menu-toggle"
            >
              <Menu size={24} />
            </button>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{title}</h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ThemeToggle />
            <div style={{ position: 'relative' }}>
              <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} onToggle={() => setIsNotifOpen(!isNotifOpen)} />
            </div>
          </div>
        </header>
        
        <main className="page-container">
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-toggle { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
