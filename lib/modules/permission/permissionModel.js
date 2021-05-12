// Importing mongoose
var mongoose = require('mongoose')
const constants = require('../../constants')
const db = require('../../config/dbConfig')
var Schema = mongoose.Schema
var mongoosePaginate = require('mongoose-paginate-v2');

var PermissionSchema = new Schema({
    permission_title: { type: String, required: true },
    permission_name: { type: String, required: true },
    permission_level: { type: Number, default: 2 },
    permission_parent_id: { type: mongoose.Types.ObjectId, ref: constants.DB_MODEL_REF.PERMISSION },
    permission_status: { type: String, enum: [constants.STATUS.ACTIVE, constants.STATUS.INACTIVE], default: constants.STATUS.ACTIVE },
    permission_is_deleted: { type: Boolean, default: false },
    permission_modify_by: { type: mongoose.Types.ObjectId, ref: constants.DB_MODEL_REF.USER },
}, {
    timestamps: { createdAt: 'permission_created_at',updatedAt:"permission_updated_at" } ,
    versionKey: false
});

PermissionSchema.plugin(mongoosePaginate)

// Export permission module
permission = module.exports = mongoose.model(constants.DB_MODEL_REF.PERMISSION, PermissionSchema)