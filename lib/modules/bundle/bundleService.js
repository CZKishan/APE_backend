const mongoose = require('mongoose');
const constants = require('../../constants');

const bundleDao = require('../article/articledao');

/**
* get explore more bundles
* @param {*} userId
* @param {number} skip
* @param {number} limit
* @param {string} search
*/
function getExploreBundle(userId, skip = 0, limit = 10, search = '') {

    let query = {
        bundle_created_by: { $ne: mongoose.Types.ObjectId(userId) },
        bundle_status: constants.BUNDLE_STATUS.PUBLIC,
        bundle_is_deleted: false
    }

    if (search) {
        query.bundle_name = {
            $regex: search,
            $options: 'i'
        }
    }

    let exploreMoreQuery = [{
        $match: query
    }, {
        $project: {
            bundle_name: 1,
            bundle_status: 1,
            bundle_created_at: 1,
            article: {
                $ifNull: [{ $arrayElemAt: ["$bundle_article", 0] }, {}]
            },
            // saved_by_count: { $size: { "$ifNull": ["$bundle_saved_by", []] } },
            bundle_saved_by: {
                "$filter": {
                    "input": "$bundle_saved_by",
                    "as": "bundle_saved_by",
                    "cond": {
                        $eq: ["$$bundle_saved_by", mongoose.Types.ObjectId(userId)]
                    }
                }
            }
        }
    }, {
        $project: {
            bundle_name: 1,
            bundle_status: 1,
            bundle_created_at: 1,
            article_image: {
                $ifNull: ['$article.article_image', process.env.defaultBundleImage]
            },
            // saved_by_count: 1,
            follow_bundle: {
                $cond: {
                    if: {
                        $gt: [{ $indexOfArray: ["$bundle_saved_by", mongoose.Types.ObjectId(userId)] }, -1]
                    },
                    then: true,
                    else: false
                }
            }
        }
    }, {
        $sort: { bundle_created_at: -1 }
    }, {
        $skip: skip
    }, {
        $limit: limit
    }];

    return bundleDao.aggregateBundle(exploreMoreQuery).then((data) => {
        if (data && data != null) {
            return data;
        }
    }).catch((er) => {
        return er;
    })

}

module.exports = {
    getExploreBundle
}