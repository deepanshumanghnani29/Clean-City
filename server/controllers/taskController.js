const WasteReport = require('../models/WasteReport');
const ReportStatusHistory = require('../models/ReportStatusHistory');
const CleanupEvidence = require('../models/CleanupEvidence');
const User = require('../models/User');
const { uploadImage } = require('../services/imageStorage');
const { createNotification } = require('../services/notifications');

// GET /api/tasks/my — Staff's assigned tasks
const getMyTasks = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { assignedStaffId: req.user._id };
    if (status) filter.status = status;

    const tasks = await WasteReport.find(filter)
      .populate('reporterId', 'name')
      .sort({ assignedAt: -1 });

    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tasks/:id/status — Staff updates task status
const updateTaskStatus = async (req, res, next) => {
  try {
    const report = await WasteReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Task not found.' });

    // Staff can only update their own assigned tasks
    if (!report.assignedStaffId || report.assignedStaffId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'This task is not assigned to you.' });
    }

    const { status, note } = req.body;

    const allowedTransitions = {
      assigned: ['in_progress'],
      in_progress: ['awaiting_verification'],
    };

    if (!allowedTransitions[report.status] || !allowedTransitions[report.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from "${report.status}" to "${status}".`,
      });
    }

    const previousStatus = report.status;
    report.status = status;
    await report.save();

    await ReportStatusHistory.create({
      reportId: report._id,
      changedBy: req.user._id,
      previousStatus,
      newStatus: status,
      note: note || '',
    });

    // Notify reporter
    await createNotification({
      userId: report.reporterId,
      title: `Cleanup Update — ${report.complaintNumber}`,
      message: status === 'in_progress'
        ? 'A cleaning team has started working on your reported garbage.'
        : 'Cleanup is complete and awaiting admin verification.',
      type: status === 'in_progress' ? 'cleanup_started' : 'awaiting_verification',
      reportId: report._id,
    });

    res.json({ success: true, message: 'Task status updated.', data: report });
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks/:id/evidence — Staff uploads cleanup evidence
const uploadEvidence = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'An evidence image is required.' });
    }

    const report = await WasteReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Task not found.' });

    if (!report.assignedStaffId || report.assignedStaffId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'This task is not assigned to you.' });
    }

    if (report.status !== 'in_progress') {
      return res.status(400).json({ success: false, message: 'Evidence can only be uploaded when task is in progress.' });
    }

    const imageResult = await uploadImage(req.file.path, 'cleancity/evidence');

    const evidence = await CleanupEvidence.create({
      reportId: report._id,
      staffId: req.user._id,
      imageUrl: imageResult.url,
      imagePublicId: imageResult.publicId,
      notes: req.body.notes?.trim().slice(0, 500),
      verificationStatus: 'pending',
    });

    // Move report to awaiting verification
    const previousStatus = report.status;
    report.status = 'awaiting_verification';
    await report.save();

    await ReportStatusHistory.create({
      reportId: report._id,
      changedBy: req.user._id,
      previousStatus,
      newStatus: 'awaiting_verification',
      note: 'Cleanup evidence uploaded. Awaiting admin verification.',
    });

    await createNotification({
      userId: report.reporterId,
      title: `Cleanup Evidence Uploaded — ${report.complaintNumber}`,
      message: 'Cleaning staff has submitted evidence. Your report is awaiting final verification.',
      type: 'awaiting_verification',
      reportId: report._id,
    });

    res.status(201).json({ success: true, message: 'Evidence uploaded successfully.', data: evidence });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyTasks, updateTaskStatus, uploadEvidence };
