"use strict";

//========================== Class Definitions Start =====================

class BaseDao {
    constructor(dbModel) {
        //Get Model
        this.Model = dbModel;
    }

    save(object) {
        return this.Model.create(object);
    }

    findOne(query, projection) {
        return this.Model.findOne(query, projection).exec();
    }

    find(query, projection) {
        return this.Model.find(query, projection).exec();
    }

    // findPagination(query,options,projection){

    //     return this.Model.find(query,projection).skip(options.skip).limit(options.limit).exec();
    // }

    findPagination(query, options, projection) {
        return this.Model.find(query, projection).sort(options.sort).skip(options.skip).limit(options.limit).exec();
    }

    updateOne(query, update, options) {
        return this.Model.updateOne(query, update, options).exec();
    }

    findOneAndUpdate(query, update, options) {
        return this.Model.findOneAndUpdate(query, update, options).exec();
    }

    findAndModify(query, update, options) {
        return this.Model.findAndModify(query, update, options).exec();
    }

    /**
     * Update Given Model
     * @param query
     * @param toUpdate
     * @return Promise Object
     * @private
     */
    update(query, update, options) {
        if (!options) {
            options = {};
        }
        return this.Model.update(query, update, options).exec();
    }

    remove(query, options) {
        return this.Model.deleteMany(query, options).exec();
    }

    deleteOne(query, options) {
        return this.Model.deleteOne(query, options).exec();
    }

    findByIdAndRemove(query, options) {
        return this.Model.findByIdAndRemove(query, options).exec();
    }

    aggregate(aggPipe) {
        return this.Model.aggregate(aggPipe).exec();
    }

    findWithPeginate(query, options, isLean) {
        if (isLean) {
            options["lean"] = true;
        }
        return this.Model.paginate(query, options);
    }
    findSortingAndLimit(query, condition, limit, projection) {
        return this.Model.find(query, projection).limit(limit).sort(condition).exec();
    }


    // insertMany(data) {
    //     return this.Model.insertMany(data).exec();
    // }

    insertMany(data) {
        return this.Model.insertMany(data);
    }

    updateMany(query,data) {
        return this.Model.updateMany(query,data).exec();
    }

    count(query) {
        return this.Model.countDocuments(query).exec();
    }
}
//========================== Class Definitions End =====================


//========================== Helper methods start =======================

//========================== Helper methods end =======================

//========================== Export module start =======================

module.exports = BaseDao;

//========================== Export module End =======================
