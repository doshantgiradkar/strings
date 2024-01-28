const LocalStrategy = require("passport-local").Strategy;
const db = require("./db");
const { SHA256 } = require("crypto-js")

function init(passport) {
    const authenticateUser = (username, password, done) => {
        db.query(
            `SELECT * FROM users WHERE username = '${username}'`,
            (err, results) => {
                if (err)
                    throw err;

                if (results.rows.length > 0) {
                    const user = results.rows[0];
                    if (SHA256(password).toString() === user.pass_hash) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: "Wrong Username or Password" })
                    }
                } else {
                    return done(null, false, { message: "Incorrect Username" })
                }
            })
    }
    passport.use(new LocalStrategy({
        usernameField: "username",
        passwordField: "pswd"
    }, authenticateUser));
    passport.serializeUser((user, done) => { done(null, user.user_id) })
    passport.deserializeUser((user_id, done) => {
        db.query(
            `SELECT * FROM users WHERE user_id = ${user_id}`,
            (err, results) => {
                if (err)
                    throw err;

                return done(null, results.rows[0])
            }
        )
    })
}

module.exports = init