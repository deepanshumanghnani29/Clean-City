const express = require('express');
const router = express.Router();
const {
  createReport, getReports, getReport, updateReport, classifyReport, getReportHistory, getMapReports
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const rateLimit = require('express-rate-limit');

const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { success: false, message: 'Too many reports submitted. Please wait before submitting again.' },
});

// Public route for map
router.get('/map', getMapReports);

// Protected routes
router.use(protect);

router.post('/', reportLimiter, upload.single('image'), createReport);
router.get('/', getReports);
router.get('/:id', getReport);
router.patch('/:id', authorize('admin', 'staff'), updateReport);
router.post('/:id/classify', authorize('admin'), classifyReport);
router.get('/:id/history', getReportHistory);

module.exports = router;
