const { Pool } = require("pg")
require("dotenv").config()

// Setting Up Connection With Database
const db = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    database: "strings"
})

module.exports = db // Exporting Connection with database
