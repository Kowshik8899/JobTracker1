const Application = require('../models/Application');
const { createNotification } = require('./notificationController');

// @desc    Get user applications with filtering, sorting, and pagination
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res, next) => {
  try {
    const { search, status, priority, jobType, sort } = req.query;

    const query = { user: req.user._id };

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { jobRole: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }
    
    if (priority && priority !== 'All') {
      query.priority = priority;
    }
    
    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    let sortOption = { applicationDate: -1 }; // Default: Newest

    switch(sort) {
      case 'oldest':
        sortOption = { applicationDate: 1 };
        break;
      case 'company':
        sortOption = { companyName: 1 };
        break;
      case 'deadline':
        sortOption = { deadline: 1 };
        break;
      case 'priority':
        // Custom sorting for priority might require aggregation, but we'll sort alphabetically for now
        sortOption = { priority: 1 };
        break;
      case 'status':
        sortOption = { status: 1 };
        break;
      default:
        sortOption = { applicationDate: -1 };
    }

    const applications = await Application.find(query).sort(sortOption);

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (application && application.user.toString() === req.user._id.toString()) {
      res.json(application);
    } else {
      res.status(404);
      throw new Error('Application not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res, next) => {
  try {
    const applicationData = {
      ...req.body,
      user: req.user._id
    };

    const application = await Application.create(applicationData);
    
    createNotification(req.user._id, 'New Application Added', `${application.companyName} — ${application.jobRole}`, 'application_update', application._id);

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (application && application.user.toString() === req.user._id.toString()) {
      const oldStatus = application.status;
      const updatedApplication = await Application.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (req.body.status && req.body.status !== oldStatus) {
        createNotification(req.user._id, 'Application Status Updated', `${updatedApplication.companyName} — ${oldStatus} → ${updatedApplication.status}`, 'application_update', updatedApplication._id);
      }

      res.json(updatedApplication);
    } else {
      res.status(404);
      throw new Error('Application not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (application && application.user.toString() === req.user._id.toString()) {
      await Application.deleteOne({ _id: req.params.id });
      res.json({ message: 'Application removed' });
    } else {
      res.status(404);
      throw new Error('Application not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication
};
