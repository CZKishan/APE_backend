
const mongoose = require("mongoose");
const constants = require('../../constants')

const userModel = require('../../generic/usersModel')
const userMaster = mongoose.model(constants.DB_MODEL_REF.USER, userModel.UserSchema);
let dao = require('../../dao/baseDao');
let userDao = new dao(userMaster);
const mongoClient = require('../../dao/mongoClient')

const db = require('../../config/dbConfig');

/** for check user is exist or not
 *
 * @param {string} 
 */
async function checkIfExist(query, projection) {
  // let newConnection = await db.createMongooseConnection()
  return await userDao.findOne(query, projection).then(async result => {
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


/** for get redis value
 *
 * @param {string} data key
 */
async function getRedisValue(data) {
  let redisConnection = await db.createRedisConnection()
  return new Promise((resolve, reject) => {
    redisConnection.get(data, function (err, result) {
      redisConnection.quit()
      resolve(result)
      if (err) {
        reject(err)
      }
    })
  })
}

async function deleteRedisValue(data) {
  let redisConnection = await db.createRedisConnection()
  return new Promise((resolve, reject) => {
    redisConnection.del(data, function (err, result) {
      redisConnection.quit()
      resolve(result)
      if (err) {
        reject(err)
      }
    })
  })
}
/** for signUp Users
 *
 * @param {object} userInfo signUp Details
 */
async function createUser(userInfo) {
  // let newConnection = await db.createMongooseConnection();
  return await userDao.save(userInfo).then(async result => {
    let obj = {
      user_first_name: result.user_first_name,
      user_last_name: result.user_last_name,
      user_email: result.user_email || '',
      _id: result._id,
      user_progress: result.user_progress,
    };
    //await newConnection.connection.close()
    return obj;
  })
}


async function updateDetails(query, data) {
  let options = {}
  options.new = true;
  options.projection = {
    user_password: 0,
    user_tokens: 0
  };
  // let newConnection = await db.createMongooseConnection();

  return await userDao.findOneAndUpdate(query, data, options).then(async result => {
    // await  newConnection.connection.close();
    return result
  })
}

async function fulshRedis() {
  let redisConnection = await db.createRedisConnection();
  redisConnection.flushdb(function (err, succeeded) {
    console.log("Flushed Redis DB : ", succeeded); // will be true if successfull
  });
}


async function listWithCount(agQuery, countQuery) {
  //let newConnection = await db.createMongooseConnection();
  return await userDao.aggregate(agQuery).then(async (result) => {

    //await newConnection.connection.close();
    // let newConnection1 = await db.createMongooseConnection();

    let count = await userDao.aggregate(countQuery); // add count
    // await newConnection1.connection.close();

    let resultWithCounter = {};
    resultWithCounter.docs = result;
    resultWithCounter.count = count.length;

    return resultWithCounter;

  })
}


async function aggregate(query) {
  // let newConnection = await db.createMongooseConnection();
  return await userDao.aggregate(query).then( async result => {
    //await newConnection.connection.close()
    return result;
  })
}

async function getListByAggregate(agQuery, query, option) {
  //let newConnection = await db.createMongooseConnection();
  return await userDao.aggregate(agQuery).then(async (result) => {
    
      //await newConnection.connection.close();
      // let newConnection1 = await db.createMongooseConnection();

      let count = await userDao.aggregate(query); // add count
      // await newConnection1.connection.close();

      let resultWithCounter = {};
      resultWithCounter.docs = result;
      resultWithCounter.limit = option.limit;
      resultWithCounter.offset = option.offset;
      resultWithCounter.totalDocs = count.length;

      return resultWithCounter;

  })
}


module.exports = {
  getRedisValue,
  setRedisValue,
  checkIfExist,
  createUser,
  updateDetails,
  fulshRedis,
  listWithCount,
  aggregate,
  getListByAggregate,
  deleteRedisValue
}
