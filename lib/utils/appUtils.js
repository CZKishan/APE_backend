'use strict';

//========================== Load Modules Start ===========================

//========================== Load External Module =========================

var promise = require('bluebird');
var bcrypt = require('bcryptjs');
require("dotenv").config;

// function isValidEmail(data) {
//     let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     return regex.test(data)
// }

// function isValidPassword(data) {
//     let regex = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!%*#?&])[A-Za-z0-9$@$!%*#?&]{6,15}$/;
//     return regex.test(data)
// }


function verifyPassword(user, isExist) {
    return bcrypt.compare(user, isExist.user_password);
}


function generateSaltAndHashForPassword(password) {
    return bcrypt.hash(password, 10);
}

function isValidPhone(phone, verifyCountryCode) {
    var reExp = verifyCountryCode ? /^\+\d{6,16}$/ : /^\d{6,16}$/;
    return reExp.test(phone);
}

/**
 *
 * @returns {string}
 * get random 6 digit number
 * FIX ME: remove hard codeing
 * @private
 */
async function getRandomOtp() {
    //Generate Random Number
    return Math.floor(100000 + Math.random() * 900000);
}

function generateOtp() {
    //Generate Random Number
    return Math.floor(100000 + Math.random() * 900000);
}
/**for generate random string
 * 
 */
function getRandomString(codeLength = 4) {
    return Math.random().toString(36).substring(codeLength);
}

function generateResetPassordToken() {
    return randomstring.generate();
}

/*
 * To calculate the no. of days between two dates 
 */
function differentInDays(date1, date2) {
    var differenceInTime = date1 - date2;
    // To calculate the no. of days between two dates 
    var differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.round(differenceInDays);
}
//========================== Export Module Start ===========================

module.exports = {
    verifyPassword,
    isValidPhone,
    getRandomOtp,
    generateSaltAndHashForPassword,
    getRandomString,
    generateOtp,
    differentInDays,
    generateResetPassordToken
};

//========================== Export Module End===========================