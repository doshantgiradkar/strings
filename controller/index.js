const { log } = require("console");
const express = require("express");
const router = express.Router();
const multr = require("multer");
const path = require("path")
const db = require("../model/db");
const flash = require("express-flash");

const storeImg = multr.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
})

const upload = multr({ storage: storeImg });

router.get('/', (req, res) => {

    db.query(
        `SELECT content.content_id, content.title, content.img, content.user_id, users.username,
        COALESCE(SUM(CASE WHEN actions._like THEN 1 ELSE 0 END), 0) AS total_likes,
        COALESCE(SUM(CASE WHEN actions._dislike THEN 1 ELSE 0 END), 0) AS total_dislikes
        FROM content
        JOIN users ON content.user_id = users.user_id
        LEFT JOIN actions ON content.content_id = actions.content_id
        GROUP BY content.content_id, content.title, content.img, content.user_id, users.username
        ORDER BY content.content_id DESC;`, (err, results) => {
        if (err)
            throw err;

        let homePage = results.rows
        if (typeof req.user != 'undefined') {
            discoverPage = {}
            res.render('index', {
                user: req.user.username,
                activeDir: req.path,
                homePage
            });
        } else
            res.render('index', {
                activeDir: req.path,
                homePage
            });
    })
})

router.get("/discover", (req, res) => {
    db.query(
        `SELECT content.content_id, content.title, content.img, content.user_id, users.username,
        COALESCE(SUM(CASE WHEN actions._like THEN 1 ELSE 0 END), 0) AS total_likes,
        COALESCE(SUM(CASE WHEN actions._dislike THEN 1 ELSE 0 END), 0) AS total_dislikes
        FROM content
        JOIN users ON content.user_id = users.user_id
        LEFT JOIN actions ON content.content_id = actions.content_id
        GROUP BY content.content_id, content.title, content.img, content.user_id, users.username
        ORDER BY total_likes DESC, total_dislikes ASC;`, (err, results) => {
        if (err)
            throw err;

        let discoverPage = results.rows
        if (typeof req.user != 'undefined')
            res.render("discover", {
                user: req.user.username,
                activeDir: req.path,
                discoverPage
            });
        else
            res.render("discover", {
                activeDir: req.path,
                discoverPage
            });
    })

})

router.get("/upload", (req, res) => {
    if (typeof req.user != 'undefined')
        res.render("upload/upload", {
            user: req.user.username,
            activeDir: req.path
        });
    else {
        res.redirect("/user/login")
    }
})

router.get("/my-gallery", (req, res) => {
    if (typeof req.user != 'undefined')
        db.query(
            `SELECT content.content_id, content.title, content.img, content.user_id, users.username,
            COALESCE(SUM(CASE WHEN actions._like THEN 1 ELSE 0 END), 0) AS total_likes,
            COALESCE(SUM(CASE WHEN actions._dislike THEN 1 ELSE 0 END), 0) AS total_dislikes
            FROM content
            JOIN users ON content.user_id = users.user_id
            LEFT JOIN actions ON content.content_id = actions.content_id
            WHERE users.username = '${req.user.username}'
            GROUP BY content.content_id, content.title, content.img, content.user_id,  users.username
            ORDER BY total_likes DESC, total_dislikes ASC;`, (err, results) => {
            if (err)
                throw err;
            else {
                let galleryPage = results.rows;
                res.render("gallery", {
                    user: req.user.username,
                    activeDir: req.path,
                    galleryPage
                });
            }
        })
    else
        res.redirect("/user/login");
})

router.post("/upload", upload.single('file'), (req, res) => {
    if (typeof req.user != 'undefined') {
        let { title } = req.body;
        db.query(
            `INSERT INTO content (user_id, title, img) 
        VALUES ($1, $2, '${req.file.filename}')`, [req.user.user_id, title], (err, results) => {
            if (err)
                throw err;
            else {
                req.flash('success_msg', "Image Uploaded!!");
                res.redirect("/");
            }
        })
    } else {
        res.redirect("/user/login")
    }
})

module.exports = router;