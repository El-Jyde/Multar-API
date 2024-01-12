const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const sendEmail = require('../middleware/email');
const { generateDynamicEmail } = require('../emailText');
const { resetFunc } = require('../forgot');
const resetHTML = require('../resetHTML');
const jwt = require('jsonwebtoken');

const signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const emailExists = await userModel.findOne({ email: email.toLowerCase() });
        if (emailExists) {
            return res.status(404).json({
                message: 'Email already exists',
            })
        }

        const salt = bcrypt.genSaltSync(12);
        const hashPassword = bcrypt.hashSync(password, salt);

        const user = await new userModel({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashPassword,
            //profilePic: req.files.profilePicture

        })

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            })
        }

        const first = user.firstName.slice(0, 1).toUpperCase()
        const firstN = user.firstName.slice(1).toLowerCase()
        const last = user.lastName.slice(0, 1).toUpperCase()

        const fullName = first + firstN + " " + last

        const token = jwt.sign({ email, firstName, lastName }, process.env.secret, { expiresIn: "120s" })
        user.token = token
        const subject = 'Email Verification'
        await jwt.verify(token, process.env.secret)
        const link = `${req.protocol}://${req.get('host')}/api/v1/verify/${user.id}/${user.token}`
        const html = generateDynamicEmail(fullName, link)
        sendEmail({
            email: user.email,
            html,
            subject
        })
        await user.save()
        return res.status(200).json({
            message: 'User profile created successfully',
            data: user,
        })

    } catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error: ' + err.message,
        })
    }
}

const verify = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id)
        jwt.verify(user.token, process.env.secret, (err) => {
            if (!err) {
                userModel.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true })
            }
        })
        const { firstName, lastName, email } = user
        if (user.isVerified === true) {
            res.json("You have been successfully verified kindly visit the login page ")
        } else {
            await jwt.verify(user.token, process.env.secret, (err) => {
                if (err) {
                    const token = jwt.sign({ email, firstName, lastName }, process.env.secret, { expiresIn: "120s" })
                    user.token = token
                    user.save();

                    const first = user.firstName.slice(0, 1).toUpperCase()
                    const firstN = user.firstName.slice(1).toLowerCase()
                    const last = user.lastName.slice(0, 1).toUpperCase()

                    const fullName = first + firstN + " " + last
                    const link = `${req.protocol}://${req.get('host')}/api/v1/verify/${user.id}/${user.token}`
                    sendEmail({
                        email: user.email,
                        html: generateDynamicEmail(fullName, link),
                        subject: `RE-VERIFY YOUR ACCOUNT`
                    })
                    return res.json("This link is expired. Kindly check your email for another email to verify")   
                } else if (user.isVerified === true) {
                    return res.status(200).json(`Email verified. Registration complete! ${user.firstName}`);
                }
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error: ' + err.message,
        })
    }
};


//Function to logIn a registered user
const logIn = async (req, res) => {
    try {
        // Get the user's login details 
        const { email, password } = req.body;

        //Make sure both fields are provided
        if (!email || !password) {
            return res.status(400).json({
                message: 'Please provide your email and password'
            })
        }

        //Check if the user already  exist in the database
        const checkEmail = await userModel.findOne({ email: email.toLowerCase() })

        //Check if the user is not existing and return a response
        if (!checkEmail) {
            return res.status(404).json({
                message: 'User does not exist'
            })
        }

        //Verify the user's password
        const checkPassword = bcrypt.compareSync(password, checkEmail.password)
        if (!checkPassword) {
            return res.status(400).json({
                message: "Password is incorrect",
            })
        }

        //Generate a token for the user
        const token = jwt.sign({
            userId: checkEmail._id,
            name: checkEmail.name,
            email: checkEmail.email,
        }, process.env.secret, { expiresIn: "1h" })
        return res.status(200).json({
            message: `Login Successful, welcome ${checkEmail.name}`,
            token: token
        });


    } catch (err) {
        return res.status(500).json({
            Error: 'Internal Server Error' + err.message,
        });
    }
};



const forgotpassword = async (req, res) => {
    try {
        const checkUser = await userModel.findOne({ email: req.body.email });
        if (!checkUser) {
            return res.status(404).json({
                message: 'Email does not exist'
            });
        }
        else {
            const subject = 'Kindly reset your password'
            const link = `${req.protocol}://${req.get('host')}/api/v1/reset/${checkUser._id}`
            const html = resetFunc(checkUser.name, link)
            sendEmail({
                email: checkUser.email,
                html,
                subject
            })
            return res.status(200).json({
                message: "Kindly check your email to reset your password",
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error: ' + err.message,
        })
    }
};


const resetPassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const resetPage = resetHTML(userId);

        // Send the HTML page as a response to the user
        res.send(resetPage);
    } catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error: ' + err.message,
        });
    }
};


const submitReset = async (req, res) => {
    try {
        const userId = req.params.userId;
        const password = req.body.password

        const salt = bcrypt.genSaltSync(12);
        const hashPassword = bcrypt.hashSync(password, salt);

        const reset = await userModel.findByIdAndUpdate(userId, { password: hashPassword }, { new: true });
        return res.status(200).json({
            message: "Password reset successfully",
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error: ' + err.message,
        })
    }
};


module.exports = {
    signUp,
    verify,
    logIn,
    forgotpassword,
    resetPassword,
    submitReset,

}