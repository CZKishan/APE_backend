

// 'use strict';
var categoryService = require('./categoryService');
const resHandlr = require('../../handlers/responseHandler');
const constants = require('../../constants');
const categoryMsg = require('./categoryConstants');



function addCategory(req) {
    return categoryService.addCategory(req).then((data) => {
        if (data == 1) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, categoryMsg.MESSAGES.issWithAdd, {});
        } else if (data == 2) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, categoryMsg.MESSAGES.alreadyExist, {});
        } else {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, categoryMsg.MESSAGES.addCategorySuccess, {})
        }
    }, (error) => {
        console.log(error);
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, categoryMsg.MESSAGES.issWithAdd, {})
    })
}

function getCategoryById(req) {
    return categoryService.getCategoryById(req).then((data) => {
        if (data == 1) {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {});
        } else {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, categoryMsg.MESSAGES.getCategorySuccess, data)
        }
    }, (error) => {
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, categoryMsg.MESSAGES.issueWithget, {})
    })
}



function deleteCategoryById(req) {
    return categoryService.deleteCategoryById(req).then((data) => {
        if (data == 1) {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {});
        } else {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, categoryMsg.MESSAGES.deletedSuccessfully, {})
        }
    }, (error) => {
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, categoryMsg.MESSAGES.issueWithdelete, {})
    })
}


function listCategory(req) {
    return categoryService.listCategory(req).then((data) => {
        if (data == 1) {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {});
        } else {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, categoryMsg.MESSAGES.listingSuccessfully, data)
        }
    }, (error) => {
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, categoryMsg.MESSAGES.issueWithList, {})
    })
}

function updateCategoryById(req) {
    return categoryService.updateCategoryById(req).then((data) => {
        if (data == 1) {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {});
        } else if (data == 2) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, categoryMsg.MESSAGES.alreadyExist, {});
        } else {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, categoryMsg.MESSAGES.updatedSuccessfully, data)
        }
    }, (error) => {
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, categoryMsg.MESSAGES.issueWithUpdate, {})
    })
}


function changeStatusById(req) {
    return categoryService.changeStatusById(req).then((data) => {
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

function getCategoriesList(req) {
    return categoryService.getCategoriesList(req).then((data) => {
        if (data == 1) {
            return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {});
        } else {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, categoryMsg.MESSAGES.listingSuccessfully, data)
        }
    }, (error) => {
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, categoryMsg.MESSAGES.issueWithList, {})
    })
}
module.exports = {
    addCategory,
    getCategoryById,
    deleteCategoryById,
    listCategory,
    updateCategoryById,
    changeStatusById,
    getCategoriesList
};

