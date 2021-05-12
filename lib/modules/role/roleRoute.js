// ===================================Load Internal Modules================================================================================
const routr = require('express').Router()
const resHndlr = require("../../handlers/responseHandler");
const facade = require('./roleFacade');
const validators = require('./roleValidators');
const jwtHandler = require('../../handlers/jwtHandler');
// ====================================Load Modules End======================================================================


/**
* For : Admin Panel
* Purpose :list Role
* Created date : 12 JULY 2020 
* Last updated :
*/
routr.route('/list')
    .post([jwtHandler.verifyAdminToken], (req, res) => {
        facade.roleList(req, res).then((result) => {
            resHndlr.sendSuccess(res, result)
        }).catch((err) => {
            resHndlr.sendError(res, err)
        })
    })


/**
* For : Admin Panel
* Purpose :Add Role
* Created date : 12 JULY 2020 
* Last updated :
*/
routr.route('/add')
    .post([jwtHandler.verifyAdminToken, validators.checkValidateDetails], (req, res) => {
        facade.addRole(req, res).then((result) => {
            resHndlr.sendSuccess(res, result);
        }).catch((err) => {
            resHndlr.sendError(res, err);
        });
    })

/**
* For : Admin Panel
* Purpose :get Role By Id
* Created date : 12 JULY 2020 
* Last updated :
*/
routr.route('/get/:id')
    .get([jwtHandler.verifyAdminToken, validators.validateId], (req, res) => {
        facade.getRoleById(req, res).then((result) => {
            resHndlr.sendSuccess(res, result);
        }).catch((err) => {
            resHndlr.sendError(req, err);
        })
    })


/**
* For : Admin Panel
* Purpose :update Role By Id
* Created date : 12 JULY 2020 
* Last updated :
*/
routr.route('/update/:id')
    .post([jwtHandler.verifyAdminToken, validators.validateId, validators.checkValidateDetails], (req, res) => {
        facade.updateRoleById(req, res).then((result) => {
            resHndlr.sendSuccess(res, result);
        }).catch((err) => {
            resHndlr.sendError(res, err);
        })
    })



/**
* For : Admin Panel
* Purpose :delete Role By Id
* Created date : 12 JULY 2020 
* Last updated :
*/routr.route('/delete/:id')
    .delete([jwtHandler.verifyAdminToken, validators.validateId], (req, res) => {
        facade.deleteRoleById(req, res).then((result) => {
            resHndlr.sendSuccess(res, result);
        }).catch((err) => {
            resHndlr.sendError(res, err);
        });
    })

/**
* For : Admin Panel
* Purpose :change status
* Created date : 12 JULY 2020 
* Last updated : */
routr.route('/changeStatus/:id')
    .put([jwtHandler.verifyAdminToken, validators.validateId, validators.checkStatus], (req, res) => {
        facade.changeStatusById(req, res).then((result) => {
            resHndlr.sendSuccess(res, result);
        }).catch((err) => {
            resHndlr.sendError(res, err);
        });
    })


/**
* For : Admin Panel
* Purpose :getRoleWisePermissionNames
* Created date : 12 JULY 2020 
* Last updated : */
routr.route('/getRoleWisePermissionNames/:id')
    .get([jwtHandler.verifyAdminToken, validators.validateId], (req, res) => {
        facade.getRoleWisePermissionNamesById(req, res).then((result) => {
            resHndlr.sendSuccess(res, result);
        }).catch((err) => {
            resHndlr.sendError(res, err);
        })
    })

/**
* For : Admin Panel
* Purpose :getRoleList
* Created date : 12 JULY 2020 
* Last updated : */
routr.route('/getRolesList')
    .get([jwtHandler.verifyAdminToken], (req, res) => {
        facade.getRolesList(req, res).then((result) => {
            resHndlr.sendSuccess(res, result);
        }).catch((err) => {
            resHndlr.sendError(res, err);
        })
    })

//==============================================Admin End==============================================

// export modules
module.exports = routr
