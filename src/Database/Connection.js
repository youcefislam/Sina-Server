const mysql = require("mysql");

require("dotenv").config();

// ### Connection with the database ### -- tested
var dbPool = mysql.createPool({
  connectionLimit: 30,
  host: "localhost",
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true,
});

module.exports = dbPool;
