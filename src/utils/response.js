class Response {
    constructor(message, data, error, statusCode) {
        this.statusCode = statusCode
        this.error = error
        this.message = message
        this.data = data
    }
}

module.exports = {
    Response
}