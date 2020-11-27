const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const { pointSchema } = require('../../utils/pointSchema')

const UserSchema = new Schema({
    name: {
        type: String
    },

    email: {
        type: String
    },

    password: {
        type: String
    },
    location: {
        type: pointSchema
    }
});

module.exports = mongoose.model('User', UserSchema, "users");