//========================== Load Modules Start ===========================
const resHndlr =require("../../handlers/responseHandler");
const moduleMsg = require("./permissionConstants")
const constants = require("../../constants")
const joi = require('@hapi/joi');

//========================== Load Modules End =============================
/**for validation error handler */
function validationErrorHandler(res, error) {
    resHndlr.sendError(res, resHndlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, error.details ? error.details[0].message : 'There is some issue in validation.', {}));
}

/**check page mandatory field  */
async function checkValidateDetails(req, res, next) {
    try {
        // create schema for city validation
        const schema = joi.object({
            permission_name: joi.required()
                .messages({
                    'empty': moduleMsg.MESSAGES.emptyPermissionName,
                    'any.required': moduleMsg.MESSAGES.emptyPermissionName
                }),
            permission_title: joi.required()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.emptyPermissionCode,
                    'any.required': moduleMsg.MESSAGES.emptyPermissionCode
                }),
            permission_level: joi.required()
                .messages({
                    'empty': moduleMsg.MESSAGES.emptyPermissionLevel,
                    'any.required': moduleMsg.MESSAGES.emptyPermissionLevel
                }),
                permission_parent_id: joi.string().length(24)
                .messages({
                    'string.length': moduleMsg.MESSAGES.emptyId,
                    'string.empty': moduleMsg.MESSAGES.emptyId,
                    
                }),
                
        })
        await schema.validateAsync(req.body);
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
                    'string.length': moduleMsg.MESSAGES.emptyId,
                    'string.empty': moduleMsg.MESSAGES.emptyId,
                    'any.required': moduleMsg.MESSAGES.emptyId
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
            permission_status: joi.string().required()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.emptyStatus,
                    'any.required': moduleMsg.MESSAGES.emptyStatus
                }),
        })
        await schema.validateAsync(req.body);
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }
}

//========================== Export Module Start ==============================

module.exports = {
    checkValidateDetails, /** for validate empty */
    validateId, /** for validate Id */
    checkStatus, /**for check status */
};

//========================== Export Module End ===============================