'use strict';

//=================================== Load Modules start ===================================

//=================================== Load external modules=================================
const mongoose = require('mongoose');

// Initilize redis connection
var redis = require('redis');
//=================================== Load Modules end =====================================

async function createMongooseConnection() {
    let op = { poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
    let db = await mongoose.connect(process.env.dbUrl + process.env.dbName, op)
    // { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, autoReconnect: true, socketTimeoutMS: 300000 })
    return await db
}
// ,  promiseLibrary: global.Promise 
async function createRedisConnection() {
    let dbr = await redis.createClient(process.env.redisPort, process.env.redisHost, { password: process.env.redisPass });
    return dbr;
}

module.exports = {

    createMongooseConnection,

    createRedisConnection
} 
