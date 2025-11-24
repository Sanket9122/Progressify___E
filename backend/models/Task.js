const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a task name'],
      trim: true,
    },
    description: {
      type: String,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project', // Refers to the Project model
      required: true, // Each task must belong to a project
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember', // Refers to the TeamMember model
      default: null, // Null if the task is in the 'in_queue' status
    },
    status: {
      type: String,
      enum: ['In_queue', 'Pending', 'Completed', 'Blocked'],
      default: 'In_queue', // New tasks typically start in a queu      type: Number, // Changed to Number for correct sorting
      enum: [1, 2, 3], // 1: low, 2: medium, 3: high
      default: 2, // Default to medium priority
      default: 'medium',
    },
    dueDate: {
      type: Date,
      required: [true, 'Please add a due date for the task'],
    },
    completedAt: {
      type: Date,
      default: null, // Set when task status changes to 'completed'
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model('Task', taskSchema);
