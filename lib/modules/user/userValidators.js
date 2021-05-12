
// ===================================Load Internal Modules===================================================================
const moduleMsg = require('./userConstants');
const constants = require('../../constants');
const resHndlr = require('../../handlers/responseHandler');
const regExValidator = require('../../utils/regularExpression');
const joi = require('@hapi/joi');




/**for validation error handler */
function validationErrorHandler(res, error) {
    console.log('User Module ErrorLog : ', error); // Dont remove this line of console.
    resHndlr.sendError(res, resHndlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, error.details ? error.details[0].message : 'There is some issue in validation.', {}));
}

async function validateAddUser(req, res, next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            user_email: joi.string().required().pattern(regExValidator.emailRegEx).empty()
                .messages({
                    'string.empty': constants.MESSAGES.emailCantEmpty,
                    'any.required': constants.MESSAGES.emailCantEmpty,
                    'string.pattern.base': constants.MESSAGES.invalidEmail,
                }),
            user_name: joi.string().required().empty()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.userNameRequired,
                    'any.required': moduleMsg.MESSAGES.userNameRequired
                }),
        })
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        validationErrorHandler(res, error);
    }
}

async function validateSignUpData(req, res, next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            user_email: joi.string().required().pattern(regExValidator.emailRegEx).empty()
                .messages({
                    'string.empty': constants.MESSAGES.emailCantEmpty,
                    'any.required': constants.MESSAGES.emailCantEmpty,
                    'string.pattern.base': constants.MESSAGES.invalidEmail,
                }),
                user_first_name: joi.string().required().empty()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.userFirstnameRequired,
                    'any.required': moduleMsg.MESSAGES.userFirstnameRequired
                }),
                user_last_name: joi.string().required().empty()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.userLastnameRequired,
                    'any.required': moduleMsg.MESSAGES.userLastnameRequired
                }),
            user_password: joi.string().required().pattern(regExValidator.passwordAppRegEx).empty()
                .messages({
                    'string.empty': constants.MESSAGES.passCantEmpty,
                    'any.required': constants.MESSAGES.passCantEmpty,
                    'string.pattern.base': constants.MESSAGES.invalidPassword,
                }),

            user_device_id: joi.string().empty()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.userDeviceIdRequired,
                    'any.required': moduleMsg.MESSAGES.userDeviceIdRequired
                }),
            user_device_type: joi.string().empty()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.userDeviceTypeRequired,
                    'any.required': moduleMsg.MESSAGES.userDeviceTypeRequired
                }),
            user_device_token: joi.string().empty()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.userDeviceTokenRequired,
                    'any.required': moduleMsg.MESSAGES.userDeviceTokenRequired
                }),

        })
        await schema.validateAsync(req.body);
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }
}



async function validateSignInData(req, res, next) {
    try {
        // create schema for email validation
        let obj = {
            // user_device_id: joi.string().empty()
            //     .messages({
            //         'string.empty': moduleMsg.MESSAGES.userDeviceIdRequired,
            //         'any.required': moduleMsg.MESSAGES.userDeviceIdRequired
            //     }),
            // user_device_type: joi.string().empty()
            //     .messages({
            //         'string.empty': moduleMsg.MESSAGES.userDeviceTypeRequired,
            //         'any.required': moduleMsg.MESSAGES.userDeviceTypeRequired
            //     }),
            // user_device_token: joi.string().empty()
            //     .messages({
            //         'string.empty': moduleMsg.MESSAGES.userDeviceTokenRequired,
            //         'any.required': moduleMsg.MESSAGES.userDeviceTokenRequired
            //     }),
            user_register_via: joi.string().empty()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.registerViaRequired,
                    'any.required': moduleMsg.MESSAGES.registerViaRequired
                }),
            user_email: joi.string().pattern(regExValidator.emailRegEx).empty()
                .messages({
                    'string.empty': constants.MESSAGES.emailCantEmpty,
                    'any.required': constants.MESSAGES.emailCantEmpty,
                    'string.pattern.base': constants.MESSAGES.invalidEmail,
                })
        }

        if (req.body.user_register_via != '') {
            // if normal login
            if (req.body.user_register_via == constants.REGISTERED_VIA.NORMAL) {
                obj.user_password = joi.string().required().pattern(regExValidator.passwordAppRegEx).empty()
                    .messages({
                        'string.empty': constants.MESSAGES.passCantEmpty,
                        'any.required': constants.MESSAGES.passCantEmpty,
                        'string.pattern.base': constants.MESSAGES.invalidPassword,
                    });
            }
            // if facebook  login
            else if (req.body.user_register_via == constants.REGISTERED_VIA.FACEBOOK) {

                obj.user_name = joi.string().required().empty()
                    .messages({
                        'string.empty': moduleMsg.MESSAGES.userNameRequired,
                        'any.required': moduleMsg.MESSAGES.userNameRequired
                    });

                obj.user_account_id = joi.string().required().empty()
                    .messages({
                        'string.empty': moduleMsg.MESSAGES.facebookAccountIdRequired,
                        'any.required': moduleMsg.MESSAGES.facebookAccountIdRequired
                    });
            }
            // if google login
            else if (req.body.user_register_via == constants.REGISTERED_VIA.GOOGLE) {

                obj.user_name = joi.string().required().empty()
                    .messages({
                        'string.empty': moduleMsg.MESSAGES.userNameRequired,
                        'any.required': moduleMsg.MESSAGES.userNameRequired
                    });

                obj.user_account_id = joi.string().required().empty()
                    .messages({
                        'string.empty': moduleMsg.MESSAGES.googleAccountIdRequired,
                        'any.required': moduleMsg.MESSAGES.googleAccountIdRequired
                    });

            }
        }


        const schema = joi.object(obj);
        await schema.validateAsync(req.body, { allowUnknown: true });
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }
}

// /**check page mandatory field  */
async function validateResetPassword(req, res, next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            user_email: joi.string().required().pattern(regExValidator.emailRegEx).empty()
                .messages({
                    'string.empty': constants.MESSAGES.emailCantEmpty,
                    'any.required': constants.MESSAGES.emailCantEmpty,
                    'string.pattern.base': constants.MESSAGES.invalidEmail,
                }),
            user_password: joi.string().pattern(regExValidator.passwordAppRegEx).required()
                .messages({
                    'string.empty': constants.MESSAGES.passCantEmpty,
                    'any.required': constants.MESSAGES.passCantEmpty,
                    'string.pattern.base': constants.MESSAGES.invalidPassword
                }),
            user_confirm_password: joi.string().pattern(regExValidator.passwordAppRegEx).required()
                .messages({
                    'string.pattern.base': moduleMsg.MESSAGES.confPasswordPattern,
                    'string.empty': moduleMsg.MESSAGES.confPasswordCantEmpty,
                    'any.required': moduleMsg.MESSAGES.confPasswordCantEmpty
                }),
        })
        await schema.validateAsync(req.body, { allowUnknown: true });
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

/**check page mandatory field  */
async function validateForgotPassword(req, res, next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            user_email: joi.string().pattern(regExValidator.emailRegEx).required()
                .messages({
                    'string.empty': constants.MESSAGES.emailCantEmpty,
                    'any.required': constants.MESSAGES.emailCantEmpty,
                    'string.pattern.base': constants.MESSAGES.invalidEmail,
                }),
        })
        await schema.validateAsync(req.body);
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }
}


async function validateOtp(req, res, next) {

    try {
        // create schema for email validation
        const schema = joi.object({
            user_otp: joi.string().length(6).required()
                .messages({
                    'string.length': constants.MESSAGES.invalidOtp,
                    'string.empty': constants.MESSAGES.otpRequired,
                    'any.required': constants.MESSAGES.otpRequired,
                }),
        })
        await schema.validateAsync(req.body);
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }
}

async function changeUserAppLanguageValidate(req, res, next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            app_language_id: joi.string().length(24).required()
                .messages({
                    'string.length': constants.MESSAGES.invalidId,
                    'string.empty': moduleMsg.MESSAGES.langIdRequired,
                    'any.required': moduleMsg.MESSAGES.langIdRequired,
                }),
        })
        await schema.validateAsync(req.body, { allowUnknown: true });
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }
}


async function changeUserNewsLanguageValidate(req, res, next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            user_news_languages: joi.array().items(joi.string().length(24)).required().messages({
                'any.required': moduleMsg.MESSAGES.newsLangIdRequired,
            }).min(1)
        })
        await schema.validateAsync(req.body, { allowUnknown: true });
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }
}

async function userInterestedTopicsValidate(req, res, next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            user_follow_topics: joi.array().items(joi.string().length(24)).required().messages({
                'any.required': moduleMsg.MESSAGES.topicIdRequired,
            })
        })
        await schema.validateAsync(req.body, { allowUnknown: true });
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }
}


async function userInterestedLocationValidate(req, res, next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            user_location_id: joi.string().length(24).required()
                .messages({
                    'string.length': constants.MESSAGES.invalidId,
                    'string.empty': moduleMsg.MESSAGES.locationIdRequired,
                    'any.required': moduleMsg.MESSAGES.locationIdRequired,
                }),
        })
        await schema.validateAsync(req.body, { allowUnknown: true });
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }

}

async function userInterestedPublicationValidate(req, res, next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            user_publication_id: joi.string().length(24).required()
                .messages({
                    'string.length': constants.MESSAGES.invalidId,
                    'string.empty': moduleMsg.MESSAGES.publicationIdRequired,
                    'any.required': moduleMsg.MESSAGES.publicationIdRequired,
                }),
        })
        await schema.validateAsync(req.body, { allowUnknown: true });
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }

}


async function userEditProfileValidate(req, res, next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            user_email: joi.string().pattern(regExValidator.emailRegEx).allow(null, '')
                .messages({
                    // 'string.empty': constants.MESSAGES.emailCantEmpty,
                    // 'any.required': constants.MESSAGES.emailCantEmpty,
                    'string.pattern.base': constants.MESSAGES.invalidEmail,
                }),
            user_password: joi.string().pattern(regExValidator.passwordAppRegEx)
                .messages({
                    'string.empty': constants.MESSAGES.passCantEmpty,
                    // 'any.required': constants.MESSAGES.passCantEmpty,
                    'string.pattern.base': constants.MESSAGES.invalidPassword,
                }),
            user_new_password: joi.string().pattern(regExValidator.passwordAppRegEx).allow(null, '')
                .messages({
                    // 'string.empty': constants.MESSAGES.passCantEmpty,
                    // 'any.required': constants.MESSAGES.passCantEmpty,
                    'string.pattern.base': constants.MESSAGES.invalidNewPassword,
                }),
            user_confirm_password: joi.string().pattern(regExValidator.passwordAppRegEx).allow(null, '')
                .messages({
                    'string.pattern.base': moduleMsg.MESSAGES.confPasswordPattern,
                    // 'string.empty': moduleMsg.MESSAGES.confPasswordCantEmpty,
                    // 'any.required': moduleMsg.MESSAGES.confPasswordCantEmpty
                })

        })
        await schema.validateAsync(req.body, { allowUnknown: true });
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }
}

async function userCreateBundleValidate(req, res, next) {

    try {
        // create schema for email validation
        const schema = joi.object({
            bundle_name: joi.string().required()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.bundleNameRequired,
                    'any.required': moduleMsg.MESSAGES.bundleNameRequired,
                }),
            bundle_status: joi.string().required().valid(constants.BUNDLE_STATUS.PRIVATE, constants.BUNDLE_STATUS.PUBLIC)
                .messages({
                    'string.empty': moduleMsg.MESSAGES.bundleStatusRequired,
                    'any.required': moduleMsg.MESSAGES.bundleStatusRequired,
                }),
        })
        await schema.validateAsync(req.body, { allowUnknown: true });
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }

}

async function userEditBundleValidate(req, res, next) {

    try {
        let obj = {};

        if (req.body.bundle_name) {
            obj.bundle_name = joi.string().required()
                .messages({
                    'string.empty': moduleMsg.MESSAGES.bundleNameRequired,
                    'any.required': moduleMsg.MESSAGES.bundleNameRequired,
                });
        }

        if (req.body.bundle_status) {
            obj.bundle_status = joi.string().required().valid(constants.BUNDLE_STATUS.PRIVATE, constants.BUNDLE_STATUS.PUBLIC)
                .messages({
                    'string.empty': moduleMsg.MESSAGES.bundleStatusRequired,
                    'any.required': moduleMsg.MESSAGES.bundleStatusRequired,
                });
        }

        const schema = joi.object(obj)
        await schema.validateAsync(req.body, { allowUnknown: true });
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }

}

async function validateBundleType(req, res, next) {

    try {
        let obj = {};

        obj.type = joi.string().required().valid(constants.BUNDLE_TYPE.MYBUNDLE, constants.BUNDLE_TYPE.SAVED)
            .messages({
                'string.empty': constants.MESSAGES.typeRequired,
                'any.required': constants.MESSAGES.typeRequired,
            });

        const schema = joi.object(obj)
        await schema.validateAsync(req.body, { allowUnknown: true });
        next();

    } catch (error) {
        validationErrorHandler(res, error);
    }

}

async function validateEmail(req,res,next) {
    try {
        // create schema for email validation
        const schema = joi.object({
            user_email: joi.string().required().pattern(regExValidator.emailRegEx).empty()
                .messages({
                    'string.empty': constants.MESSAGES.emailCantEmpty,
                    'any.required': constants.MESSAGES.emailCantEmpty,
                    'string.pattern.base': constants.MESSAGES.invalidEmail,
                })
        })
        await schema.validateAsync(req.body, { allowUnknown: true });
        next();
    } catch (error) {
        validationErrorHandler(res, error);
    }
}
//========================== Export Module Start ==============================

module.exports = {
    validateAddUser,

    //------application
    validateSignUpData,
    validateId,
    validateSignInData,
    validateResetPassword,
    validateForgotPassword,
    validateOtp,
    changeUserAppLanguageValidate,
    changeUserNewsLanguageValidate,
    userInterestedTopicsValidate,
    userInterestedLocationValidate,
    userInterestedPublicationValidate,
    userEditProfileValidate,
    userCreateBundleValidate,
    userEditBundleValidate,
    validateBundleType,
    validateEmail
}
