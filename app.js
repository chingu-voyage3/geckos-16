const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes");
const meetingRoutes = require("./routes/meeting-routes");

const app = express();

// load environment variables
if (process.env.NODE_ENV !== "production") require("dotenv").config();
const PORT = process.env.PORT;
const dbURL = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION;

// set up view engine
app.set("view engine", "ejs");

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
