require('dotenv').config();

const express = require('express');
let app = express();

const parser = require('body-parser');
const { default: TokenManager } = require('./DataAccessors/TokenManager');
app.use(parser.json());

const http = require('http').Server(app);
const io = require('socket.io')(http);
const da = require("./DataAccessors/ChatDa");
const tokenManager = new TokenManager();
let port = process.env.PORT || 3000;

app.post('/login', (req, res) => {
    let user = da.login(req.body);

    if (user) {
        res.json({
            userId: user.userId,
            userName: user.userName,
            token: tokenManager.create(user)
        });
    } else {
        res.sendStatus(401);
    }
});

app.post('/signup', (req, res) => {
    let user = {
        userName = req.body.username,
        password = req.body.password
    };

    let userId = da.signup(user);

    if (userId) {
        res.json({
            userId: userId,
            userName: user.userName,
            token: tokenManager.create({
                userId: userId,
                userName: user.userName
            })
        });
    } else {
        res.sendStatus(400);
    }
});

io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        let user = TokenManager.validate(socket.handshake.query.token);

        if (user) {
            socket.user = user;
            next();
        } else {
            next(new Error('Failed to authenticate.'))
        }
    }
})
    .on('connection', function (socket) {
        let initialChats = da.getLastMessages(100);

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