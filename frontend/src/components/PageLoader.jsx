import React from 'react';

const PageLoader = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-primary)'
    }}>
      <div className="spinner" style={{ width: '3rem', height: '3rem', borderWidth: '4px' }}></div>
      <p style={{ marginTop: '1rem', fontWeight: '500', color: 'var(--color-text-main)' }}>Loading JobTracker...</p>
    </div>
  );
};

export default PageLoader;
