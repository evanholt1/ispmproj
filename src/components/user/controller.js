const User = require('./model');

module.exports = userController = {

    signup: async (signupInput) => {
        let { mobileNumber } = signupInput;
        const mobileNumberAlreadyExists = await User.findOne({ mobileNumber }).lean().exec();
        if(mobileNumberAlreadyExists){
            return {
                success: false,
                message: "Number already in use!",
                status: 401
            }
        }       
    
        await User.create(signupInput);

        return {
            success:true,
            status:200,
            message: "New User Successfully Created!"
        };
      },
    
      signin: async (signinInput, req) => { 
        const user = await User.findOne({ mobileNumber: signinInput.mobileNumber }).lean().exec();

        if(!user) 
            return {
                success: false,
                status: 401,
                message: "Phone Number is wrong! Try again!"
            };
        
        req.session._id = user._id;
        req.session.loginDate = Date.now();
    
        return {
            success: true,
            status: 200,
            message: "User successfully logged in"
        };
      },

      signout: async (req, res) => {
        await destroySessionPromise(req, res);

        return {
            success: true,
            status: 200,
            message: "User successfully logged out"
        }
      }
}


// because the callback version is bad and just doesnt work 
const destroySessionPromise = (req,res) => {
    return new Promise( (resolve,reject) => 
        {
            req.session.destroy(function(err) {
                if(err) reject(null);
                res.clearCookie("US");
                resolve(null);
            })
        }
    )
}