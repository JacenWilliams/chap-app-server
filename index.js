require('dotenv').config();

const express = require('express');
let app = express();

const parser = require('body-parser');
app.use(parser.json());

const cors = require('cors');
app.use(cors());

const TokenManager = require('./DataAccessors/TokenManager');
const tokenManager = new TokenManager();

const ChatDa = require('./DataAccessors/ChatDa');
const chatDa = new ChatDa();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const users = require('./Routers/users');
const chats = require('./Routers/chats');
app.use('/users', users);
app.use('/chats', chats)

const port = process.env.PORT || 3000;


io.use(async (socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        const user = await tokenManager.validate(socket.handshake.query.token);

        if (user) {
            socket.user = user;
            next();
        } else {
            next(new Error('Failed to authenticate.'))
        }
    }
})
    .on('connection', async function (socket) {
        const initialChats = await chatDa.getLastMessages(100);

        socket.emit('initialize', initialChats);

        socket.on('message', async function (msg) {

            let messageId = await chatDa.saveMessage(msg, socket.user.userId);

            let savedMessage = await chatDa.getMessage(messageId);

            if (savedMessage)
                io.emit('message', savedMessage);
        })
    });

app.set('socketio', io);

http.listen(port, function () {
    console.log('listening on port: ' + port);
});