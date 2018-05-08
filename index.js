var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  io.emit('notification', 'A dushbag connected!');
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  })
  socket.on("disconnect", function() {
    io.emit('notification', 'A dushbag left.');
  })
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});
