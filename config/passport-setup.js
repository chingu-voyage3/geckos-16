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
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  // passport callback function
  (req, accessToken, refreshToken, profile, done) => {
    // user is not logged in yet
    if (!req.user) {
      // check if user already exists in db
      User.findOne({"google.id": profile.id}).then((currentUser) => {
        if (currentUser) {
          // user already in db
          //console.log("user is: " + currentUser);
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
            //console.log("new user created: " + newUser);
            done(null, newUser);
          });
        }
      });
    }
    // user is logged in already, and needs to be merged
    else {
      const user = req.user;
      user.google.id = profile.id,
      user.google.token = accessToken,
      user.google.name = profile.displayName,
      user.google.email = profile.emails[0].value

      user.save((err) => {
        if (err) {
          throw err;
        }
        return done(null, user);
      })
    }
  }
));

// =============================================================================
// ## Use the FacebookStrategy with Passport ##
// =============================================================================
passport.use(
  new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ["displayName", "emails"],
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  // passport callback function
  (req, accessToken, refreshToken, profile, done) => {    
    //process.nextTick(function() {
      // user is not logged in yet
      if (!req.user) {
        // check if user already exists in db
        User.findOne({"facebook.id": profile.id}).then((currentUser) => {
          // if user already in db, log them in
          if (currentUser) {
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
              //console.log("new user created: " + newUser);
              done(null, newUser);
            });
          }
        });
      }
      // user is logged in already, and needs to be merged
      else {
        const user = req.user;
        user.facebook.id = profile.id,
        user.facebook.token = accessToken,
        user.facebook.name = profile.displayName,
        user.facebook.email = profile.emails[0].value

        user.save((err) => {
          if (err) {
            throw err;
          }
          return done(null, user);
        })
      }
    //});
  }
));

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
    req.checkBody("name", "Please enter a username").notEmpty();
    req.checkBody("email", "Invalid email address").notEmpty().isEmail();
    req.checkBody("password", "Password must be at least 8 characters long").len(8);
    req.checkBody("password", "Password must include at least 1 uppercase character, 1 lowercase character, 1 number and 1 special character")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!]).{8,}$/);
      /*  (?=.*\d)      # must contains one digit from 0-9
          (?=.*[a-z])   # must contains one lowercase characters
          (?=.*[A-Z])   # must contains one uppercase characters
          (?=.*[@#$%!]) # must contains one special symbols in the list "@#$%!"
          .             # match anything with previous condition checking
          {6,}          # length at least 6 characters
      */
    req.checkBody("passwordCheck", "Passwords do not match, please try again").equals(password);
    const errors = req.validationErrors();
    if (errors) {
      let messages = [];
      errors.forEach((error) => {
        messages.push(error.msg);
      });
      return done(null, false, req.flash("error", messages));
    }
    // passport callback function
    User.findOne({"local.email": email}, (err, foundUser) => {
      if (err) {
        return done(err);
      }

      // if user with that email already exists
      if (foundUser) {
        return done(null, false, {message: "Email is already in use. Please log in, or try a different email address"});
      }
      // if user is not logged in (with another account)
      if (!req.user) {
        // create the user
        var newUser = new User();
        newUser.local.name = req.body.name;
        newUser.local.email = email;
        newUser.local.password = newUser.generateHash(password);

        // save the user
        newUser.save((err, result) => {
          if (err) {
            return done(err);
          }
          return done(null, newUser);
        });
      }
      // user is logged in and trying to merge local account
      else {
        const user = req.user;
        user.local.name = req.body.name;
        user.local.email = email;
        user.local.password = user.generateHash(password);

        user.save((err) => {
          if (err) {
            throw err;
          }
          return done(null, user);
        });
      }
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
  usernameField: "email",
  passwordField: "password",
  passReqToCallback : true // allows us to pass back the entire request to the callback
},
(req, email, password, done) => { // callback with email and password from our form
  process.nextTick(() => {
    // use express-validator methods to validate input
    req.checkBody("email", "Invalid email address").notEmpty().isEmail();
    req.checkBody("password", "Password must be at least 8 characters long").len(8);
    req.checkBody("password", "Password must include at least 1 uppercase character, 1 lowercase character, 1 number and 1 special character")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!]).{8,}$/);
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
