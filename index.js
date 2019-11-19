const express = require('express')();
const http = require('http').createServer(express);
const io = require('socket.io')(http);

io.on('connection', function(socket) {
    socket.on('message', function(msg) {
        console.log('message: ' + msg);
        io.emit(message);
    })
});

http.listen(80, function() {
    console.log('listening on port: ' + 80);
});  