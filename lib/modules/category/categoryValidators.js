
// ===================================Load Internal Modules===================================================================
const constants = require('../../constants');
const resHndlr = require('../../handlers/responseHandler')
const joi = require('@hapi/joi')


/**for validation error handler */
function validationErrorHandler(res, error) {
    resHndlr.sendError(res, resHndlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, error.details ? error.details[0].message : 'There is some issue in validation.', {}));
}

/** check mongoose ObjectId is valid */
async function validateId(req, res, next) {
    try {
        // create schema for id parameter
        const schema = joi.object({
            id: joi.string().length(24).required()
                .messages({
                    'string.length': constants.MESSAGES.invalidId,
                    'string.empty': constants.MESSAGES.emptyId,
                    'any.required': constants.MESSAGES.emptyId
                })
        });
        await schema.validateAsync(req.params, { allowUnknown: true })
        next();
    } catch (error) {
        validationErrorHandler(res, error);
    }
}

/**check status field  */
async function checkStatus(req, res, next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            category_status: joi.string().required()
                .messages({
                    'string.empty': constants.MESSAGES.emptyStatus,
                    'any.required': constants.MESSAGES.emptyStatus
                }),
        })
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        validationErrorHandler(res, error);
    }
}


module.exports = {
    validateId,
    checkStatus
}

