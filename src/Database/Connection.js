const mysql = require("mysql");

// ### Connection with the database ### -- tested
var dbPool = mysql.createPool({
  connectionLimit: 30,
  host: "localhost",
  user: "sina",
  password: "password",
  database: "sina",
  multipleStatements: true,
});

module.exports = dbPool;
