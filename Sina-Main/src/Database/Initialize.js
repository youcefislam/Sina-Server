const dbPool = require("./Connection");
const fs = require("fs");
const path = require("path");

const schema = path.resolve("./src/Model/Schema.sql");
const data = path.resolve("./src/Model/data.sql");

const dropDatabase = () =>
  new Promise((resolve, reject) => {
    const statement = `DROP DATABASE sina; CREATE SCHEMA IF NOT EXISTS sina; USE sina;`;
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result);
    });
  });
const implementSchema = () =>
  new Promise((resolve, reject) => {
    let statement = fs.readFileSync(schema).toString();
    // console.log(statement.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " "));
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result);
    });
  });
const insertDefaultData = () =>
  new Promise((resolve, reject) => {
    let statement = fs.readFileSync(data).toString();
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) reject(dbErr);
      else resolve(result);
    });
  });

async function initializeDatabase({ force = false }) {
  try {
    console.log("DATABASE INITIALIZATION");
    if (force) {
      console.log("Force Mode : ACTIVE");
      await dropDatabase();
      console.log("DATABASE DROPPED");
    }
    await implementSchema();
    console.log("SCHEMA IMPLEMENTED");
    if (force) {
      await insertDefaultData();
      console.log("DEFAULT DATA INSERTED TO THE DATABASE");
    }
    console.log("DATABASE IS READY");
  } catch (error) {
    console.log("SOMETHING WENt WRONG");
    console.log(error);
    throw new Error(error);
  }
}

initializeDatabase({ force: false });
