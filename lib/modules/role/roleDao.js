'use strict'
//= ========================= Load Modules Start =======================
const mongoose = require('mongoose');
const constants = require('../../constants');
const roleModel = require('../role/roleModel')
const roleMaster =  mongoose.model(constants.DB_MODEL_REF.ROLE, roleModel.roleSchema);
let BaseDao = require('../../dao/baseDao');
const dao = new BaseDao(roleMaster);
var db = require('../../config/dbConfig')

//= ========================= Load Modules End ==============================================
/**for fetch all list
 * 
 * @param {string} query, option 
 */
async function getList(query, option) {
    //let newConnection = await db.createMongooseConnection();
    return await dao.findWithPeginate(query, option).then(async(result) => {
        //await newConnection.connection.close();
        return result;
    })
}

/** for add detalis
 * 
 * @param {Object} addDetails 
 */
async function addDetails(details) {
    //let newConnection = await db.createMongooseConnection();
    return await dao.save(details).then(async(result) => {
        // await  newConnection.connection.close();
        return result
    })
}

/**for add role Permissions * 
 * @param {string} query 
 * @param {object} data 
 */
async function addRolePermissions(query, data) {
    //let newConnection = await db.createMongooseConnection();
    let update = {};
    update['$addToSet'] = { role_permissions: data.role_permissions }
    let option = {};
    option.new = true;
    return await dao.findOneAndUpdate(query, update, option).then(async(result) => {
        // await  newConnection.connection.close();
        return result
    })
}

/**for remove permission * 
 * @param {string} query 
 * @param {object} data 
 */
async function removeRolePermissions(query, data) {
    //let newConnection = await db.createMongooseConnection();
    let update = {};
    update['$pull'] = { role_permissions: data.role_permissions }
    let option = {};
    option.new = true;
    return await dao.findOneAndUpdate(query, update, option).then(async(result) => {
        //await newConnection.connection.close();
        return result
    })
}

/**
 * for fetch details
 * @param {object} req request object
 * @param {object} res response object 
 */
async function fetchDetails(query){
    //let newConnection = await db.createMongooseConnection();
    return await dao.findOne(query).then(async(result) => {
        //await newConnection.connection.close();
        return result; 
    }).catch(e =>{
        console.log({e})
    })
}

/**for update Details data
 * 
 * @param {string} query 
 * @param {object} data 
 */
async function updateDetails(query,data) {
    //let newConnection = await db.createMongooseConnection();
    let update = {};
    update['$set'] = data

    let option = {};
    option.new = true;
    return await dao.findOneAndUpdate(query,update,option).then(async(result) => {
        // await  newConnection.connection.close();
        return result
    })
}

/**for delete Details data
 * 
 * @param {string} query  
 */
async function deleteDetail(query,data) {
    //let newConnection = await db.createMongooseConnection();
    let option = {};
    return await dao.findByIdAndRemove(query,option).then(async(result) => {
        //await newConnection.connection.close();
        return result
    })
}



/**
 * for fetch details
 * @param {object} req request object
 * @param {object} res response object 
 */
async function getRoleWisePermissions(query){
    //let newConnection = await db.createMongooseConnection();
    return await dao.aggregate(query).then(async(result) => {
        //await newConnection.connection.close();
        return result; 
    }).catch(e =>{
        console.log({e})
    })
}

/**
 * for fetch details
 * @param {object} req request object
 * @param {object} res response object 
 */
async function getRolesList(query,prj){
    //let newConnection = await db.createMongooseConnection();
    return await dao.find(query,prj).then(async(result) => {
        //await newConnection.connection.close();
        return result; 
    }).catch(e =>{
        console.log({e})
    })
}

async function findSortingAndLimit(query, condition, limit, projection){
    //let newConnection = await db.createMongooseConnection();
    return await dao.findSortingAndLimit(query, condition, limit, projection).then(async(result) => {
        //await newConnection.connection.close();
        return result;
    })
}


//= ========================= Export Module Start ==============================

module.exports = {
    getList, /**for fetch all  list */
    addDetails,/**for add details */
    fetchDetails, /**for fetch details */
    updateDetails,/**for update details */
    deleteDetail,/**for delete details */
    addRolePermissions, /**for role permission */
    removeRolePermissions, /**for role permission */
    getRoleWisePermissions,
    getRolesList,
    findSortingAndLimit
}

//= ========================= Export Module End ===============================
