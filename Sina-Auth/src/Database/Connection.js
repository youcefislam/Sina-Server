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

function queryErrorHandler(code, message, path) {
  this.code = code;
  this.message = message;
  this.path = path;
}

module.exports = {
  dbPool,
  queryErrorHandler,
};
