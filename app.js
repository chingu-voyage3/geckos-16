const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const expressValidator = require("express-validator");

const app = express();

// load environment variables
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const PORT = process.env.PORT;
const dbURL = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION;

// connect to db
mongoose.connect(dbURL);

/* pass passport for configuration */
require('./config/passport')(passport);

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// use middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add this after the bodyParser middleware
app.use(session({secret: sessionSecret, resave: false, saveUninitialized: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// create "login" global variable for use in views
// this must come after passport setup
app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

// define routes
app.use(require("./routes/index"));
app.use(require("./routes/meetings"));
app.use(require("./routes/users"));

// start the server
app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
})