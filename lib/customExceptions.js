//========================== Load Modules Start ===========================

//========================== Load Internal Module =========================

// Load exceptions
var Exception = require("./generic/Exception");
var constants = require("./constants");

//========================== Load Modules End =============================

//========================== Export Module Start ===========================

module.exports = {
    intrnlSrvrErr: function (err) {
        return new Exception(1, constants.MESSAGES.intrnlSrvrErr, err);
    },
    unauthorizeAccess: function (err) {
        return new Exception(2, constants.MESSAGES.unAuthAccess, err);
    },
    tokenGenException: function (err) {
        return new Exception(3, constants.MESSAGES.tokenGenError, err);
    },
    invalidEmail: function () {
        return new Exception(4, constants.MESSAGES.invalidEmail);
    },
    invalidMobileNo: function () {
        return new Exception(4, constants.MESSAGES.invalidMobile);
    },
    getActionBlockedException () {
        return new Exception(4, constants.MESSAGES.blockedMobile);
    },
    invalidOTP: function () {
        return new Exception(4, constants.MESSAGES.invalidOtp);
    },
    getCustomErrorException: function (errMsg, error) {
        return new Exception(5, errMsg, error);
    },
    alreadyRegistered: function (err) {
        return new Exception(6, constants.MESSAGES.usernameAlrdyRegistered, err);
    },
    incorrectPass: function () {
        return new Exception(7, constants.MESSAGES.incorrectPass);
    },
    userNotFound: function (err) {
        return new Exception(8, constants.MESSAGES.userNotFound, err);
    }
};

//========================== Export Module   End ===========================
