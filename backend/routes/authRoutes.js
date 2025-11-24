const express = require('express');

const router = express.Router();

const {registerUser ,LoginUser , getMe , getAllUsers} = require('../Controller/authController');
const {protect} = require('../middleware/authMiddleware');

router.post('/register_user', registerUser); // Register a new user
router.post('/login__user', LoginUser); // Login a user
router.get('/:me', protect, getMe); // Get current user details
router.get('/users', protect , getAllUsers); // Get all users



module.exports = router;
