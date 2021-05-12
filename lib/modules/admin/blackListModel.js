var mongoose = require("mongoose");
var constants = require('../../constants');
var Schema = mongoose.Schema;


var blacklistSchema = new Schema({
    blt_token: {
        type: String
    }
}, {
    timestamps: true
});


module.exports = mongoose.model(constants.DB_MODEL_REF.BLACKLISTTOKEN, blacklistSchema);