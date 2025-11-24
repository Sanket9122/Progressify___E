const mongoose = require('mongoose');
const validator = require('validator'); // For email validation

const teamMemberSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a team member name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email for the team member'],
      unique: true, // Each team member must have a unique email
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email address'],
    },
    role: {
      type: String,
      required: [true, 'Please add a role for the team member'],
      trim: true,
    },
    // Optional: If a team member also has a user account in the system
    associatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Refers to the User model
      unique: true, // Ensure one user account is linked to one team member profile
      sparse: true, // Allows null values while maintaining uniqueness for non-null values
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model('TeamMember', teamMemberSchema);

