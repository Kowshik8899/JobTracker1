import React, { useContext } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  BarChart2, 
  User, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Applications', path: '/applications', icon: <Briefcase size={20} /> },
    { name: 'Add Application', path: '/applications/add', icon: <PlusCircle size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      ></div>

      {/* Sidebar Content */}
      <aside 
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0
        }}
      >
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', cursor: 'pointer' }}>
            <Briefcase color="var(--color-primary)" size={24} />
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>
              JobTracker
            </span>
          </Link>
          
          <button 
            className="btn-icon mobile-close-btn" 
            onClick={onClose}
            style={{ display: 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem', overflowY: 'auto' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                    fontWeight: isActive ? '600' : '500',
                    transition: 'all var(--transition-fast)',
                    textDecoration: 'none'
                  })}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--color-border)' }}>
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-danger)',
              backgroundColor: 'transparent',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-danger-bg)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>

        <style>{`
          .nav-link:hover:not(.active) {
            background-color: var(--color-surface-hover) !important;
            color: var(--color-text-main) !important;
          }
          @media (max-width: 768px) {
            .mobile-close-btn { display: block !important; }
            .sidebar { position: fixed !important; z-index: 1000; }
          }
        `}</style>
      </aside>
    </>
  );
};

export default Sidebar;
