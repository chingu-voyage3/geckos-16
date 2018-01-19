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

router.get("/delete-comment/:id", (req, res) => {
  Comment.findById(req.params.id)
  .then(function(results) {
    const comment = results;
    comment.text = null;
    comment.status = "deleted";
    comment.save((err) => {
      if (err) {
        throw err;
      }
      res.redirect("/meetings/meeting-detail/" + comment.meeting);
    });
  });
});

router.get("/edit-comment/:id", (req, res) => {
  Comment.findById(req.params.id)
  .then(function(results) {
    const comment = results;
    comment.status = "edit";
    comment.save((err) => {
      if (err) {
        throw err;
      }
      res.redirect("/meetings/meeting-detail/" + comment.meeting);
    });
  });
});

router.post("/edit-comment", (req, res) => {
  Comment.findById(req.body.commentId)
  .then(function(results) {
    const comment = results;
    comment.text = req.body.comment;
    comment.status = "normal";
    comment.save((err) => {
      if (err) {
        throw err;
      }
      res.redirect("/meetings/meeting-detail/" + comment.meeting);
    });
  });
});

module.exports = router;