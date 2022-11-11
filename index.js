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
app.route('/contacts')
    .get(contactController.getContacts)
    .post(contactController.postContact)
app.route('/contacts/:id')
    .get(contactController.getContact)
    .put(contactController.updateContact)
    .delete(contactController.deleteContact);

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});

module.exports = app;