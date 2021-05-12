'use strict'

//= ========================= Load Modules Start =======================
const constants = require('../../constants');
require('dotenv').config
const userDao = require('./userDao');
const bundleDao = require('../article/articledao');
const jwtHandler = require("../../handlers/jwtHandler");
const mongoose = require('mongoose');

const imageUpload = require('../../utils/imageUpload');
const appUtils = require('../../utils/appUtils');
const emailHelper = require('../../utils/emailHelper');
const _ = require('lodash');
const generator = require('generate-password');
const notificationHelper = require('../../utils/notificationHelper');

async function uploadData(req) {
    if (req.files == null) {
        return 3;
    } else {
        let updType = req.body.updType;
        if (req.files) {
            if (updType == constants.UPLOAD_TYPE.IMAGE) {
                let reponseImg = await imageUpload.uploadDocs(req.files.updDocs);
                let obj = {
                    'url': reponseImg.Location,
                    'publicid': reponseImg.key,
                }
                return obj;
            }
            else if (updType == constants.UPLOAD_TYPE.VIDEO) {
                let reponseImg = await imageUpload.uploadVideo(req.files.updDocs);
                let obj = {
                    'url': reponseImg.Location,
                    'publicid': reponseImg.key,
                }
                return obj;
            }
            else {
                return 2;
            }
        } else {
            return 1;
        }
    }
}

async function addUser(req) {

    let findQuery = {
        user_is_deleted: false,
        user_email: req.body.user_email
    };

    return await userDao.checkIfExist(findQuery, {}).then(async (result) => {
        if (result && result != null) {
            return 1;
        } else {
            return await userDao.getRedisValue(req.body.user_email).then(async data => {
                if (!data) {
                    // return await saveUser(req)
                    let userData = req.body;

                    userData.user_role_id = constants.ACCOUNT_LEVEL.USER;

                    let generatePassword = await generator.generate({
                        length: 10,
                        numbers: true,
                        symbols: true
                    });
                    if (generatePassword) {
                        var password = await appUtils.generateSaltAndHashForPassword(generatePassword);
                        userData.user_password = password;

                        return await userDao.createUser(userData).then(async (register) => {

                            if (register && register != null) {
                                await userDao.setRedisValue(register.user_email, JSON.stringify(register))
                                await emailHelper.sendUserAccountGenerate(generatePassword, userData);
                            }

                        })
                    } else {
                        return 2;
                    }

                } else {
                    /******************for already email is existed********************/
                    return 1;
                }
            })
        }
    });


}

async function editUser(req) {

    let findQuery = {
        user_is_deleted: false,
        user_email: req.body.user_email
    };

    return await userDao.checkIfExist(findQuery, {}).then(async (result) => {
        if (result && result != null) {
            let updateData = {
                user_name: req.body.user_name
            };

            return userDao.updateDetails(findQuery, { $set: updateData }).then((data) => {
                if (data && data != null) {
                    return data;
                }
            });
        } else {
            return 1;
        }
    });
}


async function getUserById(req) {

    let findQuery = {
        user_is_deleted: false,
        _id: mongoose.Types.ObjectId(req.params.id)
    }

    return userDao.checkIfExist(findQuery, { user_password: 0 }).then((result) => {
        if (result && result != null) {
            return result;
        } else {
            return 1;
        }
    })
}

async function deleteUserById(req) {
    let findQuery = {
        user_is_deleted: false,
        _id: mongoose.Types.ObjectId(req.params.id)
    }
    let updateData = {
        user_is_deleted: true
    };

    updateData['user_modify_by'] = mongoose.Types.ObjectId(req._id);

    return userDao.checkIfExist(findQuery, {}).then(async (result) => {
        if (result && result != null) {
            if (result.user_tokens) {

                // redis.del.apply(redis, ["aaa","bbb","ccc"])
                await userDao.deleteRedisValue(result.user_email).then(async (data) => { })
            }

            return userDao.updateDetails(findQuery, updateData).then(async (data) => {
                if (data) {
                    return data;
                }
            })
        } else {
            return 1;
        }
    })

}

async function listUser(req) {

    let ninArray = [constants.ACCOUNT_LEVEL.USER];
    // ninArray.push(constants.ACCOUNT_LEVEL.USER);
    // if (req._roleId != constants.ACCOUNT_LEVEL.SUPERADMIN) {
    //     ninArray.push(constants.ACCOUNT_LEVEL.SUPERADMIN);
    //     ninArray.push(constants.ACCOUNT_LEVEL.ADMIN);
    // }
    let query = {
        role_id: { $in: ninArray },
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

    for (let i = 0; i < 6; i++) {
        if (req.body['columns[' + i + '][search][value]']) {

            if (columnName = req.body['columns[' + i + '][data]']) {

                columnName = req.body['columns[' + i + '][data]']
                clumnValue = req.body['columns[' + i + '][search][value]'];

                key = columnName;
                // if (key == 'user_displayName') {
                //     query['$or'] = [];
                //     query['$or'].push({
                //         ['firstName']: {
                //             $regex: clumnValue,
                //             $options: 'i'
                //         }
                //     });
                //     // console.log('------------------------------------1',query)
                //     query['$or'].push({
                //         ['lastName']: {
                //             $regex: clumnValue,
                //             $options: 'i'
                //         }
                //     });
                // } else 
                if (key == 'user_status') {
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
            user_name: 1,
            role_id: '$role_details._id',
            role_name: '$role_details.role_name',
            user_email: 1,
            user_status: 1,
            user_created_at: 1,
            user_is_deleted: 1,
            // user_phone_number: 1
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

    return await userDao.getListByAggregate(aggregateQuery, totalAgQuery, option).then((result) => {
        if (result && result != null) {
            return result
        } else {
            return 1;
        }
    })
}


async function signUp(req) {
    let findQuery = {
        user_is_deleted: false,
        user_email: req.body.user_email
    }
    return await userDao.checkIfExist(findQuery, {}).then(async (result) => {
        if (result && result != null) {
            return 1;
        } else {
            return await userDao.getRedisValue(req.body.user_email).then(async data => {
                if (!data) {
                    return await saveUser(req)
                } else {
                    /******************for already email is existed********************/
                    return 1;
                }
            })
        }
    });
}

async function saveUser(req) {
    let userData = req.body;
    // const country = await getCountry(process.env.ISDCODE)
    // userData.user_country_id = country._id;
    // userData.user_isd_code = country.country_isdCode;
    userData.user_role_id = constants.ACCOUNT_LEVEL.USER;

    if (userData.user_password) {
        /*******this method used for convert simple string password to hash password*************/
        var password = await appUtils.generateSaltAndHashForPassword(userData.user_password)
        userData.user_password = password
    }
    /*****************************for add Admin************************* */
    return await userDao.createUser(userData).then(async (register) => {
        console.log('registercdscdc', register);
        await userDao.setRedisValue(register.user_email, JSON.stringify(register))
        createDefaultBundle(register._id)
        // let obj = {
        //     _user_name: register.user_name,
        //     _role_id: register.user_role_id,
        //     _id: register._id,
        //     _email: register.user_email
        // };
        //********************here add details in redis***************************************/
        // return await jwtHandler.genUserToken(obj).then(async (jwt) => {
        //     //    let register = register.toObject();

        //     register.user_jwt = jwt;
        //     let query = {
        //         _id: mongoose.Types.ObjectId(obj._id)
        //     };
        //     let updateData = {
        //         $push: {
        //             user_tokens: {
        //                 user_jwt: jwt,
        //                 user_device_id: userData.user_device_id,
        //                 user_device_type: userData.user_device_type,
        //                 user_device_token: userData.user_device_token,
        //             }
        //         }
        //     };
        //     userDao.updateDetails(query, updateData)

        //     return await { user: register };
        // });
        return await generateToken(req, register)

    })
}

async function verifyEmail(req) {
    let query = {
        user_email: req.body.user_email,
        user_is_deleted: false,
        // "user_status": constants.STATUS.ACTIVE
    };
    return await userDao.checkIfExist(query, {}).then(async (isExist) => {
        if (isExist && isExist != null) {
            if (isExist.user_status == constants.STATUS.ACTIVE) {
                return 2;
            } else {
                return 3;
            }

        } else {
            return 1;
        }
    })

}

async function signIn(req) {
    let { user_register_via } = req.body;

    // if registerd via normal
    if (user_register_via && user_register_via == constants.REGISTERED_VIA.NORMAL) {
        let query = {
            user_email: req.body.user_email,
            user_is_deleted: false,
            // "user_status": constants.STATUS.ACTIVE
        };

        return await userDao.checkIfExist(query, {}).then(async (isExist) => {
            if (isExist && isExist != null) {
                if (isExist.user_status == constants.STATUS.ACTIVE) {
                    return await appUtils.verifyPassword(req.body.user_password, isExist).then(async (valid) => {
                        if (valid) {
                            return await generateToken(req, isExist);
                        } else {
                            return 3;
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                } else {
                    return 5;
                }
            } else {
                return 2;
            }
        })

    }
    // if registerd via google
    else if (user_register_via && user_register_via == constants.REGISTERED_VIA.GOOGLE) {
        let query = {
            user_google_id: req.body.user_account_id,
            user_is_deleted: false
        };

        return await userDao.checkIfExist(query, {}).then(async (isExist) => {
            if (isExist && isExist != null) {

                if (isExist.user_status == constants.STATUS.ACTIVE) {
                    return await generateToken(req, isExist);
                } else {
                    return 5;
                }
            } else {
                return await socialSignUp(req, user_register_via);
            }
        });
    }
    // if registerd via facebook
    else if (user_register_via && user_register_via == constants.REGISTERED_VIA.FACEBOOK) {
        let query = {
            user_facebook_id: req.body.user_account_id,
            user_is_deleted: false
        };
        return await userDao.checkIfExist(query, {}).then(async (isExist) => {
            if (isExist && isExist != null) {
                if (isExist.user_status == constants.STATUS.ACTIVE) {

                    return await generateToken(req, isExist);
                } else {
                    return 5;
                }
            } else {
                // generate the record
                return await socialSignUp(req, user_register_via);
            }
        });
    } else {
        return 1;
    }
}

async function generateToken(req, data) {
    console.log('data123456798', data);
    let obj = {
        _role_id: data.user_role_id,
        _id: data._id,
        _email: data.user_email && data.user_email != null ? data.user_email : ''
    };
    return await jwtHandler.genUserToken(obj).then(async (jwt) => {
        data.user_jwt = jwt;    
        let obj = {
            user_first_name: data.user_first_name && data.user_first_name != null ? data.user_first_name : "",
            user_last_name: data.user_last_name && data.user_last_name != null ? data.user_last_name : "",
            user_email: data.user_email && data.user_email != null ? data.user_email : '',
            _id: data._id,
            user_jwt: jwt,
            // user_news_languages: data.user_news_languages && data.user_news_languages != null ? data.user_news_languages : '',
            // user_follow_topics: data.user_follow_topics && data.user_follow_topics != null ? data.user_follow_topics : '',
            // user_app_language: data.user_app_language && data.user_app_language != null ? data.user_app_language : '',
            // user_location: data.user_location && data.user_location != null ? data.user_location : '',
            // user_progress: data.user_progress
        };

        let query1 = {
            _id: mongoose.Types.ObjectId(obj._id)
        };
        let updateData = {
            $push: {
                user_tokens: {
                    user_jwt: jwt,
                    user_device_id: req.body.user_device_id,
                    user_device_type: req.body.user_device_type,
                    user_device_token: req.body.user_device_token,

                }
            }
        };
        userDao.updateDetails(query1, updateData)

        return await obj;
    });

}

async function socialSignUp(req, type) {

    if (type == constants.REGISTERED_VIA.FACEBOOK) {

        if (req.body.user_email && req.body.user_email != undefined) {

            let query = {
                user_email: req.body.user_email
            };
            return await userDao.checkIfExist(query, {}).then(async (data) => {
                if (data && data != null) {
                    let updateData = {
                        $set: {
                            // user_register_via: req.body.user_register_via,
                            user_facebook_id: req.body.user_account_id
                        }
                    };
                    userDao.updateDetails(query, updateData);

                    return await generateToken(req, data);
                } else {
                    return await socialSignUpCreate(req, type);
                }
            });
        } else {
            return await socialSignUpCreate(req, type);
        }
    } else {
        if (req.body.user_email && req.body.user_email != undefined) {

            let query = {
                user_email: req.body.user_email
            };
            return await userDao.checkIfExist(query, {}).then(async (data) => {
                if (data && data != null) {
                    let updateData = {
                        $set: {
                            // user_register_via: req.body.user_register_via,
                            user_google_id: req.body.user_account_id
                        }
                    };
                    userDao.updateDetails(query, updateData);

                    return await generateToken(req, data);
                } else {
                    return await socialSignUpCreate(req, type);
                }
            });
        } else {
            return await socialSignUpCreate(req, type);
        }
    }

}

async function socialSignUpCreate(req, type) {
    let data = req.body;
    let obj = {
        user_email: data.user_email && data.user_email != null ? data.user_email : '',
        user_name: data.user_name && data.user_name != null ? data.user_name : '',
        user_role_id: constants.ACCOUNT_LEVEL.USER,
        user_register_via: data.user_register_via
    };

    if (type == constants.REGISTERED_VIA.FACEBOOK) {
        obj.user_facebook_id = data.user_account_id;
    } else {
        obj.user_google_id = data.user_account_id;
    }

    return await userDao.createUser(obj).then(async (register) => {
        if (register) {
            console.log('register', register);
            await userDao.setRedisValue(register.user_email, JSON.stringify(register))
            createDefaultBundle(register._id)


            return await generateToken(req, register);
        }
    });

}

async function followingsListWithArticles(req) {

    let page = 1;
    let skip = 0;

    if (req.body.page) {
        page = parseInt(req.body.page);
    }

    if (page == 1) {
        skip = 0;
    } else {
        skip = (page - 1) * 5;
    }

    let option = {
        skip: skip,
        limit: 5
    }
    let responseObj = {
        topics: [],
        publications: []
    };

    let appLangugeData = await appLangDao.checkIfExist({ _id: mongoose.Types.ObjectId(req._app_langId) });
    let userData = await userDao.checkIfExist({ _id: mongoose.Types.ObjectId(req._id) });

    let newsLanguage = [];

    if (userData && userData.user_news_languages && userData.user_news_languages.length) {
        newsLanguage = _.map(userData.user_news_languages, convertObjectId);
    }

    let publicationQuery = [{
        $match: {
            _id: mongoose.Types.ObjectId(req._id),
            user_status: 'ACTIVE',
            user_is_deleted: false
        }
    }, {
        $lookup: {
            from: constants.LOOKUP_DB_NAME.PUBLICATION,
            foreignField: "_id",
            localField: "user_follow_publications",
            as: "publicationDetails"
        }
    }, { $unwind: '$publicationDetails' }, {
        $match: {
            'publicationDetails.publication_status': 'ACTIVE',
            'publicationDetails.publication_is_deleted': false
        }
    }, {
        $skip: option['skip']
    }, {
        $limit: option['limit']
    }, {
        $lookup: {
            from: constants.LOOKUP_DB_NAME.NEWS,
            foreignField: "news_publication_id",
            localField: "publicationDetails._id",
            as: "newsDetails"
        }
    }, {
        '$unwind': {
            path: '$newsDetails',
            preserveNullAndEmptyArrays: true
        }
    },
    // {
    //     $match: {
    //         'newsDetails.news_language_id': { $in: newsLanguage }
    //     }
    // },
    {
        $lookup: {
            from: constants.LOOKUP_DB_NAME.ARTICLE,
            foreignField: "article_news_id",
            localField: "newsDetails._id",
            as: "articleDetails"
        }
    }, {
        $project: {
            // articleDetails: { $slice: ["$articleDetails", 0, 5] },
            articleDetails: '$articleDetails',
            publicationDetails: 1,
            newsDetails: 1
        }
    }, {
        '$unwind': {
            path: '$articleDetails',
            preserveNullAndEmptyArrays: true
        }
    }, {
        $sort: {
            'articleDetails.article_pub_date': -1
        }
    }, {
        $project: {
            like: {
                $cond: {
                    if: {
                        $gt: [{ $indexOfArray: ["$articleDetails.article_like", { type: 'like', user_id: mongoose.Types.ObjectId(req._id) }] }, -1]
                    },
                    then: true,
                    else: false
                }
            },
            dislike: {
                $cond: {
                    if: {
                        $gt: [{ $indexOfArray: ["$articleDetails.article_like", { type: 'dislike', user_id: mongoose.Types.ObjectId(req._id) }] }, -1]
                    },
                    then: true,
                    else: false
                }
            },
            publication_id: '$publicationDetails._id',
            publication_name_ot: {
                "$filter": {
                    "input": "$publicationDetails.publication_name",
                    "as": "publication_name",
                    "cond": {
                        $eq: ["$$publication_name.lang", appLangugeData.app_language_code]
                    }
                }
            },
            publication_name_en: {
                "$filter": {
                    "input": "$publicationDetails.publication_name",
                    "as": "publication_name",
                    "cond": {
                        $eq: ["$$publication_name.lang", process.env.lang]
                    }
                }
            },
            article_title: '$articleDetails.article_title',
            article_description: '$articleDetails.article_description',
            article_pub_date: '$articleDetails.article_pub_date',
            article_image: '$articleDetails.article_image',
            article_link: '$articleDetails.article_link',
            article_id: '$articleDetails._id',
            news_language_id: '$newsDetails.news_language_id'
        }
    }, {
        $unwind:
        {
            path: '$publication_name_ot',
            preserveNullAndEmptyArrays: true
        }
    }, {
        $unwind: {
            path: '$publication_name_en',
            preserveNullAndEmptyArrays: true
        }
    }, {
        $lookup: {
            from: constants.LOOKUP_DB_NAME.READLATER,
            localField: 'article_id',
            foreignField: 'read_later_article_id',
            as: 'readLaterDetail'
        }
    }, {
        $unwind: {
            path: '$readLaterDetail',
            preserveNullAndEmptyArrays: true
        }
    }, {
        $project: {
            like: 1,
            dislike: 1,
            readLater: {
                $cond: {
                    if: {
                        $gt: [{ $indexOfArray: ["$readLaterDetail.read_later_user_id", mongoose.Types.ObjectId(req._id)] }, -1]
                    },
                    then: true,
                    else: false
                }
            },
            publication_name: {
                $cond: {
                    if: '$publication_name_ot.title',
                    then: '$publication_name_ot.title',
                    else: '$publication_name_en.title',
                }
            },
            article_title: 1,
            article_description: 1,
            article_link: 1,
            article_image: 1,
            article_pub_date: 1,
            article_id: 1,
            publication_id: 1,
            news_language_id: 1
        }
    }, {
        $group: {
            _id: '$publication_id',
            publication_name: { $first: '$publication_name' },
            articles: {
                $push: {
                    $cond: {
                        if: {
                            $and: [
                                { $gt: ['$article_title', null] },
                                { $in: ['$news_language_id', newsLanguage] }
                            ]
                        },
                        then: {
                            like: '$like',
                            dislike: '$dislike',
                            article_title: '$article_title',
                            article_description: '$article_description',
                            article_link: '$article_link',
                            article_image: '$article_image',
                            article_pub_date: '$article_pub_date',
                            article_id: '$article_id',
                            publication_name: '$publication_name',
                            publication_id: '$publication_id',
                            readLater: '$readLater'
                        },
                        else: '$$REMOVE'
                    }
                }
            }
        }
    }, {
        $project: {
            _id: 1,
            publication_name: 1,
            articles: { $slice: ["$articles", 0, 5] }
        }
    }];

    let topicsQuery = [{
        $match: {
            _id: mongoose.Types.ObjectId(req._id),
            user_status: 'ACTIVE',
            user_is_deleted: false
        }
    }, {
        $lookup: {
            from: 'topics',
            foreignField: "_id",
            localField: "user_follow_topics",
            as: "topicsDetails"
        }
    }, { $unwind: '$topicsDetails' }, {
        $match: {
            'topicsDetails.topic_status': 'ACTIVE',
            'topicsDetails.topic_is_deleted': false
        }
    }, {
        $skip: option['skip']
    }, {
        $limit: option['limit']
    }, {
        $lookup: {
            from: constants.LOOKUP_DB_NAME.NEWS,
            foreignField: "news_topic_id",
            localField: "topicsDetails._id",
            as: "newsDetails"
        }
    }, {
        '$unwind': {
            path: '$newsDetails',
            preserveNullAndEmptyArrays: true
        }
    }, {
        $lookup: {
            from: constants.LOOKUP_DB_NAME.ARTICLE,
            foreignField: "article_news_id",
            localField: "newsDetails._id",
            as: "articleDetails"
        }
    }, {
        $lookup: {
            from: constants.LOOKUP_DB_NAME.PUBLICATION,
            foreignField: "_id",
            localField: "newsDetails.news_publication_id",
            as: "publicationDetail"
        }
    }, {
        $project: {
            // articleDetails: { $slice: ["$articleDetails", 0, 5] },
            articleDetails: '$articleDetails',
            topicsDetails: 1,
            publicationDetail: 1,
            newsDetails: 1
        }
    }, {
        '$unwind': {
            path: '$articleDetails',
            preserveNullAndEmptyArrays: true
        }
    }, {
        '$unwind': {
            path: '$publicationDetail',
            preserveNullAndEmptyArrays: true
        }
    }, {
        $sort: {
            'articleDetails.article_pub_date': -1
        }
    }, {
        $project: {
            topic_id: '$topicsDetails._id',
            topic_name_ot: {
                "$filter": {
                    "input": "$topicsDetails.topic_name",
                    "as": "topic_name",
                    "cond": {
                        $eq: ["$$topic_name.lang", appLangugeData.app_language_code]
                    }
                }
            },
            topic_name_en: {
                "$filter": {
                    "input": "$topicsDetails.topic_name",
                    "as": "topic_name",
                    "cond": {
                        $eq: ["$$topic_name.lang", process.env.lang]
                    }
                }
            },
            publication_id: "$publicationDetail._id",
            publication_name_ot: {
                "$filter": {
                    "input": "$publicationDetail.publication_name",
                    "as": "publication_name",
                    "cond": {
                        $eq: ["$$publication_name.lang", appLangugeData.app_language_code]
                    }
                }
            },
            publication_name_en: {
                "$filter": {
                    "input": "$publicationDetail.publication_name",
                    "as": "publication_name",
                    "cond": {
                        $eq: ["$$publication_name.lang", process.env.lang]
                    }
                }
            },
            like: {
                $cond: {
                    if: {
                        $gt: [{ $indexOfArray: ["$articleDetails.article_like", { type: 'like', user_id: mongoose.Types.ObjectId(req._id) }] }, -1]
                    },
                    then: true,
                    else: false
                }
            },
            dislike: {
                $cond: {
                    if: {
                        $gt: [{ $indexOfArray: ["$articleDetails.article_like", { type: 'dislike', user_id: mongoose.Types.ObjectId(req._id) }] }, -1]
                    },
                    then: true,
                    else: false
                }
            },
            article_title: '$articleDetails.article_title',
            article_description: '$articleDetails.article_description',
            article_pub_date: '$articleDetails.article_pub_date',
            article_image: '$articleDetails.article_image',
            article_link: '$articleDetails.article_link',
            article_id: '$articleDetails._id',
            news_language_id: '$newsDetails.news_language_id'
        }
    }, {
        $unwind:
        {
            path: '$topic_name_ot',
            preserveNullAndEmptyArrays: true
        }
    }, {
        $unwind: {
            path: '$topic_name_en',
            preserveNullAndEmptyArrays: true
        }
    }, {
        $unwind:
        {
            path: '$publication_name_ot',
            preserveNullAndEmptyArrays: true
        }
    }, {
        $unwind: {
            path: '$publication_name_en',
            preserveNullAndEmptyArrays: true
        }
    }, {
        $lookup: {
            from: constants.LOOKUP_DB_NAME.READLATER,
            localField: 'article_id',
            foreignField: 'read_later_article_id',
            as: 'readLaterDetail'
        }
    }, {
        $unwind: {
            path: '$readLaterDetail',
            preserveNullAndEmptyArrays: true
        }
    }, {
        $project: {
            readLater: {
                $cond: {
                    if: {
                        $gt: [{ $indexOfArray: ["$readLaterDetail.read_later_user_id", mongoose.Types.ObjectId(req._id)] }, -1]
                    },
                    then: true,
                    else: false
                }
            },
            topic_name: {
                $cond: {
                    if: '$topic_name_ot.title',
                    then: '$topic_name_ot.title',
                    else: '$topic_name_en.title',
                }
            },
            publication_name: {
                $cond: {
                    if: '$publication_name_ot.title',
                    then: '$publication_name_ot.title',
                    else: '$publication_name_en.title',
                }
            },
            like: 1,
            dislike: 1,
            article_title: 1,
            article_description: 1,
            article_link: 1,
            article_image: 1,
            article_pub_date: 1,
            article_id: 1,
            topic_id: 1,
            publication_id: 1,
            news_language_id: 1
        }
    }, {
        $group: {
            _id: '$topic_id',
            topic_name: { $first: '$topic_name' },
            articles: {
                $push: {
                    $cond: {
                        if: {
                            $and: [
                                { $gt: ['$article_title', null] },
                                { $in: ['$news_language_id', newsLanguage] }
                            ]
                        },
                        then: {
                            news_language_id: '$news_language_id',
                            like: '$like',
                            dislike: '$dislike',
                            article_title: '$article_title',
                            article_description: '$article_description',
                            article_link: '$article_link',
                            article_image: '$article_image',
                            article_pub_date: '$article_pub_date',
                            article_id: '$article_id',
                            topic_name: '$topic_name',
                            readLater: '$readLater',
                            publication_name: '$publication_name',
                            publication_id: '$publication_id'
                        },
                        else: '$$REMOVE'
                    }
                }
            }
        }
    }, {
        $project: {
            _id: 1,
            topic_name: 1,
            articles: { $slice: ["$articles", 0, 5] }
        }
    }];

    responseObj.publications = await userDao.aggregate(publicationQuery);
    responseObj.topics = await userDao.aggregate(topicsQuery);
    return await responseObj;
}

let createDefaultBundle = (user_id) => {
    let data = {
        bundle_created_by: mongoose.Types.ObjectId(user_id),
        bundle_name: 'My favorite',
    };
    bundleDao.createBundle(data)
}

// 
async function forgotPassword(req) {
    let findQuery = {
        user_email: req.body.user_email,
        user_is_deleted: false,
        "user_status": constants.STATUS.ACTIVE
    };
    let findQueryRegisterVia = {
        user_email: req.body.user_email,
        user_register_via: constants.REGISTERED_VIA.NORMAL,
        user_is_deleted: false
    }
    return await userDao.checkIfExist(findQuery, {}).then(async (data) => {
        if (data && data != null) {
            return await userDao.checkIfExist(findQueryRegisterVia, {}).then(async (result) => {
                if (result && result != null) {
                    let otp = await appUtils.getRandomOtp();
                    let updateData = {
                        $set: { user_otp: otp }
                    };
                    await emailHelper.sendUserForgotPassword(data, otp);
                    await userDao.updateDetails(findQuery, updateData);
                    return {};
                } else {
                    return 2;
                }
            })
        } else {
            return 1;
        }
    });
}


async function otpCheck(req) {

    let findQuery = {
        user_otp: req.body.user_otp
    };

    return await userDao.checkIfExist(findQuery, {}).then(async (data) => {
        if (data) {

            let updateData = {
                $unset: { user_otp: 1 }
            };
            await userDao.updateDetails(findQuery, updateData);
            return {};
        } else {
            return 1;
        }
    });
}


async function resetPassword(req) {
    if (req.body.user_password === req.body.user_confirm_password) {
        let findQuery = {
            user_email: req.body.user_email,
            user_is_deleted: false,
            "user_status": constants.STATUS.ACTIVE
        };

        return await userDao.checkIfExist(findQuery, {}).then(async (data) => {
            if (data && data != null) {

                let password = await appUtils.generateSaltAndHashForPassword(req.body.user_password)
                let updateData = {
                    $set: {
                        user_password: password
                    }
                };
                return await userDao.updateDetails(findQuery, updateData).then(async (data) => {
                    if (data) {
                        return {};
                    }
                })
            } else {
                return 2
            }
        });
    } else {
        return 1
    }
}

async function logout(req) {

    let findUserQuery = {
        _id: mongoose.Types.ObjectId(req._id),
    };

    let updateData = {
        $pull: {
            'user_tokens': { user_jwt: req.headers['authorization'] }
        }
    };

    return await userDao.checkIfExist(findUserQuery, {}).then(async (data) => {
        if (data && data != null) {
            return await userDao.updateDetails(findUserQuery, updateData).then(result => {
                if (result && result != null) {
                    return {};
                }
            })
        } else {
            return 1;
        }
    });
}

async function editProfile(req) {

    let userFindQuery = {
        _id: mongoose.Types.ObjectId(req._id),
        user_is_deleted: false
    };

    return await userDao.checkIfExist(userFindQuery).then(async (result) => {
        if (result && result != null) {
            let obj = {};

            if (req.body.user_email && req.body.user_email != undefined) {
                obj.user_email = req.body.user_email;

                let emailUniqueQuery = {
                    user_email: req.body.user_email,
                    _id: { $ne: mongoose.Types.ObjectId(req._id) }
                }
                let checkEmail = await userDao.checkIfExist(emailUniqueQuery);

                if (checkEmail && checkEmail != null) {
                    return 5;
                }

            }

            if (req.body.user_name && req.body.user_name != undefined) {
                obj.user_name = req.body.user_name;
            }

            if (req.body.user_password && req.body.user_password != undefined) {

                return await appUtils.verifyPassword(req.body.user_password, result).then(async (valid) => {
                    if (valid) {
                        if (req.body.user_new_password === req.body.user_confirm_password) {

                            let password = await appUtils.generateSaltAndHashForPassword(req.body.user_new_password)
                            obj.user_password = password
                            return await updateUserProfile(userFindQuery, obj, req)

                        } else {
                            return 3
                        }
                    } else {
                        return 2;
                    }
                }).catch((err) => {
                    console.log(err);
                })

            } else {
                return await updateUserProfile(userFindQuery, obj, req)
            }


        } else {
            return 1;
        }
    });

}

async function updateUserProfile(findQuery, data, req) {

    let updateData = {};
    if (Object.keys(data).length == 0) {
        return 4;
    } else {
        updateData = { $set: data };
    }

    return await userDao.updateDetails(findQuery, updateData).then(async (res) => {
        if (res && res != null) {
            let obj = {
                _user_name: res.user_name && res.user_name != null ? res.user_name : '',
                _role_id: res.user_role_id,
                _id: res._id,
                _email: res.user_email && res.user_email != null ? res.user_email : ''
            };
            let token = await jwtHandler.genUserToken(obj);
            // return res;
            let returnObj = {
                user_name: res.user_name && res.user_name != null ? res.user_name : '',
                user_email: res.user_email && res.user_email != null ? res.user_email : '',
                _id: res._id,
                user_jwt: token
            };

            let query1 = {
                _id: mongoose.Types.ObjectId(obj._id),
                'user_tokens.user_jwt': req.header.authorization
            };
            let updateTokenData = {
                $set: {
                    'user_tokens.$.user_jwt': token
                }
            };

            userDao.updateDetails(query1, updateTokenData);
            return await returnObj;
        }
    });
}

async function createBundle(req) {
    // bundleDao
    let { bundle_name, bundle_status } = req.body;

    let findBundle = {
        bundle_is_deleted: false,
        bundle_name: bundle_name,
        bundle_created_by: mongoose.Types.ObjectId(req._id)
    }

    return bundleDao.findOneBundle(findBundle).then((bundleResult) => {

        if (!bundleResult) {

            let addData = {
                bundle_created_by: mongoose.Types.ObjectId(req._id),
                bundle_name: bundle_name,
                bundle_status: bundle_status
            };

            return bundleDao.createBundle(addData).then((result) => {

                if (result && result != null) {
                    return result;
                }

            }).catch((err) => {

                return err;
            })
        } else {

            // bundle name already exist for this user
            return 1;
        }
    })

}


function editBundle(req) {

    let findBundleQuery = {
        _id: mongoose.Types.ObjectId(req.params.id),
        bundle_is_deleted: false
    };

    return bundleDao.findOneBundle(findBundleQuery).then((result) => {

        if (result && result != null) {

            let updateData = {};

            if (req.body.bundle_name && req.body.bundle_name != null) {
                updateData.bundle_name = req.body.bundle_name;
            }

            if (req.body.bundle_status && req.body.bundle_status != null) {
                updateData.bundle_status = req.body.bundle_status;
            }
            return bundleDao.updateBundle(findBundleQuery, { $set: updateData }).then((result) => {

                if (result && result != null) {
                    return result;
                }

            })
        } else {
            return 1;
        }

    }).catch((err) => {
        return err;
    })
}


async function saveBundle(req) {
    let findBundleQuery = {
        _id: mongoose.Types.ObjectId(req.params.id),
        bundle_is_deleted: false,
        bundle_status: constants.BUNDLE_STATUS.PUBLIC
    };

    return bundleDao.findOneBundle(findBundleQuery).then(async (result) => {

        if (result && result != null) {
            let index = await result.bundle_saved_by.indexOf(req._id);

            let updateBundleQuery = {};
            let returnData = 0;
            if (index >= 0) {
                updateBundleQuery = {
                    $pull: { bundle_saved_by: mongoose.Types.ObjectId(req._id) }
                };
                returnData = 4;
            } else {
                updateBundleQuery = {
                    $push: { bundle_saved_by: mongoose.Types.ObjectId(req._id) }
                };
                // process.nextTick(sendSaveBundleNotification(result.bundle_created_by, req._user_name, result.bundle_name));
                // sendSaveBundleNotification(result.bundle_created_by, req._user_name, result.bundle_name)

                returnData = 3;
            }

            return bundleDao.updateBundle(findBundleQuery, updateBundleQuery).then((result) => {

                if (result && result != null) {
                    return returnData;
                }

            })
        } else {
            return 1;
        }

    }).catch((err) => {
        return err;
    })
}

async function sendSaveBundleNotification(user_id, user_name, bundle_name) {

    let aggQuery = [{
        $match: {
            _id: mongoose.Types.ObjectId(user_id),
            user_is_deleted: false,
            'user_notification.bundle_activity': constants.NOTIFICATION.YES
        }
    }, {
        $unwind: '$user_tokens'
    }, {
        $group: {
            _id: '$_id',
            tokens: {
                $push: '$user_tokens.user_device_token'
            }
        }
    }];
    userDao.aggregate(aggQuery).then((data) => {
        if (data && data.length) {
            let msg = (user_name || '') + ' saved your ' + bundle_name + ' bundle';
            notificationHelper.sendNotification(data[0].tokens || [], msg, process.env.appName)
        }
    });

}

async function viewProfile(req) {

    let userFindQuery = {
        _id: mongoose.Types.ObjectId(req._id),
        user_is_deleted: false
    };
    let responseObj = {
        user_name: '',
        following: {
            topics: 0,
            publications: 0
        },
        bundles: [],

    };

    let pubCountquery = [
        {
            $match: {
                _id: mongoose.Types.ObjectId(req._id),
                user_is_deleted: false,
                user_status: 'ACTIVE'
            }
        }, {
            $lookup: {
                from: 'publications',
                localField: 'user_follow_publications',
                foreignField: '_id',
                as: 'publicationDetail'
            }
        }, { $unwind: '$publicationDetail' }, {
            $match: {
                'publicationDetail.publication_status': 'ACTIVE',
                'publicationDetail.publication_is_deleted': false
            }
        }
    ];

    let topCountQuery = [
        {
            $match: {
                _id: mongoose.Types.ObjectId(req._id),
                user_is_deleted: false,
                user_status: 'ACTIVE'
            }
        }, {
            $lookup: {
                from: 'topics',
                localField: 'user_follow_topics',
                foreignField: '_id',
                as: 'topicDetail'
            }
        }, { $unwind: '$topicDetail' }, {
            $match: {
                'topicDetail.topic_status': 'ACTIVE',
                'topicDetail.topic_is_deleted': false
            }
        }
    ];

    return await userDao.checkIfExist(userFindQuery, {}).then(async (userData) => {
        if (userData && userData != null) {

            let publicationData = await userDao.aggregate(pubCountquery);
            let topicData = await userDao.aggregate(topCountQuery);

            responseObj.user_name = userData.user_name && userData.user_name != null ? userData.user_name : '';

            responseObj.following.topics = await topicData && topicData.length ? topicData.length : 0;
            responseObj.following.publications = await publicationData && publicationData.length ? publicationData.length : 0;

            let aggregateQuery = [{ $match: { bundle_created_by: mongoose.Types.ObjectId(req._id), bundle_is_deleted: false } }, {
                $project: {
                    bundle_name: 1,
                    bundle_status: 1,
                    article: {
                        $ifNull: [{ $arrayElemAt: ["$bundle_article", 0] }, {}]
                    }
                }
            }, {
                $project: {
                    bundle_name: 1,
                    bundle_status: 1,
                    article_image: {
                        $ifNull: ['$article.article_image', process.env.defaultBundleImage]
                    }
                }
            }, {
                $skip: 0
            }, {
                $limit: 5
            }];

            responseObj.bundles = await bundleDao.aggregateBundle(aggregateQuery)
            return await responseObj;
        } else {
            return 1;
        }
    })

}




async function guestSignIn(req) {

    let saveData = {
        user_name: 'Guest',
        user_email: '',
        user_role_id: constants.ACCOUNT_LEVEL.GUEST
    };
    return await userDao.createUser(saveData).then(async (register) => {

        if (register && register != null) {

            return await generateToken(req, register);
        }

    })
}



module.exports = {
    uploadData, /* upload image/video using s3 bucket */
    addUser,
    editUser,
    getUserById,
    deleteUserById,
    listUser,

    // -----APP
    signUp,
    verifyEmail,
    signIn,
    forgotPassword,
    otpCheck,
    resetPassword,
    logout,

    editProfile,
    createBundle,
    editBundle,
    saveBundle,
    viewProfile,
    guestSignIn,
}