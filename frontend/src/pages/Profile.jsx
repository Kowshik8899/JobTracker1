import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Briefcase, 
  Upload, 
  Check, 
  Download,
  Trash2,
  FileText,
  Phone,
  MapPin,
  Link,
  ExternalLink,
  Edit2,
  Plus,
  Calendar,
  X
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobGoal: ''
  });

  const [summaryData, setSummaryData] = useState('');
  const [skillsData, setSkillsData] = useState({ languages: '', frameworks: '', concepts: '' });
  const [contactData, setContactData] = useState({ phone: '', location: '', linkedin: '', github: '' });
  
  const [editMode, setEditMode] = useState({
    summary: false,
    skills: false,
    contact: false
  });

  const [eduList, setEduList] = useState([]);
  const [expList, setExpList] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        jobGoal: user.jobGoal || ''
      });
      setSummaryData(user.summary || '');
      setSkillsData({
        languages: user.skills?.languages?.join(', ') || '',
        frameworks: user.skills?.frameworks?.join(', ') || '',
        concepts: user.skills?.concepts?.join(', ') || ''
      });
      setContactData({
        phone: user.phone || '',
        location: user.location || '',
        linkedin: user.contactInformation?.linkedin || '',
        github: user.contactInformation?.github || ''
      });
      setEduList(user.education || []);
      setExpList(user.experience || []);
    }
  }, [user]);

  const handlePartialUpdate = async (updatePayload, section) => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const { data } = await axios.put(`${backendUrl}/api/auth/profile`, updatePayload, config);
      updateUser({ ...user, ...data });
      toast.success(`${section} updated successfully`);
      return true;
    } catch (error) {
      const message = error.response?.status === 500 
        ? `Failed to update ${section}. Please try again.`
        : error.response?.data?.message || `Failed to update ${section}. Please try again.`;
      toast.error(message);
      return false;
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const { data } = await axios.put(`${backendUrl}/api/auth/profile`, formData, config);
      
      // Update context properly without reload
      const updatedUser = { ...user, ...data };
      updateUser(updatedUser);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      const message = error.response?.status === 500 
        ? 'Failed to update profile. Please try again.'
        : error.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadData = new FormData();
      uploadData.append('resume', file);
      
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const config = { 
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        } 
      };
      
      const promise = axios.post(`${backendUrl}/api/auth/resume`, uploadData, config)
        .then((res) => {
          const updatedUser = { ...user, resumeInformation: res.data };
          updateUser(updatedUser);
        });

      toast.promise(promise, {
        loading: 'Uploading resume...',
        success: 'Resume uploaded successfully!',
        error: 'Failed to upload resume',
      });
    }
  };

  const handleResumeDelete = async () => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      await axios.delete(`${backendUrl}/api/auth/resume`, config);
      
      const updatedUser = { ...user, resumeInformation: { fileName: '', fileUrl: '', uploadedAt: null } };
      updateUser(updatedUser);
      toast.success('Resume deleted successfully');
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  const handleResumeDownload = () => {
    if (user?.resumeInformation?.fileUrl) {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      window.open(`${backendUrl}${user.resumeInformation.fileUrl}`, '_blank');
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column - Profile Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Profile Card */}
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--color-primary-light)', 
              color: 'var(--color-primary)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: '0 auto 1.5rem auto'
            }}>
              {user?.firstName?.charAt(0) || <User size={40} />}
            </div>
            <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>{user?.firstName} {user?.lastName}</h2>
            <p style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Briefcase size={16} /> {user?.jobGoal || 'Job Seeker'}
            </p>
            
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Mail size={18} color="var(--color-text-muted)" />
                <span>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Check size={18} color="var(--color-success)" />
                <span>Account Active</span>
              </div>
            </div>
          </div>

          
          {/* Contact Information */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Contact Information</h3>
              <button type="button" className="btn-icon" onClick={() => setEditMode({...editMode, contact: !editMode.contact})}>
                <Edit2 size={16} />
              </button>
            </div>
            <div className="card-body">
              {editMode.contact ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="text" className="form-control" value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-control" value={contactData.location} onChange={e => setContactData({...contactData, location: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn</label>
                    <input type="text" className="form-control" value={contactData.linkedin} onChange={e => setContactData({...contactData, linkedin: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GitHub</label>
                    <input type="text" className="form-control" value={contactData.github} onChange={e => setContactData({...contactData, github: e.target.value})} />
                  </div>
                  <button type="button" className="btn btn-primary" onClick={async () => {
                    const success = await handlePartialUpdate({
                      phone: contactData.phone,
                      location: contactData.location,
                      contactInformation: {
                        linkedin: contactData.linkedin,
                        github: contactData.github
                      }
                    }, 'Contact Info');
                    if(success) setEditMode({...editMode, contact: false});
                  }}>Save</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Phone size={18} color="var(--color-text-muted)" />
                    <span>{user?.phone || 'Not provided'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <MapPin size={18} color="var(--color-text-muted)" />
                    <span>{user?.location || 'Not provided'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link size={18} color="var(--color-text-muted)" />
                    <span>{user?.contactInformation?.linkedin || 'Not provided'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <ExternalLink size={18} color="var(--color-text-muted)" />
                    <span>{user?.contactInformation?.github || 'Not provided'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resume Upload */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Resume</h3>
            </div>
            <div className="card-body">
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Upload your current resume to have it handy when applying for jobs.
              </p>
              
              <div style={{ 
                border: '2px dashed var(--color-border)', 
                borderRadius: 'var(--radius-md)', 
                padding: '2rem', 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color var(--transition-fast)'
              }} onClick={() => fileInputRef.current.click()}>
                <Upload size={32} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
                <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Click to upload or drag and drop</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>PDF, DOCX up to 5MB</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                />
              </div>

              {user?.resumeInformation?.fileName && (
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1rem', 
                  backgroundColor: 'var(--color-background)', 
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FileText size={24} color="var(--color-primary)" />
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{user.resumeInformation.fileName}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                        {user.resumeInformation.uploadedAt ? new Date(user.resumeInformation.uploadedAt).toLocaleDateString() : 'Uploaded'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-icon" title="Download" onClick={handleResumeDownload}><Download size={16} /></button>
                    <button className="btn-icon" title="Delete" onClick={handleResumeDelete} style={{ color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Edit Profile Form */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <div className="card-header">
            <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Edit Profile Information</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpdateProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Job Goal</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="jobGoal" 
                  value={formData.jobGoal} 
                  onChange={handleChange} 
                  placeholder="e.g. Full Stack Developer"
                />
                <small style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'block' }}>
                  This helps tailor your analytics and recommendations.
                </small>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
          {/* About Me */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', margin: 0 }}>About Me</h3>
              <button type="button" className="btn-icon" onClick={() => setEditMode({...editMode, summary: !editMode.summary})}>
                <Edit2 size={16} />
              </button>
            </div>
            <div className="card-body">
              {editMode.summary ? (
                <div>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    value={summaryData} 
                    onChange={e => setSummaryData(e.target.value)}
                    placeholder="Write a brief summary about yourself..."
                    style={{ marginBottom: '1rem' }}
                  ></textarea>
                  <button type="button" className="btn btn-primary" onClick={async () => {
                    const success = await handlePartialUpdate({ summary: summaryData }, 'Summary');
                    if(success) setEditMode({...editMode, summary: false});
                  }}>Save</button>
                </div>
              ) : (
                <p style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text-main)' }}>
                  {user?.summary || 'No summary provided. Click edit to add one.'}
                </p>
              )}
            </div>
          </div>

          {/* Technical Skills */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Technical Skills</h3>
              <button type="button" className="btn-icon" onClick={() => setEditMode({...editMode, skills: !editMode.skills})}>
                <Edit2 size={16} />
              </button>
            </div>
            <div className="card-body">
              {editMode.skills ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Languages (comma-separated)</label>
                    <input type="text" className="form-control" value={skillsData.languages} onChange={e => setSkillsData({...skillsData, languages: e.target.value})} placeholder="e.g. JavaScript, Python, Java" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Frameworks (comma-separated)</label>
                    <input type="text" className="form-control" value={skillsData.frameworks} onChange={e => setSkillsData({...skillsData, frameworks: e.target.value})} placeholder="e.g. React, Node.js, Spring" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Concepts (comma-separated)</label>
                    <input type="text" className="form-control" value={skillsData.concepts} onChange={e => setSkillsData({...skillsData, concepts: e.target.value})} placeholder="e.g. REST APIs, Agile, CI/CD" />
                  </div>
                  <button type="button" className="btn btn-primary" onClick={async () => {
                    const payload = {
                      skills: {
                        languages: skillsData.languages.split(',').map(s => s.trim()).filter(Boolean),
                        frameworks: skillsData.frameworks.split(',').map(s => s.trim()).filter(Boolean),
                        concepts: skillsData.concepts.split(',').map(s => s.trim()).filter(Boolean)
                      }
                    };
                    const success = await handlePartialUpdate(payload, 'Skills');
                    if(success) setEditMode({...editMode, skills: false});
                  }}>Save</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Languages</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {user?.skills?.languages?.length > 0 ? user.skills.languages.map((skill, i) => (
                        <span key={i} style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '999px', fontSize: '0.875rem', fontWeight: '500' }}>{skill}</span>
                      )) : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>None added</span>}
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Frameworks</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {user?.skills?.frameworks?.length > 0 ? user.skills.frameworks.map((skill, i) => (
                        <span key={i} style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '999px', fontSize: '0.875rem', fontWeight: '500' }}>{skill}</span>
                      )) : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>None added</span>}
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Concepts</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {user?.skills?.concepts?.length > 0 ? user.skills.concepts.map((skill, i) => (
                        <span key={i} style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '999px', fontSize: '0.875rem', fontWeight: '500' }}>{skill}</span>
                      )) : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>None added</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Work Experience</h3>
              <button type="button" className="btn-icon" onClick={() => {
                setExpList([...expList, { company: '', position: '', startDate: '', endDate: '', description: '', isNew: true }]);
              }}>
                <Plus size={16} />
              </button>
            </div>
            <div className="card-body">
              {expList.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)' }}>No work experience added.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {expList.map((exp, index) => (
                    <div key={index} style={{ borderLeft: '2px solid var(--color-border)', paddingLeft: '1rem', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-5px', top: '0', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                      
                      {exp.isNew || exp.isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <input type="text" className="form-control" placeholder="Company" value={exp.company} onChange={e => { const newL = [...expList]; newL[index].company = e.target.value; setExpList(newL); }} />
                          <input type="text" className="form-control" placeholder="Position" value={exp.position} onChange={e => { const newL = [...expList]; newL[index].position = e.target.value; setExpList(newL); }} />
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <input type="date" className="form-control" value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''} onChange={e => { const newL = [...expList]; newL[index].startDate = e.target.value; setExpList(newL); }} />
                            <input type="date" className="form-control" value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''} onChange={e => { const newL = [...expList]; newL[index].endDate = e.target.value; setExpList(newL); }} />
                          </div>
                          <textarea className="form-control" rows="2" placeholder="Description" value={exp.description} onChange={e => { const newL = [...expList]; newL[index].description = e.target.value; setExpList(newL); }}></textarea>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" className="btn btn-primary btn-sm" onClick={async () => {
                              const newL = [...expList];
                              delete newL[index].isNew;
                              delete newL[index].isEditing;
                              setExpList(newL);
                              await handlePartialUpdate({ experience: newL }, 'Work Experience');
                            }}>Save</button>
                            <button type="button" className="btn btn-danger btn-sm" onClick={async () => {
                              const newL = expList.filter((_, i) => i !== index);
                              setExpList(newL);
                              if (!exp.isNew) await handlePartialUpdate({ experience: newL }, 'Work Experience');
                            }}>Remove</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: '0 0 0.25rem 0' }}>{exp.position}</h4>
                            <div style={{ fontWeight: '500', color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>{exp.company}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                              <Calendar size={14} />
                              <span>
                                {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, {month: 'short', year: 'numeric'}) : ''} - 
                                {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, {month: 'short', year: 'numeric'}) : ' Present'}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.875rem' }}>{exp.description}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="button" className="btn-icon" onClick={() => { const newL = [...expList]; newL[index].isEditing = true; setExpList(newL); }}><Edit2 size={16} /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Education</h3>
              <button type="button" className="btn-icon" onClick={() => {
                setEduList([...eduList, { institution: '', degree: '', field: '', startYear: '', endYear: '', cgpa: '', isNew: true }]);
              }}>
                <Plus size={16} />
              </button>
            </div>
            <div className="card-body">
              {eduList.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)' }}>No education added.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {eduList.map((edu, index) => (
                    <div key={index} style={{ borderLeft: '2px solid var(--color-border)', paddingLeft: '1rem', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-5px', top: '0', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                      
                      {edu.isNew || edu.isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <input type="text" className="form-control" placeholder="Institution" value={edu.institution} onChange={e => { const newL = [...eduList]; newL[index].institution = e.target.value; setEduList(newL); }} />
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <input type="text" className="form-control" placeholder="Degree" value={edu.degree} onChange={e => { const newL = [...eduList]; newL[index].degree = e.target.value; setEduList(newL); }} />
                            <input type="text" className="form-control" placeholder="Field of Study" value={edu.field} onChange={e => { const newL = [...eduList]; newL[index].field = e.target.value; setEduList(newL); }} />
                          </div>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <input type="text" className="form-control" placeholder="Start Year" value={edu.startYear} onChange={e => { const newL = [...eduList]; newL[index].startYear = e.target.value; setEduList(newL); }} />
                            <input type="text" className="form-control" placeholder="End Year" value={edu.endYear} onChange={e => { const newL = [...eduList]; newL[index].endYear = e.target.value; setEduList(newL); }} />
                            <input type="text" className="form-control" placeholder="CGPA" value={edu.cgpa} onChange={e => { const newL = [...eduList]; newL[index].cgpa = e.target.value; setEduList(newL); }} />
                          </div>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" className="btn btn-primary btn-sm" onClick={async () => {
                              const newL = [...eduList];
                              delete newL[index].isNew;
                              delete newL[index].isEditing;
                              setEduList(newL);
                              await handlePartialUpdate({ education: newL }, 'Education');
                            }}>Save</button>
                            <button type="button" className="btn btn-danger btn-sm" onClick={async () => {
                              const newL = eduList.filter((_, i) => i !== index);
                              setEduList(newL);
                              if (!edu.isNew) await handlePartialUpdate({ education: newL }, 'Education');
                            }}>Remove</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: '0 0 0.25rem 0' }}>{edu.institution}</h4>
                            <div style={{ fontWeight: '500', color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>{edu.degree} in {edu.field}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                              <span>{edu.startYear} - {edu.endYear || 'Present'}</span>
                              {edu.cgpa && <span>• CGPA: {edu.cgpa}</span>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="button" className="btn-icon" onClick={() => { const newL = [...eduList]; newL[index].isEditing = true; setEduList(newL); }}><Edit2 size={16} /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
