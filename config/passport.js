const passport = require("passport");

// load the user model
const User = require("../models/user");

// load all strategies
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

// =========================================================================
// ## passport session setup ##
// required for persistent login sessions
// passport needs ability to serialize and deserialize users out of session
// =========================================================================

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// =============================================================================
// ## LOCAL SIGNUP ##
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called "local"
// =============================================================================
passport.use("local-signup", new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true // allows us to pass back the entire request to the callback
}, 
(req, email, password, done) => {
  // use express-validator methods to validate input
  req.checkBody("email", "Invalid email address").notEmpty().isEmail();
  req.checkBody("password", "Invalid password").notEmpty().isLength({min:4});
  let errors = req.validationErrors();
  if (errors) {
    let messages = [];
    errors.forEach((error) => {
      messages.push(error.msg);
    });
    return done(null, false, req.flash("error", messages));
  }

  User.findOne({"local.email": email}, (err, user) => {
    if (err) {
      return done(err);
    }

    // if user with that email already exists
    if (user) {
      return done(null, false, {message: "Email is already in use"});
    }

    // create the user
    var newUser = new User();
    newUser.local.email = email;
    newUser.local.password = newUser.generateHash(password);

    // save the user
    newUser.save((err, result) => {
      if (err) {
        return done(err);
      }
      return done(null, newUser);
    })
  });

}));
