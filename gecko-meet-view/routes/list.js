var express = require('express');
var router = express.Router();
var Meeting = require('../models/meeting');
/* GET users listing. */
router.get('/', function(req, res){
  Meeting.find({}, function(err, meeting) {
    if (err) {
      throw err;
    } else {
      console.log(meeting);
      res.render('list', {
       meeting:meeting
    });
    }
  });
});
module.exports = router;
