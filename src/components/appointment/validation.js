const Joi = require('joi-oid')

const { serviceNames } = require('../../utils/services')
const { idSchema, idsSchema } = require('../../utils/validation');

let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setMilliseconds(0)
tomorrow.setSeconds(0)
tomorrow.setMinutes(0)

// change it so you will get datre and time seperately, and merge them later
const addAppointmentSchema = Joi.object({
    user: Joi.objectId().required(),

    service: Joi.string().valid(...serviceNames).required(),

    location: Joi.object({
        type: Joi.string().valid("Point").required(),

        coordinates: Joi.array().items(Joi.number()).required()
    }).required(),

    date: Joi.date().greater(tomorrow).message(`Date must be greater than ${tomorrow.toLocaleString()}`).required()
        // supposedly now it accepts yyyy-mm-dd format and validates quite well logically too
        // note that frontend must set seconds to 0, no use for seconds
        // https://www.tutorialspoint.com/remove-seconds-milliseconds-from-date-and-convert-to-iso-string
})



const editAppointmentSchema = Joi.object({
    _id: Joi.objectId().required(),

    service: Joi.string().valid(...serviceNames),

    location: Joi.object({
        type: Joi.string().valid("Point"),

        coordinates: Joi.array().items(Joi.number())
    }),

    state: Joi.number().integer().valid(1, -1),
    // must be at least a day in the future
    date: Joi.date().greater(tomorrow).message(`Date must be greater than ${tomorrow.toLocaleString()}`),

    allocatedStaff: Joi.array().items(Joi.objectId()),
})


exports.getOneAppointmentSchema = idSchema;

exports.getManyAppointmentsSchema = Joi.object({
    limit: Joi.number().integer().min(1).max(100),

    after: Joi.objectId(),

    service: Joi.string().valid(...serviceNames),
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