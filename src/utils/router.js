const express = require('express')
const router = express.Router()

const userRouter = require('../components/user/router');
const appointmentRouter = require('../components/appointment/routes');
const employeeRouter = require('../components/employee/routes');
const errorRouter = require('./errorRouter')

<<<<<<< HEAD
router.use('/user', userRouter);
router.use('/appointment', appointmentRouter);
router.use('/employee', employeeRouter);
=======
router.get('/', (req, res, next) => {
    res.render('Home')
})


router.use('/api/user', userRouter);
router.use('/api/appointment', appointmentRouter);



>>>>>>> 695286ff4f260e189e8a57e7cdd46a4b70c52228
router.use(errorRouter)

module.exports = router;