var mongoose = require('mongoose');


//Form schema
var meetingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
});


var Meeting = mongoose.model('Meeting', meetingSchema);


module.exports = Meeting;