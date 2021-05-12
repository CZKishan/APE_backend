// Importing mongoose
var mongoose = require("mongoose");
const constants = require("../constants");
const db = require("../config/dbConfig");
const bcrypt = require("bcryptjs");
require("dotenv").config;
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate-v2");
const { constant } = require("async");
const { any } = require("bluebird");
//Cron Job test


var UserSchema = new Schema({
    user_role_id: { type: Number, ref: constants.DB_MODEL_REF.ROLE },
    user_email: {
        type: String,
        // required: true,
    },
    user_password: {
        type: String,
    },
    user_name: { type: String },
    user_first_name: { type: String },
    user_last_name: { type: String },
    user_phone_number: { type: String },
    user_status: {
        type: String,
        enum: [
            constants.STATUS.ACTIVE, //Active for 1.
            constants.STATUS.INACTIVE, //InActive for 0.
        ],
        default: constants.STATUS.ACTIVE,
    },
    user_isd_code: { type: String },
    user_is_deleted: { type: Boolean, default: false },
    user_modifyBy: {
        type: mongoose.Types.ObjectId,
    },
    user_country_id: {
        type: mongoose.Types.ObjectId,
    }, user_profile_image: {
        type: String,
        // default:
        //     'http://res.cloudinary.com/dlhkpit1h/image/upload/v1569584744/ukbck5dsrgmedia7ggkz.png'
    },
    user_tokens: [{
        user_jwt: {
            type: String,
            default: ""
        },
        user_device_id: {
            type: String,
            default: ""
        },
        user_device_type: {
            type: String,
            default: ""
        },
        user_device_token: {
            type: String,
            default: ""
        },
    }],
    user_facebook_id: {
        type: String
    },
    user_google_id: {
        type: String
    },
    user_register_via: {
        type: String,
        enum: [
            constants.REGISTERED_VIA.GOOGLE,
            constants.REGISTERED_VIA.FACEBOOK,
            constants.REGISTERED_VIA.NORMAL
        ],
        default: constants.REGISTERED_VIA.NORMAL
    },
    user_otp: {
        type: String
    },
    user_location: { type: mongoose.Types.ObjectId },
    user_app_language: { type: mongoose.Types.ObjectId },
    user_news_languages: [{ type: mongoose.Types.ObjectId }],
    user_progress: { type: Number, default: 0 },
    user_follow_topics:[{ type: mongoose.Types.ObjectId}],
    user_follow_publications:[{ type: mongoose.Types.ObjectId}],
    user_notification:{
        bundle_activity: {
            type: String,
            enum: [
                constants.NOTIFICATION.YES,
                constants.NOTIFICATION.NO
            ],
            default: constants.NOTIFICATION.NO
        },
        regional_news: {
            type: String,
            enum: [
                constants.NOTIFICATION.YES,
                constants.NOTIFICATION.NO
            ],
            default: constants.NOTIFICATION.NO
        },
        head_lines: {
            type: String,
            enum: [
                constants.NOTIFICATION.YES,
                constants.NOTIFICATION.NO
            ],
            default: constants.NOTIFICATION.NO
        },
        following: {
            type: String,
            enum: [
                constants.NOTIFICATION.YES,
                constants.NOTIFICATION.NO
            ],
            default: constants.NOTIFICATION.NO
        }
    }
}, {
    timestamps: { createdAt: 'user_created_at', updatedAt: "user_updated_at" },
    versionKey: false
});

UserSchema.plugin(mongoosePaginate);

// Export user module
User = module.exports = mongoose.model(constants.DB_MODEL_REF.USER, UserSchema);

createAdmin();

// fulshRedis()
async function fulshRedis() {
    let redisConnection = await db.createRedisConnection();
    redisConnection.flushdb(function (err, succeeded) {
        console.log("Flushed Redis DB : ", succeeded); // will be true if successfull
    });
}

async function createAdmin() {
    /* for create mongoose connections */
    let newConnection = await db.createMongooseConnection();
    // let redisConnection = await db.createRedisConnection();
    User.find().then(async (result) => {
        if (!result[0]) {
            fulshRedis();
            let obj = {
                user_first_name: process.env.admin_firstName,
                user_last_name: process.env.admin_lastName,
                user_email: process.env.admin_email,
                user_password: process.env.admin_password,
                user_role_id: constants.ACCOUNT_LEVEL.SUPERADMIN,
                user_status: constants.STATUS.ACTIVE,
                user_phone_number: process.env.admin_phoneNumber,
                user_is_deleted: false,
                user_isd_code: process.env.admin_isdCode,
                user_country_id: mongoose.Types.ObjectId(process.env.country),

            };
            let updatedPass = await bcrypt.hashSync(obj.user_password, 11);
            obj.user_password = updatedPass;
            let user = new User(obj);
            user.save(function (err, result) {
                err ? console.log(err) : console.log("admin created successfully.");
                newConnection.connection.close();
            });
        }
    });
}