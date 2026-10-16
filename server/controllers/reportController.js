const WasteReport = require('../models/WasteReport');
const ReportStatusHistory = require('../models/ReportStatusHistory');
const CleanupEvidence = require('../models/CleanupEvidence');
const Reward = require('../models/Reward');
const User = require('../models/User');
const { uploadImage } = require('../services/imageStorage');
const { classifyWasteImage } = require('../services/aiClassification');
const { createNotification } = require('../services/notifications');

// Allowed status transitions per role
const STATUS_TRANSITIONS = {
  citizen: [],
  staff: {
    assigned: ['in_progress'],
    in_progress: ['awaiting_verification'],
  },
  admin: {
    pending_review: ['pending', 'rejected'],
    pending: ['assigned', 'rejected'],
    awaiting_verification: ['resolved', 'in_progress'],
  },
};

// POST /api/reports
const createReport = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'A garbage image is required.' });
    }

    const { description, category, severity, latitude, longitude, address } = req.body;

    if (!description || !category || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'Description, category, and location are required.' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates.' });
    }

    const validCategories = ['plastic', 'paper', 'glass', 'metal', 'organic', 'ewaste', 'mixed', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ success: false, message: 'Invalid waste category.' });
    }

    // Upload image
    const imageResult = await uploadImage(req.file.path, 'cleancity/reports');

    // Create report
    const report = await WasteReport.create({
      reporterId: req.user._id,
      imageUrl: imageResult.url,
      imagePublicId: imageResult.publicId,
      description: description.trim().slice(0, 1000),
      category,
      severity: ['low', 'medium', 'high'].includes(severity) ? severity : 'medium',
      latitude: lat,
      longitude: lng,
      address: address?.trim().slice(0, 500),
      aiProcessingStatus: 'pending',
    });

    // Log history
    await ReportStatusHistory.create({
      reportId: report._id,
      changedBy: req.user._id,
      newStatus: 'pending_review',
      note: 'Report submitted by citizen.',
    });

    // Award points for submission
    await Reward.create({
      userId: req.user._id,
      reportId: report._id,
      points: 10,
      reason: 'report_submitted',
      description: 'Points for submitting a garbage report.',
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { contributionPoints: 10 } });

    // Run AI classification asynchronously — do not block response
    setImmediate(async () => {
      try {
        await WasteReport.findByIdAndUpdate(report._id, { aiProcessingStatus: 'processing' });
        const result = await classifyWasteImage(req.file.path || imageResult.url);
        await WasteReport.findByIdAndUpdate(report._id, {
          aiPredictedCategory: result.category,
          aiConfidence: result.confidence,
          aiProvider: result.provider,
          aiProcessingStatus: 'completed',
          aiAlternatives: result.alternatives || [],
        });
      } catch (err) {
        await WasteReport.findByIdAndUpdate(report._id, { aiProcessingStatus: 'failed' });
        console.error('AI classification background error:', err.message);
      }
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully.',
      complaintNumber: report.complaintNumber,
      reportId: report._id,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/reports
const getReports = async (req, res, next) => {
  try {
    const { status, category, severity, page = 1, limit = 20, search } = req.query;
    const filter = {};

    // Citizens can only see their own reports
    if (req.user.role === 'citizen') {
      filter.reporterId = req.user._id;
    }

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (severity) filter.severity = severity;

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
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/reports/:id
const getReport = async (req, res, next) => {
  try {
    const report = await WasteReport.findById(req.params.id)
      .populate('reporterId', 'name email')
      .populate('assignedStaffId', 'name email phone');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    // Citizens can only view their own reports
    if (req.user.role === 'citizen' && report.reporterId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Fetch cleanup evidence
    const evidence = await CleanupEvidence.find({ reportId: report._id })
      .populate('staffId', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: report, evidence });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/reports/:id
const updateReport = async (req, res, next) => {
  try {
    const report = await WasteReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

    const { status, note, rejectionReason } = req.body;

    if (status) {
      const allowed = STATUS_TRANSITIONS[req.user.role];
      if (!allowed || !allowed[report.status] || !allowed[report.status].includes(status)) {
        return res.status(403).json({ success: false, message: `Transition from ${report.status} to ${status} is not permitted.` });
      }

      const previousStatus = report.status;
      report.status = status;

      if (status === 'resolved') {
        report.resolvedAt = new Date();
        // Award extra points for verified resolution
        await Reward.create({
          userId: report.reporterId,
          reportId: report._id,
          points: 20,
          reason: 'report_verified',
          description: 'Bonus points for verified cleanup.',
        });
        await User.findByIdAndUpdate(report.reporterId, { $inc: { contributionPoints: 20 } });
      }

      if (status === 'rejected') {
        report.rejectionReason = rejectionReason || 'No reason provided.';
      }

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
        title: `Report ${report.complaintNumber} Updated`,
        message: `Your report status changed to: ${status.replace(/_/g, ' ')}.`,
        type: status === 'resolved' ? 'resolved' : status === 'rejected' ? 'rejected' : 'system',
        reportId: report._id,
      });
    }

    res.json({ success: true, message: 'Report updated.', data: report });
  } catch (err) {
    next(err);
  }
};

// POST /api/reports/:id/classify
const classifyReport = async (req, res, next) => {
  try {
    const report = await WasteReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

    await WasteReport.findByIdAndUpdate(report._id, { aiProcessingStatus: 'processing' });

    const result = await classifyWasteImage(report.imageUrl);

    const updated = await WasteReport.findByIdAndUpdate(
      report._id,
      {
        aiPredictedCategory: result.category,
        aiConfidence: result.confidence,
        aiProvider: result.provider,
        aiProcessingStatus: 'completed',
        aiAlternatives: result.alternatives || [],
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Classification complete.',
      aiResult: result,
      data: updated,
    });
  } catch (err) {
    await WasteReport.findByIdAndUpdate(req.params.id, { aiProcessingStatus: 'failed' }).catch(() => {});
    next(err);
  }
};

// GET /api/reports/:id/history
const getReportHistory = async (req, res, next) => {
  try {
    const report = await WasteReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

    if (req.user.role === 'citizen' && report.reporterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const history = await ReportStatusHistory.find({ reportId: req.params.id })
      .populate('changedBy', 'name role')
      .sort({ createdAt: 1 });

    res.json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

// GET /api/reports/map — public map data
const getMapReports = async (req, res, next) => {
  try {
    const { category, status, severity } = req.query;
    const filter = { status: { $nin: ['rejected'] } };

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (severity) filter.severity = severity;

    const reports = await WasteReport.find(filter)
      .select('complaintNumber category severity status latitude longitude address createdAt isDemo')
      .sort({ createdAt: -1 })
      .limit(500);

    res.json({ success: true, data: reports });
  } catch (err) {
    next(err);
  }
};

module.exports = { createReport, getReports, getReport, updateReport, classifyReport, getReportHistory, getMapReports };
