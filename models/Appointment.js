const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const services = require('../utils/services');
const AppointmentSchema = new Schema({
    patientName: {
        type: String
    },
    mobileNumber: {
        type: Number
    },
    patientIdNumber: {
        type: Number
    },
    service: {
        type: String,
        enum: services
    },
    location: { // todo: connect with google maps api
        type: String
    }
});

module.exports = mongoose.model('Appointment',AppointmentSchema,"appointments");