class TokenManager {
    constructor() {
        this.jsonwebtoken = require('jsonwebtoken');
    }

    create(userId, username) {
        return this.jsonwebtoken.sign({ userId, username }, process.env.JWT_SECRET);
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