const Joi = require('joi-oid')

const { idSchema, idsSchema } = require('../../utils/validation');
const { serviceDepartments } = require('../../utils/services');

// change it so you will get datre and time seperately, and merge them later
const addEmployeeSchema = Joi.object({
    name: Joi.string().required(),

    department: Joi.string().valid(...serviceDepartments).required(),

    shift: Joi.object().keys({
        start: Joi.number(),
        end: Joi.number()
    }),
    role: Joi.string().valid("employee", "admin").required(),

    email: Joi.string().email().required()
})

let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setMilliseconds(0)
tomorrow.setSeconds(0)
tomorrow.setMinutes(0)

const editEmployeeSchema = Joi.object({
    _id: Joi.objectId().required(),

    name: Joi.string(),

    shift: Joi.object().keys({
        start: Joi.number(),
        end: Joi.number()
    }),

    role: Joi.string().valid("employee", "admin"),

    department: Joi.string().valid(...serviceDepartments),

    email: Joi.string().email()
})


exports.getOneEmployeeSchema = idSchema;

exports.getManyEmployeesSchema = Joi.object({
    limit: Joi.number().integer().min(1).max(100),

    after: Joi.objectId(),

    department: Joi.string().valid(...serviceDepartments),
})

exports.addEmployeesSchema = Joi.array().items(addEmployeeSchema)

exports.editEmployeesSchema = Joi.array().items(editEmployeeSchema)

exports.removeEmployeesSchema = idsSchema;

exports.options = {
    errors: {
        wrap: {
            label: ''
        }
    }
};