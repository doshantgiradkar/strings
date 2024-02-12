const express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const db = require("./db");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
require("dotenv").config()


const app = express();
const initCookie = require("./cookieConfig");
initCookie(passport)

const indexRouter = require("./controller/index");
const userRouter = require("./controller/user");
const adminRouter = require("./controller/admin");
app.use(session({
    secret: "secretproject",
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cors());
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");
app.set("layout", 'layouts/layout');
app.use(ejsLayouts);
app.use(express.static('public'));
app.use('/', indexRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.listen(process.env.PORT || 8080, () => {
    console.log("Server Started At Port " + process.env.PORT || 8080);
})
