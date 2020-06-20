const express = require('express');
const router = express.Router();
const ChatDa = require('../DataAccessors/ChatDa');
const da = new ChatDa();
const auth = require('../Middleware/protectedRoute');

router.get('/', auth, async (req, res) => {
    try {
        const messages = await da.getMessages();
        res.json(messages);
    }
    catch (error) {
        console.error(error.stack);
        res.sendStatus(500);
    }
})

router.post('/', async (req, res) => {

})

module.exports = router;