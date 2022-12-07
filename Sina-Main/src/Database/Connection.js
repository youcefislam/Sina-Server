const mysql = require("mysql");

require("dotenv").config();

// ### Connection with the database ### -- tested
const dbPool = mysql.createPool({
  connectionLimit: 30,
  host: "localhost",
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true,
});

const dbPoolV1 = mysql.createPool({
  connectionLimit: 30,
  host: "localhost",
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_V1,
  multipleStatements: true,
});

const formulateAndQuery = (statement, query) => {
  return mysql.format(statement, query).replace(/,/g, ` AND`);
};
const format = (statement, value) => {
  return mysql.format(statement, value);
};

function errorHandler(code, message, path) {
  this.code = code;
  this.message = message;
  this.path = path;
}

module.exports = {
  formulateAndQuery,
  dbPool,
  errorHandler,
  format,
  dbPoolV1,
};
