
const mongoose = require("mongoose");
const articleModel = require('./articleModel');
const readLaterModel = require('./readLaterModel')
const bundleModel = require('./bundleModel');

const constants = require('../../constants');
const articleMaster = mongoose.model(constants.DB_MODEL_REF.ARTICLE, articleModel.articleSchema);
const readLaterMaster = mongoose.model(constants.DB_MODEL_REF.READLATER, readLaterModel.readLaterSchema);
const bundleMaster = mongoose.model(constants.DB_MODEL_REF.BUNDLE, bundleModel.bundleSchema);

let dao = require('../../dao/baseDao');
const articleDao = new dao(articleMaster);
const readLaterDao = new dao(readLaterMaster);
const bundleDao = new dao(bundleMaster);

const db = require('../../config/dbConfig');


async function addArticle(info) {
    //let newConnection = await db.createMongooseConnection();
    return await articleDao.insertMany(info).then(async result => {
        // await  newConnection.connection.close();
        return await result
    })
}

async function findOneArticle(info) {
    //let newConnection = await db.createMongooseConnection();
    return await articleDao.findOne(info).then(async result => {
        //await newConnection.connection.close();
        return await result
    })
}


async function aggregateArticles(query) {
    //let newConnection = await db.createMongooseConnection();
    return await articleDao.aggregate(query).then(async result => {
        //await newConnection.connection.close();
        return await result
    })
}
 function updateArticle(query,updateData) {
    //let newConnection = await db.createMongooseConnection();
    let options = {}
    options.new = true;
    return  articleDao.findOneAndUpdate(query,updateData,options)
        //await newConnection.connection.close();
        
}

async function removeArticle(query) {
    //let newConnection = await db.createMongooseConnection();
    return await articleDao.remove(query).then(async result => {
        //await newConnection.connection.close();
        return await result;
    })
}
//----------------------------------------------------------------readLaterDao ------------------
async function findOneReadLaterArticle(info) {
    //let newConnection = await db.createMongooseConnection();
    return await readLaterDao.findOne(info).then(async result => {
        //await newConnection.connection.close();
        return await result
    })
}


async function addReadLaterArticle(info) {
    //let newConnection = await db.createMongooseConnection();
    return await readLaterDao.save(info).then(async result => {
        //await newConnection.connection.close();
        return await result
    })
}


/** for verify UserDetails
 *
 * @param {string} query
 * @param {object} data
 */
 function updateReadLaterArticle(query, data) {

    let options = {}
    options.new = true;

    // let newConnection = await db.createMongooseConnection();

    return  readLaterDao.findOneAndUpdate(query, data, options)
}

async function readLaterAggregate(query) {
    //let newConnection = await db.createMongooseConnection();
    return await readLaterDao.aggregate(query).then(async result => {
        //await newConnection.connection.close();
        return await result
    })
}

//-----------------------------------------------------end-----------readLaterDao ------------------



//----------------------------------------------------------------bundleDao ------------------

async function createBundle(info) {
    //let newConnection = await db.createMongooseConnection();
    return await bundleDao.save(info).then(async result => {
        //await newConnection.connection.close();
        return await result
    })
}

/** for verify UserDetails
 *
 * @param {string} query
 * @param {object} data
 */
async function updateBundle(query, data) {

    let options = {}
    options.new = true;

    // let newConnection = await db.createMongooseConnection();

    return await bundleDao.findOneAndUpdate(query, data, options).then(async result => {
        // await  newConnection.connection.close();
        return result
    })
}

async function findOneBundle(info) {
    //let newConnection = await db.createMongooseConnection();
    return await bundleDao.findOne(info).then(async result => {
        //await newConnection.connection.close();
        return await result
    })
}

async function aggregateBundle(query) {
    //let newConnection = await db.createMongooseConnection();
    return await bundleDao.aggregate(query).then(async result => {
        //await newConnection.connection.close();
        return await result
    })
}

async function countBundles(query) {
    //let newConnection = await db.createMongooseConnection();
    return await bundleDao.count(query).then(async result => {
        //await newConnection.connection.close();
        return await result
    })
}
//-----------------------------------------------------end-----------bundleDao ------------------

module.exports = {
    addArticle,
    findOneArticle,
    updateArticle,
    removeArticle,
    findOneReadLaterArticle,
    addReadLaterArticle,
    updateReadLaterArticle,
    readLaterAggregate,
    createBundle,
    updateBundle,
    findOneBundle,
    aggregateArticles,
    aggregateBundle,
    countBundles
};
