const express = require("express");
const router = express.Router({ mergeParams: true });

const controller = require("./controller");
const {
    validateSession,
    employeeAuthorization,
} = require("../../utils/identity");
const { serviceDepartments, serviceNames } = require("../../utils/services");

router.get("/", async (req, res, next) => {
    try {
        const result = await controller.getMany(req.query);

        const { statusCode, ...response } = result;

        //res.status(statusCode).json(response);
        res.status(statusCode).render("appointment", {
            sessionData: req.session,
            data: response.data,
            services: serviceNames,
            isUserPage: false,
        });
    } catch (err) {
        next(err);
    }
});

router.get("/user/:userId", validateSession, async (req, res, next) => {
    try {
        const result = await controller.getUserMany(req.params.userId);

        const { statusCode, ...response } = result;

        //res.status(statusCode).json(response);
        res.status(statusCode).render("appointment", {
            sessionData: req.session,
            data: response.data,
            services: serviceNames,
            isUserPage: true,
        });
    } catch (err) {
        next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const result = await controller.getOneById(req.params.id);

        const { statusCode, ...response } = result;

        res.status(statusCode).json(response);
    } catch (err) {
        next(err);
    }
});

router.post("/", validateSession, async (req, res, next) => {
    try {
        const result = await controller.addMany(req.body);

        const { statusCode, ...response } = result;

        res.status(statusCode).json(response);
    } catch (err) {
        next(err);
    }
});

router.patch("/", validateSession, async (req, res, next) => {
    try {
        const result = await controller.editMany(req.body);

        const { statusCode, ...response } = result;

        res.status(statusCode).json(response);
    } catch (err) {
        next(err);
    }
});

router.delete("/", validateSession, async (req, res, next) => {
    try {
        const result = await controller.removeMany(req.body);

        const { statusCode, ...response } = result;

        res.status(statusCode).json(response);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
