const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const { serviceNames, serviceStates } = require('../../utils/services');
const { pointSchema } = require('../../utils/pointSchema')
const { DateTime } = require('luxon');
const services = require('../../utils/services');

const AppointmentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    service: {
        type: String,
        enum: serviceNames
    },
    location: {
        type: pointSchema
    },
    date: {
        type: Date,
        get: toLocalDate
            // format: UTC date
            // no setter as formatting is done in 'addMany' before new Appointment() is called. (.create() to be precise)

    },
    state: { // blood collection,hemodialysis, medicine delivery, home medical services have different states. 
        // business logic code will control this
        type: Number,
        set: updateState
    },
    allocatedStaff: [{
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    isFinished: {
        type: Boolean,
        default: false
    }
}, {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true
});

var PreAutoPopulate = function(next) {
    this.populate({ path: 'allocatedStaff', select: 'name' })
        .populate({ path: 'user', select: 'name' });
    next();
};

AppointmentSchema.
pre('findOne', PreAutoPopulate).
pre('find', PreAutoPopulate);

const advanceState = function(service, currentState, nextStateIndex, isAppointmentFinished) {
    switch (service) {
        case "Hemodialysis Request":
            if (currentState < 4 && nextStateIndex - currentState === 1)
                currentState += 1;
            if (currentState == 3) { // appointment state is now "fufilled"
                isAppointmentFinished = true; // frees employees and isFinished becomes true
            }
            break;
        default:
            if (currentState < 6 && nextStateIndex - currentState === 1) {
                currentState += 1;
                if (currentState == 5) {
                    isAppointmentFinished = true;
                }
            }
            break;
    }
    return {
        'currentState': currentState,
        'isFinished': isAppointmentFinished
    };
};

const revertState = function(service, currentState, newState, isAppointmentFinished) {
    switch (service) {
        case "Hemodialysis Request":
            if (currentState > -1 && currentState - newState === 1 && currentState != 3)
                currentState -= 1;
            break;
        default:
            if (currentState > -1 && currentState - newState === 1 && currentState != 5)
                currentState -= 1;
            break;
    }
    return {
        'currentState': currentState,
        'isFinished': isAppointmentFinished
    };
};


function toLocalDate(date) {
    let appointmentDate = DateTime.fromJSDate(date, { zone: "Asia/Amman" }).toISO();

    return appointmentDate;
}

function updateState(newStateIndex) {
    if (newStateIndex > this.state) {
        const result = advanceState(this.service, this.state, newStateIndex, this.isFinished);

        this.isFinished = result.isFinished;

        return result.currentState;

    } else if (newStateIndex < this.state) {
        const result = revertState(this.service, this.state, newStateIndex, this.isFinished);

        this.isFinished = result.isFinished;

        return result.currentState;
    }

    return this.state; // no state change
}

module.exports = mongoose.model('Appointment', AppointmentSchema, "appointments");