const express = require('express');
const router = express.Router();
const { getMyTasks, updateTaskStatus, uploadEvidence } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect, authorize('staff'));

router.get('/my', getMyTasks);
router.patch('/:id/status', updateTaskStatus);
router.post('/:id/evidence', upload.single('image'), uploadEvidence);

module.exports = router;
