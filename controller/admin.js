const { SHA256 } = require("crypto-js");
const express = require("express");
const router = express.Router();
const db = require("../model/db");
require("dotenv").config()


router.get("/register", (req, res) => {
    res.render("adminForm/register");
});
router.post("/register", (req, res) => {
    let errors = [];
    let { username, pswd, confirm_pswd, admin_pswd, email } = req.body
    if (pswd !== confirm_pswd)
        errors.push({ message: "Password Didn't Match" });
    if (pswd.length < 8)
        errors.push({ message: "Password Should Atleast Be 8 Characters Long" });
    if (SHA256(admin_pswd).toString() !== process.env.ADM_HSH)
        errors.push({ message: "Invalid Admin Password!!" });
    if (errors.length > 0) {
        res.render("adminForm/register", { errors })
    } else {
        let pswd_hash = SHA256(pswd).toString();
        db.query(`SELECT * FROM users WHERE username='${username}' OR email_id='${email}'`, (err, results) => {
            if (results.rows.length > 0) {
                errors.push({ message: "USERNAME or EMAIL ID Already Exists!" });
                res.render("adminForm/register", { errors })
            } else {
                db.query(
                    `INSERT INTO users (username, email_id, pass_hash, is_adm)
                            VALUES ($1, $2, $3, $4)`, [username, email, pswd_hash, true],
                    (err, results) => {
                        if (err)
                            throw err;
                        else {
                            req.flash("success_msg", "You are now registered as ADMIN, Please Login");
                            res.redirect("/user/login");
                        }
                    }
                )
            }
        });
    }
})

module.exports = router;