'use strict'
//= ========================= Load Modules Start =======================
const mongoose = require('mongoose');
const constants = require('../../constants');
const permissionModel = require('../permission/permissionModel')
const permissionMaster = mongoose.model(constants.DB_MODEL_REF.PERMISSION, permissionModel.PermissionSchema);
let BaseDao = require('../../dao/baseDao');
const dao = new BaseDao(permissionMaster);
var db = require('../../config/dbConfig')

//= ========================= Load Modules End ==============================================
// /**for fetch all list
//  * 
//  * @param {string} query, option 
//  */
// async function getList(query, option) {
//     //let newConnection = await db.createMongooseConnection();
//     return dao.findWithPeginate(query, option).then((result) => {
//         newConnection.connection.close();
//         return result;
//     })
// }

// /** for add detalis
//  * 
//  * @param {Object} addDetails 
//  */
// async function addDetails(details) {
//     //let newConnection = await db.createMongooseConnection();
//     let data = new permissionModel(details);
//     return dao.save(data).then((result) => {
//         newConnection.connection.close();
//         return result
//     })
// }

// /**
//  * for fetch details
//  * @param {object} req request object
//  * @param {object} res response object 
//  */
// async function fetchDetails(query) {
//     //let newConnection = await db.createMongooseConnection();
//     return dao.findOne(query).then((result) => {
//         newConnection.connection.close();
//         return result;
//     }).catch(e => {
//         console.log({ e })
//     })
// }

// /**for update Details data
//  * 
//  * @param {string} query 
//  * @param {object} data 
//  */
// async function updateDetails(query, data) {
//     //let newConnection = await db.createMongooseConnection();
//     let update = {};
//     update['$set'] = data

//     let option = {};
//     option.new = true;
//     return dao.findOneAndUpdate(query, update, option).then((result) => {
//         newConnection.connection.close();
//         return result
//     })
// }

// /**for delete Details data
//  * 
//  * @param {string} query  
//  */
// async function deleteDetail(query, data) {
//     //let newConnection = await db.createMongooseConnection();
//     let option = {};
//     return dao.findByIdAndRemove(query, option).then((result) => {
//         newConnection.connection.close();
//         return result
//     })
// }

/**for Get Permissions data
 * 
 * @param {string} query  
 */
async function getPermissionsList(query) {
    //let newConnection = await db.createMongooseConnection();
    return await dao.aggregate(query).then(async(result) => {
        //await newConnection.connection.close();
        return result
    })
}

//= ========================= Export Module Start ==============================

module.exports = {
    // getList, /**for fetch all  list */
    // addDetails,/**for add details */
    // fetchDetails, /**for fetch details */
    // updateDetails,/**for update details */
    // deleteDetail,/**for delete details */
    getPermissionsList
}

//= ========================= Export Module End ===============================
