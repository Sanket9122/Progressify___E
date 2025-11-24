const {verifyToken} = require('../utils/jwt');
const User = require('../models/UserModels'); 
// Middleware to protect routes and check if user is authenticated

// This middleware checks for a valid JWT token in the request headers or cookies

const protect = async(req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = verifyToken(token);

        // fetch the user details from the database using the decode id
        
        const user =await User.findById (decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = {protect};