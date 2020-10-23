const express = require('express')
const router = express.Router()

const userRouter = require('../components/user/router');
const hospitalRouter = require('../components/hospital/routes');
const appointmentRouter = require('../components/appointment/routes');

router.use('/user', userRouter);
router.use('/hospital', hospitalRouter);
router.use('/appointment', appointmentRouter);

module.exports = router;