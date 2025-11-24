const jwttoken = require('jsonwebtoken');
///create token
const generateToken = (user) => {
    if (!user || !user._id || !user.role) {
        throw new Error('Invalid user object');
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret is not defined in environment variables');
    }
    try{
    const token = jwttoken.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } 
    );
    return token;
}
catch (error) {
    console.error('Error creating token:', error);
    throw new Error('Token creation failed');
}
};
//verify token
const verifyToken = (token)=>{
    try{
        const decoded = jwttoken.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        console.error('Error verifying token:', error);
        throw new Error('Invalid token');
    }
}

////  export
module.exports = 
{generateToken, verifyToken};



