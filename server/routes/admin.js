const express = require('express');
const router = express.Router();
const {
  getDashboard, getAnalytics, getAdminReports, assignReport, verifyReport, exportReports, getStaff, getUsers
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);
router.get('/reports', getAdminReports);
router.patch('/reports/:id/assign', assignReport);
router.patch('/reports/:id/verify', verifyReport);
router.get('/export', exportReports);
router.get('/staff', getStaff);
router.get('/users', getUsers);

module.exports = router;
