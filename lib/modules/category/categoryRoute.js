const categoryRouter = require("express").Router();
const resHndlr = require("../../handlers/responseHandler");
const categoryFacade = require("./categoryFacade");
const validators = require("./categoryValidators");
const jwtHandler = require('../../handlers/jwtHandler');


/**
* For : Admin Panel
* Purpose :Add Category
* Created date : 17 JULY 2020 
* Last updated :
*/
categoryRouter.route('/add').post([jwtHandler.verifyAdminToken], (req, res) => {
    categoryFacade.addCategory(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});


/**
* For : Admin Panel
* Purpose :get Category byId
* Created date : 12 JULY 2020 
* Last updated :
*/
categoryRouter.route('/get/:id').get([jwtHandler.verifyAdminToken, validators.validateId], (req, res) => {
    categoryFacade.getCategoryById(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});



/**
* For : Admin Panel
* Purpose :delete Category byId
* Created date : 12 JULY 2020 
* Last updated :
*/
categoryRouter.route('/delete/:id').delete([jwtHandler.verifyAdminToken, validators.validateId], (req, res) => {
    categoryFacade.deleteCategoryById(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});



/**
* For : Admin Panel
* Purpose :list Category
* Created date : 12 JULY 2020 
* Last updated :
*/
categoryRouter.route('/list').post([jwtHandler.verifyAdminToken], (req, res) => {
    categoryFacade.listCategory(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});

/**
* For : Admin Panel
* Purpose :update Category byId
* Created date : 12 JULY 2020 
* Last updated :
*/
categoryRouter.route('/update/:id').post([jwtHandler.verifyAdminToken, validators.validateId], (req, res) => {
    categoryFacade.updateCategoryById(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});


/**
* For : Admin Panel
* Purpose :change Category Status
* Created date : 12 JULY 2020 
* Last updated :
*/
categoryRouter.route('/changeStatus/:id')
    .put([jwtHandler.verifyAdminToken, validators.validateId, validators.checkStatus], (req, res) => {
        categoryFacade.changeStatusById(req, res).then((result) => {
            resHndlr.sendSuccess(res, result);
        }).catch((err) => {
            resHndlr.sendError(res, err);
        });
    })



/**
 * NOT_USED
* For :
* Purpose  :get Category List Common API
* Created date : 21 JULY 2020 
* Last updated :
*/
categoryRouter.route('/categoriesList')
.get([], (req, res) => {
    categoryFacade.getCategoriesList(req, res).then((result) => {
        resHndlr.sendSuccess(res, result);
    }).catch((err) => {
        resHndlr.sendError(res, err);
    });
})


module.exports = categoryRouter;