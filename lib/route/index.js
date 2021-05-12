const adminRouter = require('../modules/admin/adminRoute'); // Load admin routes

const usrRouter = require('../modules/user/userRoute'); // Load user routes




require('dotenv').config()

//========================== Load Modules End ==============================================

//========================== Export Module Start ====== ========================


module.exports = function (app) {

    // for Admin Panel Routes
    app.use('/api/admin', adminRouter); //Attach Admin Routes

    // for APPLICATION Routes
    app.use('/api/user', usrRouter);// Attach User Routes

    app.use(function (req, res) {
        res.status(404).send("404 page not found")
    });
};