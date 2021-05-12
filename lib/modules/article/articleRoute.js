const articleRouter = require("express").Router();
const resHndlr = require("../../handlers/responseHandler");
const articleFacade = require("./articleFacade");
const validators = require("./articleValidator");
const jwtHandler = require('../../handlers/jwtHandler');
/**
* For : Application
* Purpose :Add& remove from ReadLater 
* Created date : 26 AUG 2020 
* Last updated :
*/
articleRouter.route('/readLater').post([jwtHandler.verifyUsrToken, validators.validateArticleId], (req, res) => {
    articleFacade.readLater(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});

/**
* For : Application
* Purpose :Like & Dislike ReadLater 
* Created date : 19 NOV 2020 
* Last updated :
*/
articleRouter.route('/read_later/like/:id').post([jwtHandler.verifyUsrToken, validators.validateId, validators.typeValidate], (req, res) => {
    articleFacade.readLaterLikeDislike(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});

/**
* For : Application
* Purpose :Like & Dislike ReadLater 
* Created date : 19 NOV 2020 
* Last updated :
*/
articleRouter.route('/bundle/like/:id').post([jwtHandler.verifyUsrToken, validators.validateId, validators.typeValidate], (req, res) => {
    articleFacade.bundleLikeDislike(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});

/**
* For : Application
* Purpose : ReadLater List
* Created date : 26 AUG 2020 
* Last updated :
*/
articleRouter.route('/readLaterList').post([jwtHandler.verifyUsrToken], (req, res) => {
    articleFacade.readLaterList(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});


/**
* For : Application
* Purpose : Article Add To Bundle
* Created date : 26 AUG 2020 
* Last updated :
*/
articleRouter.route('/saveArticlesToBundle/:id').post([jwtHandler.verifyUsrToken, validators.validateId, validators.validateArticleIds], (req, res) => {
    articleFacade.saveArticlesToBundle(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});



/**
* For : Application
* Purpose : get Bundle Detail
* Created date : 09 sep 2020 
* Last updated :
*/
articleRouter.route('/bundleDetail/:id').post([jwtHandler.verifyUsrToken, validators.validateId], (req, res) => {
    articleFacade.getBundleDetailById(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});



/**
* For : Application
* Purpose : like
* Created date : 14 sep 2020 
* Last updated :
*/
articleRouter.route('/like/:id').post([jwtHandler.verifyUsrToken, validators.validateId, validators.typeValidate], (req, res) => {
    articleFacade.likeDislike(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});


/**
* For : Application
* Purpose : like
* Created date : 14 sep 2020 
* Last updated :
*/
articleRouter.route('/getArticleLikeDetail/:id').get([jwtHandler.verifyUsrToken,], (req, res) => {
    articleFacade.getArticleLikeDetail(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});

module.exports = articleRouter;