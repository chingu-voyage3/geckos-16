const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  title: {type: String, required: true},
  //creator: {type: Schema.ObjectId, ref: "User"},
  description: {type: String, required: true},
  location: {type: String, required: false},
  time: {type: String, required: false}
});

// Virtual for meeting's URL
//Schema
//.virtual('url')
//.get(function () {
//  return '/meeting/' + this._id;
//});

// create the model for meetings and expose it to our app
module.exports = mongoose.model("Meeting", schema);
