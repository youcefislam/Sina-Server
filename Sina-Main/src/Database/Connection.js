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

const formulateAndQuery = (statement, query) => {
  return mysql.format(statement, query).replace(/,/g, ` AND`);
};

function queryErrorHandler(type, message, path) {
  this.type = type;
  this.message = message;
  this.path = path;
}

module.exports = {
  formulateAndQuery,
  dbPool,
  queryErrorHandler,
};
