var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Meeting = require('./models/meeting');
var compression = require('compression');
var helmet = require('helmet');

mongoose.connect('mongodb://gecko16:gecko16rulez@ds157158.mlab.com:57158/meeting-planner-mvp')
var db = mongoose.connection;
//Check connection
db.once('open', function(){
  console.log('Connected to mongoDB');
});
//Check for db errors
db.on('error', function(err) {
  console.log(err);
});
//Init app
var app = express();

var index = require('./routes/index');
var list = require('./routes/list');
var create = require('./routes/create');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); //Compress all routes
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

//Home route

app.use('/', index);
app.use('/list', list);
app.use('/create', create);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
