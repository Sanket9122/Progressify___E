const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User schema definition
const UserSchema = new mongoose.Schema({
  username: {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    maxlength: [12, 'Password must not exceed 12 characters'],
    select: false, // hide password in responses
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true,
  },
}, { timestamps: true });

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Compare entered password with hashed one
UserSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Error comparing password:', error);
    throw error;
  }
};

// Generate JWT token
UserSchema.methods.getJWTToken = function () {
  try {
    return jwt.sign(
      { id: this._id, role: this.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw error;
  }
};

module.exports = mongoose.model('User', UserSchema);
