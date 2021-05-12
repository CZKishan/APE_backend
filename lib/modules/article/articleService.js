
const axios = require('axios');
const xml2js = require('xml2js');
var dao = require('./articledao');
var async = require("async");
const newsDao = require('../news/newsDao');
var cron = require('node-cron');
const mongoose = require('mongoose');
const _ = require('lodash');
const appLangDao = require('../appLanguage/appLanguageDao');
const constants = require('../../constants');
const notificationHelper = require('../../utils/notificationHelper')
const languageDao = require('./../language/languageDao');
const categoryDao = require('../category/categoryDao');
const publicationDao = require('./../publication/publicationDao');
const bundleDao = require('./bundleModel');
const { result } = require('lodash');
// process.setMaxListeners(0);


async function addArticleData(req, data) {
    let response;

    response = await axios.get(data.news_rss_feed_link);
    console.log('---------------status--------------', response.status);

    if (response) {

        let resData = response && response != null && response.data && response.data != null ? response.data : '';
        let result = await xml2js.parseStringPromise(resData, { mergeAttrs: true }).then((data) => {
            return data;
        }).catch((er) => {
            return [];
        });

        let items = result && result != null && result.rss && result.rss != null && result.rss.channel && result.rss.channel.length && result.rss.channel[0].item ? result.rss.channel[0].item : [];
        // result.rss.channel[0].item || [];

        req.news_id = data._id;
        if (items && items.length) {
            return Promise.all(await saveArticles(req, items));

        } else {
            return {};
        }

    } else {
        return {};
    }

}

//-----------------NOTIFICATION
function sendAddRegionalNewsNotification(article) {
    let aggQuery = [{
        $match: {
            _id: mongoose.Types.ObjectId(article.article_news_id)
        }
    }, {
        $lookup: {
            from: constants.LOOKUP_DB_NAME.LOCATION,
            foreignField: "_id",
            localField: "news_location_id",
            as: "locationDetails"
        }
    }, { $unwind: '$locationDetails' },
    { $unwind: '$locationDetails.location_name' }, {
        $match: {
            'locationDetails.location_name.lang': process.env.lang
        }
    },
    {
        $lookup: {
            from: constants.LOOKUP_DB_NAME.USER,
            foreignField: "user_location",
            localField: "news_location_id",
            as: "userDetails"
        }
    },
    { $unwind: '$userDetails' },
    {
        $project: {
            locationDetails: 1,
            userDetails: 1,
            news_language_id: 1,
            news_location_id: 1,
            data: {
                $cond: {
                    if: {
                        $gt: [{ $indexOfArray: ['$userDetails.user_news_languages', '$news_language_id'] }, -1]
                    },
                    then: true,
                    else: false
                }
            }
        }
    }, { $unwind: '$userDetails.user_tokens' }, {
        $match: {
            data: true,
            'userDetails.user_notification.regional_news': constants.NOTIFICATION.YES
        }
    },
    {
        $group: {
            _id: '$news_location_id',
            location_name: { $first: '$locationDetails.location_name.title' },
            tokens: {
                $push: '$userDetails.user_tokens.user_device_token'
            }
        }
    }];

    newsDao.aggregate(aggQuery).then((data) => {
        if (data && data != null && data.length) {
            let msg = `${article.article_title} News added in your selected area, ${data[0].location_name || ''}.`;
            notificationHelper.sendNotification(data[0].tokens || [], msg, process.env.appName, article)

        }

    })
}

//-----------------NOTIFICATION
function sendAddFollowingNewsNotification(type, article) {

    if (type == 'topic') {
        let aggQuery = [{
            $match: {
                _id: mongoose.Types.ObjectId(article.article_news_id)
            }
        }, {
            $lookup: {
                from: constants.LOOKUP_DB_NAME.TOPIC,
                foreignField: "_id",
                localField: "news_topic_id",
                as: "topicDetails"
            }
        }, { $unwind: '$topicDetails' },
        { $unwind: '$topicDetails.topic_name' }, {
            $match: {
                'topicDetails.topic_name.lang': process.env.lang
            }
        },
        {
            $lookup: {
                from: constants.LOOKUP_DB_NAME.USER,
                foreignField: "user_follow_topics",
                localField: "news_topic_id",
                as: "userDetails"
            }
        },
        { $unwind: '$userDetails' },
        {
            $project: {
                topicDetails: 1,
                userDetails: 1,
                news_language_id: 1,
                news_topic_id: 1,
                data: {
                    $cond: {
                        if: {
                            $gt: [{ $indexOfArray: ['$userDetails.user_news_languages', '$news_language_id'] }, -1]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        }, { $unwind: '$userDetails.user_tokens' }, {
            $match: {
                data: true,
                'userDetails.user_notification.following': constants.NOTIFICATION.YES
            }
        },
        {
            $group: {
                _id: '$news_topic_id',
                topic_name: { $first: '$topicDetails.topic_name.title' },
                tokens: {
                    $push: '$userDetails.user_tokens.user_device_token'
                }
            }
        }];

        newsDao.aggregate(aggQuery).then((data) => {
            if (data && data != null && data.length) {
                let msg = `${article.article_title} News added in your Interested Topic, ${data[0].topic_name || ''}.`;
                notificationHelper.sendNotification(data[0].tokens || [], msg, process.env.appName, article)
            }
        })
    } else {
        let aggQuery = [{
            $match: {
                _id: mongoose.Types.ObjectId(article.article_news_id)
            }
        }, {
            $lookup: {
                from: constants.LOOKUP_DB_NAME.PUBLICATION,
                foreignField: "_id",
                localField: "news_publication_id",
                as: "publicationDetails"
            }
        }, { $unwind: '$publicationDetails' },
        { $unwind: '$publicationDetails.publication_name' }, {
            $match: {
                'publicationDetails.publication_name.lang': process.env.lang
            }
        },
        {
            $lookup: {
                from: constants.LOOKUP_DB_NAME.USER,
                foreignField: "user_follow_publications",
                localField: "news_publication_id",
                as: "userDetails"
            }
        },
        { $unwind: '$userDetails' },
        {
            $project: {
                publicationDetails: 1,
                userDetails: 1,
                news_language_id: 1,
                news_publication_id: 1,
                data: {
                    $cond: {
                        if: {
                            $gt: [{ $indexOfArray: ['$userDetails.user_news_languages', '$news_language_id'] }, -1]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        }, { $unwind: '$userDetails.user_tokens' }, {
            $match: {
                data: true,
                'userDetails.user_notification.following': constants.NOTIFICATION.YES
            }
        },
        {
            $group: {
                _id: '$news_publication_id',
                publication_name: { $first: '$publicationDetails.publication_name.title' },
                tokens: {
                    $push: '$userDetails.user_tokens.user_device_token'
                }
            }
        }];


        newsDao.aggregate(aggQuery).then((data) => {
            if (data && data != null && data.length) {
                let msg = `${article.article_title} News added in your Interested Source, ${data[0].publication_name || ''}.`;
                notificationHelper.sendNotification(data[0].tokens || [], msg, process.env.appName, article)
            }
        })
    }
}

//-----------------NOTIFICATION
function sendCatHeadLinesNewsNotification(article) {
    let aggQuery = [
        { $unwind: '$category_name' },
        {
            $match: {
                'category_name.lang': process.env.lang,
                'category_name.title': 'HeadLines',
                "category_is_deleted": false
            }
        }, {
            $lookup: {
                from: constants.LOOKUP_DB_NAME.NEWS,
                foreignField: "news_category_id",
                localField: "_id",
                as: "newsDetails"
            }
        }, { $unwind: '$newsDetails' }, {
            $lookup: {
                from: constants.LOOKUP_DB_NAME.USER,
                foreignField: "user_news_languages",
                localField: "newsDetails.news_language_id",
                as: "userDetails"
            }
        }, { $unwind: '$userDetails' }, {
            $project: {
                category_name: '$category_name.title',
                userDetails: 1,
                news_language_id: '$newsDetails.news_language_id'
            }
        }, { $unwind: '$userDetails.user_tokens' }, {
            $match: {
                'userDetails.user_notification.head_lines': constants.NOTIFICATION.YES
            }
        }, {
            $group: {
                _id: '$_id',
                category_name: { $first: '$category_name' },
                tokens: {
                    $push: '$userDetails.user_tokens.user_device_token'
                }
            }
        }];

    categoryDao.commonAggregate(aggQuery).then((data) => {
        if (data && data != null && data.length) {
            let msg = `${article.article_title} News added in ${data[0].category_name || ''}.`;
            notificationHelper.sendNotification(data[0].tokens || [], msg, process.env.appName, article)

        }

    })
}


function saveArticles(req, items) {
    return new Promise((resolve, reject) => {
        async.map(items, async function (x) {
            let item = {
                article_news_id: req.news_id,
                article_title: x && x.title && x.title.length ? x.title[0] : '',
                // removeEscapeCharFromString(x.description[0])
                article_description: x && x.description && x.description.length ? (await convertDescriptionToString(x.description[0])).trim() : '',
                article_link: x && x.link && x.link.length ? x.link[0].trim() : '',
                article_image: (await getImageSrcFromDescription(x)).trim(),
                article_pub_date: x && x.pubDate && x.pubDate.length ? await convertToDate(x.pubDate[0]) : '',
            };
            return item;
        }, async (err, results) => {
            if (err) throw err
            // results is now an array of the response bodies

            return await dao.addArticle(results).then(async (data) => {

                if (data && data != null) {

                    resolve(data)
                } else {
                    return [];
                }
            });

        });
    })
}

// get String  SRC from Item tag.
async function getImageSrcFromDescription(x) {

    let defaultNewsImg = process.env.defaultNewsImg;
    let res;
    if (x["StoryImage"] && x["StoryImage"].length) {
        res = x["StoryImage"][0] && x["StoryImage"][0] != '' ? x["StoryImage"][0] : defaultNewsImg;
    }
    else if (x["fullimage"] && x["fullimage"].length) {
        res = x["fullimage"][0] && x["fullimage"][0] != '' ? x["fullimage"][0] : defaultNewsImg;
    }
    else if (x["image"] && x["image"].length) {
        res = x["image"][0] && x["image"][0] != '' ? x["image"][0] : defaultNewsImg;
    }
    else if (x["media:thumbnail"] && x["media:thumbnail"].length && x["media:thumbnail"][0] && x["media:thumbnail"][0].url && x["media:thumbnail"][0].url.length) {
        res = x["media:thumbnail"][0].url[0] && x["media:thumbnail"][0].url[0] != '' ? x["media:thumbnail"][0].url[0] : defaultNewsImg;
    }
    else if (x["enclosure"] && x["enclosure"].length && x["enclosure"][0] && x["enclosure"][0].url && x["enclosure"][0].url.length) {
        res = x["enclosure"][0].url[0] && x["enclosure"][0].url[0] != '' ? x["enclosure"][0].url[0] : defaultNewsImg;
    }
    else if (x["media:content"] && x["media:content"].length && x["media:content"][0] && x["media:content"][0].url && x["media:content"][0].url.length) {
        res = x["media:content"][0].url[0] && x["media:content"][0].url[0] != '' ? x["media:content"][0].url[0] : defaultNewsImg;
    }
    else if (x["content:encoded"] && x["content:encoded"].length) {
        var m = await getAttrFromString(x["description"][0], 'img', 'src');
        res = m && m != '' ? m : defaultNewsImg;
    } else if (x["description"] && x["description"].length) {
        var m = await getAttrFromString(x["description"][0], 'img', 'src');
        res = m && m != '' ? m : defaultNewsImg;
    } else {
        res = defaultNewsImg;
    }
    return await res;


}


function convertToDate(str) {

    var index = str.search("IST");

    if (index && index > 0) {
        var res = str.replace("IST", "+0530");
        let newDate = new Date(res);
        return newDate;
    } else {
        let newDate = new Date(str);
        return newDate;
    }
}


function getAttrFromString(str, node, attr) {
    var regex = new RegExp('<' + node + ' .*?' + attr + '="(.*?)"', "gi"), result, res = '';
    while ((result = regex.exec(str))) {
        // res.push(result[1]);
        res = result[1]
    }
    return res;
}

//----------end------- get String  SRC from Image tag.


function convertDescriptionToString(str) {

    str = str.toString();
    if ((str === null) || (str === ''))
        return '';
    else
        str = str.toString();

    str = unescape(str);


    // return str.replace(/(<([^>]+)>)/ig, '');
    str = str.replace(/<a\b[^>]*>/ig, '').replace(/<\/a>/ig, '') // remove anchor tag in the html
    str = str.replace(/<img\b[^>]*>/ig, ''); // remove img tag in the html
    str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''); // remove script tag in html
    str = str.replace(/\r/ig, '').replace(/\t/ig, ''); // remove \r\t in html
    str = str.replace(/&lt;.*?/ig, '<').replace(/&gt;.*?/ig, '>'); // replace "&lt to <" and "&gt to >"
    str = str.replace(/Download Dainik Bhaskar App to read Latest Hindi News Today/ig, '')
    return str;
}

async function autoUpdateArticles() {
    console.log('----------inside---------------------------------------------------------------------1')
    await cronForUpdateData();
    await removeOldArticles(3);
    removeDuplicateArticles();
    // })
}

// TODO  QUERY UPDATE
async function cronForUpdateData() {

    // find all record from table
    let result = await newsDao.findAll({
        "news_status": "ACTIVE",
        "news_is_deleted": false
    });
    if (result && result.length) {
        console.log("result if crone ")
        console.log('--------------------------1',);
        async function resultLoop(index, result) {
            // taking one record for rssfeed get
            let rssFeed = await result[index];

            if (rssFeed == undefined) {
                return;
            }
            console.log('---------------rssfeed--------------',);
            // take rss feed & call for xml data
            response = await axios.get(rssFeed.news_rss_feed_link);
            console.log('---------------status--------------', response.status);

            if (response) {
                let resData = response && response != null && response.data && response.data != null ? response.data : '';

                // convert xml data to json.
                let data = await xml2js.parseStringPromise(resData, { mergeAttrs: true }).then((data) => {
                    return data;
                }).catch((er) => {
                    return [];
                });
                // take articles array from json data
                let items = data && data != null && data.rss && data.rss != null && data.rss.channel && data.rss.channel.length && data.rss.channel[0].item ? data.rss.channel[0].item : [];

                // console.log('-------|||-4',items)
                // console.log('-------|||-4', items.length)

                // req.news_id = ;
                if (items && items.length) {
                    console.log('-------|||-5',)

                    console.log('-------|||-6', rssFeed._id)
                    // loop of items data & generate the unique article array
                    async.map(items, async function (x) {

                        let item = {
                            article_news_id: mongoose.Types.ObjectId(rssFeed._id),
                            article_title: x && x.title && x.title.length ? x.title[0].trim() : '',
                            // removeEscapeCharFromString(x.description[0])
                            article_description: x && x.description && x.description.length ? (await convertDescriptionToString(x.description[0])).trim() : '',
                            article_link: x && x.link && x.link.length ? x.link[0].trim() : '',
                            article_image: (await getImageSrcFromDescription(x)).trim(),
                            article_pub_date: x && x.pubDate && x.pubDate.length ? await convertToDate(x.pubDate[0]) : '',
                        };
                        let itemQuery = {
                            // article_news_id: rssFeed._id,
                            article_title: (x && x.title && x.title.length) ? x.title[0].trim() : '',
                            // article_pub_date: (x && x.pubDate && x.pubDate.length) ? await convertToDate(x.pubDate[0]) : '',
                        };
                        if (item) {
                            // console.log('item =>', item);
                            //find article from table if exist then insert othewise not
                            let article = await dao.findOneArticle(itemQuery);
                            // console.log('-------|||-7', article);

                            if (article && article == null || !article) {
                                return item;
                            } else {
                                console.log('-------|||-7-.1--------else',);
                                return
                            }
                        }

                    }, async (err, results) => {
                        console.log('-------|||-8', results.length)

                        if (err) throw err
                        // results is now an array of the response bodies
                        console.log('-------|||-9', results.length)

                        //getting array with undefined values so remove undefined && null values from array
                        results = await _.without(results, undefined, null);
                        console.log('-------|||-9.1', results.length)

                        if (results && results.length) {
                            //insert that articles into the database.
                            await dao.addArticle(results).then(async (data) => {
                                console.log('-------|||-10',)

                                if (data && data != null) {
                                    console.log('-------|||-done-----------------',)
                                    // if success run then +1 & run again
                                    let art = results[0];
                                    //-----------------NOTIFICATION CODE
                                    // let temp = Math.round(result.length / 3);
                                    // if (index == temp || index == (2 * temp) || index == (3 * temp)) {
                                    // following
                                    // process.nextTick(sendAddFollowingNewsNotification('publication', art));
                                    sendAddFollowingNewsNotification('publication', art)
                                    // process.nextTick(sendAddFollowingNewsNotification('topic', art));
                                    sendAddFollowingNewsNotification('topic', art)
                                    // // regional news
                                    // process.nextTick(sendAddRegionalNewsNotification(art));
                                    sendAddRegionalNewsNotification(art)
                                    // // Head Line News
                                    // process.nextTick(sendCatHeadLinesNewsNotification(art));
                                    sendCatHeadLinesNewsNotification(art)

                                    // }

                                    index = index + 1;

                                    await resultLoop(index, result);
                                } else {
                                    // if any issue then skip it & run again
                                    index = index + 1;
                                    await resultLoop(index, result);
                                }
                            });
                        } else {
                            // if any issue then skip it & run again
                            index = index + 1;
                            await resultLoop(index, result);
                        }

                    });


                } else {
                    // if articles not found then skip it & run again

                    index = index + 1;
                    await resultLoop(index, result);
                }
            } else {
                // if issue in parsing then skip it & run again
                index = index + 1;
                await resultLoop(index, result);
            }



        }
        await resultLoop(0, result);
    }


}


function readLater(req) {

    let articleFindQuery = {
        _id: mongoose.Types.ObjectId(req.body.article_id)
    };

    let readLaterFindQuery = {
        // read_later_user_id: mongoose.Types.ObjectId(req._id),
        read_later_article_id: mongoose.Types.ObjectId(req.body.article_id)
    };

    // find articles in read later collection
    return dao.findOneReadLaterArticle(readLaterFindQuery).then(async (readLaterResult) => {

        if (readLaterResult && readLaterResult != null) {

            if (readLaterResult.read_later_user_id && readLaterResult.read_later_user_id.length) {

                let index = await readLaterResult.read_later_user_id.indexOf(req._id);

                let updateReadLaterQuery = {};
                let returnData = 0;
                if (index >= 0) {
                    updateReadLaterQuery = {
                        $pull: { read_later_user_id: mongoose.Types.ObjectId(req._id) }
                    };
                    returnData = 4;
                } else {
                    updateReadLaterQuery = {
                        $push: { read_later_user_id: mongoose.Types.ObjectId(req._id) }
                    };
                    returnData = 3;
                }

                return await dao.updateReadLaterArticle(readLaterFindQuery, updateReadLaterQuery).then((updateData) => {
                    if (updateData) {
                        return returnData;
                    }
                })

            } else {

                let updateReadLaterQuery = {
                    $push: { read_later_user_id: mongoose.Types.ObjectId(req._id) }
                };

                return await dao.updateReadLaterArticle(readLaterFindQuery, updateReadLaterQuery).then((updateData) => {
                    if (updateData) {
                        return 3;
                    }
                })
            }

        } else {

            // find article in article collection
            return dao.findOneArticle(articleFindQuery).then(async (articleResult) => {

                if (articleResult && articleResult != null) {
                    let articleData = {
                        read_later_title: articleResult.article_title,
                        read_later_description: articleResult.article_description,
                        read_later_link: articleResult.article_link,
                        read_later_image: articleResult.article_image,
                        read_later_pub_date: articleResult.article_pub_date,
                        read_later_user_id: [mongoose.Types.ObjectId(req._id)],
                        read_later_article_id: mongoose.Types.ObjectId(req.body.article_id),
                        read_later_news_id: mongoose.Types.ObjectId(articleResult.article_news_id),
                        read_later_like: articleResult.article_like
                    };

                    return await dao.addReadLaterArticle(articleData).then((addReadLaterResult) => {
                        if (addReadLaterResult && addReadLaterResult != null) {
                            // console.log("this is result ?????????????", addReadLaterResult)
                            return 3;
                        }
                    });
                } else {

                    let articleInBundle = {
                        'bundle_article.article_id': mongoose.Types.ObjectId(req.body.article_id)
                    }
                    let projection = {
                        bundle_article: {
                            $elemMatch: {
                                article_id: mongoose.Types.ObjectId(req.body.article_id)
                            }
                        }
                    }
                    // find article in bundle collection
                    return bundleDao.findOne(articleInBundle, projection).then((bundlResult) => {

                        if (bundlResult && bundlResult != null) {

                            let articleData = {
                                read_later_title: bundlResult.bundle_article[0].article_title,
                                read_later_description: bundlResult.bundle_article[0].article_description,
                                read_later_link: bundlResult.bundle_article[0].article_link,
                                read_later_image: bundlResult.bundle_article[0].article_image,
                                read_later_pub_date: bundlResult.bundle_article[0].article_pub_date,
                                read_later_user_id: [mongoose.Types.ObjectId(req._id)],
                                read_later_article_id: mongoose.Types.ObjectId(req.body.article_id),
                                read_later_news_id: mongoose.Types.ObjectId(bundlResult.bundle_article[0].article_news_id),
                                read_later_like: bundlResult.bundle_article[0].article_like || []
                            }

                            return dao.addReadLaterArticle(articleData).then((addReadLaterResult) => {
                                if (addReadLaterResult && addReadLaterResult != null) {
                                    return 3;
                                }
                            });

                        } else {
                            return 1;
                        }
                    })
                }
            })
        }
    })
}


async function readLaterList(req) {

    let page = 1;
    let skip = 0;

    if (req.body.page) {
        page = parseInt(req.body.page);
    }

    if (page == 1) {
        skip = 0;
    } else {
        skip = (page - 1) * 10;
    }

    let option = {
        skip: skip,
        limit: 10
    };

    let search = req.body.search || '';
    let query = {};
    let fieldArray = ['article_title', 'article_description', 'publication_name']
    query['$or'] = [];
    for (let i = 0; i < fieldArray.length; i++) {
        let fieldI = fieldArray[i];
        query['$or'].push({
            [fieldI]: {
                $regex: search,
                $options: 'i'
            }
        });
    }

    return await appLangDao.checkIfExist({ _id: mongoose.Types.ObjectId(req._app_langId) }).then(async (data) => {
        if (data && data != null) {

            let articleAggQuery = [{
                $match: {
                    read_later_user_id: mongoose.Types.ObjectId(req._id)
                }
            }, {
                $lookup: {
                    from: constants.LOOKUP_DB_NAME.NEWS,
                    localField: 'read_later_news_id',
                    foreignField: '_id',
                    as: 'newsDetail'
                }
            }, { $unwind: '$newsDetail' },
            {
                $match: { 'newsDetail.news_status': constants.STATUS.ACTIVE }
            }, {
                $lookup: {
                    from: constants.LOOKUP_DB_NAME.PUBLICATION,
                    localField: 'newsDetail.news_publication_id',
                    foreignField: '_id',
                    as: 'publicationsDetail'
                }
            }, { $unwind: '$publicationsDetail' },
            {
                $match: { 'publicationsDetail.publication_status': constants.STATUS.ACTIVE }
            }, {
                $project: {
                    like: {
                        $cond: {
                            if: {
                                $gt: [{ $indexOfArray: ["$read_later_like", { type: 'like', user_id: mongoose.Types.ObjectId(req._id) }] }, -1]
                            },
                            then: true,
                            else: false
                        }
                    },
                    dislike: {
                        $cond: {
                            if: {
                                $gt: [{ $indexOfArray: ["$read_later_like", { type: 'dislike', user_id: mongoose.Types.ObjectId(req._id) }] }, -1]
                            },
                            then: true,
                            else: false
                        }
                    },
                    article_id: '$read_later_article_id',
                    publication_id: '$publicationsDetail._id',
                    publication_name_ot: {
                        "$filter": {
                            "input": "$publicationsDetail.publication_name",
                            "as": "publication_name",
                            "cond": {
                                $eq: ["$$publication_name.lang", data.app_language_code]
                            }
                        }
                    },
                    publication_name_en: {
                        "$filter": {
                            "input": "$publicationsDetail.publication_name",
                            "as": "publication_name",
                            "cond": {
                                $eq: ["$$publication_name.lang", process.env.lang]
                            }
                        }
                    },
                    article_pub_date: '$read_later_pub_date',
                    article_image: '$read_later_image',
                    article_title: '$read_later_title',
                    article_description: '$read_later_description',
                    article_link: '$read_later_link',
                    read_later_created_at: 1
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
                $project: {
                    like: 1,
                    dislike: 1,
                    article_id: 1,
                    article_image: 1,
                    article_title: 1,
                    readLater: 1,
                    publication_id: 1,
                    article_pub_date: 1,
                    article_description: 1,
                    article_link: 1,
                    publication_name: {
                        $cond: {
                            if: '$publication_name_ot.title',
                            then: '$publication_name_ot.title',
                            else: '$publication_name_en.title',
                        }
                    },
                    read_later_created_at: 1
                }
            }, {
                $match: query
            }, {
                $sort: { 'read_later_created_at': -1 }
            }, {
                $skip: option['skip']
            }, {
                $limit: option['limit']
            }];

            // // console.log('------------------------------------', aggregateQuery)
            return await dao.readLaterAggregate(articleAggQuery).then((result) => {
                if (result) {
                    return result;
                }
            })
        }
    });
}

function convertObjectId(value) {
    return mongoose.Types.ObjectId(value);
}

async function saveArticlesToBundle(req) {
    // findArticles

    req.body.article_id = _.map(req.body.article_id, convertObjectId);

    let findArticlesQuery = [{
        $match: {
            _id: { $in: req.body.article_id }
        }
    }, {
        $project: {
            article_news_id: 1,
            article_title: 1,
            article_description: 1,
            article_link: 1,
            article_image: 1,
            article_pub_date: 1,
            article_like: 1,
            article_id: '$_id',
            _id: 0
        }
    }]

    let findBundleQuery = {
        _id: mongoose.Types.ObjectId(req.params.id),
        bundle_is_deleted: false
    };

    return await dao.findOneBundle(findBundleQuery).then(async (data) => {

        if (data && data != null) {

            let findedArticles = data.bundle_article;

            let updateArray = [];

            return await dao.aggregateArticles(findArticlesQuery).then(async (result) => {

                if (result && result.length) {

                    if (findedArticles && findedArticles.length) {

                        console.log('comming 1')
                        updateArray = await generateArticlesArray(req, findedArticles, result);
                    } else {
                        updateArray = result;
                    }

                    return await dao.updateBundle(findBundleQuery, {
                        $set: {
                            bundle_article: updateArray
                        }
                    }).then(async (res) => {
                        return res;
                    })

                } else {
                    return 2;
                }
            })

        } else {
            return 1;
        }
    })
}


function generateArticlesArray(req, findedArticles, articles) {
    return new Promise((resolve, reject) => {

        req.body.article_id.map(async (x, j) => {

            let filterData = await findedArticles.filter(y => y.article_id == x.toString());
            console.log('comming 2')
            if (filterData && filterData != null && filterData.length) {

                console.log('comming 3.1')
                let index = await findedArticles.indexOf(filterData[0]);

                await findedArticles.splice(index, 1);

                if (j == req.body.article_id.length - 1) {
                    resolve(findedArticles)
                }
            } else {

                console.log('comming 3.2')
                let filterRes = await articles.filter(y => y.article_id == x.toString());

                if (filterRes && filterRes.length) {
                    let index = await articles.indexOf(filterRes[0]);
                    console.log('comming 4')
                    let obj = {
                        article_title: articles[index].article_title ? articles[index].article_title : '',
                        article_description: articles[index].article_description ? articles[index].article_description : '',
                        article_link: articles[index].article_link ? articles[index].article_link : '',
                        article_image: articles[index].article_image ? articles[index].article_image : '',
                        article_pub_date: articles[index].article_pub_date ? articles[index].article_pub_date : '',
                        article_news_id: articles[index].article_news_id ? articles[index].article_news_id : '',
                        article_id: articles[index].article_id,
                        article_like: articles[index].article_like || []
                    };
                    await findedArticles.push(obj);

                    if (j == req.body.article_id.length - 1) {
                        // process.nextTick(sendSaveNewsInBundleNotification(req));
                        console.log('comming 5')
                        sendSaveNewsInBundleNotification(req, obj)
                        resolve(findedArticles)
                    }
                }

            }
        })

    })
}
//-----------------NOTIFICATION
function sendSaveNewsInBundleNotification(req, articleDetail) {
    let aggQuery = [{
        $match: {
            _id: mongoose.Types.ObjectId(req.params.id)
        }
    }, {
        $lookup: {
            from: constants.LOOKUP_DB_NAME.USER,
            foreignField: "_id",
            localField: "bundle_created_by",
            as: "createdUserDetails"
        }
    }, {
        $lookup: {
            from: constants.LOOKUP_DB_NAME.USER,
            foreignField: "_id",
            localField: "bundle_saved_by",
            as: "savedUserDetails"
        }
    }, { $unwind: '$savedUserDetails' }, { $unwind: '$createdUserDetails' }, {
        $match: {
            'savedUserDetails.user_notification.bundle_activity': constants.NOTIFICATION.YES,
            'savedUserDetails.user_is_deleted': false
        }
    }, { $unwind: '$savedUserDetails.user_tokens' }, {
        $group: {
            _id: '$_id',
            bundle_name: { $first: '$bundle_name' },
            created_user: { $first: '$createdUserDetails.user_name' },
            tokens: {
                $push: '$savedUserDetails.user_tokens.user_device_token'
            }
        }
    }];

    console.log('comming 6')
    dao.aggregateBundle(aggQuery).then((data) => {

        console.log('comming 7', data)
        if (data && data != null && data.length) {
            let result = data[0];

            let msg = `${result.created_user || ''} added news in your saved ${result.bundle_name} bundle.`
            notificationHelper.sendNotification(result.tokens || [], msg, process.env.appName, articleDetail);

        }

    })
}

async function getBundleDetailById(req) {

    let resObj = {
        bundleDetail: {},
        articleDetail: []
    };

    // pagination start----------
    let page = 1;
    let skip = 0;

    if (req.body.page) {
        page = parseInt(req.body.page);
    }

    if (page == 1) {
        skip = 0;
    } else {
        skip = (page - 1) * 10;
    }

    let option = {
        skip: skip,
        limit: 10
    };
    // ----end for pagination

    let query = {
        "_id": mongoose.Types.ObjectId(req.params.id),
        // "bundle_status": constants.BUNDLE_STATUS.PUBLIC,
        "bundle_is_deleted": false,
    }

    let bundleDetailQuery = [{
        $match: query
    }, {
        $lookup: {
            from: constants.LOOKUP_DB_NAME.USER,
            foreignField: "_id",
            localField: "bundle_created_by",
            as: "userDetails"
        }
    }, { $unwind: '$userDetails' }, {
        $project: {
            user_name: '$userDetails.user_name',
            bundle_name: 1,
            bundle_status: 1,
            bundle_saved_count: { $size: '$bundle_saved_by' },
            bundle_article_count: { $size: '$bundle_article' },
            bundle_created_by: 1,
            bundle_created_at: { $dateToString: { format: "%d-%m-%Y", date: "$bundle_created_at" } },
            article_image: {
                $ifNull: [{ $arrayElemAt: ["$bundle_article.article_image", 0] }, process.env.defaultBundleImage]
            },
            follow_bundle: {
                $cond: {
                    if: {
                        $gt: [{ $indexOfArray: ["$bundle_saved_by", mongoose.Types.ObjectId(req._id)] }, -1]
                    },
                    then: true,
                    else: false
                }
            }
        }
    }];
    let appLangugeData = await appLangDao.checkIfExist({ _id: mongoose.Types.ObjectId(req._app_langId) });
    return await dao.aggregateBundle(bundleDetailQuery).then(async (data) => {

        if (data && data.length) {

            if (data[0].bundle_status == constants.BUNDLE_STATUS.PUBLIC ||
                (data[0].bundle_created_by == req._id)) {

                resObj.bundleDetail = await data[0];

                let articleListQuery = [{
                    $match: {
                        "_id": mongoose.Types.ObjectId(req.params.id),
                        "bundle_status": constants.BUNDLE_STATUS.PUBLIC,
                        "bundle_is_deleted": false,
                    }
                }, { $unwind: '$bundle_article' }, {
                    $lookup: {
                        from: constants.LOOKUP_DB_NAME.NEWS,
                        foreignField: "_id",
                        localField: "bundle_article.article_news_id",
                        as: "newsDetails"
                    }
                }, { $unwind: '$newsDetails' }, {
                    $lookup: {
                        from: constants.LOOKUP_DB_NAME.PUBLICATION,
                        foreignField: "_id",
                        localField: "newsDetails.news_publication_id",
                        as: "publicationDetails"
                    }
                }, { $unwind: '$publicationDetails' },
                {
                    $lookup: {
                        from: constants.LOOKUP_DB_NAME.READLATER,
                        localField: 'bundle_article.article_id',
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
                        like: {
                            $cond: {
                                if: {
                                    $gt: [{ $indexOfArray: ["$articleDetail.article_like", { type: 'like', user_id: mongoose.Types.ObjectId(req._id) }] }, -1]
                                },
                                then: true,
                                else: false
                            }
                        },
                        dislike: {
                            $cond: {
                                if: {
                                    $gt: [{ $indexOfArray: ["$articleDetail.article_like", { type: 'dislike', user_id: mongoose.Types.ObjectId(req._id) }] }, -1]
                                },
                                then: true,
                                else: false
                            }
                        },
                        readLater: {
                            $cond: {
                                if: {
                                    $gt: [{ $indexOfArray: ["$readLaterDetail.read_later_user_id", mongoose.Types.ObjectId(req._id)] }, -1]
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
                        article_id: '$bundle_article.article_id',
                        article_title: '$bundle_article.article_title',
                        article_description: '$bundle_article.article_description',
                        article_link: '$bundle_article.article_link',
                        article_image: '$bundle_article.article_image',
                        article_pub_date: '$bundle_article.article_pub_date'
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
                    $project: {
                        publication_id: 1,
                        publication_name: {
                            $cond: {
                                if: '$publication_name_ot.title',
                                then: '$publication_name_ot.title',
                                else: '$publication_name_en.title',
                            }
                        },
                        like: 1,
                        dislike: 1,
                        readLater: 1,
                        article_id: 1,
                        article_title: 1,
                        article_description: 1,
                        article_link: 1,
                        article_image: 1,
                        article_pub_date: 1,
                    }
                }, {
                    $skip: option['skip']
                }, {
                    $limit: option['limit']
                }];

                resObj.articleDetail = await dao.aggregateBundle(articleListQuery);
                return await resObj;
            } else {

                // you have no access to get this bundle
                return 2;
            }

        } else {
            return 1;
        }
    })

}

async function likeDislike(req) {
    let articleFindQuery = {
        _id: mongoose.Types.ObjectId(req.params.id)
    };

    let articleLikeFindQuery = {
        _id: mongoose.Types.ObjectId(req.params.id),
        'article_like.type': req.body.type,
        'article_like.user_id': mongoose.Types.ObjectId(req._id)
    };
    return await dao.findOneArticle(articleFindQuery).then(async (articleData) => {
        if (articleData && articleData != null) {

            return await dao.findOneArticle(articleLikeFindQuery).then(async (articleLikeData) => {
                if (articleLikeData && articleLikeData != null) {
                    if (req.body.type == constants.ARTICLE_LIKE_TYPE.LIKE) {
                        return 2;
                    } else {
                        return 3;
                    }
                } else {
                    let updateArticleData = {
                        $push: {
                            article_like: {
                                type: req.body.type,
                                user_id: mongoose.Types.ObjectId(req._id)
                            }
                        }
                    };
                    await dao.updateArticle(articleFindQuery, updateArticleData)

                    if (req.body.type == constants.ARTICLE_LIKE_TYPE.LIKE) {
                        return await 4;
                    }
                    else {
                        return await 5;
                    }
                }
            })

        } else {
            return 1;
        }
    })

}

function readLaterLikeDislike(req) {
    let articleFindQuery = {
        _id: mongoose.Types.ObjectId(req.params.id)
    };

    let articleLikeFindQuery = {
        _id: mongoose.Types.ObjectId(req.params.id),
        'read_later_like.type': req.body.type,
        'read_later_like.user_id': mongoose.Types.ObjectId(req._id)
    };

    return dao.findOneReadLaterArticle(articleFindQuery).then((articleData) => {
        if (articleData && articleData != null) {

            return dao.findOneReadLaterArticle(articleLikeFindQuery).then(async (articleLikeData) => {
                if (articleLikeData && articleLikeData != null) {
                    if (req.body.type == constants.ARTICLE_LIKE_TYPE.LIKE) {
                        return 2;
                    } else {
                        return 3;
                    }
                } else {
                    let updateArticleData = {
                        $push: {
                            read_later_like: {
                                type: req.body.type,
                                user_id: mongoose.Types.ObjectId(req._id)
                            }
                        }
                    };
                    await dao.updateReadLaterArticle(articleFindQuery, updateArticleData)

                    if (req.body.type == constants.ARTICLE_LIKE_TYPE.LIKE) {
                        return 4;
                    }
                    else {
                        return 5;
                    }
                }
            })

        } else {
            return 1;
        }
    })
}


async function getArticleLikeDetail(req) {
    let resObj = {
        like: false,
        article_id: '',
        dislike: false
    };

    let articleDisLikeFindQuery = {
        _id: mongoose.Types.ObjectId(req.params.id),
        'article_like.type': constants.ARTICLE_LIKE_TYPE.DISLIKE,
        'article_like.user_id': mongoose.Types.ObjectId(req._id)
    };

    let articleLikeFindQuery = {
        _id: mongoose.Types.ObjectId(req.params.id),
        'article_like.type': constants.ARTICLE_LIKE_TYPE.LIKE,
        'article_like.user_id': mongoose.Types.ObjectId(req._id)
    };

    let articleFindQuery = {
        _id: mongoose.Types.ObjectId(req.params.id)
    };
    return await dao.findOneArticle(articleFindQuery).then(async (articleData) => {
        if (articleData && articleData != null) {

            let likeData = await dao.findOneArticle(articleLikeFindQuery);
            let dislikeData = await dao.findOneArticle(articleDisLikeFindQuery);

            if (likeData && likeData != null) {
                resObj.like = true;
            }

            if (dislikeData && dislikeData != null) {
                resObj.dislike = true;
            }
            resObj.article_id = mongoose.Types.ObjectId(req.params.id);
            return await resObj;
        } else {
            return 1;
        }
    })
}

function removeOldArticles(days) {

    let findArticleQuery = {
        article_created_at: {
            $lt: new Date(new Date().setDate(new Date().getDate() - parseInt(days)))
        }
    }
    dao.removeArticle(findArticleQuery);
}

function removeDuplicateArticles() {

    let findDuplicateArticleQuery = [{
        $group: {
            _id: { article_title: "$article_title" },
            dups: { "$addToSet": "$_id" },
            count: { "$sum": 1 }
        }
    }, {
        $match: {
            count: { "$gt": 1 }
        }
    }]

    dao.aggregateArticles(findDuplicateArticleQuery).then((result) => {

        let duplicates = [];

        result.map((doc) => {
            doc.dups.shift();
            doc.dups.forEach((dupId) => {
                duplicates.push(dupId);
            });
        });

        if (duplicates.length) {

            let removeArticleQuery = {
                _id: duplicates
            }

            console.log('duplicates articles =>', duplicates.length)

            dao.removeArticle(removeArticleQuery);
        }
    })
}

function bundleLikeDislike(req) {
    let articleFindQuery = {
        'bundle_article.article_id': mongoose.Types.ObjectId(req.params.id)
    };

    let projection = {
        bundle_article: {
            $elemMatch: {
                article_id: mongoose.Types.ObjectId(req.params.id)
            }
        }
    }

    let articleLikeFindQuery = {
        'bundle_article.article_id': mongoose.Types.ObjectId(req.params.id),
        'bundle_article.article_like.type': req.body.type,
        'bundle_article.article_like.user_id': mongoose.Types.ObjectId(req._id)
    };

    return bundleDao.findOne(articleFindQuery, projection).then((articleData) => {
        if (articleData && articleData != null) {

            return bundleDao.findOne(articleLikeFindQuery).then(async (articleLikeData) => {

                if (articleLikeData && articleLikeData != null) {
                    if (req.body.type == constants.ARTICLE_LIKE_TYPE.LIKE) {
                        return 2;
                    } else {
                        return 3;
                    }
                } else {
                    let updateArticleData = {
                        $push: {
                            'bundle_article.$.article_like': {
                                type: req.body.type,
                                user_id: mongoose.Types.ObjectId(req._id)
                            }
                        }
                    };
                    await bundleDao.updateMany(articleFindQuery, updateArticleData)

                    if (req.body.type == constants.ARTICLE_LIKE_TYPE.LIKE) {
                        return 4;
                    }
                    else {
                        return 5;
                    }
                }
            })

        } else {
            return 1;
        }
    })
}

module.exports = {
    addArticleData,
    autoUpdateArticles,

    readLater,
    readLaterList,

    saveArticlesToBundle,
    getBundleDetailById,
    likeDislike,
    readLaterLikeDislike,
    getArticleLikeDetail,
    bundleLikeDislike
};
