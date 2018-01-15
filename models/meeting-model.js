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
  return "/meetings/meeting-detail/" + this._id + "/delete";
});

// Virtual for meeting's URL
meetingSchema
.virtual("url")
.get(function () {
  return "/meetings/meeting-detail/" + this._id;
});

// Virtual for meeting's edit URL
meetingSchema
.virtual("eurl")
.get(function () {
  return "/meetings/meeting-detail/" + this._id + "/edit";
});

// create the model for meeting and expose it to our app
const Meeting = mongoose.model("Meeting", meetingSchema);


module.exports = Meeting;