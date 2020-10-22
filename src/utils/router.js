const express = require('express')
const router = express.Router()

const userRouter = require('../components/User/router');
const hospitalRouter = require('../components/hospital/routes');

router.use('/user', userRouter);
router.use('/hospital', hospitalRouter);

module.exports = router;