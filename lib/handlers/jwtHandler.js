// load all dependencies
var Promise = require("bluebird");
var exceptions = require('../customExceptions')
var jwt = Promise.promisifyAll(require("jsonwebtoken"));
var resHndlr = require('../handlers/responseHandler')

var constants = require('../constants');
// var httpCode = require('./constants').http_code
var userDao = require('../modules/admin/adminDao');
const mongoose = require('mongoose')


/**for generate user and admin Token */
var genAdminToken = function (user) {
    let secretKey = process.env.admin_secret
    return jwt.signAsync(user, secretKey
        //     , {
        //     expiresIn: "1 day"
        // }
    )
        .then((jwtToken) => {
            return jwtToken;
        }).catch(function (err) {
            throw new exceptions.tokenGenException();
        });
};

var genUserToken = function (user) {
    secretKey = process.env.user_secret
    return jwt.signAsync(user, secretKey
        //     , {
        //     expiresIn: "1 day"
        // }
    )
        .then((jwtToken) => {
            return jwtToken;
        }).catch(function (err) {
            throw new exceptions.tokenGenException();
        });
};

// /**for generate reset password Token */
// var genResetPasswordToken = function(user) {
//     var options = { expiresIn: '24hr' };
//     return jwt.signAsync( user, process.env.user_secret, options )
//         .then((jwtToken) => {
//             return jwtToken;
//         }).catch(function(err) {
//             return err;
//         });
// };

/**for generate reset password Token */
var genResetPasswordAdminToken = function (user) {
    var options = { expiresIn: '24hr' };
    return jwt.signAsync(user, process.env.admin_secret, options)
        .then((jwtToken) => {
            return jwtToken;
        }).catch(function (err) {
            return err;
        });
};

// /**for verify User Token */
var verifyUsrToken = function (req, res, next) {

    let token = req.headers['authorization']

    if (!token) {
        return resHndlr.sendSuccess(res, resHndlr.requestResponse(constants.http_code.unAuthorized, constants.MESSAGES.statusFalse, constants.MESSAGES.invalidToken, {}))
    }

    return jwt.verifyAsync(token, process.env.user_secret)
        .then((jwtToken) => {

            req.usr_email = jwtToken._email;
            req._id = jwtToken._id;
            req._roleId = jwtToken._role_id;
            req._user_name = jwtToken._user_name;

            return userDao.checkIfExist({ _id: mongoose.Types.ObjectId(jwtToken._id), "user_status": constants.STATUS.ACTIVE }, {}).then((result) => {
                if (!result || (result && result == null)) {
                    return resHndlr.sendSuccess(res, resHndlr.requestResponse(constants.http_code.unAuthorized, constants.MESSAGES.statusFalse, constants.MESSAGES.unAuthAccess, {}))
                }
                req._app_langId = result.user_app_language && result.user_app_language != undefined ? result.user_app_language : '';
                
                next();
            })
        }).catch(function (err) {
            return resHndlr.sendSuccess(res, resHndlr.requestResponse(constants.http_code.unAuthorized, constants.MESSAGES.statusFalse, constants.MESSAGES.unAuthAccess, {}))
        });
}

// /**for verify Admin Token */
var verifyAdminToken = function (req, res, next) {
    let token = req.headers['authorization']
    return jwt.verifyAsync(token, process.env.admin_secret)
        .then(async (jwtToken) => {
            req.usr_email = jwtToken._email;
            req._id = jwtToken._id;
            req._roleId = jwtToken._role_id;

            let query = {
                _id: mongoose.Types.ObjectId(req._id),
                user_is_deleted: false,
                user_role_id: req._roleId
            };
            let data = await userDao.checkIfExist(query, {});
            if (data && data != null) {
                next();
            } else {
                return resHndlr.sendSuccess(res, resHndlr.requestResponse(constants.http_code.unAuthorized, constants.MESSAGES.statusFalse, constants.MESSAGES.unAuthAccess, {}))
            }
        }).catch(function (err) {
            return resHndlr.sendSuccess(res, resHndlr.requestResponse(constants.http_code.unAuthorized, constants.MESSAGES.statusFalse, constants.MESSAGES.unAuthAccess, {}))
        });
}


//     /**for decode token */
// var decodeToken = function(req) {
//     let token = req.headers['authorization']
//     return jwt.decode(token)
// }



// // /**for verify User Token */
var verifyNotGuestUsrToken = function (req, res, next) {
    let token = req.headers['authorization']

    if (!token) {
        return resHndlr.sendSuccess(res, resHndlr.requestResponse(constants.http_code.unAuthorized, constants.MESSAGES.statusFalse, constants.MESSAGES.invalidToken, {}))
    }

    return jwt.verifyAsync(token, process.env.user_secret)
        .then((jwtToken) => {
            return userDao.checkIfExist({ _id: mongoose.Types.ObjectId(jwtToken._id), "user_status": constants.STATUS.ACTIVE, user_role_id: constants.ACCOUNT_LEVEL.USER }, {}).then((result) => {
                if (!result || (result && result == null)) {
                    return resHndlr.sendSuccess(res, resHndlr.requestResponse(constants.http_code.unAuthorized, constants.MESSAGES.statusFalse, constants.MESSAGES.unAuthAccess, {}))
                }
                next();
            })
        }).catch(function (err) {
            return resHndlr.sendSuccess(res, resHndlr.requestResponse(constants.http_code.unAuthorized, constants.MESSAGES.statusFalse, constants.MESSAGES.unAuthAccess, {}))
        });
}


// ============================================export Modules===============================================================

module.exports = {

    genAdminToken,
    // /**for generate user and admin Token */

    // genResetPasswordToken,
    // /**for generate reset password token */
    genResetPasswordAdminToken,
    verifyUsrToken,
    // /**for verify User Token */

    verifyAdminToken,
    // /**for verify Admin Token */
    // verifyToken,

    // verifyResetPasswordToken,
    // /**for verify reset password token */
    genUserToken,
    verifyNotGuestUsrToken
    // decodeToken,
    // /**for decode token */

};