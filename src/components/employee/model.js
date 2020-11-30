const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const { serviceDepartments } = require('../../utils/services');


const EmployeeSchema = new Schema({
    name: {
        type: String
    },
    busyDates: [{
        type: Date
    }],
    department: {
        type: String,
        enum: serviceDepartments
    },
    shift: {
        start: {
            type: Number //format: 0830
        },
        end: {
            type: Number // format: 1230
        }
    }
});


EmployeeSchema.statics.findFreeStaff = async function(serviceDepartments, date) {
    let appointmentDate = date;

    const hourBeforeDate = appointmentDate.minus({ hours: 1 }),
        appointmentHour = appointmentDate.hour < 10 ? "0" + appointmentDate.hour : appointmentDate.hour,
        appointmentMinute = appointmentDate.minute < 10 ? "0" + appointmentDate.minute : appointmentDate.minute,
        dateHourandMinute = parseInt(appointmentHour.toString() +
            appointmentMinute.toString());


    // return format: freeEmployees[0].employees returns a department's free employees
    // for an employee to be returned here, he must be in a matching department, his shift 
    // must start before and end after the appointment, and he must not be busy
    // at that date (with the hour), or the hour before in that date
    const freeEmployees = await this.aggregate([{
            $match: {
                busyDates: { $nin: [appointmentDate, hourBeforeDate] },
                department: { $in: serviceDepartments },
                "shift.start": { $lt: dateHourandMinute },
                "shift.end": { $gt: dateHourandMinute }
            }
        },
        {
            $group: {
                _id: "$department",
                employees: { $push: "$_id" }
            }
        }
    ]).exec();

    // check if each service has at least 1 free employee
    let areEmployeesFromAllDepartmentsAvailable =
        serviceDepartments.every(service => freeEmployees.some(employee => employee._id == service))

    if (!areEmployeesFromAllDepartmentsAvailable) {
        return null;
    }

    if (!freeEmployees) return null;

    else return freeEmployees;
}

EmployeeSchema.statics.emptyStaffAtDate = async function(allocatedStaff, date) {
    await this.updateMany({ _id: { $in: allocatedStaff } }, { "$pull": { "busyDates": date } }, { multi: true }).exec();
    return;
}

EmployeeSchema.statics.addStaffAtDate = async function(allocatedStaff, date) {
    await this.updateMany({ _id: { $in: allocatedStaff } }, { "$push": { "busyDates": date } }, { multi: true }).exec();
    return;
}

module.exports = mongoose.model('Employee', EmployeeSchema, "employees");