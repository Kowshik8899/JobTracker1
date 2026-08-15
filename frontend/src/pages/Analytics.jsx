import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  Download, 
  RefreshCw, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart2,
  Target
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import PageLoader from '../components/PageLoader';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState(5);
  const [savingGoal, setSavingGoal] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.get(`${backendUrl}/api/analytics`, config);
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user.token]);

  const handleExportPDF = () => {
    if (!data) return;
    
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('JobTracker Analytics Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    autoTable(doc, {
      startY: 40,
      head: [['Metric', 'Value']],
      body: [
        ['Total Applications', data.totalApplications],
        ['Interviews', data.interviews],
        ['Offers', data.offers],
        ['Pending', data.pending],
        ['Rejected', data.rejected],
        ['Response Rate', `${data.rates.responseRate}%`],
        ['Interview Rate', `${data.rates.interviewRate}%`],
        ['Offer Rate', `${data.rates.offerRate}%`],
      ],
    });
    
    // Add status distribution
    const statusData = Object.keys(data.statusDistribution)
      .filter(k => data.statusDistribution[k] > 0)
      .map(k => [k, data.statusDistribution[k]]);
      
    if (statusData.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Application Status', 'Count']],
        body: statusData,
      });
    }
    
    doc.save('jobtracker-analytics.pdf');
    toast.success('Analytics report downloaded successfully!');
  };

  const handleEditGoals = () => {
    setGoalInput(data.weeklyGoal || 5);
    setShowGoalModal(true);
  };

  const saveGoal = async () => {
    setSavingGoal(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${backendUrl}/api/auth/profile`, { weeklyGoal: Number(goalInput) }, config);
      
      setData(prev => ({ ...prev, weeklyGoal: Number(goalInput) }));
      
      const updatedUser = { ...user, weeklyGoal: Number(goalInput) };
      updateUser(updatedUser);
      
      setShowGoalModal(false);
      toast.success('Weekly goal updated!');
    } catch (error) {
      toast.error('Failed to update goal');
    } finally {
      setSavingGoal(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!data) return <DashboardLayout title="Analytics"><div style={{ padding: '2rem', textAlign: 'center' }}>No data available</div></DashboardLayout>;

  // Prepare chart data
  const timelineLabels = Object.keys(data.timeline).reverse();
  const timelineValues = Object.values(data.timeline).reverse();

  const lineChartData = {
    labels: timelineLabels,
    datasets: [
      {
        label: 'Applications',
        data: timelineValues,
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const statusLabels = Object.keys(data.statusDistribution).filter(k => data.statusDistribution[k] > 0);
  const statusValues = statusLabels.map(k => data.statusDistribution[k]);
  
  const getStatusColor = (status) => {
    const colors = {
      'Applied': '#3B82F6',
      'Screening': '#8B5CF6',
      'Interview': '#F59E0B',
      'Technical Interview': '#F59E0B',
      'Final Interview': '#F59E0B',
      'Offer': '#10B981',
      'Accepted': '#10B981',
      'Rejected': '#EF4444',
      'Withdrawn': '#EF4444'
    };
    return colors[status] || '#9CA3AF';
  };

  const doughnutChartData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusValues,
        backgroundColor: statusLabels.map(getStatusColor),
        borderWidth: 0,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'var(--color-text-main)'
        }
      }
    },
    scales: {
      y: {
        ticks: { color: 'var(--color-text-muted)', precision: 0 },
        grid: { color: 'var(--color-border)' }
      },
      x: {
        ticks: { color: 'var(--color-text-muted)' },
        grid: { display: false }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: 'var(--color-text-main)' }
      }
    }
  };

  return (
    <DashboardLayout title="Analytics">
      {/* Action Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Overview</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Track your application performance metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={fetchAnalytics} className="btn btn-secondary">
            <RefreshCw size={18} /> Refresh
          </button>
          <button onClick={handleExportPDF} className="btn btn-primary">
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Applications</p>
          <h3 style={{ fontSize: '2.5rem', margin: 0 }}>{data.totalApplications}</h3>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Response Rate</p>
          <h3 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--color-info)' }}>{data.rates.responseRate}%</h3>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Interview Rate</p>
          <h3 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--color-warning)' }}>{data.rates.interviewRate}%</h3>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Offer Rate</p>
          <h3 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--color-success)' }}>{data.rates.offerRate}%</h3>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Applications Over Time */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1.125rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--color-primary)" /> Applications Over Time
            </h3>
          </div>
          <div className="card-body" style={{ height: '300px' }}>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1.125rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChartIcon size={18} color="var(--color-primary)" /> Application Status
            </h3>
          </div>
          <div className="card-body" style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            {statusLabels.length > 0 ? (
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-muted)' }}>No data to display</div>
            )}
          </div>
        </div>
      </div>

      {/* Goals & Comparisons */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem'
      }}>
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1.125rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="var(--color-primary)" /> Weekly Goals
            </h3>
            <button onClick={handleEditGoals} className="btn-text" style={{ fontSize: '0.875rem' }}>Edit Goals</button>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '500' }}>Applications this week</span>
              <span style={{ fontWeight: 'bold' }}>2 / {data.weeklyGoal}</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${Math.min((2 / data.weeklyGoal) * 100, 100)}%`, 
                backgroundColor: 'var(--color-primary)' 
              }}></div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
              You're on track! Keep applying to reach your weekly goal.
            </p>
          </div>
        </div>
      </div>
      {/* Goal Edit Modal */}
      {showGoalModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div className="card slide-up" style={{ width: '90%', maxWidth: '400px' }}>
            <div className="card-header">
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={20} color="var(--color-primary)" /> Edit Weekly Goal
              </h3>
            </div>
            <div className="card-body">
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                How many applications do you want to submit each week?
              </p>
              <div className="form-group">
                <input 
                  type="number" 
                  min="1" max="100" 
                  className="form-control" 
                  value={goalInput} 
                  onChange={(e) => setGoalInput(e.target.value)} 
                />
              </div>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowGoalModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveGoal} disabled={savingGoal}>
                {savingGoal ? 'Saving...' : 'Save Goal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Analytics;
