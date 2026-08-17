import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import PageLoader from '../components/PageLoader';
import toast from 'react-hot-toast';

const Applications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  
  // Filters and Sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  
  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'https://jobtracker-backend-4mt6.onrender.com';
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params: {
          search: searchTerm,
          status: statusFilter,
          sort: sortOption
        }
      };

      const { data } = await axios.get(`${backendUrl}/api/applications`, config);
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchApplications();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter, sortOption, user.token]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setSortOption('newest');
  };

  const confirmDelete = (app) => {
    setAppToDelete(app);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!appToDelete) return;
    
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'https://jobtracker-backend-4mt6.onrender.com';
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      await axios.delete(`${backendUrl}/api/applications/${appToDelete._id}`, config);
      toast.success('Application deleted successfully');
      
      // Update local state instead of refetching to be faster
      setApplications(prev => prev.filter(a => a._id !== appToDelete._id));
    } catch (error) {
      console.error("Failed to delete application:", error);
      toast.error('Failed to delete application');
    } finally {
      setDeleteModalOpen(false);
      setAppToDelete(null);
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
    <DashboardLayout title="Applications">
      {/* Filters and Actions Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
              <Search size={18} />
            </div>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search companies, roles, locations..." 
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={18} color="var(--color-text-muted)" />
              <select 
                className="form-control" 
                style={{ width: 'auto' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Interview">Interview</option>
                <option value="Technical Interview">Technical Interview</option>
                <option value="Final Interview">Final Interview</option>
                <option value="Offer">Offer</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>

            {/* Sort */}
            <select 
              className="form-control" 
              style={{ width: 'auto' }}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company">Company (A-Z)</option>
              <option value="status">Status</option>
            </select>

            {/* Clear Filters */}
            {(searchTerm || statusFilter !== 'All' || sortOption !== 'newest') && (
              <button className="btn-text" onClick={clearFilters}>
                Clear
              </button>
            )}

            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 0.5rem' }}></div>

            {/* View Toggle */}
            <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button 
                onClick={() => setViewMode('list')}
                style={{ 
                  padding: '0.5rem', 
                  border: 'none', 
                  backgroundColor: viewMode === 'list' ? 'var(--color-primary-light)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  cursor: 'pointer'
                }}
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                style={{ 
                  padding: '0.5rem', 
                  border: 'none', 
                  backgroundColor: viewMode === 'grid' ? 'var(--color-primary-light)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  cursor: 'pointer'
                }}
              >
                <Grid size={20} />
              </button>
            </div>

            {/* Add Application Button */}
            <Link to="/applications/add" className="btn btn-primary">
              <Plus size={18} /> Add
            </Link>
          </div>
        </div>
      </div>

      {/* Applications Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', 
            backgroundColor: 'var(--color-background)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 1.5rem auto' 
          }}>
            <Search size={32} color="var(--color-text-muted)" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No applications found</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            {searchTerm || statusFilter !== 'All' 
              ? "Try adjusting your filters or search term." 
              : "You haven't added any applications yet."}
          </p>
          {(searchTerm || statusFilter !== 'All') ? (
            <button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>
          ) : (
            <Link to="/applications/add" className="btn btn-primary">Add Your First Application</Link>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <div className="card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Company</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Role</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Date Applied</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: '500' }}>{app.companyName || 'Untitled Application'}</div>
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
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link to={`/applications/add?edit=${app._id}`} className="btn-icon" title="Edit">
                            <Edit2 size={16} />
                          </Link>
                          <button onClick={() => confirmDelete(app)} className="btn-icon" title="Delete" style={{ color: 'var(--color-danger)' }}>
                            <Trash2 size={16} />
                          </button>
                          {app.companyWebsite && (
                            <a href={app.companyWebsite} target="_blank" rel="noopener noreferrer" className="btn-icon" title="Company Website">
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {applications.map((app) => (
                <div key={app._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="card-header" style={{ alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', margin: '0 0 0.25rem 0' }}>{app.jobRole}</h3>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>{app.companyName || 'Untitled Application'}</p>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="card-body" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {app.location && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Location:</span>
                        <span style={{ fontWeight: '500' }}>{app.location}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Date Applied:</span>
                      <span style={{ fontWeight: '500' }}>{new Date(app.applicationDate).toLocaleDateString()}</span>
                    </div>
                    {app.salary && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Salary:</span>
                        <span style={{ fontWeight: '500' }}>{app.salary}</span>
                      </div>
                    )}
                  </div>
                  <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    {app.companyWebsite && (
                      <a href={app.companyWebsite} target="_blank" rel="noopener noreferrer" className="btn btn-text">
                        <ExternalLink size={16} />
                      </a>
                    )}
                    <Link to={`/applications/add?edit=${app._id}`} className="btn btn-secondary">
                      <Edit2 size={16} /> Edit
                    </Link>
                    <button onClick={() => confirmDelete(app)} className="btn btn-danger" style={{ padding: '0.625rem' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="card slide-up" style={{ width: '90%', maxWidth: '400px' }}>
            <div className="card-header">
              <h3 style={{ margin: 0 }}>Delete Application</h3>
            </div>
            <div className="card-body">
              <p>Are you sure you want to delete your application for <strong>{appToDelete?.jobRole}</strong> at <strong>{appToDelete?.companyName}</strong>?</p>
              <p style={{ color: 'var(--color-danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>This action cannot be undone.</p>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => {
                setDeleteModalOpen(false);
                setAppToDelete(null);
              }}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Applications;
