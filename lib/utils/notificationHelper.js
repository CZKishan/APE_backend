// push notification
require('dotenv').config();
const FCM = require('fcm-push');
// const serverKey = process.env.fireBaseServerKey;
// var fcm = new FCM(serverKey);
const fs = require('fs');
const logFile = "./public/logs/logger.txt";

//========================== Load Modules End =============================

//========================== Export Module Start ===========================


/**
* send push notification
* @param {*} to recipient
* @param {*} message message
* @param {*} title title
* @param {*} data data
* @param {boolean} flag, allowing notification object to be passed in the body or not
*/
async function sendNotification(to, description, title, data = {}) {
    // let { notificationType } = data;
    // let obj = { notificationType }
    // obj.title = title;
    // obj.body = message;
    // let notification = {
    //     data: obj,
    //     title,
    //     body: message
    // };

    // let modifyedResult = { to, notification, data: obj }
    // modifyedResult.notification.priority = 'high'
    // if (!flag) {
    //     delete modifyedResult.notification;
    // }
    // console.log("notification payload", JSON.stringify(modifyedResult, null, 4))
    // fcm.send(modifyedResult, function (err, response) {
    //     if (err) {
    //         console.log(err);
    //         console.log("Something has gone wrong !");
    //     } else {
    //         console.log("Successfully sent with response :", response);
    //     }
    // });


    //-----------------------------------------------

    // if (to && to.length) {

    //     var message = {
    //         // to: to, // required fill with device token or topics
    //         registration_ids: to, // send mutiple notification at same time 
    //         notification: {
    //             title: `${title}`,
    //             body: `${description}`,
    //             sound: `default`,
    //             // icon:'',
    //             priority: 'high',
    //         }
    //     };

    //     await fcm.send(message).then((response) => {
    //         console.log("Successfully sent with response: ", response);
    //         return response;
    //     }).catch((err) => {
    //         console.log("Something has gone wrong!");
    //         return 3; //fail to sending pushnotification
    //     })
    // } else {

    //     console.log('push notification token not found for the user');
    // }

}



function fileContentAppend(content) {
    fs.readFileSync(logFile, "utf8");
    let logRows = fs.readFileSync(logFile).toString().split('\n');
    logRows.unshift(content);
    fs.writeFileSync(logFile, logRows.join('\n'), (err) => {
        if (err) {
            console.log(err);
        }
        else {
            // Get the file contents after the append operation 
            // console.log("\nFile Contents of file after append:",
            // fs.readFileSync(logFile, "utf8")); 
        }
    });

}

module.exports = {
    sendNotification,
    fileContentAppend
};

// ios---------------

// {
// to :['',''],
// notification:{  
//     title:'NewsPod',
//     body:'----------------------------masg-----------------------'
//     sound: `default`,
//     data:{
//     title:'',
//     message:''
//     }
// }
// priority:'high'
// }

//------  android


// {
// to :['',''],
// title:'NewsPod',
// data:'-----------------------------msg--------------------------'
// }
