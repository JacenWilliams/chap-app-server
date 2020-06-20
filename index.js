require('dotenv').config();

const express = require('express');
let app = express();

const parser = require('body-parser');

const TokenManager = require('./DataAccessors/TokenManager');
const tokenManager = new TokenManager();
app.use(parser.json());

const http = require('http').Server(app);
const io = require('socket.io')(http);

const users = require('./Routers/users');
const chats = require('./Routers/chats');
app.use('/users', users);
app.use('/chats', chats)

const port = process.env.PORT || 3000;


io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        const user = tokenManager.validate(socket.handshake.query.token);

        if (user) {
            socket.user = user;
            next();
        } else {
            next(new Error('Failed to authenticate.'))
        }
    }
})
    .on('connection', function (socket) {
        const initialChats = da.getLastMessages(100);

        socket.emit('initialize', initialChats);

        socket.on('message', function (msg) {

            let message = da.saveMessage(msg, socket.user.userId);

            if (message)
                io.emit('message', message);
        })
    });

http.listen(port, function () {
    console.log('listening on port: ' + port);
});