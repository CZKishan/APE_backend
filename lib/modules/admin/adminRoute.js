const adminRouter = require("express").Router();
const resHndlr = require("../../handlers/responseHandler");
const adminFacade = require("./adminFacade");
const validators = require("./adminValidators");
const jwtHandler = require('../../handlers/jwtHandler')


adminRouter.route('/temp')
    .post([], (req, res) => {
        console.log('---body-----',req.body);

        // adminFacade.login(req, res).then((result) => {
        //     resHndlr.sendSuccess(res, result)
        // }).catch((err) => {
        //     resHndlr.sendError(res, err)
        // })
    })

/**
* For : Admin Panel
* Purpose : Admin Login
* Created date : 11 JULY 2020 
* Last updated :
*/
adminRouter.route('/login')
    .post([validators.validateLoginData], (req, res) => {
        adminFacade.login(req, res).then((result) => {
            resHndlr.sendSuccess(res, result)
        }).catch((err) => {
            resHndlr.sendError(res, err)
        })
    })


/**
* For : Admin Panel
* Purpose : Admin Forgot Password
* Created date : 11 JULY 2020 
* Last updated :
*/
adminRouter.route('/forgotPassword')
    .post([validators.validateForgotPassword], (req, res) => {
        adminFacade.forgotPassword(req, res).then(result => {
            resHndlr.sendSuccess(res, result)
        }).catch(err => {
            resHndlr.sendError(res, err)
        })
    })



/**
* For : Admin Panel
* Purpose : Check admin or not
* Created date : 11 JULY 2020 
* Last updated :
*/
adminRouter.route('/isAdmin').get([jwtHandler.verifyAdminToken], (req, res) => {

    adminFacade.isAdmin(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});


/**
* For : Admin Panel
* Purpose :Reset password
* Created date : 11 JULY 2020 
* Last updated :
*/
adminRouter.route('/resetPassword').post(
    [validators.validateResetPassword, jwtHandler.verifyAdminToken]
    //validation file
    , (req, res) => {
        adminFacade.resetPassword(req).then(result => {
            resHndlr.sendSuccess(res, result)
        }).catch(err => {
            resHndlr.sendError(res, err)
        });
    });


/**
* For : Admin Panel
* Purpose :Check token black list
* Created date : 11 JULY 2020 
* Last updated :
*/
adminRouter.route('/checkBlackListToken').get([jwtHandler.verifyAdminToken], (req, res) => {
    adminFacade.checkBlackListToken(req).then(result => {
        res.send({ status: 200, data: result });
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});

/**
* For : Admin Panel
* Purpose :Add Admin
* Created date : 12 JULY 2020 
* Last updated :
*/
adminRouter.route('/add').post([jwtHandler.verifyAdminToken, validators.validateEditUserProfile], (req, res) => {
    adminFacade.addAdmin(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});

/**
* For : Admin Panel
* Purpose :get Admin byId
* Created date : 12 JULY 2020 
* Last updated :
*/
adminRouter.route('/get/:id').get([jwtHandler.verifyAdminToken, validators.validateId], (req, res) => {
    adminFacade.getAdminById(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});


/**
* For : Admin Panel
* Purpose :delete Admin byId
* Created date : 12 JULY 2020 
* Last updated :
*/
adminRouter.route('/delete/:id').delete([jwtHandler.verifyAdminToken, validators.validateId], (req, res) => {
    adminFacade.deleteAdminById(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});

/**
* For : Admin Panel
* Purpose :update Admin byId
* Created date : 12 JULY 2020 
* Last updated :
*/
adminRouter.route('/update/:id').post([jwtHandler.verifyAdminToken, validators.validateId], (req, res) => {
    adminFacade.updateAdminById(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});

/**
* For : Admin Panel
* Purpose :list Admin
* Created date : 12 JULY 2020 
* Last updated :
*/
adminRouter.route('/list').post([jwtHandler.verifyAdminToken], (req, res) => {
    adminFacade.listAdmin(req).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    });
});

/**
* For : Admin Panel
* Purpose :change User Status
* Created date : 12 JULY 2020 
* Last updated :
*/
adminRouter.route('/changeStatus/:id')
    .put([jwtHandler.verifyAdminToken, validators.validateId, validators.checkStatus], (req, res) => {
        adminFacade.changeStatusById(req, res).then((result) => {
            resHndlr.sendSuccess(res, result);
        }).catch((err) => {
            resHndlr.sendError(res, err);
        });
    })


/**
* For : Admin Panel
* Purpose :logout
* Created date : 28 JULY 2020 
* Last updated :
*/
adminRouter.route('/logout')
  .get([jwtHandler.verifyAdminToken], (req, res) => {
    adminFacade.logout(req, res).then(result => {
        resHndlr.sendSuccess(res, result)
    }).catch(err => {
        resHndlr.sendError(res, err)
    })
  })


module.exports = adminRouter;