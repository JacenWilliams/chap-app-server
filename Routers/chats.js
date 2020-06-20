const express = require('express');
const router = express.Router();
const ChatDa = require('../DataAccessors/ChatDa');
const chatDa = new ChatDa();
const UserDa = require('../DataAccessors/UserDa');
const userDa = new UserDa();
const auth = require('../Middleware/protectedRoute');

router.get('/', auth, async (req, res) => {
    try {
        const messages = await chatDa.getMessages();
        res.json(messages);
    }
    catch (error) {
        console.error(error.stack);
        res.sendStatus(500);
    }
})

router.post('/', auth, async (req, res) => {
    try {
        const io = req.app.get('socketio');

        let messageText = req.body.message;
        let userId = req.user.userId;

        if (!userId) {
            res.status(400).send('Invalid user token');
        }

        let chatId = await chatDa.saveMessage(messageText, userId);

        let chatData = await chatDa.getMessage(chatId);

        io.emit('message', JSON.stringify(chatData));
        res.json(chatData);

    }
    catch (error) {
        console.error(error.stack);
        res.sendStatus(500);
    }
})

module.exports = router;