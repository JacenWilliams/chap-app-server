const TokenManager = require('../DataAccessors/TokenManager');
const tokenManager = new TokenManager();
const UserDa = require('../DataAccessors/UserDa');
const userDa = new UserDa();

async function protectedRoute(req, res, next) {
    try {
        var header = req.headers.authorization;
        if (header && header.split(' ')[0] === 'Bearer') {
            const token = req.headers.authorization.split(' ')[1];
            const user = tokenManager.validate(token);

            if (!user) {
                res.sendStatus(401);
                return;
            }

            console.log(JSON.stringify(user));

            const userId = await userDa.getUserId(user.username);

            if (!userId) {
                res.sendStatus(401);
                return;
            }

            req.username = user.username;
            req.userId = userId;

            console.log(JSON.stringify({ username: user.username, userId: userId }));
            next();
        }
        else {
            res.status(401).send('Invalid authorization schema.');
        }
    }
    catch (error) {
        console.error(error.trace);
        res.sendStatus(500);
    }
}

module.exports = protectedRoute;