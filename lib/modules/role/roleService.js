'use strict'

//= ========================= Load Modules Start =======================
const dao = require('./roleDao')
const mongoose = require('mongoose')
const constants = require("../../constants")
//= ========================= Load Modules End ==============================================
const moduleName = 'role'

/**for fetch get list */
function roleList(req, res) {
    let query = {
    };
    if (req._roleId == parseInt(constants.ACCOUNT_LEVEL.SUPERADMIN)) {
        query = {
            role_is_deleted: false,
        };
    } else {
        query = {
            role_is_deleted: false,
            _id: { $ne: parseInt(constants.ACCOUNT_LEVEL.SUPERADMIN) }
        };
    }
    let option = {
        sort: {
            'role_created_at': -1
        }
    };

    var columnName = null;
    var clumnValue = null;
    var key = null;
    var roleName = null;


    if (req.body['search[value]']) {
        query['$or'] = [];
    }


    for (let i = 0; i < 5; i++) {
        if (req.body['columns[' + i + '][search][value]']) {

            if (columnName = req.body['columns[' + i + '][data]']) {

                columnName = req.body['columns[' + i + '][data]']
                clumnValue = req.body['columns[' + i + '][search][value]'];

                key = columnName;
                if (key == 'role_status') {
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
            roleName = req.body['columns[' + i + '][data]'];
            if (roleName == 'role_name') {
                roleName = 'role_name'
            }
            option = {
                sort: {
                    [roleName]: (req.body['order[0][dir]'] == 'asc') ? 1 : -1
                }
            };
        }
    }

    option['offset'] = parseInt(req.body['start']);
    option['limit'] = parseInt(req.body['length']);

    return dao.getList(query, option)
        .then((result) => {
            if (!result) {
                return 1
            }
            return result
        })
}


async function addRole(req) {
    let details = req.body
    req.body._id = await generateRoleId();

    return dao.addDetails(details).then((result) => {
        if (result && result != null) {
            return result;
        } else {
            return 1;
        }
    })
}


function getRoleById(req) {
    let query = {
        _id: parseInt(req.params.id),
        role_is_deleted: false
    };
    return dao.fetchDetails(query)
        .then((result) => {
            if (result && result != null) {
                return result;
            } else {
                return 1;
            }
        })
}


async function generateRoleId() {

    let identityCode;
    let sequenceFind = {
        _id: { $exists: true }
    };

    let sort = {
        _id: -1
    };

    return await dao.findSortingAndLimit(sequenceFind, sort, 1).then(async (result) => {

        if (result.length) {
            let max = parseInt(result[0]._id);
            max = max + 1;
            return await max;
        } else {
            identityCode = 1;
            return await identityCode;

        }
    });

}

async function updateRoleById(req) {
    let query = {
        _id: parseInt(req.params.id),
        role_is_deleted: false
    };

    return await dao.fetchDetails(query).then(async (result) => {
        if (result && result != null) {
            let details = req.body;
            details[moduleName + '_modify_by'] = mongoose.Types.ObjectId(req._id);
            return await dao.updateDetails(query, details).then(async (data) => {
                if (data) {
                    if (data._id.toString() == req._roleId.toString()) {
                        let rest = await getRoleWisePermissionNamesById(req);
                        return rest.permissions;
                    } else {
                        return [];
                    }
                }
            })
        } else {
            return 1;
        }
    })
}


function deleteRoleById(req) {

    let details = req.body
    details['role_is_deleted'] = true
    details[moduleName + '_modify_by'] = mongoose.Types.ObjectId(req._id)

    let findQuery = {
        role_is_deleted: false,
        _id: parseInt(req.params.id)
    };

    return dao.fetchDetails(findQuery).then((result) => {
        if (result && result != null) {

            return dao.updateDetails(findQuery, details).then(async (data) => {
                if (data) {
                    return data;
                }
            })
        } else {
            return 1;
        }
    })

}

async function changeStatusById(req) {
    let query = {
        _id: parseInt(req.params.id),
        role_is_deleted: false
    };
    return await dao.fetchDetails(query).then(async (result) => {
        if (result && result != null) {
            if (req.body.role_status == result.role_status) {
                if (req.body.role_status == constants.STATUS.ACTIVE) {
                    return 2;
                } else {
                    return 3;
                }
            } else {
                let details = req.body;
                details[moduleName + '_modify_by'] = mongoose.Types.ObjectId(req._id)

                return await dao.updateDetails(query, details).then((data) => {
                    if (data) {
                        return data
                    }
                });
            }

        } else {
            return 1;
        }
    });

}

function getRoleWisePermissionNamesById(req) {
    let aggrQuery = [
        {
            $match: {
                _id: parseInt(req.params.id)
            }
        }, {
            $lookup: {
                from: constants.LOOKUP_DB_NAME.PERMISSION,
                localField: 'role_permissions',
                foreignField: '_id',
                as: 'PerDetail'
            }
        }, {
            $unwind: {
                path: '$PerDetail',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group:
            {
                _id: "$_id",
                permissions: { $push: "$PerDetail.permission_name" }
            }
        }
    ];
    return dao.getRoleWisePermissions(aggrQuery).then((result) => {
        if (result && result != null) {
            return result[0];
        } else {
            return 1;
        }
    })
}

function getRolesList(req) {
    let query = {};
    let ninArray = [];

    if (req._roleId != constants.ACCOUNT_LEVEL.SUPERADMIN) {
        ninArray.push(constants.ACCOUNT_LEVEL.SUPERADMIN);
        ninArray.push(constants.ACCOUNT_LEVEL.ADMIN);
    }

    query = {
        _id: { $nin: ninArray }
    };
    return dao.getRolesList(query, { _id: 1, role_name: 1 }).then((result) => {
        if (!result && result == null) {
            return 1
        }
        return result;
    })
}
//= ========================= Export Module Start ==============================

module.exports = {

    roleList, /**for fetch all List */
    addRole,
    getRoleById,
    updateRoleById,
    deleteRoleById,
    changeStatusById,
    getRoleWisePermissionNamesById,
    getRolesList
}

//= ========================= Export Module End ===============================