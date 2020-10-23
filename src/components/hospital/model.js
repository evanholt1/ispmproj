const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const HospitalSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    departments: [
        {
            type: String,
            required: true
        }
    ]
});

module.exports = mongoose.model('Hospital',HospitalSchema,"hospitals");