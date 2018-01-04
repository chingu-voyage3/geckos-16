const express = require('express');
const router = express.Router();
const Meeting = require("../models/meeting");

router.get("/create", isLoggedIn, (req, res) => {
  res.render("create", {title: "GeckoMeet - Create a Meeting"});
});

router.post("/create", isLoggedIn, (req, res, next) => {
  var meeting = {
    title: req.body.title,
    creator: req.user._id,
    description: req.body.description,
    location: req.body.location,
    time: req.body.time
  };
  var data = new Meeting(meeting);
  data.save();
  res.redirect("meetings");
});

router.post("/edit", isLoggedIn, (req, res, next) => {
  var id = req.body.id;

  Meeting.findById(id, function(err, results) {
    if (err) {
      console.log("error, no meeting found");
    }
    results.title = req.body.title;
    results.description = req.body.description;
    results.location = req.body.location;
    results.time = req.body.time;
    results.save();
  });
  res.redirect("meetings");
});

router.post("/delete", isLoggedIn, (req, res, next) => {
  var id = req.body.id;
  Meeting.findByIdAndRemove(id).exec();
  res.redirect("meetings");
});

router.get("/meetings", isLoggedIn, (req, res, next) => {
  Meeting.find({ creator: req.user.id })
  .then(function(results) {
    res.render("meetings", {title: "GeckoMeet - Current Meetings", meetings: results})
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
