const express = require('express');
const { signUp, verify, logIn, forgotpassword, resetPassword, submitReset, } = require('../controller/userController');

const router = express.Router();

//endpoint to signUp a new User 
router.post('/signup', signUp); 

//endpoint to verified a new user
router.get('/verify/:id/:token', verify);

//endpoint to login a registered user
router.post('/login', logIn);

//endpoint for forget Password
router.post('/forgot', forgotpassword);

//endpoint for forget Password
router.get('/reset/:userId', resetPassword);

//endpoint for forget Password
router.post('/reset/:userId', submitReset);

module.exports = router;