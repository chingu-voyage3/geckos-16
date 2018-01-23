const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: String,
  creator: {type: mongoose.Schema.ObjectId, ref: "User", required: true},
  meeting: {type: mongoose.Schema.ObjectId, ref: "Meeting", required: true},
  timestamp: {type: Date, default: Date.now},
  status: {type: String}
});

// Virtual for comment's delete URL
commentSchema
.virtual("durl")
.get(function () {
  return "/meetings/meeting-detail/" + this._id + "/delete";
});

// create the model for comment and expose it to our app
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
