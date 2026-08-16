import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  XCircle, 
  TrendingUp,
  Plus,
  ArrowRight
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import PageLoader from '../components/PageLoader';

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
          {title}
        </p>
        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--color-text-main)' }}>
          {value}
        </h3>
      </div>
      <div style={{ 
        width: '48px', 
        height: '48px', 
        borderRadius: 'var(--radius-md)', 
        backgroundColor: `${color}15`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
    </div>
    {trend && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
        <TrendingUp size={14} color="var(--color-success)" />
        <span style={{ color: 'var(--color-success)', fontWeight: '500' }}>{trend}</span>
        <span>vs last month</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_URL || 'https://jobtracker-backend-4mt6.onrender.com';
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };

        const [analyticsRes, appsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/analytics`, config),
          axios.get(`${backendUrl}/api/applications?sort=newest`, config)
        ]);

        setStats(analyticsRes.data);
        setRecentApplications(appsRes.data.slice(0, 5)); // Get top 5 newest
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.token]);

  if (loading) {
    return <PageLoader />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'var(--color-info)';
      case 'Screening': return '#8B5CF6';
      case 'Interview': case 'Technical Interview': case 'Final Interview': return 'var(--color-warning)';
      case 'Offer': case 'Accepted': return 'var(--color-success)';
      case 'Rejected': case 'Withdrawn': return 'var(--color-danger)';
      default: return 'var(--color-text-muted)';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Applied': return 'badge-applied';
      case 'Screening': return 'badge-screening';
      case 'Interview': case 'Technical Interview': case 'Final Interview': return 'badge-interview';
      case 'Offer': case 'Accepted': return 'badge-offer';
      case 'Rejected': case 'Withdrawn': return 'badge-rejected';
      default: return 'badge-applied';
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome back, {user.firstName}! 👋</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Here's what's happening with your job applications today.</p>
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link to="/applications/add" className="btn btn-primary">
          <Plus size={18} /> Add Application
        </Link>
        <Link to="/applications" className="btn btn-secondary">
          View All Applications
        </Link>
        <Link to="/analytics" className="btn btn-secondary">
          View Analytics
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard 
          title="Total Applications" 
          value={stats?.totalApplications || 0} 
          icon={<Briefcase size={24} />} 
          color="var(--color-primary)" 
        />
        <StatCard 
          title="Interviews" 
          value={stats?.interviews || 0} 
          icon={<Clock size={24} />} 
          color="var(--color-warning)" 
        />
        <StatCard 
          title="Offers" 
          value={stats?.offers || 0} 
          icon={<CheckCircle size={24} />} 
          color="var(--color-success)" 
        />
        <StatCard 
          title="Rejected" 
          value={stats?.rejected || 0} 
          icon={<XCircle size={24} />} 
          color="var(--color-danger)" 
        />
      </div>

      {/* Main Content Area */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Recent Applications */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Recent Applications</h3>
            <Link to="/applications" style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            {recentApplications.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Company</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Role</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: '500' }}>{app.companyName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{app.location || '-'}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-main)' }}>{app.jobRole}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        {new Date(app.applicationDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <Briefcase size={48} color="var(--color-border)" style={{ marginBottom: '1rem' }} />
                <h4 style={{ marginBottom: '0.5rem' }}>No applications yet</h4>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Start tracking your job search by adding your first application.</p>
                <Link to="/applications/add" className="btn btn-primary">
                  Add Application
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
