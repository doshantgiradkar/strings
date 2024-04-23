require("dotenv").config() //module to read enviornment variables
const cors = require("cors") //dependency for ExpressJS
const express = require("express") //ExpressJS - node framework to build web backend
const ejsLayouts = require("express-ejs-layouts") //template engine EJS
const bodyParser = require("body-parser") //middle ware to parse body
const session = require("express-session") //middleware to create sessions
const flash = require("express-flash") //middleware to store data 
const passport = require("passport") //middleware to setup cookie

// Creating express app
const app = express()

// Initializing cookie
const initCookie = require("./cookieConfig")
initCookie(passport)

// Importing Route Controllers
const indexRouter = require("./controller/index")
const userRouter = require("./controller/user")
const adminRouter = require("./controller/admin")
const actionRouter = require("./controller/actions")

// Middleware
app.use(session({ 
    secret: "secretproject", //keyword to encrypt session
    resave: false,
    saveUninitialized: false
})) // Setting up sessons options
app.use(flash())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs')
app.set("views", __dirname + "/views")
app.set("layout", 'layouts/layout')
app.use(ejsLayouts)

// Setting Up Routers
app.use(express.static('public'))
app.use('/', indexRouter)
app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.use('/actn', actionRouter)

// Listening on port defined in enviornment variable // Default PORT:4000
app.listen(process.env.PORT || 4000, () => {
    console.log("Server Started At Port " + process.env.PORT || 4000)
})
