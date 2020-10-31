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
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema, "appointments");