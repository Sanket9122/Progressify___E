const express = require ('express');
const router = express.Router();

const {
    assignTasks,
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    markTaskCompleted,
    assignTasktoMember,
    deleteTask
} = require('../Controller/TaskController');

const {protect} = require  ('../middleware/authMiddleware');
router.post('/assign', protect, assignTasks); // Assign tasks to team members
router.post('/', protect, createTask); // Create a new task
router.get('/', protect, getTasks); // Get all tasks
router.get('/:id', protect, getTaskById); // Get a task by ID   
router.put('/:id', protect, updateTask); // Update a task by ID
router.put('/:id/complete', protect, markTaskCompleted); // Mark a task as completed
router.put('/:id/assign', protect, assignTasktoMember); // Assign a task to a member
router.delete('/:id', protect, deleteTask); // Delete a task by ID

module.exports = router;
