const TokenManager = require('../DataAccessors/TokenManager');
const tokenManager = new TokenManager();
const UserDa = require('../DataAccessors/UserDa');
const userDa = new UserDa();

async function protectedRoute(req, res, next) {
    try {
        var header = req.headers.authorization;
        if (header && header.split(' ')[0] === 'Bearer') {
            const token = req.headers.authorization.split(' ')[1];
            const user = await tokenManager.validate(token);

            if (!user) {
                res.sendStatus(401);
                return;
            }

            req.user = user;
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