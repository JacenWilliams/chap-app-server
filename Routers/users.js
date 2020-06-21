const UserDa = require('../DataAccessors/UserDa');
const express = require('express');
const router = express.Router();
const da = new UserDa();
const TokenManager = require('../DataAccessors/TokenManager');
const tokenManager = new TokenManager();

router.post('/signup', async (req, res) => {
    try {
        let username = req.body.username;
        let password = req.body.password;

        let userExists = await da.userExists(username);

        if (userExists) {
            res.sendStatus(400);
        }

        let userId = await da.signUp(username, password);
        let token = tokenManager.create(userId, username);

        res.json({
            userId: userId,
            username: username,
            token: token
        });
    }
    catch (err) {
        console.error(err.stack);
        res.sendStatus(500);
    }
});

router.post('/login', async (req, res) => {
    try {
        let username = req.body.username;
        let password = req.body.password;

        let userData = await da.login(username, password);

        if (!userData) {
            res.sendStatus(400);
        }

        res.json(userData);
    }
    catch (err) {
        console.error(err.stack);
        res.sendStatus(500);
    }
});

module.exports = router;