const Joi = require('joi-oid')

const services = require('../../utils/services')

exports.getManySchema = Joi.object({
    limit: Joi.number().integer().min(1).max(100), 
    
    after: Joi.objectId(), 

    service: Joi.string().valid(...services),
})


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