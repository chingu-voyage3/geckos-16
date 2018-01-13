const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define the schema for our comment model
const commentSchema = new Schema({

});

// create the model for comment and expose it to our app
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;