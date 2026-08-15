const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, jobGoal } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      jobGoal
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        jobGoal: user.jobGoal,
        theme: user.theme,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        jobGoal: user.jobGoal,
        theme: user.theme,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.jobGoal = req.body.jobGoal !== undefined ? req.body.jobGoal : user.jobGoal;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      user.institution = req.body.institution !== undefined ? req.body.institution : user.institution;
      user.academicYear = req.body.academicYear !== undefined ? req.body.academicYear : user.academicYear;
      user.cgpa = req.body.cgpa !== undefined ? req.body.cgpa : user.cgpa;
      user.weeklyGoal = req.body.weeklyGoal !== undefined ? req.body.weeklyGoal : user.weeklyGoal;
      user.summary = req.body.summary !== undefined ? req.body.summary : user.summary;
      
      if (req.body.skills) user.skills = req.body.skills;
      if (req.body.education) user.education = req.body.education;
      if (req.body.experience) user.experience = req.body.experience;
      if (req.body.contactInformation) user.contactInformation = req.body.contactInformation;
      if (req.body.resumeInformation) user.resumeInformation = req.body.resumeInformation;
      if (req.body.notificationPreferences) user.notificationPreferences = req.body.notificationPreferences;
      if (req.body.privacyPreferences) user.privacyPreferences = req.body.privacyPreferences;
      if (req.body.theme) user.theme = req.body.theme;

      const updatedUser = await user.save();

      res.json(updatedUser);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Private
const updateUserPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (await user.matchPassword(req.body.currentPassword)) {
        user.password = req.body.newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
      } else {
        res.status(401);
        throw new Error('Invalid current password');
      }
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear session
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res, next) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      // Do not expose whether user exists
      return res.status(200).json({ message: 'If that email exists, a reset link has been sent' });
    }

    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire to 10 minutes
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    // For development, log the URL
    console.log(`Password reset URL (Development only): \n${resetUrl}`);

    res.status(200).json({ message: 'If that email exists, a reset link has been sent (check console for dev URL)' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const crypto = require('crypto');
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired token');
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume
// @route   POST /api/auth/resume
// @access  Private
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a file');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.resumeInformation = {
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedAt: Date.now()
    };

    await user.save();
    res.status(200).json(user.resumeInformation);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/auth/resume
// @access  Private
const deleteResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Attempt to delete physical file if needed, but for now we just clear the DB
    const fs = require('fs');
    const path = require('path');
    if (user.resumeInformation && user.resumeInformation.fileUrl) {
      const filePath = path.join(__dirname, '..', user.resumeInformation.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    user.resumeInformation = {
      fileName: '',
      fileUrl: '',
      uploadedAt: null
    };

    await user.save();
    res.status(200).json({ message: 'Resume deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Also delete all related applications and notifications
      await require('../models/Application').deleteMany({ user: req.user._id });
      await require('../models/Notification').deleteMany({ user: req.user._id });
      
      await User.deleteOne({ _id: req.user._id });
      res.json({ message: 'Account deleted successfully' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  logoutUser,
  forgotPassword,
  resetPassword,
  uploadResume,
  deleteResume,
  deleteAccount
};
