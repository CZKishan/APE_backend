// ===================================Load Internal Modules================================================================================
const routr = require('express').Router()
const resHndlr = require("../../handlers/responseHandler");
const facade = require('./permissionFacade')
const validators = require('./permissionValidators')
const jwtHandler =require('../../handlers/jwtHandler');
// ====================================Load Modules End======================================================================


// ===================================Admin Start ===========================================================//
/**for fetch List */

// routr.route('/getList')
//     .post([jwtHandler.verifyAdminToken], (req, res) => {
//         facade.getList(req, res).then((result) => {
//             resHndlr.sendSuccess(res, result)
//         }).catch((err) => {
//             resHndlr.sendError(res, err)
//         })
//     })

// /**for add details */
// routr.route('/addDetails')
//     .post([jwtHandler.verifyAdminToken, validators.checkValidateDetails], (req, res) => {
//         facade.addDetails(req, res).then((result) => {
//             resHndlr.sendSuccess(res, result);
//         }).catch((err) => {
//             resHndlr.sendError(res, err);
//         });
//     })

// /** for fetch details */
// routr.route('/fetchDetails/:id')
//     .get([jwtHandler.verifyAdminToken], (req, res) => {
//         facade.fetchDetails(req, res).then((result) => {
//             resHndlr.sendSuccess(res, result);
//         }).catch((err) => {
//             resHndlr.sendError(req, err);
//         })
//     })

// /**for update Details */
// routr.route('/updateDetails/:id')
//     .put([jwtHandler.verifyAdminToken, validators.validateId, validators.checkValidateDetails], (req, res) => {
//         facade.updateDetails(req, res).then((result) => {
//             resHndlr.sendSuccess(res, result);
//         }).catch((err) => {
//             resHndlr.sendError(res, err);
//         });
//     })

// /** for change status */
// routr.route('/changeStatus/:id')
//     .put([jwtHandler.verifyAdminToken, validators.validateId, validators.checkStatus], (req, res) => {
//         facade.changeStatus(req, res).then((result) => {
//             resHndlr.sendSuccess(res, result);
//         }).catch((err) => {
//             resHndlr.sendError(res, err);
//         });
//     })

// /**for soft Delete Details */
// routr.route('/deleteDetails/:id')
//     .patch([jwtHandler.verifyAdminToken, validators.validateId], (req, res) => {
//         facade.softDeleteDetails(req, res).then((result) => {
//             resHndlr.sendSuccess(res, result);
//         }).catch((err) => {
//             resHndlr.sendError(res, err);
//         });
//     })

// /**for Delete Details */
// routr.route('/deleteDetail/:id')
//     .delete([jwtHandler.verifyAdminToken, validators.validateId], (req, res) => {
//         facade.deleteDetail(req, res).then((result) => {
//             resHndlr.sendSuccess(res, result);
//         }).catch((err) => {
//             resHndlr.sendError(res, err);
//         });
//     })


    /**for Delete Details */
routr.route('/getPermissions')
.get([jwtHandler.verifyAdminToken], (req, res) => {
    facade.getPermissionsList(req, res).then((result) => {
        resHndlr.sendSuccess(res, result);
    }).catch((err) => {
        resHndlr.sendError(res, err);
    });
})


    /**for Delete Details */
    routr.route('/getPermissionMatrix')
    .get([jwtHandler.verifyAdminToken], (req, res) => {
        facade.getPermissionMatrix(req, res).then((result) => {
            resHndlr.sendSuccess(res, result);
        }).catch((err) => {
            resHndlr.sendError(res, err);
        });
    })
    
     /**for Delete Details */
     routr.route('/updatePermissionMatrix')
     .post([jwtHandler.verifyAdminToken], (req,res) => {
         facade.updatePermissionMatrix(req,res).then((result) => {
             resHndlr.sendSuccess(res, result);
         }).catch((err) => {
             resHndlr.sendError(res, err);
         });
     })
     
//==============================================Admin End==============================================

// export modules
module.exports = routr
