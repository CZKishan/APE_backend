const s3Bucket = require('./refrence');
const fs = require('fs');

async function uploadDocs(file) {
    const date = new Date();
    return await new Promise((resolve, reject) => {
        let d = date.getTime() + file.name.toString();
        fs.writeFile(d, file.data, 'binary', async function () {
            s3Bucket.getFolders('newsPodImage/').then((folder) => {

                if (folder.Key == "newsPodImage/") {
                    s3Bucket.uploadFile('news-pod-storage', 'newsPodImage', d, d).then(async (data) => {
                        if (data) {
                            fs.unlink(d, function (err) {
                                if (err) throw err;
                                console.log('File deleted!');
                            });
                            resolve(data);

                        } else {
                            reject(error);
                        }
                    })
                } else if (folder.Key != "newsPodImage/") {
                    //create new folder
                    s3Bucket.createFolder('newsPodImage').then((result) => {
                        s3Bucket.uploadFile('news-pod-storage', 'newsPodImage', d, d).then(async (data) => {
                            if (data) {
                                fs.unlink(d, function (err) {
                                    if (err) throw err;
                                    console.log('File deleted!');
                                });
                                resolve(data);

                            } else {
                                reject(error);
                            }
                        })
                    })
                }
            })
        })
    })
}

async function uploadVideo(videoFile) {
    const date = new Date();
    return await new Promise((resolve, reject) => {
        let d = date.getTime() + videoFile.name.toString();;
        fs.writeFile(d, videoFile.data, 'binary', async function () {
            s3Bucket.getFolders('newsPodVideo/').then((folder) => {
                if (folder.Key == "newsPodVideo/") {
                    s3Bucket.uploadFile('news-pod-storage', 'newsPodVideo', d, d).then(async (data) => {
                        if (data) {
                            fs.unlink(d, function (err) {
                                if (err) throw err;
                                console.log('File deleted!');
                            });
                            resolve(data);

                        } else {
                            reject(error);
                        }
                    })
                } else if (folder.Key != "newsPodVideo/") {
                    //create new folder
                    s3Bucket.createFolder('newsPodVideo').then((result) => {
                        s3Bucket.uploadFile('news-pod-storage', 'newsPodVideo', d, d).then(async (data) => {
                            if (data) {
                                fs.unlink(d, function (err) {
                                    if (err) throw err;
                                    console.log('File deleted!');
                                });
                                resolve(data);

                            } else {
                                reject(error);
                            }
                        })
                    })
                }
            })
        })
    })
}


module.exports = {
    uploadDocs,
    uploadVideo
}