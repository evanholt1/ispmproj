const express = require('express')
const router = express.Router()

const userRouter = require('../components/user/router');
const appointmentRouter = require('../components/appointment/routes');
const errorRouter = require('./errorRouter')

router.get('/', (req, res, next) => {
    res.render('Home')
})


router.use('/api/user', userRouter);
router.use('/api/appointment', appointmentRouter);



router.use(errorRouter)

module.exports = router;