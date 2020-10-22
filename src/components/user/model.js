const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    patientName: {
        type: String
    },
    mobileNumber: {
        type: Number
    }
});

module.exports = mongoose.model('User',UserSchema,"users");