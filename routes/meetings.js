const express = require('express');
const router = express.Router();
const Meeting = require("../models/meeting");

router.get("/create", (req, res) => {
  res.render("create", {title: "GeckoMeet - Create a Meeting"});
});

router.post("/create", (req, res) => {
  //var title = req.body.title;
  // TODO: save to db, and other clever stuff
  res.redirect("meetings");
});

router.get("/meetings", (req, res) => {
  Meeting.find((err, results) => {
    res.render("meetings", {title: "GeckoMeet - Current Meetings", meetings: results});
  });  
});

module.exports = router;
