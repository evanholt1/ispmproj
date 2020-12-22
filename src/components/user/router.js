const express = require('express')
const router = express.Router({ mergeParams: true })

const controller = require('./controller');
const { validateSession } = require('../../utils/identity');

router.post('/signup', async(req, res, next) => {
    try {
        const result = await controller.signup(req.body);

        const { statusCode, ...response } = result;

        //res.status(statusCode).json(response);
        res.status(statusCode).redirect('/');
    } catch (err) {
        next(err);
    }
})

router.post('/signin', async(req, res, next) => {
    try {
        const result = await controller.signin(req.body, req);

        const { statusCode, ...response } = result;

        //res.status(statusCode).json(response);
        if (req.session.role === "user")
            res.status(statusCode).redirect('/bookAppointment');
        else
            res.status(statusCode).redirect('/employee');
    } catch (err) {
        next(err);
    }
})

router.post('/signout', validateSession, async(req, res) => {
    try {
        const result = await controller.signout(req, res);

        const { statusCode, ...response } = result;

        //res.status(statusCode).json(response);
        res.redirect('/')
    } catch (err) {
        next(err);
    }
})


module.exports = router;