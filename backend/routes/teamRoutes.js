const express  =  require ('express');

const {
  addTeamMember,
  getTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} = require('../Controller/TeamController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, addTeamMember); // Create a new team member
router.get('/', protect, getTeamMembers); // Get all team members
router.get('/:id', protect, getTeamMemberById); // Get a team member by ID
router.put('/:id', protect, updateTeamMember); // Update a team member by ID
router.delete('/:id', protect, deleteTeamMember); // Delete a team member by ID

module.exports = router;
