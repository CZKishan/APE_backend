const constants = require('../../constants');
const resHndlr = require('../../handlers/responseHandler')
const joi = require('@hapi/joi')


/**for validation error handler */
function validationErrorHandler(res, error) {
    resHndlr.sendError(res, resHndlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, error.details ? error.details[0].message : 'There is some issue in validation.', {}));
}

/** check mongoose ObjectId is valid */
async function validateArticleId(req, res, next) {
    try {
        // create schema for id parameter
        const schema = joi.object({
            article_id: joi.string().length(24).required()
                .messages({
                    'string.length': constants.MESSAGES.invalidId,
                    'string.empty': constants.MESSAGES.articleIdRequired,
                    'any.required': constants.MESSAGES.articleIdRequired
                })
        });
        await schema.validateAsync(req.body, { allowUnknown: true })
        next();
    } catch (error) {
        validationErrorHandler(res, error);
    }
}

// article_id

async function validateArticleIds(req, res, next) {
    try {
        // create schema for id parameter
        const schema = joi.object({
            article_id: joi.array().items(joi.string().length(24)).required().messages({
                'any.required': constants.MESSAGES.articleIdRequired,
                'string.length': constants.MESSAGES.articleIdInvalid,

            }).min(1)
        });
        await schema.validateAsync(req.body, { allowUnknown: true })
        next();
    } catch (error) {
        validationErrorHandler(res, error);
    }
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


async function typeValidate(req, res, next) {
    try {
        // create schema for id parameter
        const schema = joi.object({
            type: joi.string().required().valid(constants.ARTICLE_LIKE_TYPE.LIKE,constants.ARTICLE_LIKE_TYPE.DISLIKE)
                .messages({
                    'string.length': constants.MESSAGES.invalidType,
                    'string.empty': constants.MESSAGES.typeRequired,
                    'any.required': constants.MESSAGES.typeRequired
                })
        });
        await schema.validateAsync(req.body, { allowUnknown: true })
        next();
    } catch (error) {
        validationErrorHandler(res, error);
    }
}
module.exports = {
    validateArticleId,
    validateArticleIds,
    validateId,
    typeValidate
}

