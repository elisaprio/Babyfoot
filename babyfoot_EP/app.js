var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
app.use('/users', users);

//render page
app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'public','main.html'));
});

/*
app.get('/new', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'public','new.html'));
});
*/

//queries to access data in URL
var db = require(path.join(__dirname, 'public/javascripts','queries.js'));
app.get('/all', db.getAllMatches);
app.get('/new/:idp1&:idp2',db.createMatch);
app.get('/update/:matchID&:state_e',db.updateMatch);
app.get('/remove/:matchID',db.removeMatch);



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
