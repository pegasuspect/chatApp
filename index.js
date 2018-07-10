const express = require('express');
const path = require('path');
const app = express();
const session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});

// Attach session
app.use(session);
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
    res.sendFile(__dirname + 'public/index.html');
});

const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(3000, function() {
    console.log('listening on *:3000');
});

const sharedsession = require("express-socket.io-session");


// Share session with io sockets
io.use(sharedsession(session));


io.on('connection', function(socket) {
    // Accept a login event with user's data
    socket.on("login", function(userdata) {
        socket.handshake.session.userdata = userdata;
        let nick = userdata.nickname;
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

    socket.on('typing', function(nick) {
        socket.broadcast.emit('typing', nick);
    })

    socket.on('chat message', function(msg) {
        const userdata = socket.handshake.session.userdata;
        socket.broadcast.emit('chat message', {
            userdata,
            msg
        });
    })
    socket.on('disconnect', function() {
        if (socket.handshake.session) {
            if (socket.handshake.session.userdata) {
                const nick = socket.handshake.session.userdata.nickname;
                socket.broadcast.emit('notification', nick + " left!");

                delete socket.handshake.session.userdata;
                socket.handshake.session.save();
            }
        }

    });
})
