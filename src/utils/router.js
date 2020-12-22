const express = require('express')
const router = express.Router()

const userRouter = require('../components/user/router');
const appointmentRouter = require('../components/appointment/routes');
const employeeRouter = require('../components/employee/routes');
const errorRouter = require('./errorRouter')
const { validateSession, employeeAuthorization, adminAuthorization } = require('./identity');
const { serviceNames } = require('./services')

router.get('/', (req, res, next) => {
    res.render('Home', {
        sessionData: req.session
    })
})

router.get('/bookAppointment', validateSession, (req, res, next) => {
    res.render('bookAppointment', {
        sessionData: req.session,
        services: serviceNames
    })
})


// router.get('/employees', validateSession, employeeAuthorization, (req, res, next) => {
//     res.render('employee', {
//         sessionData: req.session
//     })
// })

router.use('/user', userRouter);
router.use('/appointment', appointmentRouter);
router.use('/employee', employeeRouter);


router.use(errorRouter)

module.exports = router;