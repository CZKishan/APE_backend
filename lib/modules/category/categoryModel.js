// Importing mongoose
var mongoose = require('mongoose')
const constants = require('../../constants')
const db = require('../../config/dbConfig')
var Schema = mongoose.Schema
var mongoosePaginate = require('mongoose-paginate-v2');

var CategorySchema = new Schema({
    category_name: [{
        _id: false,
        lang: { type: String, required: true },
        title: { type: String, required: true }
    }],
    category_image: { type: String},
    category_status: { type: String, enum: [constants.STATUS.ACTIVE, constants.STATUS.INACTIVE], default: constants.STATUS.ACTIVE },
    category_is_deleted: { type: Boolean, default: false },
    category_modify_by: { type: mongoose.Types.ObjectId, ref: constants.DB_MODEL_REF.USER },
    category_deleted_by: { type: mongoose.Types.ObjectId, ref: constants.DB_MODEL_REF.USER },
    category_created_by: { type: mongoose.Types.ObjectId, ref: constants.DB_MODEL_REF.USER },
    category_deleted_at: { type: Date },
}, {
    timestamps: { createdAt: 'category_created_at', updatedAt: "category_updated_at" },
    versionKey: false
});


CategorySchema.plugin(mongoosePaginate);

// Export country module
category = module.exports = mongoose.model(constants.DB_MODEL_REF.CATEGORY, CategorySchema);
