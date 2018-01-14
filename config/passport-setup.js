const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user-model");
const Meeting = require("../models/meeting-model");
const Comment = require("../models/comment-model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(
  new GoogleStrategy({
    // options for the google strategy
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  // passport callback function
  (accessToken, refreshToken, profile, done) => {
    // check if user already exists in db
    User.findOne({"google.id": profile.id}).then((currentUser) => {
      if (currentUser) {
        // user already in db
        console.log("user is: " + currentUser);
        done(null, currentUser);
      }
      else {
        // user not in db, so create user
        new User({
          "google.id": profile.id,
          "google.token": accessToken,
          "google.name": profile.displayName,
          "google.email": profile.emails[0].value
        }).save().then((newUser) => {
          console.log("new user created: " + newUser);
          done(null, newUser);
        });
      }
    });
  }
));

// Use the FacebookStrategy with Passport
passport.use(
  new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ["displayName", "emails"]
  },
  // passport callback function
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    // check if user already exists in db
    User.findOne({"facebook.id": profile.id}).then((currentUser) => {
      if (currentUser) {
        // user already in db
        console.log("user is: " + currentUser);
        done(null, currentUser);
      }
      else {
        // user not in db, so create user
        new User({
          "facebook.id": profile.id,
          "facebook.token": accessToken,
          "facebook.name": profile.displayName,
          "facebook.email": profile.emails[0].value
        }).save().then((newUser) => {
          console.log("new user created: " + newUser);
          done(null, newUser);
        });
      }
    });
  }
));

// Use the LocalStrategy with Passport
passport.use(
  new LocalStrategy({
    // options for the local strategy
    usernameField: "email",
    passwordField: "password",
    session: false
  },
  (username, password, done) => {
    // passport callback function
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));