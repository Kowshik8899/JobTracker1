import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1.25rem 2rem',
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Briefcase color="var(--color-primary)" size={28} />
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>
          JobTracker
        </Link>
      </div>

      {/* Desktop Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-menu">
        <Link to="/" style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Home</Link>
        {user && (
          <>
            <Link to="/dashboard" style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Dashboard</Link>
            <Link to="/applications" style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Applications</Link>
            <Link to="/analytics" style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Analytics</Link>
          </>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
          <ThemeToggle />
          
          {user ? (
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          ) : (
            <>
              <Link to="/login" className="btn btn-text">Login</Link>
              <Link to="/register" className="btn btn-primary">Start Tracking Free</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Hamburger */}
      <div className="mobile-menu-btn" style={{ display: 'none' }}>
        <button onClick={toggleMobileMenu} className="btn-icon">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            padding: '1rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <Link to="/" onClick={closeMobileMenu} style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Home</Link>
          {user && (
            <>
              <Link to="/dashboard" onClick={closeMobileMenu} style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Dashboard</Link>
              <Link to="/applications" onClick={closeMobileMenu} style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Applications</Link>
              <Link to="/analytics" onClick={closeMobileMenu} style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Analytics</Link>
            </>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <ThemeToggle />
            
            {user ? (
              <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="btn btn-secondary">Logout</button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" onClick={closeMobileMenu} className="btn btn-secondary">Login</Link>
                <Link to="/register" onClick={closeMobileMenu} className="btn btn-primary">Start Tracking Free</Link>
              </div>
            )}
          </div>
        </div>
      )}
      
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
