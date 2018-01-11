const express = require('express');
const router = express.Router();
const Meeting = require("../models/meeting");
const isLoggedIn = require("../middleware").isLoggedIn;

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

router.get("/meeting/:id/delete", isLoggedIn, (req, res, next) => {
  Meeting.findById(req.params.id)
  .then(function(results) {
    res.render("delete", {title: "Delete Meeting", meeting: results});
  });
});

router.get("/meeting/delete/:id", isLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Meeting.findByIdAndRemove({_id: id}, function(err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    res.redirect("/meetings");
  });
});

router.get("/meetings", isLoggedIn, (req, res, next) => {
  Meeting.find({creator: req.user.id})
  .then(function(results) {
    res.render("meetings", {title: "GeckoMeet - Current Meetings", meetings: results});
  });
});

router.get("/meeting/:id", (req, res, next) => {
  Meeting.findById(req.params.id)
  .then(function(results) {
    res.render("meeting", {title: results.title, meeting: results});
  })
});

module.exports = router;
