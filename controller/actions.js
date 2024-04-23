const router = require("express").Router();
const db = require("../model/db");
require("dotenv").config();

router.post("/like/:id", async (req, res) => {
  if (typeof req.user != 'undefined') {
    db.query(
      `
      INSERT INTO actions values(${req.user.user_id}, ${req.params.id}, true, false);
    `,
      (err) => {
        if (err) {
          db.query(
            `
          UPDATE actions SET 
          _like = ${true},
          _dislike = ${false}
          WHERE content_id = ${req.params.id} AND user_id = ${
              req.user.user_id
            };
        `,
            (err) => {
              if (err) {
                res
                  .status(422)
                  .send(`Something went wrong!!
                        <br><hr><br>
                        go to home page? <a href='/'>[Y]<a>
                        `);
              } else {
                res.status(200);
              }
            }
          );
        }
      }
    );
  } else {
    res
      .status(422)
      .send(
        "please login first<br><hr><br>go to home page? <a href='/'>[Y]<a>"
      );
  }
});

router.post("/dislike/:id", (req, res) => {
  if (typeof req.user != 'undefined') {
    db.query(
      `
      INSERT INTO actions values(${req.user.user_id}, ${
        req.params.id
      }, ${false}, ${true});
    `,
      (err) => {
        if (err) {
          db.query(
            `
          UPDATE actions SET 
          _like = ${false},
          _dislike = ${true}
          WHERE content_id = ${req.params.id} AND user_id = ${
              req.user.user_id
            };
        `,
            (err) => {
              if (err) {
                res
                  .status(422)
                  .send(`Something went wrong!!`);
              } else {
                res.status(200);
              }
            }
          );
        }
      }
    );
  } else {
    res
      .status(422)
      .send(
        "<script> alert('Please login first')</script>"
      );
  }
});


router.post("/delete/:id", (req, res) => {
  if (typeof req.user != 'undefined') {
    db.query(
      `
    DELETE FROM content
    WHERE user_id = ${req.user.user_id} AND content_id = ${req.params.id};
    `,
      (err) => {
        if (err) {
          res
            .status(422)
            .send(`Something went wrong!!`);
        } else {
          res.status(200);
        }
      }
    );
  } else {
    res
      .status(422)
      .send(
        "please login first<br><hr><br>go to home page? <a href='/'>[Y]<a>"
      );
  }
});

module.exports = router;
