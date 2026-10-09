const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Get user analytics
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all applications for user
    const applications = await Application.find({ user: userId });
    const user = await User.findById(userId);

    const totalApplications = applications.length;
    
    // Status counts
    const statusCounts = {
      Applied: 0,
      Screening: 0,
      Interview: 0,
      'Technical Interview': 0,
      'Final Interview': 0,
      Offer: 0,
      Accepted: 0,
      Rejected: 0,
      Withdrawn: 0
    };

    applications.forEach(app => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
    });

    // Combined stats
    const interviews = statusCounts.Interview + statusCounts['Technical Interview'] + statusCounts['Final Interview'];
    const offers = statusCounts.Offer + statusCounts.Accepted;
    const pending = totalApplications - statusCounts.Rejected - statusCounts.Withdrawn - offers;
    const rejected = statusCounts.Rejected;

    // Rates
    const responseRate = totalApplications > 0 ? (((totalApplications - statusCounts.Applied) / totalApplications) * 100).toFixed(1) : 0;
    const interviewRate = totalApplications > 0 ? ((interviews / totalApplications) * 100).toFixed(1) : 0;
    const offerRate = totalApplications > 0 ? ((offers / totalApplications) * 100).toFixed(1) : 0;

    // Applications over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const recentApps = applications.filter(app => new Date(app.applicationDate) >= sixMonthsAgo);
    
    // Group by month
    const timelineData = {};
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthYear = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      timelineData[monthYear] = 0;
    }

    recentApps.forEach(app => {
      const d = new Date(app.applicationDate);
      const monthYear = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (timelineData[monthYear] !== undefined) {
        timelineData[monthYear]++;
      }
    });

    // Calculate applications this week
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(now.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // Following Monday
    endOfWeek.setHours(0, 0, 0, 0);

    const applicationsThisWeek = applications.filter(app => {
      const appDate = new Date(app.applicationDate || app.createdAt);
      return appDate >= startOfWeek && appDate < endOfWeek;
    }).length;

    res.json({
      totalApplications,
      applicationsThisWeek,
      interviews,
      offers,
      pending,
      rejected,
      rates: {
        responseRate,
        interviewRate,
        offerRate
      },
      statusDistribution: statusCounts,
      timeline: timelineData,
      weeklyGoal: user.weeklyGoal || 10
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics
};
