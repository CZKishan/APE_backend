// ===================================Load Internal Modules================================================================================
const usrRoutr = require('express').Router();
const resHndlr = require("../../handlers/responseHandler");
const usrFacade = require('./userFacade');
const jwtHandler = require('../../handlers/jwtHandler');
const validators = require('./userValidators');
const userConstants = require('./userConstants');
const userValidators = require('./userValidators');


usrRoutr.route('/uploadData')
  .post([], (req, res) => {
    usrFacade.uploadData(req, res).then((result) => {
      resHndlr.sendSuccess(res, result)
    }).catch((err) => {
      resHndlr.sendError(res, err)
    })
  })

  /**
* For : Admin Panel
* Purpose :Add User
* Created date : 7 JULY 2020 
* Last updated :
*/
usrRoutr.route('/add').post([jwtHandler.verifyAdminToken,validators.validateAddUser], (req, res) => {
  usrFacade.addUser(req).then(result => {
      resHndlr.sendSuccess(res, result)
  }).catch(err => {
      resHndlr.sendError(res, err)
  });
});

  /**
* For : Admin Panel
* Purpose :edit User
* Created date : 7 JULY 2020 
* Last updated :
*/
usrRoutr.route('/update/:id').post([jwtHandler.verifyAdminToken,validators.validateAddUser], (req, res) => {
  usrFacade.editUser(req).then(result => {
      resHndlr.sendSuccess(res, result)
  }).catch(err => {
      resHndlr.sendError(res, err)
  });
});

/**
* For : Admin Panel
* Purpose :get User byId
* Created date : 7 JULY 2020 
* Last updated :
*/
usrRoutr.route('/get/:id').get([jwtHandler.verifyAdminToken, validators.validateId], (req, res) => {
  usrFacade.getUserById(req).then(result => {
      resHndlr.sendSuccess(res, result)
  }).catch(err => {
      resHndlr.sendError(res, err)
  });
});

/**
* For : Admin Panel
* Purpose :delete User byId
* Created date :7 JULY 2020 
* Last updated :
*/
usrRoutr.route('/delete/:id').delete([jwtHandler.verifyAdminToken, validators.validateId], (req, res) => {
  usrFacade.deleteUserById(req).then(result => {
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
usrRoutr.route('/list').post([jwtHandler.verifyAdminToken], (req, res) => {
  usrFacade.listUser(req).then(result => {
      resHndlr.sendSuccess(res, result)
  }).catch(err => {
      resHndlr.sendError(res, err)
  });
});

//-----------------------------------------adminpanel  end
/**
* For :Application
* Purpose : Sign Up
* Created date : 28 JULY 2020 
* Last updated :
*/
usrRoutr.route('/signUp')
  .post([validators.validateSignUpData], (req, res) => {
    usrFacade.signUp(req, res).then((result) => {
      resHndlr.sendSuccess(res, result)
    }).catch((err) => {
      resHndlr.sendError(res, err)
    })
  })

  /**
* For :Application
* Purpose : verify Email
* Created date : 28 JULY 2020 
* Last updated :
*/
usrRoutr.route('/verifyEmail')
.post([validators.validateEmail], (req, res) => {
  usrFacade.verifyEmail(req, res).then((result) => {
    resHndlr.sendSuccess(res, result)
  }).catch((err) => {
    resHndlr.sendError(res, err)
  })
})



/**
* For :Application
* Purpose : Sign In
* Created date : 28 JULY 2020 
* Last updated :
*/
usrRoutr.route('/signIn')
  .post([validators.validateSignInData], (req, res) => {
    usrFacade.signIn(req, res).then((result) => {
      resHndlr.sendSuccess(res, result)
    }).catch((err) => {
      resHndlr.sendError(res, err)
    })
  })

/**
* For : Application
* Purpose : Forgot Password
* Created date : 29 JULY 2020 
* Last updated :
*/
usrRoutr.route('/forgotPassword')
  .post([validators.validateForgotPassword], (req, res) => {
    usrFacade.forgotPassword(req, res).then(result => {
      resHndlr.sendSuccess(res, result)
    }).catch(err => {
      resHndlr.sendError(res, err)
    })
  })


/**
* For : Application
* Purpose : otpCheck
* Created date : 29 JULY 2020 
* Last updated :
*/
usrRoutr.route('/otpCheck')
  .post([validators.validateOtp], (req, res) => {
    usrFacade.otpCheck(req, res).then(result => {
      resHndlr.sendSuccess(res, result)
    }).catch(err => {
      resHndlr.sendError(res, err)
    })
  })


/**
* For : Application
* Purpose : otpCheck
* Created date : 29 JULY 2020 
* Last updated :
*/
usrRoutr.route('/resetPassword')
  .post([validators.validateResetPassword], (req, res) => {
    usrFacade.resetPassword(req, res).then(result => {
      resHndlr.sendSuccess(res, result)
    }).catch(err => {
      resHndlr.sendError(res, err)
    })
  })

/**
* For :Application
* Purpose :logout
* Created date : 29 JULY 2020 
* Last updated :
*/
usrRoutr.route('/logout')
  .get([jwtHandler.verifyUsrToken], (req, res) => {
    usrFacade.logout(req, res).then(result => {
      resHndlr.sendSuccess(res, result)
    }).catch(err => {
      resHndlr.sendError(res, err)
    })
  })


  /**
* For :Application
* Purpose :changeUserAppLanguage step 1
* Created date : 07 JULY 2020 
* Last updated :
*/
usrRoutr.route('/changeUserAppLanguage')
.post([jwtHandler.verifyUsrToken,validators.changeUserAppLanguageValidate], (req, res) => {
  usrFacade.changeUserAppLanguage(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})


  
  /**
* For :Application
* Purpose :changeUserNewsLanguage step 3
* Created date : 07 JULY 2020 
* Last updated :
*/
usrRoutr.route('/changeUserNewsLanguage')
.post([jwtHandler.verifyUsrToken,validators.changeUserNewsLanguageValidate], (req, res) => {
  usrFacade.changeUserNewsLanguage(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})


  /**
* For :Application
* Purpose :setUserInterestedTopics step 2
* Created date : 10 JULY 2020 
* Last updated :
*/
usrRoutr.route('/setUserInterestedTopics')
.post([jwtHandler.verifyUsrToken,validators.userInterestedTopicsValidate], (req, res) => {
  usrFacade.setUserInterestedTopics(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})


  /**
* For :Application
* Purpose :setUserInterestedLocation step 4
* Created date : 10 JULY 2020 
* Last updated :
*/
usrRoutr.route('/setUserInterestedLocation')
.post([jwtHandler.verifyUsrToken,validators.userInterestedLocationValidate], (req, res) => {
  usrFacade.setUserInterestedLocation(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})

  /**
* For :Application
* Purpose :User followings List  topics / publications with pagination & count
* Created date : 11 JULY 2020 
* Last updated :
*/
usrRoutr.route('/followingsList')
.post([jwtHandler.verifyUsrToken], (req, res) => {
  usrFacade.userFollowingsList(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})


  /**
* For :Application
* Purpose :setUserInterestedPublication
* Created date : 11 JULY 2020 
* Last updated :
*/
usrRoutr.route('/setUserInterestedPublication')
.post([jwtHandler.verifyUsrToken,validators.userInterestedPublicationValidate], (req, res) => {
  usrFacade.setUserInterestedPublication(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})


  /**
* For :Application
* Purpose :Edit User Profile
* Created date : 13 JULY 2020 
* Last updated :
*/
usrRoutr.route('/editProfile')
.post([jwtHandler.verifyUsrToken,validators.userEditProfileValidate], (req, res) => {
  usrFacade.editProfile(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})


  /**
* For :Application
* Purpose :create Bundle
* Created date : 28 AUG 2020 
* Last updated :
*/
usrRoutr.route('/createBundle')
.post([jwtHandler.verifyUsrToken,validators.userCreateBundleValidate], (req, res) => {
  usrFacade.createBundle(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})


  /**
* For :Application
* Purpose :edit Bundle
* Created date : 31 AUG 2020 
* Last updated :
*/
usrRoutr.route('/editBundle/:id')
.post([jwtHandler.verifyUsrToken,userValidators.validateId,validators.userEditBundleValidate], (req, res) => {
  usrFacade.editBundle(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})




  /**
* For :Application
* Purpose :save Bundle
* Created date : 31 AUG 2020 
* Last updated :
*/
usrRoutr.route('/saveBundle/:id')
.post([jwtHandler.verifyUsrToken,userValidators.validateId], (req, res) => {
  usrFacade.saveBundle(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})

  /**
* For :Application
* Purpose :view User Profile
* Created date : 1 SEP 2020 
* Last updated :
*/
usrRoutr.route('/viewProfile')
.get([jwtHandler.verifyUsrToken], (req, res) => {
  usrFacade.viewProfile(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})


  /**
* For :Application
* Purpose :Users Bundle List
* Created date : 1 SEP 2020 
* Last updated :
*/
usrRoutr.route('/usersBundleList')
.post([jwtHandler.verifyUsrToken,userValidators.validateBundleType], (req, res) => {
  usrFacade.usersBundleList(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})


  /**
* For :Application
* Purpose :Other Users bundle List by Pagination ( 6 )
* Created date : 2 SEP 2020 
* Last updated :
*/
usrRoutr.route('/bundleList')
.post([jwtHandler.verifyUsrToken], (req, res) => {
  usrFacade.bundleList(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})



  /**
* For :Application
* Purpose :Other Users bundle List by Pagination ( 6 )
* Created date : 2 SEP 2020 
* Last updated :
*/
usrRoutr.route('/followingsListWithArticles')
.post([jwtHandler.verifyUsrToken], (req, res) => {
  usrFacade.followingsListWithArticles(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})

//
  /**
* For :Application
* Purpose :Users Bundle List
* Created date : 1 SEP 2020 
* Last updated :
*/
usrRoutr.route('/usersBundleNamesList')
.post([jwtHandler.verifyUsrToken], (req, res) => {
  usrFacade.usersBundleNamesList(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})

//
  /**
* For :Application
* Purpose :Update Notification Data
* Created date : 17 SEP 2020 
* Last updated :
*/
usrRoutr.route('/editNotifications')
.post([jwtHandler.verifyUsrToken], (req, res) => {
  usrFacade.editUserNotifications(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})

//
  /**
* For :Application
* Purpose :get Notification Data
* Created date : 17 SEP 2020 
* Last updated :
*/
usrRoutr.route('/getNotifications')
.get([jwtHandler.verifyUsrToken], (req, res) => {
  usrFacade.getUserNotifications(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})



//
  /**
* For :Application
* Purpose :Sign in as guest
* Created date : 21 SEP 2020 
* Last updated :
*/
usrRoutr.route('/guestSignIn')
.post([], (req, res) => {
  usrFacade.guestSignIn(req, res).then(result => {
    resHndlr.sendSuccess(res, result)
  }).catch(err => {
    resHndlr.sendError(res, err)
  })
})

usrRoutr.route('/dashboardDetail')
  .post([jwtHandler.verifyAdminToken], (req, res) => {
    usrFacade.dashboardDetail(req, res).then((result) => {
      resHndlr.sendSuccess(res, result)
    }).catch((err) => {
      resHndlr.sendError(res, err)
    })
  })

module.exports = usrRoutr
