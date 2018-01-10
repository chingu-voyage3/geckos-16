const passport = require("passport");

// load the user model
const User = require("../models/user");

// load all strategies
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

// expose this function to our app using module.exports
module.exports = function(passport) {

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
    process.nextTick(() => {
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
    });
  }));

  // =============================================================================
  // ## LOCAL LOGIN ##
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called "local"
  // =============================================================================

  passport.use("local-login", new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : "email",
    passwordField : "password",
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  (req, email, password, done) => { // callback with email and password from our form
    process.nextTick(() => {
      // use express-validator methods to validate input
      req.checkBody("email", "Invalid email address").notEmpty().isEmail();
      req.checkBody("password", "Invalid password").notEmpty();
      let errors = req.validationErrors();
      if (errors) {
        let messages = [];
        errors.forEach((error) => {
          messages.push(error.msg);
        });
        return done(null, false, req.flash("error", messages));
      }

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({"local.email": email}, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err) {
          return done(err);
        }

        // if no user is found, return the message
        if (!user) {
          return done(null, false, {message: "No user found."});
        }

        if (!user.validPassword(password)) {
          return done(null, false, {message: "Wrong password."}); 
        }

        // all is well, return successful user
        return done(null, user);
      });
    })
  }));



  // =============================================================================
  // ## FACEBOOK LOGIN ##
  // =============================================================================

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ["id", "displayName", "email"],
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  // facebook will send back the token and profile
  (req, accessToken, refreshToken, profile, done) => {
    process.nextTick(function() {
      User.findOne({"facebook.id": profile.id}, function (err, user) {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err) {
          return done(err);
        }
        // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, return that user
        }
        else {
          // if there is no user found with that facebook id, create one
          const newUser = new User();
          // set all of the facebook information in our user model
          newUser.facebook.id = profile.id;
          newUser.facebook.token = accessToken;
          newUser.facebook.name = profile.displayName;
          newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

          // save our user to the database
          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            // if successful, return the new user
            return done(null, newUser);
          });
        }
      });
    });

  }));

};
