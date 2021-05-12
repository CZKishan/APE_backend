
const mongoose = require("mongoose");
const categoryModel = require('./categoryModel')

const constants = require('../../constants');
const categoryMaster = mongoose.model(constants.DB_MODEL_REF.CATEGORY, categoryModel.categorySchema);
let dao = require('../../dao/baseDao');
const categoryDao = new dao(categoryMaster);
const db = require('../../config/dbConfig');


async function addCategory(info) {
    //let newConnection = await db.createMongooseConnection();
    return await categoryDao.save(info).then(async result => {
        //await newConnection.connection.close();
        return result
    })
}


async function checkIfExist(query) {
    // let newConnection = await db.createMongooseConnection();
    return await categoryDao.findOne(query).then(async result => {
        //await newConnection.connection.close();
        return result
    })
}

/** for verify UserDetails
 *
 * @param {string} query
 * @param {object} data
 */
async function updateDetails(query, data) {
    let update = {}
    update['$set'] = data

    let options = {}
    options.new = true;

    // let newConnection = await db.createMongooseConnection();

    return await categoryDao.findOneAndUpdate(query, update, options).then(async result => {
        //await newConnection.connection.close();
        return result
    })
}



/**for fetch all list
 * 
 * @param {string} query 
 */
async function getList(query, option) {
    //let newConnection = await db.createMongooseConnection();
    return await categoryDao.findWithPeginate(query, option).then(async(result) => {
        //await newConnection.connection.close();
        return result;
    })
}


async function commonAggregate(query) {
    // let newConnection = await db.createMongooseConnection();
    return categoryDao.aggregate(query).then(async result => {
        //await newConnection.connection.close()
        return result
    })
}

module.exports = {
    addCategory,
    checkIfExist,
    updateDetails,
    getList,
    commonAggregate
};
