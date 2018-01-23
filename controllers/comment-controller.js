const Comment = require("../models/comment-model");

// Display a list of all Meetings initiated by a given User.
exports.commentscomment_created_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Comment created list');
};

// Display a list of all Meetings User is participating in.
exports.comments_viewed_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Meetings viewed list');
};

// Display detail page for a specific Comment.
exports.comment_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Comment detail: ' + req.params.id);
};

// Display Comment create form on GET.
exports.comment_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Meeting create GET');
};

// Handle Comment create on POST.
exports.comment_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Comment create POST');
};

// Display Comment edit form on GET.
exports.comment_edit_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Comment update GET');
};

// Handle Comment edit on POST.
exports.comment_edit_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Comment update POST');
};

// Display Comment delete form on GET.
exports.comment_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Comment delete GET');
};

// Handle Comment delete on POST.
exports.comment_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Comment delete POST');
};