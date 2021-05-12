
var articleService = require('./articleService');
const resHandlr = require('../../handlers/responseHandler');
const constants = require('../../constants');
const articleMsg = require('./articleConstants');
const { func } = require('@hapi/joi');


function readLater(req) {
    return articleService.readLater(req).then((data) => {
        if (data == 1) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.articleNotFound, {});
        } else if (data == 3) {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, articleMsg.MESSAGES.articleAddReadLater, {})
        } else if (data == 4) {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, articleMsg.MESSAGES.articleremoveReadLater, {})
        } else {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, articleMsg.MESSAGES.issWithReadLater, {})
        }
    }, (error) => {
        console.log(error);
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, articleMsg.MESSAGES.issWithReadLater, {})
    })
}


function readLaterList(req) {
    return articleService.readLaterList(req).then((data) => {
        if (data && data != null) {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, articleMsg.MESSAGES.readLaterListingSuccess, data)
        } else { 
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, articleMsg.MESSAGES.issWithReadLaterList, {})
        }
    }, (error) => {
        console.log(error);
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, articleMsg.MESSAGES.issWithReadLaterList, {})
    })
}


function saveArticlesToBundle(req) {
    return articleService.saveArticlesToBundle(req).then((data) => {
        if (data && data == 1) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.bundleNotFound, {})
        } else if(data && data == 2) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.articleNotFound, {})
        } else if (data && data != null) {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, articleMsg.MESSAGES.articleSavetoBundleSuccess, {})
        } else {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, articleMsg.MESSAGES.issWithSaveBundleList, {})
        }
    }, (error) => {
        console.log(error);
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, articleMsg.MESSAGES.issWithSaveBundleList, {})
    })
}

function getBundleDetailById(req) {
    return articleService.getBundleDetailById(req).then((data) => {
        if (data && data == 1) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.bundleNotFound, {})
        } else if(data && data == 2) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.bundleNotAccess, {})
        } else if (data && data != null) {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, articleMsg.MESSAGES.bundleGetByIdSuccess, data)
        } else {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, articleMsg.MESSAGES.issWithGetById, {})
        }
    }, (error) => {
        console.log(error);
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, articleMsg.MESSAGES.issWithGetById, {})
    })
}


function likeDislike(req) {
    return articleService.likeDislike(req).then((data) => {
        if (data && data == 1) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.articleNotFound, {})
        } else if (data && data == 2) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, articleMsg.MESSAGES.articleAlreadyLiked, {})
        } else if (data && data == 3) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, articleMsg.MESSAGES.articleAlreadyDisLiked, {})
        } else if (data && data == 4) {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, articleMsg.MESSAGES.articleLikedSuccess, {})
        } else if (data && data == 5) {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, articleMsg.MESSAGES.articleDisLikedSuccess, {})
        } else {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
        }
    }, (error) => {
        console.log(error);
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
    })
}

function readLaterLikeDislike(req) {
    return articleService.readLaterLikeDislike(req).then((data) => {
        if (data && data == 1) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.readLaterArticleNotFound, {})
        } else if (data && data == 2) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, articleMsg.MESSAGES.articleAlreadyLiked, {})
        } else if (data && data == 3) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, articleMsg.MESSAGES.articleAlreadyDisLiked, {})
        } else if (data && data == 4) {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, articleMsg.MESSAGES.articleLikedSuccess, {})
        } else if (data && data == 5) {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, articleMsg.MESSAGES.articleDisLikedSuccess, {})
        } else {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
        }
    }, (error) => {
        console.log(error);
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
    })
}

function getArticleLikeDetail(req) {
    return articleService.getArticleLikeDetail(req).then((data) => {
        if (data && data == 1) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.articleNotFound, {})
        } else {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.getByIdSuccess,data)
        }
    }).catch((error) => {
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
    })
}

function bundleLikeDislike(req) {
    return articleService.bundleLikeDislike(req).then((data) => {
        if (data && data == 1) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.readLaterArticleNotFound, {})
        } else if (data && data == 2) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, articleMsg.MESSAGES.articleAlreadyLiked, {})
        } else if (data && data == 3) {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, articleMsg.MESSAGES.articleAlreadyDisLiked, {})
        } else if (data && data == 4) {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, articleMsg.MESSAGES.articleLikedSuccess, {})
        } else if (data && data == 5) {
            return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, articleMsg.MESSAGES.articleDisLikedSuccess, {})
        } else {
            return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
        }
    }, (error) => {
        return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
    })
}

module.exports = {
    readLater,
    readLaterList,
    readLaterLikeDislike,
    saveArticlesToBundle,
    getBundleDetailById,
    likeDislike,
    getArticleLikeDetail,
    bundleLikeDislike
};

