'use strict'

//= ========================= Load Modules Start =======================
const dao = require('./permissionDao')
const mongoose = require('mongoose')
const constant = require("../../constants")
//= ========================= Load Modules End ==============================================
const moduleName = 'permission'
const roleDao = require('../role/roleDao');
const roleService = require('../role/roleService');
const constants = require('../../constants')

/**for fetch get list */
// function getList(req, res) {
//     let query = {
//         permission_is_deleted: false
//     };

//     let option = {
//         sort: {
//             'permission_created_at': -1
//         }
//     };

//     var columnName = null;
//     var clumnValue = null;
//     var key = null;
//     var cname = null;

//     if (req.body['search[value]']) {
//         query['$or'] = [];
//     }

//     for (let i = 0; i < 5; i++) {
//         // for if null value
//         if (req.body['search[value]']) {

//             if (columnName = req.body['columns[' + i + '][data]']) {
//                 columnName = req.body['columns[' + i + '][data]']
//                 clumnValue = req.body['search[value]'];
//                 key = columnName,
//                     query['$or'].push({
//                         [key]: {
//                             $regex: clumnValue,
//                             $options: 'i'
//                         }
//                     })
//             }

//         }
//         if (req.body['order[0][column]'] == i) {
//             cname = req.body['columns[' + i + '][data]'];
//             option = {
//                 sort: {
//                     [cname]: (req.body['order[0][dir]   '] == 'asc') ? 1 : -1
//                 }
//             };
//         }
//     }

//     for (let i = 0; i < 5; i++) {
//         if (req.body['columns[' + i + '][search][value]']) {
//             if (columnName = req.body['columns[' + i + '][data]']) {

//                 columnName = req.body['columns[' + i + '][data]']
//                 clumnValue = req.body['columns[' + i + '][search][value]'];

//                 // if (req.body['columns[' + i + '][data]'] == 'isVerified') {
//                 //     key = columnName,
//                 //         query[key] = clumnValue;
//                 // } else {
//                 key = columnName,
//                     query[key] = {
//                         $regex: clumnValue,
//                         $options: 'i'
//                     }
//                 // }
//             }
//         }
//         if (req.body['order[0][column]'] == i) {
//             cname = req.body['columns[' + i + '][data]'];
//             option = {
//                 sort: {
//                     [cname]: (req.body['order[0][dir]'] == 'asc') ? 1 : -1
//                 }
//             };
//         }
//     }

//     option['offset'] = parseInt(req.body['start']);
//     option['limit'] = parseInt(req.body['length']);

//     return dao.getList(query, option)
//         .then((result) => {
//             if (!result) {
//                 return 1
//             }
//             return result
//         })
// }

// /**for add Details */
// function addDetails(req, res) {
//     let details = req.body

//     return dao.addDetails(details)
//         .then((result) => {
//             if (!result) {
//                 return 1
//             }
//             return result
//         })
// }

// /**
//  * for fetch details
//  * @param {object} req request object
//  * @param {object} res response object 
//  */

// function fetchDetails(req, res) {
//     let query = {
//         _id: mongoose.Types.ObjectId(req.params.id),
//         permission_is_deleted: false
//     };

//     return dao.fetchDetails(query)
//         .then((result) => {

//             if (!result) {
//                 return 1
//             }
//             return result
//         })
// }

// /**for update details */
// async function updateDetails(req, res) {
//     let query = {
//         _id: mongoose.Types.ObjectId(req.params.id),
//         permission_is_deleted: false

//     };

//     return await dao.fetchDetails(query).then(async (result) => {
//         if (result && result != null) {

//             let details = req.body;
//             details[moduleName + '_modifyOn'] = Date.now();
//             details[moduleName + '_modify_by'] = mongoose.Types.ObjectId(req._id);

//             return await dao.updateDetails(query, details).then(async (data) => {
//                 if (data) {
//                     return await data;
//                 }
//             })
//         } else {
//             return 1;
//         }
//     })

// }

// /**for change status */
// async function changeStatus(req, res) {

//     let query = {
//         _id: mongoose.Types.ObjectId(req.params.id),
//         permission_is_deleted: false
//     };
//     return await dao.fetchDetails(query).then(async (result) => {
//         if (result && result != null) {
//             if (req.body.permission_status == result.permission_status) {
//                 if (req.body.permission_status == constant.STATUS.ACTIVE) {
//                     return 2;
//                 } else {
//                     return 3;
//                 }
//             } else {
//                 let details = req.body;
//                 details[moduleName + '_modifyOn'] = Date.now()
//                 details[moduleName + '_modify_by'] = mongoose.Types.ObjectId(req._id)

//                 return await dao.updateDetails(query, details).then((data) => {
//                     if (data) {
//                         return data
//                     }
//                 })

//             }

//         } else {
//             return 1;
//         }
//     });
// }

// /**for soft Delete details */
// function softDeleteDetails(req, res) {
//     let details = req.body
//     details[moduleName + '_isDeleted'] = true
//     details[moduleName + '_deletedOn'] = Date.now()
//     details[moduleName + '_deletedBy'] = mongoose.Types.ObjectId(req._id)
//     return dao.updateDetails({ _id: mongoose.Types.ObjectId(req.params.id) }, details).then((result) => {
//         if (!result) {
//             return 1;
//         }
//         return result;
//     })
// }


/**
 * for getPermissions 
 * @param {object} req request object
 * @param {object} res response object 
 */

function getPermissionsList(req, res) {
    let query = [{
            $match: {
                permission_is_deleted: false
            }
        },
        {
            $lookup: {
                from: constants.LOOKUP_DB_NAME.PERMISSION,
                localField: '_id',
                foreignField: 'permission_parent_id',
                as: 'perDetails'
            }
        }, {
            $project: {
                perDetails: 1,
                permission_title: 1,
                permission_status: 1,
                permission_name: 1,

            }
        }, { $unwind: '$perDetails' },
        { $sort: { 'perDetails.permission_title': -1 } },
        {
            $group: {
                _id: { _id: '$perDetails.permission_parent_id', permission_title: "$permission_title", permission_name: "$permission_name" },
                'perDetail': { $push: '$perDetails' }
            }
        }
    ];

    return dao.getPermissionsList(query)
        .then((result) => {

            if (result && result != null) {
                return result;
            } else {
                return 1;
            }
        })
}


function getPermissionMatrix(req) {
    let query = [
        {
            $lookup: {
                from: 'permissions',
                localField: '_id',
                foreignField: 'permission_parent_id',
                as: 'perDetails'
            }
        }, {
            $project: {
                perDetails: 1,
                permission_title: 1,
                permission_status: 1,
                permission_name: 1
            }
        }, { $unwind: '$perDetails' },
        {
            $project: {
                per_id: '$perDetails._id',
                permission_parent_id: '$perDetails.permission_parent_id',
                module_name: { $concat: ["$permission_title", " - ", "$perDetails.permission_title"] },
                permission_title: 1,
                permission_status: 1,
                permission_name: '$perDetails.permission_name',
            }
        },
    ];
    let obj = {
        allPermissions: [],
        selectedPermissions: []
    };
    return dao.getPermissionsList(query)
        .then(async (result) => {
            if (result && result.length) {
                obj.allPermissions = await result;
                obj.selectedPermissions = await this.getRoleWisePermissions();
                return obj;
            } else {
                return [];
            }

        })

}


async function getRoleWisePermissions() {
    let aggregateQuery = [{
        $project: {
            _id: {
                _id: '$_id',
                role_name: '$role_name',
                role_slug: '$role_slug'
            },
            permissions: {
                $ifNull: ['$role_permissions', []]
            }
        }
    }];
    return await roleDao.getRoleWisePermissions(aggregateQuery).then((result) => {
        if (!result && result == null) {
            return 1
        }
        return result;
    })
}

async function updatePermissionMatrix(req) {

    let perArray = req.body.permissions;
    let updatedArray = [];
    if (perArray.length) {
        return await perArray.map(async (x, i) => {
            await roleDao.updateDetails({ _id: parseInt(x._id._id) }, { role_permissions: x.permissions }).then((result) => {
                updatedArray.push(result);
            })
            let res1 = [];
            if (perArray.length == updatedArray.length) {

                if (res1 && res1.permissions) {
                    return res1.permissions;
                } else {
                    return [];
                }
            }
        })
    } else {
        return [];
    }
}
//= ========================= Export Module Start ==============================

module.exports = {

    // getList,
    // /**for fetch all List */
    // addDetails,
    // /**for add details */
    // fetchDetails,
    // /** for fetch Details */
    // updateDetails,
    // /** for update Details */
    // changeStatus,
    // /** for change status */
    // softDeleteDetails,
    // /** for soft delete details */
    // deleteDetail,
    /** for delete details */
    getPermissionsList,
    getPermissionMatrix,
    getRoleWisePermissions,
    updatePermissionMatrix
}

//= ========================= Export Module End ===============================