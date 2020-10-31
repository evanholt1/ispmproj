const Joi = require('joi-oid')

const { InputValidationError } = require('./errors');


exports.validateInput = async(schema, input, options) => {
    try {
        await schema.validateAsync(input, options);
    } catch (err) {
        throw new InputValidationError(err.details[0].path[0], err.details[0].message);
    }
}

exports.idSchema = Joi.objectId();

exports.idsSchema = Joi.array().items(this.idSchema);