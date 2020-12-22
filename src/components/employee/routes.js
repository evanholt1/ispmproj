const express = require('express');
const router = express.Router({ mergeParams: true })

const controller = require('./controller');
const { validateSession, employeeAuthorization, adminAuthorization } = require('../../utils/identity');
const { serviceDepartments } = require('../../utils/services')

router.get('/', validateSession, employeeAuthorization, async(req, res, next) => {
    try {
        const result = await controller.getMany(req.query);

        const { statusCode, ...response } = result;

        //res.status(statusCode).json(response);
        res.status(statusCode).render('employee', {
            sessionData: req.session,
            data: response.data,
            departments: serviceDepartments
        });
    } catch (err) {
        next(err);
    }
})

router.get('/:id', validateSession, employeeAuthorization, async(req, res, next) => {
    try {
        const result = await controller.getOneById(req.params.id);

        const { statusCode, ...response } = result;

        res.status(statusCode).json(response);
    } catch (err) {
        next(err);
    }
})

router.post('/', validateSession, adminAuthorization, async(req, res, next) => {
    try {
        const result = await controller.addMany(req.body);

        const { statusCode, ...response } = result;

        res.status(statusCode).json(response);
    } catch (err) {
        next(err);
    }
});

router.patch('/', validateSession, adminAuthorization, async(req, res, next) => {
    try {
        const result = await controller.editMany(req.body);

        const { statusCode, ...response } = result;

        res.status(statusCode).json(response);
    } catch (err) {
        next(err);
    }
});

router.delete('/', validateSession, adminAuthorization, async(req, res, next) => {
    try {
        const result = await controller.removeMany(req.body);

        const { statusCode, ...response } = result;

        res.status(statusCode).json(response);
    } catch (err) {
        next(err);
    }
});


module.exports = router;