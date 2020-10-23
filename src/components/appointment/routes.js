const express = require('express');
const router = express.Router({mergeParams: true})

const controller = require('./controller');

router.get('/', async(req,res) => {
    const result = await controller.getMany(req.query.limit, req.query.after, req.query.service);

    res.send(result);
})

router.get('/:id', async(req,res) => {
    const result = await controller.getOneById(req.params.id);

    res.send(result);
})

router.post('/', async(req,res) => {
    const result = await controller.addMany(req.body);

    res.send(result);
})

router.patch('/', async(req,res) => {
    const result = await controller.editMany(req.body);

    res.send(result);
})

router.delete('/', async(req,res) => {
    const result = await controller.removeMany(req.body);

    res.send(result);
})


module.exports = router;