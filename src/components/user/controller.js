const User = require('./model');
const Employee = require('../employee/model')
const { options, signupSchema, signinSchema } = require('./validation');
const { InputValidationError, EntityAlreadyExistsError, EntityDoesntExistError } = require('../../utils/errors')
const { Response } = require('../../utils/response');


module.exports = userController = {

    signup: async(signupInput) => {
        try {
            await signupSchema.validateAsync(signupInput, options)
        } catch (err) {
            throw new InputValidationError(err.details[0].path[0], err.details[0].message)
        }

        let { email } = signupInput

        const emailAlreadyExists = await User.findOne({ email }).lean().exec()

        if (emailAlreadyExists)
            throw new EntityAlreadyExistsError("email", "User")

        await User.create(signupInput)

        return new Response("User Successfully Created!", null, false, 200)
    },

    signin: async(signinInput, req) => {
        if (req.session._id)
            return new Response("Already Logged In!", null, false, 200)

        try {
            await signinSchema.validateAsync(signinInput);
        } catch (err) {
            throw new InputValidationError(err.details[0].path[0], err.details[0].message);
        }

        const { email, password } = signinInput;

        let user;
        let userRole;

        if (email.includes("@hospital.jo")) {
            user = await Employee.findOne({ email, password }).lean().exec();
            userRole = user.role;
        } else {
            user = await User.findOne({ email, password }).lean().exec();
            userRole = "user";
        }

        if (!user)
            throw new EntityDoesntExistError("User")

        req.session._id = user._id;
        req.session.loginDate = Date.now();
        req.session.role = userRole;
        req.session.sessionDuration = 1000; // session duration in milliseconds

        return new Response("User successfully logged in", null, false, 200);
    },

    signout: async(req, res) => {
        if (!req.session._id)
            return new Response("Already Logged Out!", null, false, 200)

        await destroySessionPromise(req, res);

        return new Response("User successfully logged out", null, false, 200)
    }
}


// because the callback version is bad and just doesnt work 
const destroySessionPromise = (req, res) => {
    return new Promise((resolve, reject) => {
        req.session.destroy(function(err) {
            if (err) reject(err);

            res.clearCookie("US");

            resolve(null);
        })
    })
}