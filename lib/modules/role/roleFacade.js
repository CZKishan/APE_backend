'use strict'

//= ========================= Load Modules Start =======================

const service = require('./roleService')
const constants = require("../../constants")
const moduleMsg = require('./roleConstants')
const resHandlr = require('../../handlers/responseHandler');

//= ========================= Load Modules End ==============================================

/** calling service getList function from facade
 * @function getList
*/
function roleList(req, res) {
    return service.roleList(req).then((data) => {
        if (data && (data != '' || data != null)) {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, moduleMsg.MESSAGES.listSuccess, data)
        } else {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, [])
        }
    }).catch((er) => {
        return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.intrnlSrvrErr, [])
    })
}



function addRole(req) {
    return service.addRole(req)
        .then((data) => {
            if (data && (data != '' || data != null)) {
                return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, moduleMsg.MESSAGES.insertSuccess, data)
            } else {
                return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {})
            }
        }).catch((er) => {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.intrnlSrvrErr, {})
        })
}


function getRoleById(req) {
    return service.getRoleById(req)
        .then((data) => {

            if (data && (data != '' || data != null)) {
                return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, moduleMsg.MESSAGES.getRoleSuccess, data)
            } else {
                return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {})
            }
        }).catch((er) => {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.intrnlSrvrErr, {})
        })
}


function updateRoleById(req){
    return service.updateRoleById(req)
    .then((data) => {

        if (data && (data != '' || data != null)) {
            return resHandlr.requestResponse(constants.http_code.ok,constants.MESSAGES.statusTrue,moduleMsg.MESSAGES.updateSuccess,data);
        } else {
            return resHandlr.requestResponse(constants.http_code.dataNotFound,constants.MESSAGES.statusFalse,constants.MESSAGES.dataNotFound,{});
        }
    }).catch((er) => {
        return resHandlr.requestResponse(constants.http_code.dataNotFound,constants.MESSAGES.statusFalse,constants.MESSAGES.intrnlSrvrErr,{});
    })
}

function deleteRoleById(req) {
    return service.deleteRoleById(req).then((result) => {
        if(result == 1){
            return resHandlr.requestResponse(constants.http_code.dataNotFound,constants.MESSAGES.statusFalse,constants.MESSAGES.dataNotFound,{})
        }else{
            return resHandlr.requestResponse(constants.http_code.ok,constants.MESSAGES.statusTrue,moduleMsg.MESSAGES.deleteSuccess,result)
        }
    }).catch((error)=>{
        return resHandlr.requestResponse(constants.http_code.dataNotFound,constants.MESSAGES.statusFalse,constants.MESSAGES.intrnlSrvrErr,{})
    });

}

function changeStatusById(req){
    return service.changeStatusById(req)
    .then((data) => {
         if (data === 1) {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {})
        } else if (data == 2) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.alreadyActive, {})
        } else if (data == 3) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.alreadyInActive, {})
        } else {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.changeSuccess, data)
        }

    }).catch((er) => {
        return resHandlr.requestResponse(constants.http_code.dataNotFound,constants.MESSAGES.statusFalse,constants.MESSAGES.changeStatusErr,{})
    })
}


function getRoleWisePermissionNamesById(req) {
    return service.getRoleWisePermissionNamesById(req).then((result) => {
        if(result == 1){
            return resHandlr.requestResponse(constants.http_code.dataNotFound,constants.MESSAGES.statusFalse,constants.MESSAGES.dataNotFound,{})
        }
        else{
            return resHandlr.requestResponse(constants.http_code.ok,constants.MESSAGES.statusTrue,moduleMsg.MESSAGES.listSuccess,result)      
        }
    }).catch((error)=>{
        return resHandlr.requestResponse(constants.http_code.dataNotFound,constants.MESSAGES.statusFalse,constants.MESSAGES.intrnlSrvrErr,{})
    });
}


function getRolesList(req) {
    return service.getRolesList(req).then((result) => {
        if(result == 1){
            return resHandlr.requestResponse(constants.http_code.dataNotFound,constants.MESSAGES.statusFalse,constants.MESSAGES.dataNotFound,[])
        }
        else{
            return resHandlr.requestResponse(constants.http_code.ok,constants.MESSAGES.statusTrue,moduleMsg.MESSAGES.listSuccess,result)   
            
        }
    }).catch((error)=>{
        return resHandlr.requestResponse(constants.http_code.dataNotFound,constants.MESSAGES.statusFalse,constants.MESSAGES.intrnlSrvrErr,[])
    });
}
//= ========================= Export Module Start ==============================

module.exports = {
    roleList, /**calling service get List function from facade */
    addRole,
    getRoleById,
    updateRoleById,
    deleteRoleById,
    changeStatusById,
    getRoleWisePermissionNamesById,
    getRolesList
}

//= ========================= Export Module End ===============================
