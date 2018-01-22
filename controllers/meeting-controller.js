const Meeting = require("../models/meeting-model");
const Comment = require("../models/comment-model");
const User = require("../models/user-model");
const async = require('async');

// Display a list of all Meetings a user is involved with.
exports.meetings = function(req, res, next) {

  async.parallel({

    my_meetings: function(callback) {
      Meeting.find({creator: req.user.id})
        .exec(callback);
    },

    other_meetings: function(callback) {
      Meeting.find({participants: req.user.id})
        .exec(callback);
    },

  }, function(err, results) {
    if (err) {return next(err);}
    // Successful, so render
    res.render("meetings", {
      title: "Meetings",
      my_meetings: results.my_meetings,
      other_meetings: results.other_meetings,
      user: req.user
    });
  });
};

// Display detail page for a specific Meeting.
exports.meeting_detail = function(req, res) {

  async.parallel({

    meeting_detail: function(callback) {
      Meeting.findById(req.params.id)
      .populate("creator")
      .populate("participants")
      .exec(callback);
    },

    comments:  function(callback) {
      Comment.find({"meeting": req.params.id})
      .populate("creator")
      .exec(callback);
    },

  }, 
  function(err, results) {
    if (err) {return next(err);}

    // If the logged in user did not create the meeting
    // and they are not already in the participants array
    if ((req.user.id != results.meeting_detail.creator.id) && (!results.meeting_detail.participants.includes(req.user.id))) {
      // Add user to participants array
      var meeting = results.meeting_detail;
      meeting.participants.push(req.user.id);
      meeting.save((err) => {
        if (err) {throw err;}
      }); 
  }

    // Successful, so render
    res.render("meeting-detail", {
      title: "Meeting Detail",
      meeting: results.meeting_detail,
      fullUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
      comments: results.comments,
      user: req.user
    });
  });
};

// Display Meeting create form on GET.
exports.meeting_create_get = function(req, res) {
  res.render("create", {
    title: "Create a Meeting",
    user: req.user
  });
};

// Handle Meeting create on POST.
exports.meeting_create_post = function(req, res) {
  const meeting = {
    title: req.body.title,
    creator: req.user._id,
    description: req.body.description,
    location: req.body.location,
    time: req.body.time
  };
  const data = new Meeting(meeting);
  data.save();
  res.redirect("/meetings");
};

// Display Meeting edit form on GET.
exports.meeting_edit_get = function(req, res) {
  Meeting.findById(req.params.id)
  .then(function(results) {
    res.render("edit", {title: "Edit Meeting", meeting: results, user: req.user});
  });
};

// Handle Meeting edit on POST.
exports.meeting_edit_post = function(req, res) {
  Meeting.findById(req.params.id)
  .then(function(results) {
    results.title = req.body.title;
    results.description = req.body.description;
    results.location = req.body.location;
    results.time = req.body.time;
    results.save();
  });
  res.redirect("/meetings");
};

// Display Meeting delete form on GET.
exports.meeting_delete_get = function(req, res) {
  Meeting.findById(req.params.id)
  .then(function(results) {
    res.render("delete", {title: "Delete Meeting", meeting: results, user: req.user});
  });
};

// Handle Meeting delete on GET.
exports.meeting_delete_post = function(req, res) {
  let id = req.params.id;
  Meeting.findByIdAndRemove({_id: id}, function(err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    res.redirect("/meetings");
  });
};