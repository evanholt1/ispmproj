// all errors include the 'field' property, which will become the 'data' property in the response
// i.e: errors return the field they failed at.

/* used for all input validation failures */
class InputValidationError extends Error {
    constructor(field, message, ...params) {
        super(params)
        this.field = field
        this.name = "InputValidationError"
        this.message = message
    }
}

/* user error classes */
class EntityAlreadyExistsError extends Error {
    constructor(field, entity, ...params) {
        super(params)
        this.field = field
        this.message = entity + " Already Exists"
    }
}

class EntityDoesntExistError extends Error {
    constructor(entity, ...params) {
        super(params)
        this.message = entity + " Does Not Exist"
    }
}

class NotLoggedInError extends Error {
    constructor(...params) {
        super(params)
        this.message = "User Is Not Logged In!"
    }
}


module.exports = errors = {
    InputValidationError,
    EntityAlreadyExistsError,
    EntityDoesntExistError,
    NotLoggedInError
}