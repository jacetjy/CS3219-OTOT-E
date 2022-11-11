let mongoose = require('mongoose');
// Import contact model
let Contact = require('../models/contact');

/*
 * GET /contact route to retrieve all the contacts.
 */
async function getContacts (req, res) {
    try {
        let query = Contact.find({});
        return query;
    } catch (err) {
        return "";
    }
}

//export all the functions
module.exports = { getContacts };