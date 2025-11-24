const asyncHandler = require('express-async-handler'); // Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.
const TeamMember = require('../models/TeamMember');
const User = require('../models/UserModels'); // Required if associating team members with user accounts

/**
 * @desc    Add a new team member
 * @route   POST /api/team-members
 * @access  Private (Admin/Project Manager)
 */
const addTeamMember = asyncHandler(async (req, res) => {
  const { name, email, role, associatedUser } = req.body;

  // Basic validation
  if (!name || !email || !role) {
    res.status(400);
    throw new Error('Please enter all required fields: name, email, and role.');
  }

  // Check if team member with this email already exists
  const memberExists = await TeamMember.findOne({ email });
  if (memberExists) {
    res.status(400);
    throw new Error('A team member with this email already exists.');
  }

  // Optional: Check if associatedUser ID exists if provided
  if (associatedUser) {
    const userExists = await User.findById(associatedUser);
    if (!userExists) {
      res.status(404);
      throw new Error('Associated user not found.');
    }
  }

  const teamMember = await TeamMember.create({
    name,
    email,
    role,
    associatedUser: associatedUser || null, // Assign if provided, otherwise null
  });

  if (teamMember) {
    res.status(201).json({
      _id: teamMember._id,
      name: teamMember.name,
      email: teamMember.email,
      role: teamMember.role,
      associatedUser: teamMember.associatedUser,
      createdAt: teamMember.createdAt,
      updatedAt: teamMember.updatedAt,
    });
  } else {
    res.status(400);
    throw new Error('Invalid team member data.');
  }
});

/**
 * @desc    Get all team members
 * @route   GET /api/team-members
 * @access  Private
 */
const getTeamMembers = asyncHandler(async (req, res) => {
  // Populate associatedUser if you want to display user details with team members
  const teamMembers = await TeamMember.find({}).populate('associatedUser', 'username email');

  res.status(200).json(teamMembers);
});

/**
 * @desc    Get a single team member by ID
 * @route   GET /api/team-members/:id
 * @access  Private
 */
const getTeamMemberById = asyncHandler(async (req, res) => {
  const teamMember = await TeamMember.findById(req.params.id).populate('associatedUser', 'username email');

  if (teamMember) {
    res.status(200).json(teamMember);
  } else {
    res.status(404);
    throw new Error('Team member not found.');
  }
});

/**
 * @desc    Update a team member's details
 * @route   PUT /api/team-members/:id
 * @access  Private (Admin/Project Manager)
 */
const updateTeamMember = asyncHandler(async (req, res) => {
  const { name, email, role, associatedUser } = req.body;

  const teamMember = await TeamMember.findById(req.params.id);

  if (teamMember) {
    // Check if new email already exists for another member, unless it's the current member's email
    if (email && email !== teamMember.email) {
      const existingMember = await TeamMember.findOne({ email });
      if (existingMember && String(existingMember._id) !== String(teamMember._id)) {
        res.status(400);
        throw new Error('This email is already used by another team member.');
      }
    }

    // Optional: Check if associatedUser ID exists if provided and is different
    if (associatedUser && associatedUser !== String(teamMember.associatedUser)) {
      const userExists = await User.findById(associatedUser);
      if (!userExists) {
        res.status(404);
        throw new Error('Associated user not found.');
      }
      // Also check if the user is already associated with another team member
      const existingAssociation = await TeamMember.findOne({ associatedUser });
      if (existingAssociation && String(existingAssociation._id) !== String(teamMember._id)) {
        res.status(400);
        throw new Error('This user is already associated with another team member.');
      }
    }


    teamMember.name = name || teamMember.name;
    teamMember.email = email || teamMember.email;
    teamMember.role = role || teamMember.role;
    // Set associatedUser to null if explicitly passed as null, or update if provided
    teamMember.associatedUser = (associatedUser === null) ? null : (associatedUser || teamMember.associatedUser);


    const updatedTeamMember = await teamMember.save();

    res.status(200).json({
      _id: updatedTeamMember._id,
      name: updatedTeamMember.name,
      email: updatedTeamMember.email,
      role: updatedTeamMember.role,
      associatedUser: updatedTeamMember.associatedUser,
      createdAt: updatedTeamMember.createdAt,
      updatedAt: updatedTeamMember.updatedAt,
    });
  } else {
    res.status(404);
    throw new Error('Team member not found.');
  }
});

/**
 * @desc    Delete a team member
 * @route   DELETE /api/team-members/:id
 * @access  Private (Admin/Project Manager)
 */
const deleteTeamMember = asyncHandler(async (req, res) => {
  const teamMember = await TeamMember.findById(req.params.id);

  if (teamMember) {
    // Before deleting, consider tasks assigned to this member.
    // Option 1: Reassign or set to null
    // await Task.updateMany({ assignedTo: teamMember._id }, { $set: { assignedTo: null, status: 'in_queue' } });
    // Option 2: Prevent deletion if active tasks exist
    // const activeTasks = await Task.countDocuments({ assignedTo: teamMember._id, status: { $ne: 'completed' } });
    // if (activeTasks > 0) {
    //   res.status(400);
    //   throw new Error(`Cannot delete team member with ${activeTasks} active tasks.`);
    // }

    await TeamMember.deleteOne({ _id: req.params.id }); // Use deleteOne with a query
    res.status(200).json({ message: 'Team member removed successfully.' });
  } else {
    res.status(404);
    throw new Error('Team member not found.');
  }
});

module.exports = {
  addTeamMember,
  getTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
};
