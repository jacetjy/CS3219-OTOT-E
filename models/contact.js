let mongoose = require('mongoose');

//book schema definition
let ContactSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  first_name: {
      type: String,
      required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
      type: String,
      required: true
  },
  gender: String,
  ip_address: String,
});

// Sets the createdAt parameter equal to the current time
ContactSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

//Exports the ContactSchema for use elsewhere.
module.exports = mongoose.model('contact', ContactSchema);