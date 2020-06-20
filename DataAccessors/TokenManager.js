class TokenManager {
    constructor() {
        this.jsonwebtoken = require('jsonwebtoken');
    }

    create(user) {
        let token = this.jsonwebtoken.sign({
            userId: user.id,
            userName: user.username
        },
            process.env.JWT_SECRET);

        return token;
    }

    async validate(token) {
        try {
            let user = this.jsonwebtoken.verify(token, process.env.JWT_SECRET);
            return user;
        }
        catch (err) {
            console.error(err.stack);
            return null;
        }
    }
}

module.exports = TokenManager;