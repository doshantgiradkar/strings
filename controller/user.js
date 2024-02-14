const { SHA256 } = require("crypto-js");
const express = require("express");
const router = express.Router();
const db = require("../model/db");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

router.get('/login', (req, res) => {
    res.render("userForm/login", {
        activeDir: req.path,
    });
});

router.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true
}));

router.post("/logout", (req, res, next) => {
    req.logOut(err => {
        if (err)
            return next(err);
        req.flash('success_msg', "You have Logged Out!!")
        res.redirect("/user/login")
    });
})

router.get("/register", (req, res) => {
    res.render("userForm/register", {
        activeDir: req.path,
    });
});

router.post("/register", (req, res) => {
    let errors = [];
    let { username, pswd, confirm_pswd, email } = req.body
    if (pswd !== confirm_pswd)
        errors.push({ message: "Password Didn't Match" });
    if (pswd.length < 8)
        errors.push({ message: "Password Should Atleast Be 8 Characters Long" });
    if (errors.length > 0) {
        res.render("userForm/register", { errors })
    } else {
        let pswd_hash = SHA256(pswd).toString();
        db.query(`SELECT * FROM users WHERE username='${username}' OR email_id='${email}'`, (err, results) => {
            if (results.rows.length > 0) {
                errors.push({ message: "USERNAME or EMAIL ID Already Exists!" });
                res.render("userForm/register", { errors })
            } else {
                db.query(
                    `INSERT INTO users (username, email_id, pass_hash, is_adm)
                            VALUES ($1, $2, $3, $4)`, [username, email, pswd_hash, false],
                    (err, results) => {
                        if (err)
                            throw err;
                        else {
                            req.flash("success_msg", "You are now registered, Please Login");
                            res.redirect("/user/login");
                        }
                    }
                )
            }
        });
    }
})

module.exports = router;