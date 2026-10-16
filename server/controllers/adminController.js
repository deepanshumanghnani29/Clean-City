const WasteReport = require('../models/WasteReport');
const User = require('../models/User');
const ReportStatusHistory = require('../models/ReportStatusHistory');
const CleanupEvidence = require('../models/CleanupEvidence');
const { createNotification } = require('../services/notifications');

// GET /api/admin/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const [
      total,
      pendingReview,
      pending,
      assigned,
      inProgress,
      awaitingVerification,
      resolved,
      rejected,
    ] = await Promise.all([
      WasteReport.countDocuments(),
      WasteReport.countDocuments({ status: 'pending_review' }),
      WasteReport.countDocuments({ status: 'pending' }),
      WasteReport.countDocuments({ status: 'assigned' }),
      WasteReport.countDocuments({ status: 'in_progress' }),
      WasteReport.countDocuments({ status: 'awaiting_verification' }),
      WasteReport.countDocuments({ status: 'resolved' }),
      WasteReport.countDocuments({ status: 'rejected' }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        pendingReview,
        pending,
        assigned,
        inProgress,
        awaitingVerification,
        resolved,
        rejected,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/analytics
const getAnalytics = async (req, res, next) => {
  try {
    // Category distribution
    const categoryDistribution = await WasteReport.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Severity distribution
    const severityDistribution = await WasteReport.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);

    // Status distribution
    const statusDistribution = await WasteReport.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Daily reports — last 14 days
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const dailyTrend = await WasteReport.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Average resolution time (resolved reports only)
    const resolutionTimeAgg = await WasteReport.aggregate([
      { $match: { status: 'resolved', resolvedAt: { $exists: true } } },
      {
        $project: {
          resolutionHours: {
            $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 3600000],
          },
        },
      },
      { $group: { _id: null, avgHours: { $avg: '$resolutionHours' } } },
    ]);

    // Top hotspot coordinates
    const hotspots = await WasteReport.aggregate([
      { $match: { latitude: { $exists: true }, longitude: { $exists: true } } },
      {
        $group: {
          _id: {
            lat: { $round: ['$latitude', 2] },
            lng: { $round: ['$longitude', 2] },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    // Staff performance
    const staffPerformance = await WasteReport.aggregate([
      { $match: { assignedStaffId: { $exists: true, $ne: null } } },
      { $group: { _id: '$assignedStaffId', total: { $sum: 1 }, resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'staff' } },
      { $unwind: { path: '$staff', preserveNullAndEmptyArrays: true } },
      { $project: { name: '$staff.name', total: 1, resolved: 1 } },
      { $sort: { resolved: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: {
        categoryDistribution,
        severityDistribution,
        statusDistribution,
        dailyTrend,
        avgResolutionHours: resolutionTimeAgg[0]?.avgHours ?? null,
        hotspots,
        staffPerformance,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/reports
const getAdminReports = async (req, res, next) => {
  try {
    const { status, category, severity, page = 1, limit = 20, search, dateFrom, dateTo } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (severity) filter.severity = severity;

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    if (search) {
      filter.$or = [
        { complaintNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await WasteReport.countDocuments(filter);

    const reports = await WasteReport.find(filter)
      .populate('reporterId', 'name email')
      .populate('assignedStaffId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: reports,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), limit: parseInt(limit) },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/reports/:id/assign
const assignReport = async (req, res, next) => {
  try {
    const { staffId, priority } = req.body;

    const report = await WasteReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

    if (!['pending_review', 'pending', 'assigned'].includes(report.status)) {
      return res.status(400).json({ success: false, message: 'Report cannot be reassigned at this stage.' });
    }

    const staff = await User.findById(staffId);
    if (!staff || staff.role !== 'staff') {
      return res.status(400).json({ success: false, message: 'Invalid staff member.' });
    }

    const previousStatus = report.status;
    report.assignedStaffId = staffId;
    report.assignedAt = new Date();
    report.status = 'assigned';
    await report.save();

    await ReportStatusHistory.create({
      reportId: report._id,
      changedBy: req.user._id,
      previousStatus,
      newStatus: 'assigned',
      note: `Assigned to staff: ${staff.name}.`,
    });

    // Notify staff
    await createNotification({
      userId: staffId,
      title: `New Task Assigned — ${report.complaintNumber}`,
      message: `You have been assigned a ${report.severity} severity ${report.category} waste cleanup task.`,
      type: 'report_assigned',
      reportId: report._id,
    });

    // Notify reporter
    await createNotification({
      userId: report.reporterId,
      title: `Report Assigned — ${report.complaintNumber}`,
      message: 'A cleaning team member has been assigned to your reported garbage.',
      type: 'report_assigned',
      reportId: report._id,
    });

    res.json({ success: true, message: 'Report assigned to staff.', data: report });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/reports/:id/verify
const verifyReport = async (req, res, next) => {
  try {
    const { action, reason } = req.body; // action: 'approve' | 'return'

    const report = await WasteReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

    if (report.status !== 'awaiting_verification') {
      return res.status(400).json({ success: false, message: 'Report is not awaiting verification.' });
    }

    if (!['approve', 'return', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action. Use approve, return, or reject.' });
    }

    const previousStatus = report.status;

    if (action === 'approve') {
      report.status = 'resolved';
      report.resolvedAt = new Date();

      // Approve evidence
      await CleanupEvidence.updateMany(
        { reportId: report._id, verificationStatus: 'pending' },
        { verificationStatus: 'approved', verifiedBy: req.user._id, verifiedAt: new Date() }
      );

      await createNotification({
        userId: report.reporterId,
        title: `Cleanup Verified ✅ — ${report.complaintNumber}`,
        message: 'The garbage at your reported location has been cleaned and verified.',
        type: 'resolved',
        reportId: report._id,
      });
    } else if (action === 'return') {
      report.status = 'in_progress';
      await CleanupEvidence.updateMany(
        { reportId: report._id, verificationStatus: 'pending' },
        { verificationStatus: 'returned', returnReason: reason || 'Insufficient evidence.' }
      );

      if (report.assignedStaffId) {
        await createNotification({
          userId: report.assignedStaffId,
          title: `Evidence Returned — ${report.complaintNumber}`,
          message: `Admin has returned evidence for re-submission. Reason: ${reason || 'Insufficient evidence.'}`,
          type: 'system',
          reportId: report._id,
        });
      }
    } else if (action === 'reject') {
      report.status = 'rejected';
      report.rejectionReason = reason || 'Report rejected by admin.';

      await createNotification({
        userId: report.reporterId,
        title: `Report Rejected — ${report.complaintNumber}`,
        message: `Your report has been rejected. Reason: ${reason || 'Invalid or duplicate report.'}`,
        type: 'rejected',
        reportId: report._id,
      });
    }

    await report.save();

    await ReportStatusHistory.create({
      reportId: report._id,
      changedBy: req.user._id,
      previousStatus,
      newStatus: report.status,
      note: reason || `Admin action: ${action}.`,
    });

    res.json({ success: true, message: `Report ${action === 'approve' ? 'verified and resolved' : action === 'return' ? 'returned for re-submission' : 'rejected'}.`, data: report });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/export
const exportReports = async (req, res, next) => {
  try {
    const { status, category, severity } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (severity) filter.severity = severity;

    const reports = await WasteReport.find(filter)
      .populate('reporterId', 'name email')
      .populate('assignedStaffId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5000);

    const headers = [
      'Complaint Number', 'Status', 'Category', 'Severity', 'Description',
      'Address', 'Latitude', 'Longitude', 'Reporter', 'Reporter Email',
      'Assigned Staff', 'AI Category', 'AI Confidence', 'Created At', 'Resolved At'
    ].join(',');

    const rows = reports.map(r => [
      r.complaintNumber,
      r.status,
      r.category,
      r.severity,
      `"${(r.description || '').replace(/"/g, '""')}"`,
      `"${(r.address || '').replace(/"/g, '""')}"`,
      r.latitude,
      r.longitude,
      r.reporterId?.name || '',
      r.reporterId?.email || '',
      r.assignedStaffId?.name || '',
      r.aiPredictedCategory || '',
      r.aiConfidence != null ? (r.aiConfidence * 100).toFixed(1) + '%' : '',
      r.createdAt?.toISOString() || '',
      r.resolvedAt?.toISOString() || '',
    ].join(','));

    const csv = [headers, ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="cleancity-reports-${Date.now()}.csv"`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/staff
const getStaff = async (req, res, next) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, data: staff });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));

    res.json({ success: true, data: users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard, getAnalytics, getAdminReports, assignReport, verifyReport, exportReports, getStaff, getUsers };
