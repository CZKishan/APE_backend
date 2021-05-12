'use strict'

//= ========================= Load Modules Start =======================

const service = require('./permissionService')
const resHandlr = require("../../handlers/responseHandler");
const constants = require("../../constants")
const moduleMsg = require('./permissionConstants')

//= ========================= Load Modules End ==============================================

// /** calling service getList function from facade
//  * @function getList
// */
// function getList(req, res) {
//     return service.getList(req).then((data) => {
//         if (data && (data != '' || data != null)) {
//             return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.ok, data)
//         } else {
//             return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, [])
//         }
//     }).catch((er) => {
//         return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.intrnlSrvrErr, [])
//     })
// }


// /** calling service addDetails function from facade
//  * @function addDetails
// */
// function addDetails(req, res) {
//     return service.addDetails(req, res)
//         .then((data) => {
//             if (data && (data != '' || data != null)) {
//                 return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, moduleMsg.MESSAGES.inserted, data)
//             } else {
//                 return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {})
//             }
//         }).catch((er) => {
//             return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.intrnlSrvrErr, {})
//         })
// }

// /**
//  * calling service fetch details
//  * @param {object} req request object 
//  * @param {object} res response object
//  */
// function fetchDetails(req, res) {
//     return service.fetchDetails(req, res)
//         .then((data) => {
//             if (data && (data != '' || data != null)) {
//                 return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.ok, data)
//             } else {
//                 return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {})
//             }
//         }).catch((er) => {
//             return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.intrnlSrvrErr, {})
//         })
// }

// /** calling service update Details function from facade
//  * @function updateDetails
// */
// function updateDetails(req, res) {
//     return service.updateDetails(req, res)
//         .then((data) => {
//             if (data && (data != '' || data != null)) {
//                 return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, moduleMsg.MESSAGES.updated, data)
//             } else {
//                 return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {})
//             }
//         }).catch((er) => {
//             return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.intrnlSrvrErr, {})
//         })
// }

// /** calling service change status function from facade
//  * @function changeStatus
// */
// function changeStatus(req, res) {
//     return service.changeStatus(req, res)
//         .then((data) => {
//             if (data === 1) {
//                 return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {})
//             } else if (data == 2) {
//                 return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, moduleMsg.MESSAGES.alreadyActive, {})
//             } else if (data == 3) {
//                 return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, moduleMsg.MESSAGES.alreadyInActive, {})
//             } else {
//                 return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, moduleMsg.MESSAGES.change, data)
//             }

//         }).catch((er) => {
//             return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.intrnlSrvrErr, {})
//         })
// }

// /** calling service soft Delete Details function from facade
//  * @function softDeleteDetails
// */
// function softDeleteDetails(req, res) {
//     return service.softDeleteDetails(req, res).then((result) => {
//         if (result == 1) {
//             return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {})
//         } else {
//             return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, moduleMsg.MESSAGES.deleted, result)
//         }
//     }).catch((error) => {
//         return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.intrnlSrvrErr, {})
//     });
// }

// /** calling service Delete Details function from facade
//  * @function deleteDetails
// */
// function deleteDetail(req, res) {
//     return service.deleteDetail(req, res).then((result) => {
//         if (result == 1) {
//             return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, moduleMsg.MESSAGES.deleted, {})
//         } else {
//             return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.badRequest, {})
//         }
//     }).catch((error) => {
//         return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.intrnlSrvrErr, {})
//     });
// }

/**
 * calling service fetch details
 * @param {object} req request object 
 * @param {object} res response object
 */
function getPermissionsList(req, res) {
    return service.getPermissionsList(req, res)
        .then((data) => {
            if (data && (data != '' || data != null)) {
                return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, moduleMsg.MESSAGES.listSuccess, data)
            } else {
                return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {})
            }
        }).catch((er) => {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.intrnlSrvrErr, {})
        })
}

function getPermissionMatrix(req){
    return service.getPermissionMatrix(req)
        .then((data) => {
            if (data && (data != '' || data != null)) {
                return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.ok, data)
            } else {
                return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {})
            }
        }).catch((er) => {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.intrnlSrvrErr, {})
        })
}

function updatePermissionMatrix(req,res) {
    return service.updatePermissionMatrix(req,res)
    .then((data) => {
        if (data && (data != '' || data != null) ) {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, moduleMsg.MESSAGES.updated, data)
        } else {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {})
        }
    }).catch((er) => {
        return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.intrnlSrvrErr, {})
    })
}
//= ========================= Export Module Start ==============================

module.exports = {
    // getList, /**calling service get List function from facade */
    // addDetails, /**calling service add Details function from facade */
    // fetchDetails, /** calling service fetch Details details function from facade */
    // updateDetails, /** calling service update Details function from facade */
    // changeStatus, /** calling service change status function from facade */
    // softDeleteDetails, /** calling service soft delete Details function from facade */
    // deleteDetail, /** calling service delete Details function from facade */
    getPermissionsList,
    getPermissionMatrix,
    updatePermissionMatrix
}

//= ========================= Export Module End ===============================
