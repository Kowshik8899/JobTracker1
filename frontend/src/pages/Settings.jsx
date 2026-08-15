import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  Lock, 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [activeTab, setActiveTab] = useState('security');
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    interviewReminders: true,
    applicationUpdates: false,
    marketingEmails: false
  });

  useEffect(() => {
    if (user?.notificationPreferences) {
      setNotifications(user.notificationPreferences);
    }
  }, [user]);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const submitPasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      await axios.put(`${backendUrl}/api/auth/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, config);
      
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const submitNotificationPrefs = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      await axios.put(`${backendUrl}/api/auth/profile`, {
        notificationPreferences: notifications
      }, config);
      
      // Update context
      updateUser({ notificationPreferences: notifications });
      
      toast.success('Preferences saved successfully!');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      await axios.delete(`${backendUrl}/api/auth/account`, config);
      toast.success('Account deleted successfully');
      logout();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
      setDeleteModalOpen(false);
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Settings Sidebar */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          <div className="card">
            <ul style={{ listStyle: 'none', padding: '0.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`btn-text ${activeTab === 'security' ? 'active' : ''}`}
                  style={{ 
                    width: '100%', 
                    justifyContent: 'flex-start', 
                    padding: '0.75rem 1rem',
                    backgroundColor: activeTab === 'security' ? 'var(--color-primary-light)' : 'transparent',
                    color: activeTab === 'security' ? 'var(--color-primary)' : 'var(--color-text-main)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <Lock size={18} /> Security & Password
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className={`btn-text ${activeTab === 'notifications' ? 'active' : ''}`}
                  style={{ 
                    width: '100%', 
                    justifyContent: 'flex-start', 
                    padding: '0.75rem 1rem',
                    backgroundColor: activeTab === 'notifications' ? 'var(--color-primary-light)' : 'transparent',
                    color: activeTab === 'notifications' ? 'var(--color-primary)' : 'var(--color-text-main)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <Bell size={18} /> Notifications
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('appearance')}
                  className={`btn-text ${activeTab === 'appearance' ? 'active' : ''}`}
                  style={{ 
                    width: '100%', 
                    justifyContent: 'flex-start', 
                    padding: '0.75rem 1rem',
                    backgroundColor: activeTab === 'appearance' ? 'var(--color-primary-light)' : 'transparent',
                    color: activeTab === 'appearance' ? 'var(--color-primary)' : 'var(--color-text-main)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <Moon size={18} /> Appearance
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('danger')}
                  className={`btn-text ${activeTab === 'danger' ? 'active' : ''}`}
                  style={{ 
                    width: '100%', 
                    justifyContent: 'flex-start', 
                    padding: '0.75rem 1rem',
                    backgroundColor: activeTab === 'danger' ? 'var(--color-danger-bg)' : 'transparent',
                    color: activeTab === 'danger' ? 'var(--color-danger)' : 'var(--color-danger)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '1rem'
                  }}
                >
                  <AlertTriangle size={18} /> Danger Zone
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Settings Content */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card fade-in">
              <div className="card-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={20} color="var(--color-primary)" /> Security & Password
                </h3>
              </div>
              <div className="card-body">
                <form onSubmit={submitPasswordUpdate}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="currentPassword" 
                      value={passwordData.currentPassword} 
                      onChange={handlePasswordChange} 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="newPassword" 
                      value={passwordData.newPassword} 
                      onChange={handlePasswordChange} 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="confirmPassword" 
                      value={passwordData.confirmPassword} 
                      onChange={handlePasswordChange} 
                      required 
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>

                <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                  <h4 style={{ marginBottom: '1rem' }}>Two-Factor Authentication</h4>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    Add an extra layer of security to your account. We recommend enabling 2FA.
                  </p>
                  <button className="btn btn-secondary" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                    Enable 2FA (Coming Soon)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card fade-in">
              <div className="card-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={20} color="var(--color-primary)" /> Notification Preferences
                </h3>
              </div>
              <div className="card-body">
                <form onSubmit={submitNotificationPrefs}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0' }}>Email Alerts</h4>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Receive general notifications via email</p>
                      </div>
                      <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                        <input 
                          type="checkbox" 
                          name="emailAlerts" 
                          checked={notifications.emailAlerts} 
                          onChange={handleNotificationChange}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span className="slider round" style={{ 
                          position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                          backgroundColor: notifications.emailAlerts ? 'var(--color-primary)' : 'var(--color-border)', 
                          borderRadius: '24px', transition: '.4s' 
                        }}>
                          <span style={{
                            position: 'absolute', height: '18px', width: '18px', left: notifications.emailAlerts ? '26px' : '3px', bottom: '3px',
                            backgroundColor: 'white', borderRadius: '50%', transition: '.4s'
                          }}></span>
                        </span>
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0' }}>Interview Reminders</h4>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Get reminded 24h before upcoming interviews</p>
                      </div>
                      <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                        <input 
                          type="checkbox" 
                          name="interviewReminders" 
                          checked={notifications.interviewReminders} 
                          onChange={handleNotificationChange}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span className="slider round" style={{ 
                          position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                          backgroundColor: notifications.interviewReminders ? 'var(--color-primary)' : 'var(--color-border)', 
                          borderRadius: '24px', transition: '.4s' 
                        }}>
                          <span style={{
                            position: 'absolute', height: '18px', width: '18px', left: notifications.interviewReminders ? '26px' : '3px', bottom: '3px',
                            backgroundColor: 'white', borderRadius: '50%', transition: '.4s'
                          }}></span>
                        </span>
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0' }}>Application Updates</h4>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Alert me when I haven't updated an application in a while</p>
                      </div>
                      <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                        <input 
                          type="checkbox" 
                          name="applicationUpdates" 
                          checked={notifications.applicationUpdates} 
                          onChange={handleNotificationChange}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span className="slider round" style={{ 
                          position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                          backgroundColor: notifications.applicationUpdates ? 'var(--color-primary)' : 'var(--color-border)', 
                          borderRadius: '24px', transition: '.4s' 
                        }}>
                          <span style={{
                            position: 'absolute', height: '18px', width: '18px', left: notifications.applicationUpdates ? '26px' : '3px', bottom: '3px',
                            backgroundColor: 'white', borderRadius: '50%', transition: '.4s'
                          }}></span>
                        </span>
                      </label>
                    </div>

                  </div>
                  
                  <button type="submit" className="btn btn-primary">Save Preferences</button>
                </form>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="card fade-in">
              <div className="card-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Moon size={20} color="var(--color-primary)" /> Appearance
                </h3>
              </div>
              <div className="card-body">
                <h4 style={{ marginBottom: '1rem' }}>Theme</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  Customize the look and feel of your workspace.
                </p>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div 
                    onClick={() => theme !== 'light' && toggleTheme()}
                    style={{ 
                      flex: 1, 
                      padding: '1.5rem', 
                      border: `2px solid ${theme === 'light' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1rem',
                      backgroundColor: '#FFFFFF',
                      color: '#111827'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Globe size={20} color="#3B82F6" />
                    </div>
                    <span style={{ fontWeight: '500' }}>Light Mode</span>
                  </div>
                  
                  <div 
                    onClick={() => theme !== 'dark' && toggleTheme()}
                    style={{ 
                      flex: 1, 
                      padding: '1.5rem', 
                      border: `2px solid ${theme === 'dark' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1rem',
                      backgroundColor: '#111827',
                      color: '#FFFFFF'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Moon size={20} color="#60A5FA" />
                    </div>
                    <span style={{ fontWeight: '500' }}>Dark Mode</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div className="card fade-in" style={{ border: '1px solid var(--color-danger)' }}>
              <div className="card-header" style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-danger-bg)' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)' }}>
                  <AlertTriangle size={20} /> Danger Zone
                </h3>
              </div>
              <div className="card-body">
                <h4 style={{ marginBottom: '0.5rem' }}>Delete Account</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  Once you delete your account, there is no going back. All of your applications, notes, and analytics will be permanently deleted. Please be certain.
                </p>
                
                <button 
                  onClick={() => setDeleteModalOpen(true)} 
                  className="btn btn-danger"
                >
                  <Trash2 size={18} /> Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
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
          <div className="card slide-up" style={{ width: '90%', maxWidth: '450px' }}>
            <div className="card-header" style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={20} /> Final Confirmation
              </h3>
            </div>
            <div className="card-body">
              <p>Are you absolutely sure you want to delete your account?</p>
              <p style={{ color: 'var(--color-danger)', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 'bold' }}>
                This action is irreversible and all your data will be permanently lost.
              </p>
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label">Type <strong>delete my account</strong> to confirm</label>
                <input type="text" className="form-control" id="deleteConfirmInput" placeholder="delete my account" />
              </div>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => {
                  const input = document.getElementById('deleteConfirmInput').value;
                  if (input === 'delete my account') {
                    handleDeleteAccount();
                  } else {
                    toast.error('Please type the confirmation phrase exactly');
                  }
                }}
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Settings;
