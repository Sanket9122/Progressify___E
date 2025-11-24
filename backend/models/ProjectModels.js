const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a project name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a project description'],
    },
    schedule: {
      type: String, 
      required: [true, 'Please add a project schedule'],
    },
    status: {
      type: String,
      enum: ['Planned', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
      default: 'Planned',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Refers to the User model
      required: true, // The project must be associated with a creator
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model('Project', projectSchema);