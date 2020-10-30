const mongoose = require('mongoose')
const Schema = mongoose.Schema;

exports.pointSchema = new Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },{ _id : false });