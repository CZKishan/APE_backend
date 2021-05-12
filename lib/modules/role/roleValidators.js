//========================== Load Modules Start ===========================

const resHndlr = require("../../handlers/responseHandler");
const constants = require("../../constants")
const joi = require('@hapi/joi');
const moduleMsg = require("./roleConstants")
//========================== Load Modules End =============================
/**for validation error handler */
function validationErrorHandler(res, error) {
    resHndlr.sendError(res, resHndlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, error.details ? error.details[0].message : 'There is some issue in validation.', {}));
}

/**check page mandatory field  */
async function checkValidateDetails(req, res, next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            role_name: joi.required()
                .messages({
                    'empty': moduleMsg.MESSAGES.emptyRoleName,
                    'any.required': moduleMsg.MESSAGES.emptyRoleName
                }),
            role_slug: joi.string().required()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.emptyRoleSlug,
                    'any.required': moduleMsg.MESSAGES.emptyRoleSlug
                }),
            role_permissions: joi.required(),
        })
        await schema.validateAsync(req.body);
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }
}

// /** check mongoose ObjectId is valid */
async function validateId(req, res, next) {
    try {
        // create schema for id parameter
        const schema = joi.object({
            id: joi.string().required()
                .messages({ 
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
async function checkStatus(req,res,next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            role_status: joi.string().required()
                .messages({
                    'string.empty': constants.MESSAGES.emptyStatus,
                    'any.required': constants.MESSAGES.emptyStatus
                })
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

