var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
  });
var sharedsession = require("express-socket.io-session");

// Attach session
app.use(session);

// Share session with io sockets
io.use(sharedsession(session));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  // Accept a login event with user's data
  socket.on("login", function(userdata) {
    socket.handshake.session.userdata = userdata;
    var nick = userdata.nickname;
    io.emit('notification', nick + " connected!");
    socket.handshake.session.save();
    // console.log(socket.handshake);
  });
  // if logout is emitted use:
  // socket.on("logout", function(userdata) {});

  // io.on('connection', function(socket){
  // });

  socket.on('notification', function(msg) {
    socket.emit('notification', msg);
  });

  socket.on('chat message', function(msg) {
    var userdata = socket.handshake.session.userdata;
    socket.broadcast.emit('chat message', {userdata, msg});
  })
  socket.on('disconnect', function(){
    var nick = socket.handshake.session.userdata.nickname;
    socket.broadcast.emit('notification', nick + " left!");
    if (socket.handshake.session.userdata) {
      delete socket.handshake.session.userdata;
      socket.handshake.session.save();
    }
  });
})

server.listen(3000, function(){
  console.log('listening on *:3000');
});
