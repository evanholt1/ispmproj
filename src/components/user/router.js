const express = require('express')
const router = express.Router({mergeParams: true})

const controller = require('./controller');

router.post('/signup', async (req,res) => {
    const result = await controller.signup(req.body);

    res.status(result.status).json(result.message);
})

router.post('/signin', async (req,res) => {
    const result = await controller.signin(req.body, req);

    res.status(result.status).json(result.message);
})

router.post('/signout', async (req,res) => {
    const result = await controller.signout(req, res);
    console.log(result);
    res.status(result.status).json(result.message);
})


module.exports = router;