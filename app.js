var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');

//Create the express app
var app = express();


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images/icon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//render page
app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'public','html/main.html'));
});

//Get the database and associated queries
var db = require(path.join(__dirname, 'public','javascripts/queries.js'));

app.get('/all', db.getAllMatches);
app.get('/new/:idp1&:idp2',db.createMatch);
app.get('/update/:matchID&:state_e',db.updateMatch);
app.get('/remove/:matchID',db.removeMatch);


//server and socket
app.set('port', process.env.PORT || 3000);
var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);
//when a socket connects
io.sockets.on('connection', function (socket) {
  console.log("SOCKET SERVEUR CONNECTE");
  //new client receives hello worls
  socket.emit('news', { hello: 'world' });
  //then client answers and servers logs the data
  socket.on('my other event', function (data) {
    console.log(data);
  });
  //when the socket receives update, il means the db has been updated by the client
  //socket emits to all other clients (except the one that sent the data)
  //tell them to update their table too
  socket.on('update', function (data) {
    console.log("GOT UPDATE");
    socket.broadcast.emit('load', { table: 'reload' });
  });  
});

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
