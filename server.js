//Import Config
var env = require('dotenv').config();
var cron = require('node-cron');
var schedule = require('node-schedule');
var mongoose = require('mongoose');

require('events').EventEmitter.defaultMaxListeners = 15;

console.log("");
console.log(`//************************* ${process.env.appName} **************************//`);
console.log("");


const config = require('./lib/config');

// load external modules
const express = require("express");

const cors = require('cors')

const morgan = require('morgan');

// init express app
const app = express();

// app.use(cors())
app.use(cors());


// set server home directory
app.locals.rootDir = __dirname;

// config express
config.expressConfig(app, config.cfg.environment);

app.use(morgan('combined'));

// attach the routes to the app
require("./lib/route")(app);
// cron.schedule("*/20 * * * * ", async function () {

//     require('./lib/modules/article/articleService').autoUpdateArticles();
// })
// hour: 9, 
// { minute: new schedule.Range(0, 59, 1) }
// schedule.scheduleJob({hour: 9, minute: 0} , async () => {
//     require('./lib/modules/article/articleService').autoUpdateArticles();
// });

let middleware = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
mongoose.connect(process.env.dbUrl + process.env.dbName, middleware, function (err, client) {
    if(err) {
        console.log('0. Error while connecting to the database =', err);
    }
});

mongoose.connection.on('connected', function () {
    console.info('1. Database Connected');
});

mongoose.connection.on('err', function (err) {
    console.error('0. Database with err=', err);
});

mongoose.connection.on('disconnected', function (err) {
    console.error('2. Db Disconnected=', err);
});

// start server
app.listen(config.cfg.port, () => {
    console.info(`Express server listening on ${config.cfg.port}, in ${config.cfg.TAG} mode`);
});