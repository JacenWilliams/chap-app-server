class TokenManager {
    constructor() {
        this.jsonwebtoken = require('jsonwebtoken');
    }

    create(user) {
        let token = this.jsonwebtoken.sign({
            userId: user.id,
            userName: user.userName
        },
            process.env.JWT_SECRET);

        return token;
    }

    validateMiddleware(req, res, next) {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            var user = this.validate(token);

            if (!user)
                res.sendStatus(401);

            req.user = user;
            next();

        } else {
            res.sendStatus(401);
        }
    }

    validate(token) {
        this.jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error(err);
                return null;
            }

            return user;
        })
    }
}

export default TokenManager;