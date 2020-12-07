const { DateTime } = require('luxon');

const Appointment = require('./model');
const validators = require('./validation');
const { Response } = require('../../utils/response');
const { validateInput } = require('../../utils/validation');
const { services } = require('../../utils/services');
const Employee = require('../employee/model');



module.exports = appointmentController = {
    getOneById: async(id) => {
        await validateInput(validators.getOneAppointmentSchema, id, validators.options);

        const appointment = await Appointment.findById(id).exec();

        return new Response(null, appointment, false, 200)
    },

    getMany: async(queryParameters) => {
        await validateInput(validators.getManyAppointmentsSchema, queryParameters, validators.options);

        let { limit, after, service } = queryParameters;

        limit = +limit; // to make sure limit is an int not string

        if (!service) {
            if (!limit)
                return new Response(null, await Appointment.find().exec(), false, 200);

            if (!after)
                return new Response(null, await Appointment.find().limit(limit).exec(), false, 200);

            let appointments = await Appointment.find({ _id: { $gt: after } }).limit(limit).exec();

            // if an _id was deleted, find the documents after the _id just before the one deleted, returning the same results.
            while (!appointments)
                appointments = Appointment.find({ _id: { $lt: after } }).sort({ _id: -1 }).limit(1).exec();

            return new Response(null, appointments, false, 200);
        } else {
            if (!limit)
                return new Response(null, await Appointment.find({ service }).exec(), false, 200);

            if (!after)
                return new Response(null, await Appointment.find({ service }).limit(limit).exec(), false, 200);

            let appointments = await Appointment.find({ service, _id: { $gt: after } }).limit(limit).exec();

            // if an _id was deleted, find the documents after the _id just before the one deleted, returning the same results.
            while (!appointments)
                appointments = await Appointment.find({ service, _id: { $lt: after } }).sort({ _id: -1 }).limit(1).exec();

            return new Response(null, appointments, false, 200);
        }
    },

    addMany: async(appointmentsInputs) => {
        await validateInput(validators.addAppointmentsSchema, appointmentsInputs, validators.options);

        let appointments = [];

        for (const appointment of appointmentsInputs) {
            const service = services.filter(serviceElement => serviceElement.name == appointment.service);

            const departmentsNeeded = service[0].departments;

            initializeAppointmentData(appointment);

            const freeEmployeesPerDepartmentArray = await Employee.findFreeStaff(departmentsNeeded, appointment.date);

            if (!freeEmployeesPerDepartmentArray)
                return new Response("No Enough Free Employees at that time! Please Choose a later time", null, false, 200);

            // add a random employee from each required department
            await allocateAppointmentEmployees(appointment, freeEmployeesPerDepartmentArray);

            let appointmentsAdded = await Appointment.create(appointmentsInputs); // create accepts an array, and deals with it properly

            for (let appointment of appointmentsAdded) {
                appointment = await appointment.
                populate({ path: 'allocatedStaff', select: 'name' })
                    .populate({ path: 'user', select: 'name' })
                    .execPopulate();
                appointments.push(appointment.toObject({ getters: true, setters: true }));
            }


            return new Response(null, appointments, false, 200);
        }
    },

    // todo: allow changing employee(s)
    editMany: async(appointmentsInputs) => {
        await validateInput(validators.editAppointmentsSchema, appointmentsInputs, validators.options);

        let updatedAppointments = [];

        // foreach faces issue with async/await
        for (const appointmentInput of appointmentsInputs) {
            let updatedFields = {};

            let appointment = await Appointment.findById(appointmentInput._id).exec();

            const isAlreadyFinished = appointment.isFinished;

            if (isAlreadyFinished)
                return new Response("Appointment Already Finished! Can't Edit!", null, false, 200);

            if (!appointment)
                return new Response("Appointment Not Found!",
                    null, false, 200);

            if (appointmentInput.state)
                updatedFields.state = appointmentInput.state;


            if (appointmentInput.date) {
                await Employee.emptyStaffAtDate(appointment.allocatedStaff, appointment.date);

                updatedFields.date = DateTime.fromISO(appointmentInput.date).toUTC()
                    .set({ minute: 0, second: 0, millisecond: 0 });

                Employee.addStaffAtDate(appointment.allocatedStaff, updatedFields.date);
            }

            if (appointmentInput.location)
                updatedFields.location = appointmentInput.location;

            if (appointmentInput.service) {
                if (appointmentInput.service != appointment.service) {
                    updatedFields.state = 0;

                    updatedFields.allocatedStaff = [];

                    updatedFields.service = appointmentInput.service;

                    updatedFields.date = DateTime.fromISO(appointment.date).toUTC()
                        .set({ minute: 0, second: 0, millisecond: 0 });

                    const departments = getServiceDepartments(appointmentInput.service);

                    // remove busy date from old staff
                    await Employee.emptyStaffAtDate(appointment.allocatedStaff, appointment.date);

                    // add new staff
                    const freeEmployeesPerDepartmentArray = await Employee.findFreeStaff(departments, updatedFields.date);

                    if (!freeEmployeesPerDepartmentArray)
                        return new Response("No Enough Free Employees at that time! Please Choose a later time",
                            null, false, 200);

                    await allocateAppointmentEmployees(updatedFields, freeEmployeesPerDepartmentArray);
                }
            }

            // the staff included in this array will be changed
            if (appointmentInput.allocatedStaff) {
                updatedFields.date = updatedFields.date ? updatedFields.date : DateTime.fromISO(appointment.date).toUTC();

                // allocatedStaff except ones to replace

                const staffIds = appointment.allocatedStaff.map(populatedStaffSubDoc => populatedStaffSubDoc.id);

                const updatedAllocatedStaff = staffIds.filter(function(staff) {
                    return !appointmentInput.allocatedStaff.includes(staff);
                })

                updatedFields.allocatedStaff = updatedAllocatedStaff;

                let departmentsOfOldEmployees = await Employee.find({
                    "_id": {
                        $in: appointmentInput.allocatedStaff
                    }
                }, 'department -_id');

                departmentsOfOldEmployees = departmentsOfOldEmployees.map(deptObj => deptObj.department);

                // find other free staff
                const freeEmployeesPerDepartmentArray = await Employee.findFreeStaff(departmentsOfOldEmployees, updatedFields.date);

                if (!freeEmployeesPerDepartmentArray)
                    return new Response("No Enough Free Employees at that time! Please Choose a later time", null, false, 200);

                // add a random employee from each required department
                await allocateAppointmentEmployees(updatedFields, freeEmployeesPerDepartmentArray);

                await Employee.emptyStaffAtDate(appointmentInput.allocatedStaff, updatedFields.date);

            }

            appointment.set(updatedFields);

            await appointment.save();

            updatedAppointments.push(appointment);

            if (appointment.isFinished)
                await Employee.emptyStaffAtDate(this.allocatedStaff, this.date);
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



function initializeAppointmentData(appointment) {
    appointment.state = 0;

    appointment.allocatedStaff = [];

    appointment.date = DateTime.fromISO(appointment.date).toUTC();

    appointment.date = appointment.date.set({ minute: 0, second: 0, millisecond: 0 });

}

async function allocateAppointmentEmployees(appointment, freeEmployeesPerDepartmentArray) {
    for (let departmentEmployees of freeEmployeesPerDepartmentArray) {
        departmentEmployees = departmentEmployees.employees;

        const randomEmployeeId = departmentEmployees[Math.floor(Math.random() * departmentEmployees.length)];

        appointment.allocatedStaff.push(randomEmployeeId);

        // add appointment date to busy date for employee
        await Employee.updateOne({ _id: randomEmployeeId }, { $push: { busyDates: appointment.date } }).exec();
    }
}

function getServiceDepartments(serviceInput) {
    const service = services.filter(serviceElement => serviceElement.name == serviceInput);

    const departmentsNeeded = service[0].departments;

    return departmentsNeeded;
}