// Import express
let express = require('express');
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
// Import Morgan
let morgan = require('morgan');
// dotenv
require('dotenv').config();
// Import redis
const redis = require('redis');
// Initialise the app
let app = express();

// use morgan to log at command line
app.use(morgan('combined'));

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// Connect to Mongoose and set connection variable
mongoose.connect(process.env.MONGO_LOCAL_URI.concat("/resthub"), { useNewUrlParser: true});
var db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server port
var port = process.env.PORT || 8080;

// connect to redis
var redisClient;

(async () => {
    redisClient = redis.createClient();
    redisClient.on("error", (err) => console.error(err));
    await redisClient.connect();
}) ();


// Set default API response
app.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Hello World with Express',
    });
});
// Import contact controller
let contactController = require('./routes/contact');
// Contact routes
app.get('/contacts', async (req, resp) => {
    let res;
    let isCached = false;
    try {
        const cacheRes = await redisClient.get('cached contacts');
        if (cacheRes) {
            isCached = true;
            res = JSON.parse(cacheRes);
        } else {
            res = await contactController.getContacts();
            if (res.length === 0) {
                throw "Error: empty array"
            }
            await redisClient.set('cached contacts', JSON.stringify(res));
        }
        resp.json(res);
    } catch (err) {
        console.log(err);
        resp.sendStatus(404);
    }
    // res = await contactController.getContacts();
    // resp.json(res);
});


// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});

module.exports = app;