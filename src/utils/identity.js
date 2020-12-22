const { Response } = require("./response");
const User = require("../components/user/model");
const Employee = require("../components/employee/model");

const regenerateSessionPromise = (req) => {
    return new Promise((resolve, reject) => {
        req.session.regenerate(function (err) {
            if (err) reject(err);

            resolve(null);
        });
    });
};

const saveSessionPromise = (req) => {
    return new Promise((resolve, reject) => {
        req.session.save(function (err) {
            if (err) reject(err);

            resolve(null);
        });
    });
};

exports.validateSession = async (req, res, next) => {
    if (!req.session._id)
        //return res.status(401).json("You are not logged in!");
        return res.status(401).redirect("/");

    const timeDifference =
        req.session.cookie.originalMaxAge - req.session.cookie.maxAge;

    if (timeDifference >= req.session.sessionDuration) {
        let info = req.session;

        await regenerateSessionPromise(req);

        req.session.cookie.maxAge = info.cookie.maxAge; // wont be entirely accurate as milliseconds will occur
        // during this change code. stacks on multiple changes
        req.session._id = info._id;
        req.session.sessionDuration = info.sessionDuration;
        req.session.role = info.role;
        req.session.name = info.name;

        await saveSessionPromise(req);

        return next();
    }
    return next();
};

exports.employeeAuthorization = async (req, res, next) => {
    if (req.session.role === "user")
        return new Response("User Not Authorized", null, true, 403);
    else next();
};

exports.adminAuthorization = async (req, res, next) => {
    if (req.session.role !== "admin")
        return new Response("User Not Authorized", null, true, 403);
    else next();
};
