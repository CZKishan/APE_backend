
const adminDao = require('./adminDao');
const jwtHandler = require("../../handlers/jwtHandler");
const appUtils = require('../../utils/appUtils')
const constants = require('../../constants')
const mongoose = require('mongoose');
var _ = require('lodash');
const emailHelper = require('../../utils/emailHelper');


/**login for admin */
async function login(req, res) {
    let { user_email, user_password } = req.body
    let query = {
        user_email: user_email,
        user_status: constants.STATUS.ACTIVE,
        user_is_deleted: false
    };

    return await adminDao.getAdminDetails(query).then(async (isExist) => {
        if (isExist) {

            return await appUtils.verifyPassword(user_password, isExist).then(async (valid) => {
                if (valid) {

                    let obj = {
                        _first_name: isExist.user_first_name,
                        _role_id: isExist.user_role_id,
                        _id: isExist._id,
                        _email: isExist.user_email
                    };
                    return await jwtHandler.genAdminToken(obj).then(async (jwt) => {
                        isExist =await isExist.toObject();
                        isExist.user_jwt = await jwt;

                        let query = {
                            _id: mongoose.Types.ObjectId(obj._id)
                        };
                        let updateData = {
                            $push: {
                                user_tokens: { user_jwt: jwt }
                            }
                        };
                        await adminDao.commonUpdateDetails(query, updateData)


                        return await { user: isExist };
                    });
                } else {
                    return 2;
                }
            }).catch((err) => {
                console.log(err);
            })
        } else {
            return 1;
        }
    })
}


function forgotPassword(req, res) {
    let findQuery = {
        user_email: req.body.user_email,
        user_status: constants.STATUS.ACTIVE,
        user_is_deleted: false
    };
    return adminDao.checkIfExist(findQuery, {}).then(async (data) => {
        if (data) {
            let token = await jwtHandler.genResetPasswordAdminToken({
                _first_name: data.user_first_name,
                _role_id: data.user_role_id,
                _id: data._id,
                _email: data.user_email
            });
            let forgot_link = process.env.forgot_link
            let links = forgot_link + token
 
            var mail = await emailHelper.sendForgotPasswordLink(data, links)
            return {};
        } else {
            return 1;
        }
    })
}


function isAdmin(req) {
    let query = {
        _id: mongoose.Types.ObjectId(req._id),
        user_is_deleted: false,
        $or: [{ user_role_id: constants.ACCOUNT_LEVEL.ADMIN }, { user_role_id: constants.ACCOUNT_LEVEL.SUPERADMIN }]

    };

    return adminDao.checkIfExist(query, {}).then((result) => {
        if (result && result != null) {
            return result;
        } else {
            return 1;
        }
    })

}


async function resetPassword(req) {
    if (req.body.user_password === req.body.user_confirm_password) {
        let password = await appUtils.generateSaltAndHashForPassword(req.body.user_password)
        let findQuery = {
            _id: mongoose.Types.ObjectId(req._id),
            user_is_deleted: false
        };
        let updateData = {
            user_password: password
        };
        return adminDao.updateDetails(findQuery, updateData).then(async (data) => {

            if (data) {

                await adminDao.saveToken({
                    'blt_token': req.headers.authorization
                });
                return data;

            }
        }).catch((err) => {
            return 2;
        });
    } else {
        return 1
    }
}

function checkBlackListToken(req) {
    return adminDao.checkIfExistToken({ 'blt_token': req.headers.authorization })
}

//-------------TODO IMAGE UPLOAD
async function addAdmin(req) {

    let findQuery = {
        user_is_deleted: false,
        $or: [{ user_phone_number: { $eq: req.body.user_phone_number } }, { user_email: { $eq: req.body.user_email } }]
    }
    return await adminDao.checkIfExist(findQuery, {}).then(async (result) => {
        if (result && result != null) {
            return 1;
        } else {
            return await adminDao.getRedisValue(req.body.user_email).then(async data => {
                if (!data) {
                    return await saveAdmin(req)

                } else {
                    /******************for already email is existed********************/
                    return 1;
                }
            })
        }
    })
}



async function saveAdmin(req) {
    let userData = req.body;
    // const country = await getCountry(process.env.ISDCODE)
    // userData.user_country_id = country._id;
    // userData.user_isd_code = country.country_isdCode;
    if (userData.user_password) {
        /*******this method used for convert simple string password to hash password*************/
        var password = await appUtils.generateSaltAndHashForPassword(userData.user_password)
        userData.user_password = password
    }

    console.log("this is admin data", userData)
    /*****************************for add Admin************************* */
    return await adminDao.addAdmin(userData).then(async (register) => {
        console.log("this i s registor ", register)
        //         // register.currencyCode = await getUserCountryDetails(register.user_country_id)
        //         /** ******************here add details in redis***************************************/
        adminDao.setRedisValue(register.user_email, JSON.stringify(register))
        return 3;

    })
}

function getAdminById(req) {

    let findQuery = {
        user_is_deleted: false,
        _id: mongoose.Types.ObjectId(req.params.id)
    }

    return adminDao.checkIfExist(findQuery, { user_password: 0 }).then((result) => {
        if (result && result != null) {
            return result;
        } else {
            return 1;
        }
    })
}


function deleteAdminById(req) {
    let findQuery = {
        user_is_deleted: false,
        _id: mongoose.Types.ObjectId(req.params.id)
    }
    let updateData = {
        user_is_deleted: true
    };

    updateData['user_modify_by'] = mongoose.Types.ObjectId(req._id);

    return adminDao.checkIfExist(findQuery, {}).then((result) => {
        if (result && result != null) {
            return adminDao.updateDetails(findQuery, updateData).then(async (data) => {
                if (data) {
                    return data;
                }
            })
        } else {
            return 1;
        }
    })

}

async function updateAdminById(req) {
    let findQuery = {
        user_is_deleted: false,
        _id: mongoose.Types.ObjectId(req.params.id)
    }

    let phoneUniqueQuery = {
        user_email: req.body.user_email,
        _id: { $ne: mongoose.Types.ObjectId(req.params.id) }
    }

    let obj = {
        user_first_name: req.body.user_first_name,
        user_last_name: req.body.user_last_name,
        user_phone_number: req.body.user_phone_number,
        user_email: req.body.user_email,
        user_isd_code: req.body.user_isd_code,
        user_country_id: req.body.user_country_id,
        user_profile_image: req.body.user_profile_image && req.body.user_profile_image != undefined && req.body.user_profile_image != null ? req.body.user_profile_image : ''
    }
    if (req.body.user_password && req.body.user_password != '') {
        var password = await appUtils.generateSaltAndHashForPassword(req.body.user_password)
        obj.user_password = password
    }
    let updateData = obj;

    updateData['user_modify_by'] = mongoose.Types.ObjectId(req._id);

    return await adminDao.checkIfExist(findQuery, { user_password: 0 }).then(async (result) => {
        if (result && result != null) {

            return await adminDao.checkIfExist(phoneUniqueQuery, {}).then((res) => {
                if (res && res != null) {
                    return 2;
                } else {
                    return adminDao.updateDetails(findQuery, updateData).then(async (data) => {
                        if (data) {
                            return data;
                        }
                    })
                }
            })
        } else {
            return 1;
        }
    })
}




async function listAdmin(req) {

    let ninArray = [];
    ninArray.push(constants.ACCOUNT_LEVEL.USER,constants.ACCOUNT_LEVEL.GUEST);
    if (req._roleId != constants.ACCOUNT_LEVEL.SUPERADMIN) {
        ninArray.push(constants.ACCOUNT_LEVEL.SUPERADMIN);
        ninArray.push(constants.ACCOUNT_LEVEL.ADMIN);
    }
    let query = {
        role_id: { $nin: ninArray },
        user_is_deleted: false,
        _id: { $ne: mongoose.Types.ObjectId(req._id) }
    };

    let option = {
        sort: {
            'user_created_at': -1
        }
    };


    var columnName = null;
    var clumnValue = null;
    var key = null;
    var cname = null;


    if (req.body['search[value]']) {
        query['$or'] = [];
    }

    for (let i = 0; i < 8; i++) {
        if (req.body['columns[' + i + '][search][value]']) {

            if (columnName = req.body['columns[' + i + '][data]']) {

                columnName = req.body['columns[' + i + '][data]']
                clumnValue = req.body['columns[' + i + '][search][value]'];

                key = columnName;
                if (key == 'user_displayName') {
                    query['$or'] = [];
                    query['$or'].push({
                        ['firstName']: {
                            $regex: clumnValue,
                            $options: 'i'
                        }
                    });
                    query['$or'].push({
                        ['lastName']: {
                            $regex: clumnValue,
                            $options: 'i'
                        }
                    });
                } else if (key == 'user_status') {
                    query[key] = clumnValue;
                } else {
                    query[key] = {
                        $regex: clumnValue,
                        $options: 'i'
                    }
                }
            }
        }
        if (req.body['order[0][column]'] == i) {
            cname = req.body['columns[' + i + '][data]'];

            option = {
                sort: {
                    [cname]: (req.body['order[0][dir]'] == 'asc') ? 1 : -1
                }
            };
        }
    }

    option['offset'] = parseInt(req.body['start']);
    option['limit'] = parseInt(req.body['length']);

    let aggregateQuery = [{
        $lookup: {
            from: constants.LOOKUP_DB_NAME.ROLE,
            foreignField: "_id",
            localField: "user_role_id",
            as: "role_details"
        }
    }, { '$unwind': '$role_details' }, {
        $project: {
            _id: 1,
            firstName: {
                $ifNull: ['$user_first_name', '']
            },
            lastName: {
                $ifNull: ['$user_last_name', '']
            },
            role_id: '$role_details._id',
            role_name: '$role_details.role_name',
            user_email: 1,
            user_status: 1,
            user_created_at: 1,
            user_is_deleted: 1,
            user_phone_number: 1
        }
    }, {
        $match: query
    }, {
        $sort: option.sort
    }];


    let skipQuery = { $skip: option.offset };
    let limitQuery = {
        $limit: option.limit
    };
    let totalAgQuery = _.cloneDeep(aggregateQuery);
    await aggregateQuery.push(skipQuery);
    aggregateQuery.push(limitQuery);

    return await adminDao.getListByAggregate(aggregateQuery, totalAgQuery, option).then((result) => {
        if (result && result != null) {
            return result
        } else {
            return 1;
        }
    })
}

async function changeStatusById(req) {
    let query = {
        _id: mongoose.Types.ObjectId(req.params.id),
        user_is_deleted: false
    };
    return await adminDao.checkIfExist(query, {}).then(async (result) => {
        if (result && result != null) {
            if (req.body.user_status == result.user_status) {
                if (req.body.user_status == constants.STATUS.ACTIVE) {
                    return 2;
                } else {
                    return 3;
                }
            } else {
                let details = req.body;
                details['user_modify_by'] = mongoose.Types.ObjectId(req._id);

                return await adminDao.updateDetails(query, details).then((data) => {
                    if (data) {
                        return 4
                    }
                });
            }

        } else {
            return 1;
        }
    });
}

function logout(req) {
    let findUserQuery = {
        _id: mongoose.Types.ObjectId(req._id),
        user_is_deleted: false
    };
    let updateData = {
        $pull: {
            'user_tokens': { user_jwt: req.headers['authorization'] }
        }
    };

    return adminDao.commonUpdateDetails(
        findUserQuery,
        updateData
    ).then(result => {
        if (result) {
            return {};
        } else {
            return 1;
        }
    }).catch((err) => {
        return 1;
    })

}

module.exports = {
    login,
    forgotPassword,
    isAdmin,
    resetPassword,
    checkBlackListToken,
    addAdmin,
    getAdminById,
    deleteAdminById,
    updateAdminById,
    listAdmin,
    changeStatusById,
    logout
};
