const Joi = require('joi-oid')

const services = require('../../utils/services')
const { idSchema, idsSchema } = require('../../utils/validation');


const addAppointmentSchema = Joi.object({
    user: Joi.objectId().required(),

    service: Joi.string().valid(...services).required(),

    location: Joi.object({
        type: Joi.string().valid("Point").required(),

        coordinates: Joi.array().items(Joi.number()).required()
    }).required(),

    date: Joi.date().required()
        // supposedly now it accepts yyyy-mm-dd format and validates quite well logically too
        // note that frontend must set seconds to 0, no use for seconds
        // https://www.tutorialspoint.com/remove-seconds-milliseconds-from-date-and-convert-to-iso-string
})

const editAppointmentSchema = Joi.object({
    _id: Joi.objectId().required(),

    service: Joi.string().valid(...services),

    location: Joi.object({
        type: Joi.string().valid("Point"),

        coordinates: Joi.array().items(Joi.number())
    }),

    date: Joi.date()
})


exports.getOneAppointmentSchema = idSchema;

exports.getManyAppointmentsSchema = Joi.object({
    limit: Joi.number().integer().min(1).max(100),

    after: Joi.objectId(),

    service: Joi.string().valid(...services),
})

exports.addAppointmentsSchema = Joi.array().items(addAppointmentSchema)

exports.editAppointmentsSchema = Joi.array().items(editAppointmentSchema)

exports.removeAppointmentsSchema = idsSchema;

exports.options = {
    errors: {
        wrap: {
            label: ''
        }
    }
};