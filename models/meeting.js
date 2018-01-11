const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
  title: {type: String, required: true},
  creator: {type: Schema.ObjectId, ref: "User", required: true},
  description: {type: String, required: true},
  location: {type: String, required: false},
  time: {type: String, required: false}
});

// Virtual for meeting's delete URL
meetingSchema
.virtual("durl")
.get(function () {
  return "/meeting/" + this._id + "/delete";
});

// Virtual for meeting's URL
meetingSchema
.virtual("url")
.get(function () {
  return "/meeting/" + this._id;
});

// create the model for meetings and expose it to our app
module.exports = mongoose.model("Meeting", meetingSchema);
