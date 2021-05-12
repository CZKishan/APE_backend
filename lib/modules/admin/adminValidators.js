// ===================================Load Internal Modules===================================================================
const moduleMsg = require('./adminConstants');
const constants = require('../../constants');
const resHndlr = require('../../handlers/responseHandler')
const regExValidator = require('../../utils/regularExpression')
const joi = require('@hapi/joi')

//========================== Load Modules End =============================

/**for validation error handler */
function validationErrorHandler(res, error) {
    console.log('User Module ErrorLog : ', error); // Dont remove this line of console.
    resHndlr.sendError(res, resHndlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, error.details ? error.details[0].message : 'There is some issue in validation.', {}));
}

/**check page mandatory field  */
async function validateLoginData(req, res, next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            user_email: joi.string().pattern(regExValidator.emailRegEx).required()
                .messages({
                    'string.pattern.base': constants.MESSAGES.invalidEmail,
                    'string.empty': constants.MESSAGES.emailCantEmpty,
                    'any.required': constants.MESSAGES.emailCantEmpty
                }),
            // .pattern(regExValidator.passwordRegEx)
            user_password: joi.string().pattern(regExValidator.passwordRegEx).required()
                .messages({
                    'string.pattern.base': moduleMsg.MESSAGES.passwordPattern,
                    'string.empty': moduleMsg.MESSAGES.passwordCantEmpty,
                    'any.required': moduleMsg.MESSAGES.passwordCantEmpty
                }),
        })
        await schema.validateAsync(req.body);
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }
}


/**check page mandatory field  */
async function validateForgotPassword(req, res, next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            user_email: joi.string().pattern(regExValidator.emailRegEx).required()
                .messages({
                    'string.pattern.base': moduleMsg.MESSAGES.passwordPattern,
                    'string.empty': moduleMsg.MESSAGES.passwordCantEmpty,
                    'any.required': moduleMsg.MESSAGES.passwordCantEmpty
                }),
        })
        await schema.validateAsync(req.body);
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }
}
/**check page mandatory field  */
async function validateResetPassword(req, res, next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            user_password: joi.string().pattern(regExValidator.passwordRegEx).required()
                .messages({
                    'string.pattern.base': moduleMsg.MESSAGES.passwordPattern,
                    'string.empty': moduleMsg.MESSAGES.passwordCantEmpty,
                    'any.required': moduleMsg.MESSAGES.passwordCantEmpty
                }),
            user_confirm_password: joi.string().pattern(regExValidator.passwordRegEx).required()
                .messages({
                    'string.pattern.base': moduleMsg.MESSAGES.confPasswordPattern,
                    'string.empty': moduleMsg.MESSAGES.confPasswordCantEmpty,
                    'any.required': moduleMsg.MESSAGES.confPasswordCantEmpty
                }),
        })
        await schema.validateAsync(req.body);
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
            user_status: joi.string().required()
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




// /**  Operator/Driver/Rider Edit profile */

// /**check page mandatory field  */
async function validateEditUserProfile(req, res, next) {
    try {
        //create schema for validation.
        const schema = joi.object({
            user_first_name: joi.string().required()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.emptyFirstName,
                    'any.required': moduleMsg.MESSAGES.emptyFirstName
                }),
                user_last_name: joi.string().required()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.emptyLastName,
                    'any.required': moduleMsg.MESSAGES.emptyLastName
                }),

            user_email: joi.string().required().pattern(regExValidator.emailRegEx)
                .messages({
                    'string.pattern.base': constants.MESSAGES.invalidEmail,
                    'string.empty': constants.MESSAGES.emailCantEmpty,
                    'any.required': constants.MESSAGES.emailCantEmpty
                }),
                user_isd_code: joi.string().required()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.emptyIsdCode,
                    'any.required': moduleMsg.MESSAGES.emptyIsdCode
                }),
                user_phone_number: joi.string().required().pattern(regExValidator.phoneRegEx)
                .messages({
                    'string.pattern.base': constants.MESSAGES.invalidMobile,
                    'string.empty': constants.MESSAGES.emptyPhoneNumber,
                    'any.required': constants.MESSAGES.emptyPhoneNumber
                }),

                user_role_id: joi.number().required()
                .messages({
                    'number.empty': moduleMsg.MESSAGES.emptyRoleId,
                    'any.required': moduleMsg.MESSAGES.emptyRoleId
                }),
                user_country_id: joi.string().required()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.emptyCountry,
                    'any.required': moduleMsg.MESSAGES.emptyCountry
                })
        });
        // let imgSchema = joi.object({
        //     user_profileImage: joi.required(),
        // })
        await schema.validateAsync(req.body,{allowUnknown: true});
        // await imgSchema.validateAsync(req.files);
        next();
    } catch (err) {
        validationErrorHandler(res, err);
    }
}




//========================== Export Module Start ==============================

module.exports = {
    validateLoginData,
    validateResetPassword,
    validateForgotPassword,
        checkStatus,
        validateId,
        validateEditUserProfile
}

//========================== Export Module End ===============================