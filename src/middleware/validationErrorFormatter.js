// src/middleware/validationErrorFormatter.js
const { validationResult } = require('express-validator');
const httpResponse = require('../utils/httpResponse');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(error => {
            return {
                field: error.path,
                message: error.msg, 
                valueError: error.value
            };
        });

        return httpResponse.badRequest(res, formattedErrors);
    }

    next();
};
