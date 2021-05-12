const categoryDao = require('./categoryDao');
const jwtHandler = require("../../handlers/jwtHandler");
const constants = require('../../constants')
const mongoose = require('mongoose');
var _ = require('lodash');
const { constant } = require('async');


async function addCategory(req) {

    req.body.category_created_by = mongoose.Types.ObjectId(req._id);

    let UniqueEnNameQuery = [{ '$unwind': '$category_name' }, {
        $match: {
            category_is_deleted:false,
            'category_name.lang': process.env.lang,
            'category_name.title': req.body.category_name.filter(x => x.lang == process.env.lang)[0].title
        }
    }];

    return await categoryDao.commonAggregate(UniqueEnNameQuery).then(async (data) => {
        if (data && data != null && data.length) {
            return 2;
        } else {
            return await categoryDao.addCategory(req.body).then((data) => {
                if (data) {
                    return data;
                } else {
                    return 1
                }
            })
        }
    })
    /*****************************for add category************************* */
}


function getCategoryById(req) {

    let findQuery = {
        category_is_deleted: false,
        _id: mongoose.Types.ObjectId(req.params.id)
    }

    return categoryDao.checkIfExist(findQuery).then((result) => {
        if (result && result != null) {
            return result;
        } else {
            return 1;
        }
    })
}




function deleteCategoryById(req) {
    let findQuery = {
        category_is_deleted: false,
        _id: mongoose.Types.ObjectId(req.params.id)
    }
    let updateData = {
        category_is_deleted: true
    };

    updateData['category_deleted_by'] = mongoose.Types.ObjectId(req._id);
    updateData['category_deleted_at'] = new Date();

    return categoryDao.checkIfExist(findQuery).then((result) => {
        if (result && result != null) {
            return categoryDao.updateDetails(findQuery, updateData).then(async (data) => {
                if (data) {
                    return data;
                }
            })
        } else {
            return 1;
        }
    })

}

function listCategory(req) {

    let query = {
        category_is_deleted: false
    };

    let option = {
        sort: {
            'category_created_at': -1
        }
    };

    var columnName = null;
    var clumnValue = null;
    var key = null;
    var cname = null;


    if (req.body['search[value]']) {
        query['$or'] = [];
    }


    for (let i = 0; i < 5; i++) {
        if (req.body['columns[' + i + '][search][value]']) {

            if (columnName = req.body['columns[' + i + '][data]']) {

                columnName = req.body['columns[' + i + '][data]']
                clumnValue = req.body['columns[' + i + '][search][value]'];

                key = columnName;
                if (key == 'category_status') {
                    query[key] = clumnValue;
                }
                else if (key == "category_name") {
                    key = "category_name.title"
                    query[key] = {
                        $regex: clumnValue,
                        $options: 'i'
                    };
                }
                else {
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

    return categoryDao.getList(query, option)
        .then((result) => {
            if (result && result == null) {
                return 1
            } else {
                return result
            }
        })
}


async function updateCategoryById(req) {


    let findQuery = {
        category_is_deleted: false,
        _id: mongoose.Types.ObjectId(req.params.id)
    };
    let UniqueEnNameQuery = [{ '$unwind': '$category_name' }, {
        $match: {
            category_is_deleted:false,
            'category_name.lang': process.env.lang,
            'category_name.title': req.body.category_name.filter(x => x.lang == process.env.lang)[0].title,
            _id: { $ne: mongoose.Types.ObjectId(req.params.id) }
        }
    }];

    let updateData = req.body;

    updateData['category_modify_by'] = mongoose.Types.ObjectId(req._id);

    return await categoryDao.checkIfExist(findQuery).then(async (result) => {
        if (result && result != null) {
            return await categoryDao.commonAggregate(UniqueEnNameQuery).then(async (data) => {
                if (data && data != null && data.length) {
                    return 2;
                } else {
                    return categoryDao.updateDetails(findQuery, updateData).then(async (newData) => {
                        if (newData) {
                            return newData;
                        }
                    })
                }
            })
        } else {
            return 1;
        }
    })
}



async function changeStatusById(req) {
    let query = {
        _id: mongoose.Types.ObjectId(req.params.id),
        category_is_deleted: false
    };
    return await categoryDao.checkIfExist(query, {}).then(async (result) => {
        if (result && result != null) {
            if (req.body.category_status == result.category_status) {
                if (req.body.category_status == constants.STATUS.ACTIVE) {
                    return 2;
                } else {
                    return 3;
                }
            } else {
                let details = req.body;
                details['category_modify_by'] = mongoose.Types.ObjectId(req._id);

                return await categoryDao.updateDetails(query, details).then((data) => {
                    if (data) {
                        return 4;
                    }
                });
            }

        } else {
            return 1;
        }
    });
}


async function getCategoriesList(req) {
    let aggregateQuery = [
        { $unwind: '$category_name' },
        {
            $match: {
                'category_name.lang': process.env.lang, "category_status": constants.STATUS.ACTIVE,
                "category_is_deleted": false
            }
        },
        {
            $project:
            {
                category_name: '$category_name.title'
            }
        }];

    return await categoryDao.commonAggregate(aggregateQuery).then((data) => {
        if (data) {
            return data;
        }
    });
}

module.exports = {
    addCategory,
    getCategoryById,
    deleteCategoryById,
    listCategory,
    updateCategoryById,
    changeStatusById,
    getCategoriesList
};
