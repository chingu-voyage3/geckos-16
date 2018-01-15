const router = require("express").Router();
const Meeting = require("../models/meeting-model");
const isLoggedIn = require("../middleware").isLoggedIn;

router.get("/create", isLoggedIn, (req, res) => {
  res.render("create", {title: "GeckoMeet - Create a Meeting", user: req.user});
});

router.post("/create", isLoggedIn, (req, res) => {
  var meeting = {
    title: req.body.title,
    creator: req.user._id,
    description: req.body.description,
    location: req.body.location,
    time: req.body.time
  };
  var data = new Meeting(meeting);
  data.save();
  res.redirect("/meetings");
});

router.get("/meeting-detail/:id/edit", isLoggedIn, (req, res) => {
  Meeting.findById(req.params.id)
    .then(function(results) {
      //console.log(results);
      res.render("edit", {title: "Edit Meeting", meeting: results, user: req.user});
    });
});

router.post("/meeting-detail/:id/edit", isLoggedIn, (req, res) => {
  Meeting.findById(req.params.id)
    .then(function(results) {
      console.log(results);

      results.title = req.body.title;
      results.description = req.body.description;
      results.location = req.body.location;
      results.time = req.body.time;
      results.save();
  });
  res.redirect("/meetings");
});

router.get("/meeting-detail/:id/delete", isLoggedIn, (req, res) => {
  Meeting.findById(req.params.id)
  .then(function(results) {
    res.render("delete", {title: "Delete Meeting", meeting: results, user: req.user});
  });
});

router.get("/delete/:id", isLoggedIn, (req, res) => {
  let id = req.params.id;
  Meeting.findByIdAndRemove({_id: id}, function(err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    res.redirect("/meetings");
  });
});

router.get("/", isLoggedIn, (req, res) => {
  Meeting.find({creator: req.user.id})
  .then(function(results) {
    res.render("meetings", {title: "GeckoMeet - Current Meetings", meetings: results, user: req.user});
  });
});

router.get("/meeting-detail/:id", (req, res) => {
  Meeting.findById(req.params.id)
  .then(function(results) {
    res.render("meeting-detail", {title: results.title, meeting: results, user: req.user});
  })
});

module.exports = router;