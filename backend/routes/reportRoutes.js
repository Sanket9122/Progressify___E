const express = require('express');
const {
  getProjectProgressReport,
  getProjectProgressPdfReport,
  getTeamPerformanceReport,
  getOverdueTasksReport,
} = require('../Controller/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/project-progress').get(protect, getProjectProgressReport);
router.route('/project-progress/pdf').get(protect, getProjectProgressPdfReport);
router.route('/team-performance').get(protect, getTeamPerformanceReport);
router.route('/overdue-tasks').get(protect, getOverdueTasksReport);

module.exports = router;
