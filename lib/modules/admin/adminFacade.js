// 'use strict';
var adminService = require('./adminService');
const resHandlr = require('../../handlers/responseHandler');
const constants = require('../../constants');
const adminMsg = require('./adminConstants');

function login(req, res) {
    return adminService.login(req, res)
        .then((data) => {
            if (data && data != null) {
                if (data == 1) {
                    return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.dataNotFound, {});
                } else if (data == 2) {
                    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.passwordMismatch, {});
                } else {
                    return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, adminMsg.MESSAGES.loginSuccessfully, data);
                }
            } else {
                return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.issueWithLogin, {});
            }
        }).catch((er) => {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.issueWithLogin, {})
        })
}

/** calling service forgotPassword function from facade */
function forgotPassword(req, res) {
    return adminService.forgotPassword(req, res).then(data => {
        if (data && data != null) {
            if (data == 1) {
                return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.dataNotFound, {})
            } else {
                return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, adminMsg.MESSAGES.emailSended, data)
            }
        } else {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.issueWithforgotPasword, {})
        }
    }).catch((er) => {
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.issueWithforgotPasword, {})
    })
}

function isAdmin(req) {
    return adminService.isAdmin(req).then((data) => {
        if (data == 1) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.unAuthAccess, {})
        } else {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.authAccess, {})
        }
    }).catch((error) => {
        console.log(error);
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.intrnlSrvrErr, {})
    });
}

function resetPassword(req) {
    return adminService.resetPassword(req).then((data) => {
        if (data == 1) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.passwordMismatch, {})
        } else if (data == 2) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.resetPasswordError, {})
        } else {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, adminMsg.MESSAGES.resetPasswordSuccess, {})
        }
    }, (error) => {
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.resetPasswordError, {})
    });
}

function checkBlackListToken(req) {
    return adminService.checkBlackListToken(req).then(result => result);
}


function addAdmin(req) {
    return adminService.addAdmin(req).then((data) => {
        if (data == 1) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.exist, {});
        } else if (data == 3) {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, adminMsg.MESSAGES.addAdminSuccess, {})
        } else {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.issWithAdd, {})
        }
    }, (error) => {
        console.log(error);
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.issWithAdd, {})
    })
}


function getAdminById(req) {
    return adminService.getAdminById(req).then((data) => {
        if (data == 1) {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {});
        } else {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, adminMsg.MESSAGES.getUserSuccess, data)
        }
    }, (error) => {
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.issueWithget, {})
    })
}

function deleteAdminById(req) {
    return adminService.deleteAdminById(req).then((data) => {
        if (data == 1) {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {});
        } else {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, adminMsg.MESSAGES.deletedSuccessfully, {})
        }
    }, (error) => {
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.issueWithdelete, {})
    })
}

function updateAdminById(req) {
    return adminService.updateAdminById(req).then((data) => {
        if (data == 1) {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {});
        } else if (data == 2) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.emailExist, {})
        } else {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, adminMsg.MESSAGES.updatedSuccessfully, data)
        }
    }, (error) => {
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.issueWithUpdate, {})
    })
}

function listAdmin(req) {
    return adminService.listAdmin(req).then((data) => {
        if (data == 1) {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {});
        } else {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, adminMsg.MESSAGES.listingSuccessfully, data)
        }
    }, (error) => {
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, adminMsg.MESSAGES.issueWithList, {})
    })
}

function changeStatusById(req) {
    return adminService.changeStatusById(req).then((data) => {
        if (data === 1) {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {})
        } else if (data == 2) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.alreadyActive, {})
        } else if (data == 3) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.alreadyInActive, {})
        } else if (data == 4) {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.changeSuccess, {})
        } else {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.changeStatusErr, {})
        }
    }).catch(er => {
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.changeStatusErr, {})
    })
}

function logout(req){
    return adminService.logout(req).then((result) => {
        if (result == 1) {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {})
        } else {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.logoutSuccessfully, {})
        }
      })
}

module.exports = {
    login,
    forgotPassword,
    isAdmin,
    resetPassword,
    checkBlackListToken,
    addAdmin,
    getAdminById,
    deleteAdminById,
    updateAdminById,
    listAdmin,
    changeStatusById,
    logout
};
