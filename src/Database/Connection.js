// const mysql = require("mysql");

// // ### Connection with the database ### -- tested
// var dbPool = mysql.createPool({
//   connectionLimit: 30,
//   host: "localhost",
//   user: "sina",
//   password: "password",
//   database: "sina",
//   multipleStatements: true,
// });

// module.exports = dbPool;

const { Sequelize } = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize;
