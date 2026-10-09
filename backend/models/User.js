const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  jobGoal: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  institution: { type: String, default: '' },
  academicYear: { type: String, default: '' },
  cgpa: { type: String, default: '' },
  weeklyGoal: { type: Number, default: 10 },
  summary: { type: String, default: '' },
  skills: {
    languages: [{ type: String }],
    frameworks: [{ type: String }],
    concepts: [{ type: String }]
  },
  education: [{
    institution: { type: String },
    degree: { type: String },
    field: { type: String },
    startYear: { type: String },
    endYear: { type: String },
    cgpa: { type: String }
  }],
  experience: [{
    company: { type: String },
    position: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String }
  }],
  contactInformation: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' }
  },
  resumeInformation: {
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date }
  },
  notificationPreferences: {
    emailAlerts: { type: Boolean, default: true },
    interviewReminders: { type: Boolean, default: true },
    applicationUpdates: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: false }
  },
  privacyPreferences: {
    publicProfile: { type: Boolean, default: false }
  },
  theme: { type: String, default: 'light' }
}, {
  timestamps: true
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
