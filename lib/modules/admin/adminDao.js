//========================== Load Modules Start =======================

const mongoose = require("mongoose");
const adminModel = require('../../generic/usersModel')

const constants = require('../../constants');
const adminMaster = mongoose.model(constants.DB_MODEL_REF.USER, adminModel.UserSchema);
let dao = require('../../dao/baseDao');
const adminDao = new dao(adminMaster);
const db = require('../../config/dbConfig');


const blackListTokenModel = require('./blackListModel')
const blackListTokenMaster = mongoose.model(constants.DB_MODEL_REF.BLACKLISTTOKEN, blackListTokenModel.blacklistSchema);
const blackListDao = new dao(blackListTokenMaster);

// blacklistToken
//========================== Load Modules End ==============================================

//=====================================================Admin Model =========================================
/**for fetch admin details
 * 
 * @param {string} query data
 */
async function getAdminDetails(query) {
    //let newConnection = await db.createMongooseConnection();
    return await adminDao.findOne(query).then(async (result) => {
        //await newConnection.connection.close();
        return result;
    })
}

/** for check user is exist or not
 *
 * @param {string} 
 */
async function checkIfExist(query, projection) {
    // let newConnection = await db.createMongooseConnection()
    return await adminDao.findOne(query, projection).then(async result => {
        //await newConnection.connection.close()
        return result
    })
}

/** *for set a redis value
 *
 * @param {string} data key
 * @param {object} value  value of key
 */
async function setRedisValue(data, value) {
    // for create redis connections
    let redisConnection = await db.createRedisConnection()
    redisConnection.set(data, value)
    redisConnection.quit()
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
    options.projection = {
        user_password: 0
    };
    // let newConnection = await db.createMongooseConnection()

    return await adminDao.findOneAndUpdate(query, update, options).then(async result => {
        //await newConnection.connection.close()
        return result
    })
}



/** for signUp Users
 *
 * @param {object} userInfo signUp Details
 */
async function saveToken(userInfo) {
    // let newConnection = await db.createMongooseConnection()
    return await blackListDao.save(userInfo).then(async result => {
        //await newConnection.connection.close()
        return result
    })
}


/** for check user is exist or not
 *
 * @param {string} 
 */
async function checkIfExistToken(query) {
    // let newConnection = await db.createMongooseConnection()
    return blackListDao.findOne(query).then(async result => {
        //await newConnection.connection.close()
        return result
    })
}


/** for signUp Users
 *
 * @param {object} userInfo signUp Details
 */
async function addAdmin(userInfo) {
    // let newConnection = await db.createMongooseConnection()
    return await adminDao.save(userInfo).then(async result => {
        //await newConnection.connection.close()
        return result
    })
}

/** for get redis value
 *
 * @param {string} data key
 */
async function getRedisValue(data) {
    let redisConnection = await db.createRedisConnection()
    return new Promise((resolve, reject) => {
        redisConnection.get(data, async function (err, result) {
            redisConnection.quit()
            resolve(result)
            if (err) {
                reject(err)
            }
        })
    })
}


async function getListByAggregate(agQuery, query, option) {
    //let newConnection = await db.createMongooseConnection();
    return await adminDao.aggregate(agQuery).then(async (result) => {

        //await newConnection.connection.close();
        // let newConnection1 = await db.createMongooseConnection();

        let count = await adminDao.aggregate(query); // add count
        // await newConnection1.connection.close();

        let resultWithCounter = {};
        resultWithCounter.docs = result;
        resultWithCounter.limit = option.limit;
        resultWithCounter.offset = option.offset;
        resultWithCounter.totalDocs = count.length;

        return resultWithCounter;

    })
}

/** for verify UserDetails
 *
 * @param {string} query
 * @param {object} data
 */
async function commonUpdateDetails(query, data) {

    let options = {}
    options.new = true;

    // let newConnection = await db.createMongooseConnection()

    return await adminDao.findOneAndUpdate(query, data, options).then(async result => {
        //await newConnection.connection.close()
        return result
    })
}


//========================== Export Module Start ==============================

module.exports = {
    getAdminDetails,
    checkIfExist,
    setRedisValue,
    updateDetails,
    saveToken,
    checkIfExistToken,
    addAdmin,
    setRedisValue,
    getRedisValue,
    getListByAggregate,
    commonUpdateDetails
};

//========================== Export Module End ===============================