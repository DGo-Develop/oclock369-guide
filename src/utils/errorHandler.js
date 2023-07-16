class ErrorHandler {
    constructor(logger) {
        this.logger = logger;
    }

    logAndThrowError(message) {
        this.logger.error(message);
        throw new Error(message);
    }
}

module.exports = ErrorHandler;
