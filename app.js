const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes");
const meetingRoutes = require("./routes/meeting-routes");

const app = express();

// load environment variables
if (process.env.NODE_ENV !== "production") require("dotenv").config();
const PORT = process.env.PORT;
const dbURI = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION;
const passportSetup = require("./config/passport-setup");

// set up view engine
app.set("view engine", "ejs");

// Use bluebird to avoid warning:
// "Mongoose: mpromise (mongoose's default promise library) is deprecated"
mongoose.Promise = require('bluebird');

// connect to mongodb using `mongoose.connect`...
var promise = mongoose.connect(dbURI, {
  useMongoClient: true,
  /* other options */
});

// use middleware
app.use(express.static('public'));

// set up routes
app.use("/auth", authRoutes);
app.use("/meeting", meetingRoutes);

// create home route
app.get("/", (req, res) => {
  res.render("index", {title: "GeckoMeet - Homepage"});
});

// start the server
app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
