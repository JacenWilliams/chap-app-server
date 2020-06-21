const bcrypt = require('bcrypt');
const TokenManager = require('./TokenManager');
const tokenManager = new TokenManager();
const mysql = require('mysql2/promise');

class UserDa {
    constructor() {
        this.dbOptions = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASS
        };
    }

    async login(user, pass) {
        const sql =
            "   SELECT  Id  ,                   " +
            "           UserName,                   " +
            "           UserPassword                " +
            "   FROM    users                       " +
            "   WHERE   UserName    = ?               ";

        let conn = await mysql.createConnection(this.dbOptions);
        let [results, fields] = await conn.query(sql, [user]);
        await conn.end();

        if (results.length > 1) {
            console.log("Multiple found")
            throw new Error("Multiple matching users found");
        }

        if (results.length < 1) {
            console.log("None found")
            return null;
        }

        const result = results[0];

        let verified = await bcrypt.compare(pass, result.UserPassword);

        let userId = result.Id;
        let username = result.UserName;

        console.log(JSON.stringify({ userId, username }));

        if (verified) {
            let token = tokenManager.create(userId, username);

            return {
                userId,
                username,
                token
            };
        } else {
            return null;
        }
    }

    async signUp(username, password) {
        const sql =
            "   INSERT INTO     users (UserName,    " +
            "                          UserPassword)" +
            "   VALUES          (?, ?);             ";

        const hash = await bcrypt.hash(password, 10);

        let conn = await mysql.createConnection(this.dbOptions);
        let [results, fields] = await conn.query(sql, [username, hash]);
        await conn.end();

        return results.insertId;
    }

    async userExists(username) {
        const sql =
            "   SELECT  Id  ,                   " +
            "           UserName                " +
            "   FROM    users                   " +
            "   WHERE   UserName    = ?         ";

        let conn = await mysql.createConnection(this.dbOptions);
        let [results, fields] = await conn.query(sql, [username]);
        await conn.end();

        return results.length > 0;
    }

    async getUserId(username) {
        const sql =
            "   SELECT  Id  ,                   " +
            "           UserName                " +
            "   FROM    users                   " +
            "   WHERE   UserName    = ?         ";

        let conn = await mysql.createConnection(this.dbOptions);
        let [results, fields] = await conn.query(sql, [username]);
        await conn.end();

        if (results.length < 1) {
            return null;
        }

        return results[0].Id;
    }
}

module.exports = UserDa;