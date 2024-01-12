const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: true
    }, 
    lastName: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    }, 
    password: {
        type: String, 
        required: true
    },
    isVerified: {
        type: Boolean, 
        default: false
    },
    token: {
        type: String, 
    }
    // profilePic: [{
    //     type: String, 
    //     required: true
    // }]
}, {timestamps: true})

const userModel = mongoose.model('Multar', userSchema); 

module.exports = userModel;
