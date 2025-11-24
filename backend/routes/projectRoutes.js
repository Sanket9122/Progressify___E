const express = require('express');
const router = express.Router();

const {
    createProject ,
    accessprojectById,  
    updateProjectById,
    deleteProjectById
} = require('../Controller/projectController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createProject); // Create a new project
router.get('/:id', protect, accessprojectById); // Access a project by ID
router.put('/:id', protect, updateProjectById); // Update a project by ID
router.delete('/:id', protect, deleteProjectById); // Delete a project by ID

module.exports = router;