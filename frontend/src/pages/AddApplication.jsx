import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Check, ArrowRight, ArrowLeft, X } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import PageLoader from '../components/PageLoader';
import toast from 'react-hot-toast';

const STEPS = ['Basic Info', 'Details', 'Contact & Notes'];

const AddApplication = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get('edit');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(editId ? true : false);
  const [submitting, setSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  
  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    location: '',
    jobType: '',
    salary: '',
    companyWebsite: '',
    applicationDate: new Date().toISOString().split('T')[0],
    deadline: '',
    status: 'Applied',
    interviewDate: '',
    source: '',
    priority: 'Medium',
    contactPerson: '',
    contactEmail: '',
    notes: '',
    interviewExperience: '',
    skills: []
  });

  useEffect(() => {
    if (editId) {
      const fetchApplication = async () => {
        try {
          const backendUrl = import.meta.env.VITE_API_URL || 'https://jobtracker-backend-4mt6.onrender.com';
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get(`${backendUrl}/api/applications/${editId}`, config);
          
          // Format dates for input fields
          const formattedData = {
            ...data,
            applicationDate: data.applicationDate ? new Date(data.applicationDate).toISOString().split('T')[0] : '',
            deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : '',
            interviewDate: data.interviewDate ? new Date(data.interviewDate).toISOString().split('T')[0] : ''
          };
          
          setFormData(formattedData);
        } catch (error) {
          console.error("Failed to fetch application:", error);
          toast.error('Failed to load application details');
          navigate('/applications');
        } finally {
          setLoading(false);
        }
      };
      fetchApplication();
    }
  }, [editId, user.token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()]
        }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const nextStep = () => {
    // Validation for step 0
    if (currentStep === 0) {
      if (!formData.companyName || !formData.jobRole) {
        toast.error('Company Name and Job Role are required');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'https://jobtracker-backend-4mt6.onrender.com';
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      if (editId) {
        await axios.put(`${backendUrl}/api/applications/${editId}`, formData, config);
        toast.success('Application updated successfully');
      } else {
        await axios.post(`${backendUrl}/api/applications`, formData, config);
        toast.success('Application added successfully');
      }
      
      navigate('/applications');
    } catch (error) {
      console.error("Failed to save application:", error);
      toast.error(error.response?.data?.message || 'Failed to save application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <DashboardLayout title={editId ? "Edit Application" : "Add Application"}>
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Stepper */}
        <div style={{ padding: '2rem 2rem 0 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '2rem' }}>
            <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', backgroundColor: 'var(--color-border)', transform: 'translateY(-50%)', zIndex: 1 }}></div>
            
            {STEPS.map((step, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  backgroundColor: currentStep >= index ? 'var(--color-primary)' : 'var(--color-surface)',
                  border: `2px solid ${currentStep >= index ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  color: currentStep >= index ? 'white' : 'var(--color-text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.5rem',
                  transition: 'all 0.3s ease'
                }}>
                  {currentStep > index ? <Check size={16} /> : index + 1}
                </div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: currentStep >= index ? '600' : '400',
                  color: currentStep >= index ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                  position: 'absolute',
                  top: '40px',
                  whiteSpace: 'nowrap'
                }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-body" style={{ marginTop: '1rem' }}>
          <form onSubmit={currentStep === STEPS.length - 1 ? handleSubmit : (e) => e.preventDefault()}>
            
            {/* Step 1: Basic Info */}
            {currentStep === 0 && (
              <div className="fade-in">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Company Name *</label>
                    <input type="text" className="form-control" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g. Google" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Role *</label>
                    <input type="text" className="form-control" name="jobRole" value={formData.jobRole} onChange={handleChange} placeholder="e.g. Frontend Engineer" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Remote, San Francisco" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Type</label>
                    <select className="form-control" name="jobType" value={formData.jobType} onChange={handleChange}>
                      <option value="">Select Type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Salary Range</label>
                    <input type="text" className="form-control" name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. $120k - $150k" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Website</label>
                    <input type="url" className="form-control" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} placeholder="https://..." />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Application Details */}
            {currentStep === 1 && (
              <div className="fade-in">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Application Date *</label>
                    <input type="date" className="form-control" name="applicationDate" value={formData.applicationDate} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status *</label>
                    <select className="form-control" name="status" value={formData.status} onChange={handleChange} required>
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
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="form-control" name="priority" value={formData.priority} onChange={handleChange}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Application Source</label>
                    <input type="text" className="form-control" name="source" value={formData.source} onChange={handleChange} placeholder="e.g. LinkedIn, Referral" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Interview Date</label>
                    <input type="date" className="form-control" name="interviewDate" value={formData.interviewDate} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input type="date" className="form-control" name="deadline" value={formData.deadline} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact & Notes */}
            {currentStep === 2 && (
              <div className="fade-in">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Contact Person</label>
                    <input type="text" className="form-control" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Recruiter or Manager Name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Email</label>
                    <input type="email" className="form-control" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="email@example.com" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Required Skills</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Type a skill and press Enter" 
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                  />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {formData.skills.map((skill, index) => (
                      <span key={index} style={{ 
                        backgroundColor: 'var(--color-primary-light)', 
                        color: 'var(--color-primary)', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea 
                    className="form-control" 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleChange} 
                    rows="5" 
                    placeholder="Add any notes about the company, interview process, or requirements..."
                  ></textarea>
                </div>

                {editId && (
                  <div className="form-group">
                    <label className="form-label">Interview Experience</label>
                    <textarea
                      className="form-control"
                      name="interviewExperience"
                      value={formData.interviewExperience}
                      onChange={handleChange}
                      rows="5"
                      placeholder="How did the interview go? Record your experience, questions asked, and impressions..."
                    ></textarea>
                  </div>
                )}
              </div>
            )}

            {(() => {
              const isLastStep = currentStep === STEPS.length - 1;
              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={prevStep}
                    style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
                  >
                    <ArrowLeft size={18} /> Previous
                  </button>

                  {!isLastStep ? (
                    <button key="next" type="button" className="btn btn-primary" onClick={nextStep}>
                      Next <ArrowRight size={18} />
                    </button>
                  ) : (
                    <button key="submit" type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? 'Saving...' : (editId ? 'Update Application' : 'Save Application')} <Check size={18} />
                    </button>
                  )}
                </div>
              );
            })()}
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddApplication;
