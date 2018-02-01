const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// define the schema for our user model
const userSchema = new Schema({

  local: {
    email: String,
    name: String,
    password: String
  },
  facebook: {
    id: String,
    token: String,
    name: String,
    email: String
  },
  google: {
    id: String,
    token: String,
    name: String,
    email: String
  }

});

// ## methods ##

// generating a hash
userSchema.methods.generateHash = function(password) {
  const salt = bcrypt.genSaltSync(8);
  return bcrypt.hashSync(password, salt, null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
const User = mongoose.model("User", userSchema);

module.exports = User;