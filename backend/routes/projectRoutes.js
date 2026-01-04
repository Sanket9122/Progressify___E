const express = require('express');
const router = express = require('express');

const {
    createProject ,
    accessprojectById,  
    updateProjectById,
    deleteProjectById,
    getProjects // Import the new getProjects controller
} = require('../Controller/projectController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getProjects); // Route to get all projects
router.post('/', protect, createProject); // Create a new project
router.get('/:id', protect, accessprojectById); // Access a project by ID
router.put('/:id', protect, updateProjectById); // Update a project by ID
router.delete('/:id', protect, deleteProjectById); // Delete a project by ID

module.exports = router;