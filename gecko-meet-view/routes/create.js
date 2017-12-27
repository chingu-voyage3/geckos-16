var express = require('express');
var router = express.Router();
//Meeting model
var Meeting = require('../models/meeting');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('create');
});
//
// Add Submit POST Route
router.post('/', function(req, res){
  body('title', 'Genre name required').isLength({ min: 1 }).trim(),
  body('description', 'Genre name required').isLength({ min: 1 }).trim(),
  body('location', 'Genre name required').isLength({ min: 1 }).trim(),
  body('time', 'Genre name required').isLength({ min: 1 }).trim()
  // Get Errors
    let meeting = new Meeting({
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    time: req.body.time
  });
    meeting.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        console.log('Meeting added!');
        res.redirect('/list');
      }
    });
});
 
//
module.exports = router;
