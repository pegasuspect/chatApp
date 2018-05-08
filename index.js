var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log("some dushbag just used our socket.");
  socket.on("disconnect", function() {
    console.log("He fucking left!");
  })
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});
