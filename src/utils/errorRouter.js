// const { InputValidationError, 
//         EntityAlreadyExists, 
//         NotLoggedInError } = require('./errors');

const {
    InputValidationError,
    EntityAlreadyExistsError,
    NotLoggedInError
} = require('./errors');

const { Response } = require('./response')

module.exports = (err, req, res, next) => {
    switch (err.constructor) {
        case EntityAlreadyExistsError:
            return res.status(400).json(new Response(err.message, err.field, true))
        case InputValidationError:
            return res.status(400).json(new Response(err.message, err.field, true))
        case NotLoggedInError:
            return res.status(401).json(new Response(err.message, null, true))
        default:
            return res.status(500).json(new Response(err.message, null, true))
    }
}