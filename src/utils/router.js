const express = require('express')
const router = express.Router()

const userRouter = require('../components/user/router');
const appointmentRouter = require('../components/appointment/routes');
const errorRouter = require('./errorRouter')

router.use('/user', userRouter);
router.use('/appointment', appointmentRouter);
router.use(errorRouter)

module.exports = router;