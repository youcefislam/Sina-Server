const mysql = require("mysql");

require("dotenv").config();

var dbPool = mysql.createPool({
  connectionLimit: 30,
  host: "localhost",
  user: process.env.DATABASE_AUTH_USER,
  password: process.env.DATABASE_AUTH_PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true,
});

module.exports = dbPool;
