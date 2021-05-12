// Importing mongoose
var mongoose = require('mongoose')
const constants = require('../../constants')
const db = require('../../config/dbConfig')
var Schema = mongoose.Schema
var mongoosePaginate = require('mongoose-paginate-v2');
var ms = require('ms');

var articleSchema = new Schema({
    article_title: { type: String },
    article_description: { type: String },
    article_link: { type: String },
    article_image: { type: String },
    article_pub_date: { type: Date },
    article_news_id: { type: Schema.Types.ObjectId},
    article_like: [{ 
        _id:false,
        user_id:{type: Schema.Types.ObjectId },
        type: { type: String, enum: [constants.ARTICLE_LIKE_TYPE.LIKE, constants.ARTICLE_LIKE_TYPE.DISLIKE] }
    }],
    // article_modify_by: { type: mongoose.Types.ObjectId, ref: constants.DB_MODEL_REF.USER },
    // article_deleted_by: { type: mongoose.Types.ObjectId, ref: constants.DB_MODEL_REF.USER },
    // article_created_by: { type: mongoose.Types.ObjectId, ref: constants.DB_MODEL_REF.USER },
}, {
    timestamps: { createdAt: 'article_created_at', updatedAt: "article_updated_at" },
    versionKey: false
});

articleSchema.index({ article_created_at: 1 }, { expireAfterSeconds: ms('3 days') });
// articleSchema.index({ article_created_at: 1 }, { expireAfterSeconds: ms('1m') });

articleSchema.plugin(mongoosePaginate);

// Export country module
article = module.exports = mongoose.model(constants.DB_MODEL_REF.ARTICLE, articleSchema);
