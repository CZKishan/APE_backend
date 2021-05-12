// Importing mongoose
var mongoose = require('mongoose');
const constants = require('../../constants');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate-v2');

var bundleSchema = new Schema({
    bundle_saved_by: [{ type: mongoose.Types.ObjectId, ref: constants.DB_MODEL_REF.USER }],
    bundle_created_by: { type: mongoose.Types.ObjectId, ref: constants.DB_MODEL_REF.USER },
    bundle_name: { type: String },
    bundle_status: { type: String, enum: [constants.BUNDLE_STATUS.PUBLIC, constants.BUNDLE_STATUS.PRIVATE], default: constants.BUNDLE_STATUS.PRIVATE },
    bundle_article: [{
        article_title: { type: String },
        article_description: { type: String },
        article_link: { type: String },
        article_image: { type: String },
        article_pub_date: { type: Date },
        article_news_id: { type: mongoose.Types.ObjectId },
        article_id: { type: mongoose.Types.ObjectId },
        article_like: [{
            _id: false,
            user_id: { type: Schema.Types.ObjectId },
            type: { type: String, enum: [constants.ARTICLE_LIKE_TYPE.LIKE, constants.ARTICLE_LIKE_TYPE.DISLIKE] }
        }],
    }],
    bundle_is_deleted: { type: Boolean, default: false },
    bundle_modify_by: { type: mongoose.Types.ObjectId, ref: constants.DB_MODEL_REF.USER },
    bundle_deleted_by: { type: mongoose.Types.ObjectId, ref: constants.DB_MODEL_REF.USER },
    bundle_deleted_at: { type: Date }
}, {
    timestamps: { createdAt: 'bundle_created_at', updatedAt: "bundle_updated_at" },
    versionKey: false
});

bundleSchema.plugin(mongoosePaginate);

// Export bundle module
bundle = module.exports = mongoose.model(constants.DB_MODEL_REF.BUNDLE, bundleSchema);
