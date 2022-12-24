const { dbPool, dbPoolV1 } = require("./Connection");
const fs = require("fs");
const path = require("path");
const schema = path.resolve("./src/model/Schema.sql");
const data = path.resolve("./model/data.sql");
const schemaV1 = path.resolve("./src/model/SchemaV1.sql");
const dataV1 = path.resolve("./model/dataV1.sql");

const dropDatabase = (V1) =>
  new Promise((resolve, reject) => {
    const statement = `DROP DATABASE sina; CREATE SCHEMA IF NOT EXISTS sina;`;
    const statement2 = `DROP DATABASE sinaV1; CREATE SCHEMA IF NOT EXISTS sinaV1;`;
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      if (!V1) return resolve(result);
      dbPoolV1.query(statement2, (dbErr, result) => {
        console.log(result);
        if (dbErr) return reject(dbErr);
        resolve(result);
      });
    });
  });
const implementSchema = (V1) =>
  new Promise((resolve, reject) => {
    let statement = fs.readFileSync(schema).toString();
    let statementV1 = fs.readFileSync(schemaV1).toString();
    // console.log(statement.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " "));
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      if (!V1) return resolve(result);
      dbPoolV1.query(statementV1, (dbErr, result) => {
        if (dbErr) return reject(dbErr);
        resolve(result);
      });
    });
  });
const insertDefaultData = (V1) =>
  new Promise((resolve, reject) => {
    let statement = fs.readFileSync(data).toString();
    let statementV1 = fs.readFileSync(dataV1).toString();
    dbPool.query(statement, (dbErr, result) => {
      if (dbErr) return reject(dbErr);
      if (!V1) return resolve(result);
      dbPoolV1.query(statementV1, (dbErr, result) => {
        if (dbErr) return reject(dbErr);
        resolve(result);
      });
    });
  });

async function initializeDatabase({ force = false, old = false }) {
  try {
    console.log("DATABASE INITIALIZATION");
    if (force) {
      console.log("Force Mode : ACTIVE");
      await dropDatabase(old);
      console.log("DATABASE DROPPED");
    }
    await implementSchema(old);
    console.log("SCHEMA IMPLEMENTED");
    if (force) {
      await insertDefaultData(old);
      console.log("DEFAULT DATA INSERTED TO THE DATABASE");
    }
    console.log("DATABASE IS READY");
  } catch (error) {
    console.log("SOMETHING WENt WRONG");
    console.log(error);
    throw new Error(error);
  }
}

initializeDatabase({ force: false, old: false });
