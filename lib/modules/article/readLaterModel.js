// Importing mongoose
var mongoose = require('mongoose')
const constants = require('../../constants')
var Schema = mongoose.Schema
var mongoosePaginate = require('mongoose-paginate-v2');

var readLaterSchema = new Schema({
    read_later_title: { type: String },
    read_later_description: { type: String },
    read_later_link: { type: String },
    read_later_image: { type: String },
    // read_later_is_liked: { type: String },
    // read_later_is_disliked: { type: String },
    read_later_pub_date: { type: Date },
    read_later_user_id: [{ type: mongoose.Types.ObjectId }],
    read_later_article_id: { type: mongoose.Types.ObjectId },
    read_later_news_id: { type: mongoose.Types.ObjectId },
    read_later_is_deleted: { type: Boolean, default: false },
    read_later_modify_by: { type: mongoose.Types.ObjectId, ref: constants.DB_MODEL_REF.USER },
    read_later_deleted_by: { type: mongoose.Types.ObjectId, ref: constants.DB_MODEL_REF.USER },
    read_later_created_by: { type: mongoose.Types.ObjectId, ref: constants.DB_MODEL_REF.USER },
    read_later_deleted_at: { type: Date },
    // type: { type: String },
    read_later_like: [{ 
        _id:false,
        user_id:{type: Schema.Types.ObjectId },
        type: { type: String, enum: [constants.ARTICLE_LIKE_TYPE.LIKE, constants.ARTICLE_LIKE_TYPE.DISLIKE] }
    }]

}, {
    timestamps: { createdAt: 'read_later_created_at', updatedAt: "read_later_updated_at" },
    versionKey: false
});

readLaterSchema.plugin(mongoosePaginate);

// Export country module
article = module.exports = mongoose.model(constants.DB_MODEL_REF.READLATER, readLaterSchema);
