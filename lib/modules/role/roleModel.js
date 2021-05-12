var mongoose = require('mongoose');
const constants = require('../../constants');
const db = require('../../config/dbConfig');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate-v2');

var roleSchema = new Schema({
    _id: { type: Number },
    role_name: { type: String, required: true },
    role_slug: { type: String, required: true },
    role_permissions: [{ type: Schema.Types.ObjectId, ref: constants.DB_MODEL_REF.PERMISSION }],
    role_status: { type: String, enum: [constants.STATUS.ACTIVE, constants.STATUS.INACTIVE], default: constants.STATUS.ACTIVE },
    role_is_deleted: { type: Boolean, default: false },
    role_modify_by: {
        type: Schema.Types.ObjectId,
    },
}, {
    timestamps: { createdAt: 'role_created_at',updatedAt:"role_updated_at" } ,
    versionKey: false
});

roleSchema.plugin(mongoosePaginate);

// Export role module
Role = module.exports = mongoose.model(constants.DB_MODEL_REF.ROLE, roleSchema);


createRoles();

async function createRoles() {
    /** for create mongoose connections */
    // let newConnection = await db.createMongooseConnection();
    Role.find().then(
        async result => {
            if (!result[0]) {
                let arr = [{
                    _id: constants.ACCOUNT_LEVEL.SUPERADMIN,
                    role_name: 'Super Admin',
                    role_slug: constants.ACCOUNT_TYPE.SUPERADMIN,
                    role_status: constants.STATUS.ACTIVE,
                },
                {
                    _id: constants.ACCOUNT_LEVEL.ADMIN,
                    role_name: 'Admin',
                    role_slug: constants.ACCOUNT_TYPE.ADMIN,
                    role_status: constants.STATUS.ACTIVE,
                    role_is_deleted: false,
                },
                {
                    _id: constants.ACCOUNT_LEVEL.USER,
                    role_name: 'End User',
                    role_slug: constants.ACCOUNT_TYPE.USER,
                    role_status: constants.STATUS.ACTIVE,
                    role_is_deleted: false,
                }
                ]
                let role = new Role(arr[0]);

                role.save(function (err, result) {
                    err ? console.log(err) : console.log("Roles created successfully.");
                    // newConnection.connection.close();
                });
                let role1 = new Role(arr[1]);

                role1.save(function (err, result) {
                    err ? console.log(err) : console.log("Roles created successfully.");
                    // newConnection.connection.close();
                });

                // role.collection.insert(arr, function (err, docs) {
                //     if (err) {
                //         return console.error(err);
                //     } else {
                //         console.log("Roles created  successfully.");
                //         newConnection.connection.close()
                //     }
                // });
            }
        })
}