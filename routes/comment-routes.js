const router = require("express").Router();
const Comment = require("../models/comment-model");
const isLoggedIn = require("../middleware").isLoggedIn;
const appName = "GeckoMeet";

router.post("/add-comment", isLoggedIn, (req, res) => {
  const comment = {
    text: req.body.comment,
    creator: req.user.id,
    meeting: req.body.meetingId
  };
  const data = new Comment(comment);
  data.save();
  res.redirect("/meetings/meeting-detail/" + req.body.meetingId);
});



module.exports = router;