const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
  title: {type: String, required: true},
  creator: {type: Schema.ObjectId, ref: "User", required: true},
  description: {type: String, required: true},
  location: {type: String, required: false},
  time: {type: String, required: false},
  timestamp: {type: Date, default: Date.now},
  participants: [{
    type: Schema.ObjectId,
    ref: "User"
  }]
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

// Virtual for meeting's creation date
meetingSchema
.virtual("timestamp_formatted")
.get(function () {
  return moment(this.timestamp).format("MMMM Do, YYYY, h:mm a");
});

// create the model for meeting and expose it to our app
const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
