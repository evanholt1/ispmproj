const Appointment = require('./model');
const validators = require('./validation');
const { Response } = require('../../utils/response');
const { validateInput } = require('../../utils/validation');
const { InputValidationError } = require('../../utils/errors');


module.exports = appointmentController = {
    getOneById: async(id) => {
        await validateInput(validators.getOneAppointmentSchema, id, validators.options);

        const appointment = await Appointment.findById(id).lean().exec();

        return new Response(null, appointment, false, 200)
    },

    getMany: async(queryParameters) => {
        await validateInput(validators.getManyAppointmentsSchema, queryParameters, validators.options);

        let { limit, after, service } = queryParameters;

        limit = +limit; // to make sure limit is an int not string

        if (!service) {
            if (!limit)
                return new Response(null, await Appointment.find().lean().exec(), false, 200);

            if (!after)
                return new Response(null, await Appointment.find().limit(limit).lean().exec(), false, 200);

            let appointments = await Appointment.find({ _id: { $gt: after } }).limit(limit).lean().exec();

            // if an _id was deleted, find the documents after the _id just before the one deleted, returning the same results.
            while (!appointments)
                appointments = Appointment.find({ _id: { $lt: after } }).sort({ _id: -1 }).limit(1).lean().exec();

            return new Response(null, appointments, false, 200);
        } else {
            if (!limit)
                return new Response(null, await Appointment.find({ service }).lean().exec(), false, 200);

            if (!after)
                return new Response(null, await Appointment.find({ service }).limit(limit).lean().exec(), false, 200);

            let appointments = await Appointment.find({ service, _id: { $gt: after } }).limit(limit).lean().exec();

            // if an _id was deleted, find the documents after the _id just before the one deleted, returning the same results.
            while (!appointments)
                appointments = await Appointment.find({ service, _id: { $lt: after } }).sort({ _id: -1 }).limit(1).lean().exec();

            return new Response(null, appointments, false, 200);
        }
    },

    addMany: async(appointmentsInputs) => {
        await validateInput(validators.addAppointmentsSchema, appointmentsInputs, validators.options);

        let appointments = [];

        let appointmentsAdded = await Appointment.create(appointmentsInputs); // create accepts an array, and deals with it properly

        appointmentsAdded.forEach(appointment => {
            appointments.push(appointment.toObject({ getters: true }));
        });

        return new Response(null, appointments, false, 200);
    },

    editMany: async(appointmentsInputs) => {
        await validateInput(validators.editAppointmentsSchema, appointmentsInputs, validators.options);

        let updatedAppointments = [];

        // foreach faces issue with async/await
        for (const appointmentInput of appointmentsInputs) {
            let updatedAppointment = await Appointment.findByIdAndUpdate(appointmentInput._id, appointmentInput, { new: true }).exec();
            updatedAppointments.push(updatedAppointment);
        }
        return new Response("Successfully updated selected appointment", updatedAppointments, false, 200);
    },

    removeMany: async(appointmentsIds) => {
        await validateInput(validators.removeAppointmentsSchema, appointmentsIds, validators.options);

        const appointmentsToDelete = await Appointment.find({ _id: { $in: appointmentsIds } }).exec();

        appointmentsToDelete.forEach(appointment => {
            appointment.remove();

            appointment = appointment._doc;
        });

        return new Response(null, appointmentsToDelete, false, 200);
    }
}