const Joi = require('joi');

exports.signupSchema = Joi.object({
    name: Joi.string().min(3).max(40),

    email: Joi.string().email().required(),

    password: Joi.string().min(3).max(40).required(),

    passwordConfirmation: Joi.string().required().valid(Joi.ref('password')).messages({"any.only":"passwords must match"}),
})
.with('password', 'passwordConfirmation');

exports.signinSchema = Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().min(3).max(40).required(),
})

exports.options = {
    errors: {
      wrap: {
        label: ''
      }
    }
  };