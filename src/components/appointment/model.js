const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const services = require('../../utils/services');
const { pointSchema } = require('../../utils/pointSchema')

const AppointmentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    service: {
        type: String,
        enum: services
    },
    location: {
        type: pointSchema
    },
    date: {
        type: Date
    },
    state: { // blood collection,hemodialysis, medicine delivery, home medical services have different states. 
        // business logic code will control this
        type: String
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema, "appointments");