const asyncHandler = require('express-async-handler');
const Project = require('../models/ProjectModels');
const Task = require('../models/Task');
const TeamMember = require('../models/TeamMember');
const {generatePdfReport}  = require('../Services/reportService');


const generateProjectReportHtml = (reportData) => {
  let html = `
    <h1>Project Progress Report</h1>
    <table border="1" cellpadding="10" cellspacing="0" style="width:100%;">
      <thead>
        <tr>
          <th>Project Name</th>
          <th>Total Tasks</th>
          <th>Completed</th>
          <th>Pending</th>
          <th>In Queue</th>
          <th>Completion %</th>
        </tr>
      </thead>
      <tbody>
  `;

  reportData.forEach(project => {
    html += `
      <tr>
        <td>${project.projectName}</td>
        <td>${project.totalTasks}</td>
        <td>${project.completedTasks}</td>
        <td>${project.pendingTasks}</td>
        <td>${project.inQueueTasks}</td>
        <td>${project.completionPercentage.toFixed(2)}%</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  return html;
};

/**
 * @desc    Get project progress report
 * @route   GET /api/reports/project-progress
 * @access  Private
 * @query   projectId (optional)
 */
const getProjectProgressReport = asyncHandler(async (req, res) => {
  const { projectId } = req.query;
  const matchCondition = projectId ? { projectId } : {};

  const reportData = await Task.aggregate([
    {
      $match: matchCondition,
    },
    {
      $group: {
        _id: '$projectId',
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
          },
        },
        pendingTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', 'pending'] }, 1, 0],
          },
        },
        inQueueTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', 'in_queue'] }, 1, 0],
          },
        },
      },
    },
    {
      $lookup: {
        from: 'projects',
        localField: '_id',
        foreignField: '_id',
        as: 'projectDetails',
      },
    },
    {
      $unwind: '$projectDetails',
    },
    {
      $project: {
        _id: 1,
        projectName: '$projectDetails.name',
        totalTasks: 1,
        completedTasks: 1,
        pendingTasks: 1,
        inQueueTasks: 1,
        completionPercentage: {
          $cond: [
            { $eq: ['$totalTasks', 0] },
            0,
            {
              $multiply: [
                { $divide: ['$completedTasks', '$totalTasks'] },
                100,
              ],
            },
          ],
        },
      },
    },
  ]);

  res.status(200).json(reportData);
});

 


/**
 * @desc    Get project progress report (PDF format)
 * @route   GET /api/reports/project-progress/pdf
 * @access  Private
 * @query   projectId (optional)
 */
const getProjectProgressPdfReport = asyncHandler(async (req, res) => {
  const { projectId } = req.query;
  const matchCondition = projectId ? { projectId } : {};

  const reportData = await Task.aggregate([
    {
      $match: matchCondition,
    },
    {
      $group: {
        _id: '$projectId',
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
          },
        },
        pendingTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', 'pending'] }, 1, 0],
          },
        },
        inQueueTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', 'in_queue'] }, 1, 0],
          },
        },
      },
    },
    {
      $lookup: {
        from: 'projects',
        localField: '_id',
        foreignField: '_id',
        as: 'projectDetails',
      },
    },
    {
      $unwind: '$projectDetails',
    },
    {
      $project: {
        _id: 1,
        projectName: '$projectDetails.name',
        totalTasks: 1,
        completedTasks: 1,
        pendingTasks: 1,
        inQueueTasks: 1,
        completionPercentage: {
          $cond: [
            { $eq: ['$totalTasks', 0] },
            0,
            {
              $multiply: [
                { $divide: ['$completedTasks', '$totalTasks'] },
                100,
              ],
            },
          ],
        },
      },
    },
  ]);

  const reportHtml = generateProjectReportHtml(reportData);
  const pdfBuffer = await generatePdfReport(reportHtml);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="project_progress_report.pdf"',
    'Content-Length': pdfBuffer.length,
  });

  res.send(pdfBuffer);
});




/**
 * @desc    Get team performance report
 * @route   GET /api/reports/team-performance
 * @access  Private
 */
const getTeamPerformanceReport = asyncHandler(async (req, res) => {
  const reportData = await Task.aggregate([
    {
      $match: {
        assignedTo: { $ne: null }, // Only consider tasks assigned to a member
      },
    },
    {
      $group: {
        _id: '$assignedTo',
        totalAssignedTasks: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
          },
        },
        pendingTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', 'pending'] }, 1, 0],
          },
        },
      },
    },
    {
      $lookup: {
        from: 'teammembers',
        localField: '_id',
        foreignField: '_id',
        as: 'memberDetails',
      },
    },
    {
      $unwind: '$memberDetails',
    },
    {
      $project: {
        _id: 1,
        memberName: '$memberDetails.name',
        memberEmail: '$memberDetails.email',
        totalAssignedTasks: 1,
        completedTasks: 1,
        pendingTasks: 1,
        completionRate: {
          $cond: [
            { $eq: ['$totalAssignedTasks', 0] },
            0,
            {
              $multiply: [
                { $divide: ['$completedTasks', '$totalAssignedTasks'] },
                100,
              ],
            },
          ],
        },
      },
    },
  ]);

  res.status(200).json(reportData);
});

/**
 * @desc    Get overdue tasks report
 * @route   GET /api/reports/overdue-tasks
 * @access  Private
 */
const getOverdueTasksReport = asyncHandler(async (req, res) => {
  const overdueTasks = await Task.find({
    dueDate: { $lt: new Date() },
    status: { $ne: 'completed' },
  })
    .populate('projectId', 'name')
    .populate('assignedTo', 'name email');

  res.status(200).json(overdueTasks);
});

module.exports = {
  getProjectProgressReport,
  getProjectProgressPdfReport,
  getTeamPerformanceReport,
  getOverdueTasksReport,
};

