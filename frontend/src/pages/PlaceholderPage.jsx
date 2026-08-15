import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';

const PlaceholderPage = () => {
  const location = useLocation();
  const path = location.pathname.replace('/', '');
  const title = path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');

  return (
    <div className="page-container">
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <div style={{ 
          backgroundColor: 'var(--color-primary-light)', 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 2rem auto'
        }}>
          <Clock size={40} color="var(--color-primary)" />
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{title}</h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          We're currently building our {title.toLowerCase()} page. Please check back soon!
        </p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PlaceholderPage;
