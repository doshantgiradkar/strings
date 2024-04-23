const express = require("express");
const router = express.Router();
const db = require("../model/db");
const multr = require("multer");

// Content Pages

router.get("/", (req, res) => {
  db.query(
    `SELECT content.content_id, content.title, content.img, content.user_id, users.username,
        COALESCE(SUM(CASE WHEN actions._like THEN 1 ELSE 0 END), 0) AS total_likes,
        COALESCE(SUM(CASE WHEN actions._dislike THEN 1 ELSE 0 END), 0) AS total_dislikes
        FROM content
        JOIN users ON content.user_id = users.user_id
        LEFT JOIN actions ON content.content_id = actions.content_id
        GROUP BY content.content_id, content.title, content.img, content.user_id, users.username
        ORDER BY content.content_id DESC;`,
    (err, results) => {
      if (err) throw err;

      let homePageData = results.rows;
      if (typeof req.user != "undefined") {
        res.render("index", {
          user: req.user.username,
          userid: req.user.user_id,
          resp: results.rows,
          activeDir: req.path,
          homePageData,
        });
      } else
        res.render("index", {
          activeDir: req.path,
          homePageData,
        });
    }
  );
});

router.get("/discover", (req, res) => {
  db.query(
    `SELECT content.content_id, content.title, content.img, content.user_id, users.username,
        COALESCE(SUM(CASE WHEN actions._like THEN 1 ELSE 0 END), 0) AS total_likes,
        COALESCE(SUM(CASE WHEN actions._dislike THEN 1 ELSE 0 END), 0) AS total_dislikes
        FROM content
        JOIN users ON content.user_id = users.user_id
        LEFT JOIN actions ON content.content_id = actions.content_id
        GROUP BY content.content_id, content.title, content.img, content.user_id, users.username
        ORDER BY total_likes DESC, total_dislikes ASC;`,
    (err, results) => {
      if (err) throw err;

      let discoverPageData = results.rows;
      if (typeof req.user != "undefined")
        res.render("discover", {
          user: req.user.username,
          userid: req.user.user_id,
          activeDir: req.path,
          resp: results.rows,
          discoverPageData,
        });
      else
        res.render("discover", {
          activeDir: req.path,
          discoverPageData,
        });
    }
  );
});

router.get("/my-gallery", (req, res) => {
  if (typeof req.user != "undefined")
    db.query(
      `SELECT content.content_id, content.title, content.img, content.user_id, users.username,
            COALESCE(SUM(CASE WHEN actions._like THEN 1 ELSE 0 END), 0) AS total_likes,
            COALESCE(SUM(CASE WHEN actions._dislike THEN 1 ELSE 0 END), 0) AS total_dislikes
            FROM content
            JOIN users ON content.user_id = users.user_id
            LEFT JOIN actions ON content.content_id = actions.content_id
            WHERE users.username = '${req.user.username}'
            GROUP BY content.content_id, content.title, content.img, content.user_id,  users.username
            ORDER BY total_likes DESC, total_dislikes ASC;`,
      (err, results) => {
        if (err) throw err;
        else {
          let galleryPage = results.rows;
          res.render("gallery", {
            user: req.user.username,
            userid: req.user.user_id,
            activeDir: req.path,
            resp: results.rows,
            galleryPage,
          });
        }
      }
    );
  else res.redirect("/user/login");
});

router.get("/view/:username", (req, res) => {
  db.query(
    `SELECT content.content_id, content.title, content.img, content.user_id, users.username,
            COALESCE(SUM(CASE WHEN actions._like THEN 1 ELSE 0 END), 0) AS total_likes,
            COALESCE(SUM(CASE WHEN actions._dislike THEN 1 ELSE 0 END), 0) AS total_dislikes
            FROM content
            JOIN users ON content.user_id = users.user_id
            LEFT JOIN actions ON content.content_id = actions.content_id
            WHERE users.username = '${req.params.username}'
            GROUP BY content.content_id, content.title, content.img, content.user_id,  users.username
            ORDER BY total_likes DESC, total_dislikes ASC;`,
    (err, results) => {
      if (err) {
        req.flash("err_msg", err)
        res.render("user", {
          user: req.params.username,
          userid: req.user.user_id,
          activeDir: req.path,
          resp: results.rows,
        });
      } else if (results.rowCount < 1) {
        req.flash("err_msg", "User or User's page doesn't exits")
        res.render("user", {
          user: req.params.username,
          userid: req.user.user_id,
          activeDir: req.path,
          resp: results.rows,
        });
      } else {
        let userPage = results.rows;
        res.render("user", {
          user: req.params.username,
          userid: req.user.user_id,
          resp: results.rows,
          activeDir: req.path,
          userPage,
        })
      }
    })
    })

router.post("/view", (req, res) => {
  console.log(req.body);
  res.redirect(`/view/${req.body.username}`)
})

// Uploads

const storeImg = multr.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
  onFileUploadStart: (file) => {
    if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/webp') {
      return true;
    } else {
      return false;
    }
  }
});

const upload = multr({ storage: storeImg });

router.get("/upload", (req, res) => {
  if (typeof req.user != "undefined")
    res.render("upload/upload", {
      user: req.user.username,
      userid: req.user.user_id,
      activeDir: req.path,
    });
  else {
    res.redirect("/user/login");
  }
});

router.post("/upload", upload.single("file"), (req, res) => {
  ext = (req.file.filename).split('.').pop()
  if (typeof req.user != "undefined") {
    if (ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'webp' || ext == 'avif') {
      let { title } = req.body;
      db.query(
        `INSERT INTO content (user_id, title, img) 
        VALUES ($1, $2, '${req.file.filename}')`,
        [req.user.user_id, title],
        (err, results) => {
          if (err) throw err
          else {
            req.flash("success_msg", "Image Uploaded!!")
            res.redirect("/my-gallery")
          }
        }
      )
    } else {
      req.flash("err_msg", "Invalid File Type, please check file extension!!")
      res.redirect("/my-gallery")
    }
  } else {
    res.redirect("/user/login");
  }
});

module.exports = router;
