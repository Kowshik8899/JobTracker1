const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  companyName: { type: String, required: true },
  jobRole: { type: String, required: true },
  location: { type: String, default: '' },
  jobType: { type: String, default: '' },
  salary: { type: String, default: '' },
  companyWebsite: { type: String, default: '' },
  applicationDate: { type: Date, required: true, default: Date.now },
  deadline: { type: Date },
  status: { 
    type: String, 
    required: true,
    enum: ['Applied', 'Screening', 'Interview', 'Technical Interview', 'Final Interview', 'Offer', 'Accepted', 'Rejected', 'Withdrawn'],
    default: 'Applied'
  },
  interviewDate: { type: Date },
  source: { type: String, default: '' },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium' 
  },
  contactPerson: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  notes: { type: String, default: '' },
  interviewExperience: { type: String, default: '' },
  skills: [{ type: String }]
}, {
  timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
