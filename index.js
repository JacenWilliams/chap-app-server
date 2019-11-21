const express = require('express');
let app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
let port = process.env.PORT || 3000;

io.on('connection', function(socket) {
    console.log('connected to :' + socket);
    socket.on('message', function(msg) {
        console.log('message: ' + msg);
        io.emit('message', msg);
    })
});

http.listen(port, function() {
    console.log('listening on port: ' + port);
});