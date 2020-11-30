const validators = require('./validation');
const { Response } = require('../../utils/response');
const { validateInput } = require('../../utils/validation');
const Employee = require('../employee/model');

module.exports = employeeController = {
    getOneById: async(id) => {
        await validateInput(validators.getOneEmployeeSchema, id, validators.options);

        const employee = await Employee.findById(id).lean().exec();

        return new Response(null, employee, false, 200)
    },

    getMany: async(queryParameters) => {
        await validateInput(validators.getManyEmployeesSchema, queryParameters, validators.options);

        let { limit, after, department } = queryParameters;

        limit = +limit; // to make sure limit is an int not string

        if (!department) {
            if (!limit)
                return new Response(null, await Employee.find().lean().exec(), false, 200);

            if (!after)
                return new Response(null, await Employee.find().limit(limit).lean().exec(), false, 200);

            let employees = await Employee.find({ _id: { $gt: after } }).limit(limit).lean().exec();

            // if an _id was deleted, find the documents after the _id just before the one deleted, returning the same results.
            while (!employees)
                employees = Employee.find({ _id: { $lt: after } }).sort({ _id: -1 }).limit(1).lean().exec();

            return new Response(null, employees, false, 200);
        } else {
            if (!limit)
                return new Response(null, await Employee.find({ department }).lean().exec(), false, 200);

            if (!after)
                return new Response(null, await Employee.find({ department }).limit(limit).lean().exec(), false, 200);

            let employees = await Employee.find({ department, _id: { $gt: after } }).limit(limit).lean().exec();

            // if an _id was deleted, find the documents after the _id just before the one deleted, returning the same results.
            while (!employees)
                employees = await Employee.find({ department, _id: { $lt: after } }).sort({ _id: -1 }).limit(1).lean().exec();

            return new Response(null, employees, false, 200);
        }
    },

    addMany: async(employeesInputs) => {
        await validateInput(validators.addEmployeesSchema, employeesInputs, validators.options);

        let employees = await Employee.create(employeesInputs);

        return new Response(null, employees, false, 200);

    },

    // todo: allow changing employee(s)
    editMany: async(employeesInputs) => {
        await validateInput(validators.editEmployeesSchema, employeesInputs, validators.options);

        let updatedEmployees = [];

        for (const employeeInput of employeesInputs) {
            let updatedEmployee = await Employee.findByIdAndUpdate(employeeInput._id, employeeInput, { new: true }).exec();

            updatedEmployees.push(updatedEmployee);
        }

        return new Response("Successfully updated selected employee", updatedEmployees, false, 200);
    },

    removeMany: async(employeesIds) => {
        await validateInput(validators.removeEmployeesSchema, employeesIds, validators.options);

        const employeesToDelete = await Employee.find({ _id: { $in: employeesIds } }).exec();

        employeesToDelete.forEach(employee => {
            employee.remove();

            employee = employee._doc;
        });

        return new Response(null, employeesToDelete, false, 200);
    }

}