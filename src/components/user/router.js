const express = require('express')
const router = express.Router({mergeParams: true})

const controller = require('./controller');

router.post('/signup', async (req,res,next) => {
    try {
        const result = await controller.signup(req.body);

        const { statusCode, ...response } = result;

        res.status(statusCode).json(response);
    }
    catch(err) {
        next(err);
    }
})

router.post('/signin', async (req, res, next) => {
    try {
        const result = await controller.signin(req.body, req);

        const { statusCode, ...response } = result;

        res.status(statusCode).json(response);
    }
    catch(err) {
        next(err);
    }
})

router.post('/signout', async (req,res) => {
    try {
        const result = await controller.signout(req, res);

        const { statusCode, ...response } = result;

        res.status(statusCode).json(response);
    }
    catch(err) {
        next(err);
    }
})


module.exports = router;