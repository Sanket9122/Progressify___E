const asyncHandler = require('express-async-handler');
const User = require('../models/UserModels');
const bcrypt = require('bcrypt');
const tokenGenerator = require('../utils/jwt');

//**
//@desc Register a new user 
// @route POST /api/auth/register
// @access Public
//

const registerUser = asyncHandler (async(req ,res )=>{
    const {username ,email ,mobile ,password} = req.body;

    // check if all the fields are provided
    if(!username ||!username.firstname || !username.lastname || !email || !mobile || !password){
        res.status(400).json({message :'please aadd all required fields'});
        return ; 
    }
    //check if the user already exists
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400).json({message :'User already exists' ,
            _id: userExists._id,
        username: userExists.username,
        email: userExists.email,
        token: tokenGenerator.generateToken(userExists),
        }
        );
        return ; 
    }

    // create users 
    const user = await User.create({
        username :{
            firstname : username.firstname,
            lastname : username.lastname
        } ,
        email , 
        mobile ,
        password ,
        role :'user'
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: tokenGenerator.generateToken(user), /// generate jwt token for the new user
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

//**
// @desc Login a user 
// @route POST /api/auth/login
// @access Public */


const LoginUser = asyncHandler(async(req,res)=>{
    const {email , password} = req.body;
    //check if all the fields are provided
    if(!email || !password){
        res.status(400);
        throw new Error('Please add all required fields');
    }
    // check if the user exists 
//.select('+password') is used to include the password field in the query result, as it is usually excluded by default for security reasons.
    const user = await User.findOne({ email }).select('+password');
    if(!user){
        res.status(404).json({message :'user does not exist'});
    }
    const isMatch = await user.matchPassword(password);
    
    if(!isMatch){
        res.status(401).json({message: 'password matching failed '})
    }
  if (user && isMatch) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: tokenGenerator.generateToken(user), // Generate JWT for the logged-in user
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password.');
  }
});

// @desc get current authenticated user profile 
// @route GET /api/auth/me
// @access Private

const getMe = asyncHandler (async (req, res) => {
    const user =await User.findById(req.user._id).select('-password');
    if(user){
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
})

// @desc get all users
// @route GET /api/auth/users
// @access Private (for admins or specific roles)

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
});
// export the functions 
module.exports = {
    registerUser,
    LoginUser,
    getMe,
    getAllUsers,
};