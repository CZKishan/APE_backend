
//= ========================= Load Modules Start =======================
const userMsg = require('./userConstants');
const constants = require('../../constants');
const usrService = require('./userService')
const resHandlr = require('../../handlers/responseHandler');
const { func } = require('@hapi/joi');


function uploadData(req) {
  return usrService.uploadData(req).then((data) => {
    if (data == 3) {
      return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.fileNotFound, {})
    } else if (data === 2) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.inValidType, {})
    } else if (data === 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.uploadErr, {})
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.uploadSuccess, data)
    }
  }).catch((er) => {
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.uploadErr, {})
  })
}

function addUser(req) {
  return usrService.addUser(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.emailAlreadyExist, {});
    } else if (data == 2) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issueWithPassGenerate, {});
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.addUserSuccess, data)
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}

function editUser(req) {
  return usrService.editUser(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {});
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.updatedSuccess, data)
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}


function getUserById(req) {
  return usrService.getUserById(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {});
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.getUserSuccess, data)
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}

function deleteUserById(req) {
  return usrService.deleteUserById(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {});
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.deleteSuccess, data)
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}

function listUser(req) {
  return usrService.listUser(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {});
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.listingSuccess, data)
    }
  }, (error) => {
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}


function signUp(req) {
  return usrService.signUp(req).then((data) => {
    console.log('data-----------------------', data);
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.emailAlreadyExist, {});
    } else {
      console.log('data-------222', data);
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.signUpSuccess, data)
    }
  }, (error) => {
    console.log('eeeeee', error);
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}

function verifyEmail(req) {
  return usrService.verifyEmail(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {});
    } else if (data == 2) {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.signInSuccess, {})
    } else if (data == 3) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusTrue, constants.MESSAGES.userInactive, {})
    } else {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {});
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}

function signIn(req) {
  return usrService.signIn(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.registerViaInValid, {});
    } else if (data == 2) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {});
    } else if (data == 3) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.passwordMismatch, {});
    } else if (data == 5) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.userInactive, {});
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.signInSuccess, data)
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}

function forgotPassword(req) {
  return usrService.forgotPassword(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {});
    } else if (data == 2) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.alreadyRegisteredWithSocial, {});
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.emailSended, data)
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}

function otpCheck(req) {
  return usrService.otpCheck(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.invalidOtp, {});
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.otpVerified, {})
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}


function resetPassword(req) {
  return usrService.resetPassword(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.passwordMismatch, {});
    } else if (data == 2) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {});
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.resetPasswordSuccess, {})
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}


function logout(req) {
  return usrService.logout(req).then((result) => {
    if (result == 1) {
      return resHandlr.requestResponse(constants.http_code.dataNotFound, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {})
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.logoutSuccessfully, {})
    }
  })
}


function changeUserAppLanguage(req) {
  return usrService.changeUserAppLanguage(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.languageNotFound, {});
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.appLanguageChangeSuccess, {})
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}

function changeUserNewsLanguage(req) {
  return usrService.changeUserNewsLanguage(req).then((data) => {
    if (data && data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.languagesNotFound, {})
    } else if (data && data != null) {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.newsLanguageChangeSuccess, {})
    } else {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}

function setUserInterestedTopics(req) {
  return usrService.setUserInterestedTopics(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {})
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.updatedSuccess, {})
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}


function setUserInterestedLocation(req) {
  return usrService.setUserInterestedLocation(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.dataNotFound, {})
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.updatedSuccess, {})
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}

function userFollowingsList(req) {
  return usrService.userFollowingsList(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.invalidType, {})
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.listingSuccess, data)
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}


function setUserInterestedPublication(req) {
  return usrService.setUserInterestedPublication(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {})
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.updatedSuccess, {})
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}

function editProfile(req) {
  return usrService.editProfile(req).then((data) => {
    if (data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {})
    } else if (data == 2) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.passwordMismatch, {});
    } else if (data == 3) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.newAndConfPasswordNotSame, {});
    } else if (data == 4) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.atLeastOneField, {});
    } else if (data == 5) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.emailAlreadyExist, {});
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.updatedSuccess, data)
    }
  }, (error) => {
    
    // return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}

function createBundle(req) {
  return usrService.createBundle(req).then((data) => {
    if (data && data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.bundleNameError, {})
    } else if (data && data != null) {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.createBundleSuccess, { _id: data._id })
    } else {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithCreateBundle, {})
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithCreateBundle, {})
  })
}

function editBundle(req) {
  return usrService.editBundle(req).then((data) => {
    if (data && data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.bundleNotFound, {})
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.editBundleSuccess, {})
    }
  }, (error) => {
   
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithEditBundle, {})
  })
}


function saveBundle(req) {
  return usrService.saveBundle(req).then((data) => {
    if (data && data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.bundleNotFound, {})
    } else if (data == 3) {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.saveBundleSuccess, {})
    } else if (data == 4) {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.removeBundleSuccess, {})
    } else {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithSaveBundle, {})
    }

  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithSaveBundle, {})
  })
}


function viewProfile(req) {
  return usrService.viewProfile(req).then((data) => {
    if (data && data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {})
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.viewProfileSuccess, data)
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithViewProfile, {})
  })
}


function usersBundleList(req) {
  return usrService.usersBundleList(req).then((data) => {
    if (data && data != null) {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.usersBundleListSuccess, data)
    } else {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithUserListBundle, {})
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithUserListBundle, {})
  })
}


function bundleList(req) {
  return usrService.bundleList(req).then((data) => {
    if (data && data != null) {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.usersBundleListSuccess, data)
    } else {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithUserListBundle, {})
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithUserListBundle, {})
  })
}

function followingsListWithArticles(req) {
  return usrService.followingsListWithArticles(req).then((data) => {
    if (data && data != null) {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, constants.MESSAGES.listingSuccess, data)
    } else {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.InternalServerError, {})
  })
}


function usersBundleNamesList(req) {
  return usrService.usersBundleNamesList(req).then((data) => {
    if (data && data != null) {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.usersBundleListSuccess, data)
    } else {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithUserListBundle, {})
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithUserListBundle, {})
  })
}


function editUserNotifications(req) {
  return usrService.editUserNotifications(req).then((data) => {
    if (data && data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {})
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.notificationEditSuccess, {})
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithupdate, {})
  })
}

function getUserNotifications(req) {
  return usrService.getUserNotifications(req).then((data) => {
    if (data && data == 1) {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.userNotFound, {})
    } else {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.getNotificationSuccess, data)
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithGet, {})
  })
}
// 

function guestSignIn(req) {
  return usrService.guestSignIn(req).then((data) => {
    if (data && data != null) {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.countinueAsGuestSuccess, data)
    } else {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.issWithCountinueAsGuest, {})
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithCountinueAsGuest, {})
  })
}


function dashboardDetail(req) {
  return usrService.dashboardDetail(req).then((data) => {
    if (data && data != null) {
      return resHandlr.requestResponse(constants.http_code.ok, constants.MESSAGES.statusTrue, userMsg.MESSAGES.dashboardDetailSuccess, data)
    } else {
      return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, constants.MESSAGES.issWithDashboardDetail, {})
    }
  }, (error) => {
    
    return resHandlr.requestResponse(constants.http_code.badRequest, constants.MESSAGES.statusFalse, userMsg.MESSAGES.issWithDashboardDetail, {})
  })
}

module.exports = {
  uploadData, /* upload image/video using s3 bucket */
  addUser,
  editUser,
  getUserById,
  deleteUserById,
  listUser,

  //------Application
  signUp,
  verifyEmail,
  signIn,
  forgotPassword,
  otpCheck,
  resetPassword,
  logout,
  changeUserAppLanguage,
  changeUserNewsLanguage,
  setUserInterestedTopics,
  setUserInterestedLocation,
  userFollowingsList,
  setUserInterestedPublication,
  editProfile,
  createBundle,
  editBundle,
  saveBundle,
  viewProfile,
  usersBundleList,
  bundleList,
  followingsListWithArticles,
  usersBundleNamesList,
  editUserNotifications,
  getUserNotifications,
  guestSignIn,
  dashboardDetail
}










// [
//   {
//     "_id": "5f6b458b1f52ca5938d483f6",
//     "corporateAdminDetails": [
//       {
//         "firstName": "code",
//         "lastName": "z"
//       }
//     ],
//     "employeeDetails": [
//       {
//         "firstName": "James",
//         "lastName": "varghese"
//       }
//     ],
//     "productDetails": [
//       {
//         "product_name": "Mouse234",
//         "product_cost": "1000",
//         "first_three_month_cost": 250
//       },
//       {
//         "product_name": "mary",
//         "product_cost": "1000",
//         "first_three_month_cost": 250
//       }
//     ]
//   },
//   {
//     "_id": "5f6c390cb4e004352926734d",
//     "address": "bhavnagar",
//     "corporateAdminDetails": [
//       {
//         "firstName": "demo11",
//         "lastName": "dd111"
//       }
//     ],
//     "employeeDetails": [
//       {
//         "firstName": "James",
//         "lastName": "varghese"
//       }
//     ],
//     "productDetails": [
//       {
//         "product_name": "Mouse234",
//         "product_cost": "1000",
//         "first_three_month_cost": 250
//       },
//       {
//         "product_name": "mary",
//         "product_cost": "1000",
//         "first_three_month_cost": 250
//       }
//     ]
//   },
//   {
//     "_id": "5f6c78d9fcd45b6792d07160",
//     "address": "Ahmedabad",
//     "corporateAdminDetails": [
//       {
//         "firstName": "code",
//         "lastName": "z"
//       }
//     ],
//     "employeeDetails": [
//       {
//         "firstName": "James",
//         "lastName": "varghese"
//       }
//     ],
//     "productDetails": [
//       {
//         "product_name": "table",
//         "product_cost": "1500",
//         "first_three_month_cost": 375
//       }
//     ]
//   }
// ]




// [
//   {
//     "_id": "5f6b458b1f52ca5938d483f6",
//     "corporateAdminDetails": [
//       {
//         "firstName": "code",
//         "lastName": "z"
//       }
//     ],
//     "employeeDetails": [
//       {
//         "firstName": "James",
//         "lastName": "varghese"
//       }
//     ],
//     "productDetails": [
//       {
//         "product_name": "Mouse234",
//         "product_cost": "1000",
//         "first_three_month_cost": 250
//       },
//       {
//         "product_name": "mary",
//         "product_cost": "1000",
//         "first_three_month_cost": 250
//       },
//       {

//         "product_name": "table",
//         "product_cost": "1500",
//         "first_three_month_cost": 375
//       }
//     ]
//   },
//   {
//     "_id": "5f6c390cb4e004352926734d",
//     "address": "bhavnagar",
//     "corporateAdminDetails": [
//       {
//         "firstName": "demo11",
//         "lastName": "dd111"
//       }
//     ],
//     "employeeDetails": [
//       {
//         "firstName": "James",
//         "lastName": "varghese"
//       }
//     ],
//     "productDetails": [
//       {
//         "product_name": "Mouse234",
//         "product_cost": "1000",
//         "first_three_month_cost": 250
//       },
//       {
//         "product_name": "mary",
//         "product_cost": "1000",
//         "first_three_month_cost": 250
//       }
//     ]
//   },

//   ]
